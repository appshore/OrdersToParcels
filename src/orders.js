import { orders } from '../data/orders.json'

import { setParcelsUniqId } from './parcels'
import { sortByDate, sortByNumber } from './sort'

// list all orders
// ordersSort = true => clockwise
export const listOrders = (ordersSort = true) =>
  orders.sort((a, b) => sortByDate(a.date, b.date, ordersSort))

// retrieve each item in an order
export const itemsByOrder = (order, items) => {
  // retrieve each item in the order from the items list
  let its = order.items.reduce((acc, item) => {
    let it = items.find(is => is.id === item.item_id)
    for (let i = 0; i < item.quantity; i++) {
      acc = acc.concat(it)
    }
    return acc
  }, [])

  return {
    id: order.id,
    date: order.date,
    items: its
  }
}

// compute the parcels per order
export const parcelsByOrder = order => {

  // sort the order by item weight
  // true => lighter to heavier
  // if applied it will change the number of parcels and the potential revenue
  order.items.sort((a, b) => sortByNumber(a.weight, b.weight, false))

  // split the items into parcels
  let parcels = order.items.reduce((acc, item) => {
    let found = false

    // string formatted weight converted to float
    item.weight = parseFloat(item.weight)

    // map each parcel to find room for a item
    acc.every(ac => {
      // check that the weight no more 30
      let newWeight = ac.weight + item.weight
      if (newWeight <= 30.0) {
        // add item to an existing parcel
        found = true
        // add weight of item
        ac.weight = newWeight
        ac.quantity++
        // check if same item already exist in the parcel
        let idx = ac.items.findIndex(a => a.id === item.id)
        if (idx > -1) {
          ac.items[idx].quantity++
        } else {
          ac.items.push({ ...item, quantity: 1 })
        }
        return false
      }
      return true
    })

    if (!found) {
      // create a new parcel
      acc.push({
        order_id: order.id,
        quantity: 1,
        weight: parseFloat(item.weight),
        items: [{ ...item, quantity: 1 }]
      })
    }
    return acc
  }, [])

  const priceWeight = [
    { min: 0.0, max: 1.0, price: 1 },
    { min: 1.0, max: 5.0, price: 2 },
    { min: 5.0, max: 10.0, price: 3 },
    { min: 10.0, max: 20.0, price: 5 },
    { min: 20.0, max: 30.0, price: 10 }
  ]

  parcels.map(p => {
    // determine revenue by parcel according priceWeight
    let pw = priceWeight.find(pw => pw.min < p.weight && p.weight <= pw.max)
    p.revenue = pw.price
    // format weight with 2 decimals
    p.weight = parseFloat(p.weight.toFixed(2))
  })

  return parcels
}

// Weight by order
// work with items or parcels
export const weightByOrder = entities =>
  entities.reduce((acc, entity) => acc + parseFloat(entity.weight), 0.0)

// Revenue by order
// sum of each parcel
export const revenueByOrder = parcels =>
  parcels.reduce((acc, parcel) => acc + parseFloat(parcel.revenue), 0.0)

// main fct that process all
export const processOrders = async (orders, items) => {
  // map the orders array, async is mandatory to handle
  // the fetch of uniqids from server
  let promises = orders.map(async order => {
    // retrieve each unique item
    let itemsOrder = itemsByOrder(order, items)

    // define the parcels for each order
    let parcelsOrder = parcelsByOrder(itemsOrder)

    // setParcelsUniqId return an array of promises
    // so we wait for them to resolve
    parcelsOrder = await setParcelsUniqId(parcelsOrder)

    // compute order global information
    let itemsQty = itemsOrder.items.length
    let parcelsQty = parcelsOrder.length
    let weight = weightByOrder(parcelsOrder)
    let revenue = revenueByOrder(parcelsOrder)

    /*
    // uncomment to have a console output of each order
    console.log(`\nOrder: ${order.id} date: ${order.date}`)
    console.log(
      `\tParcels: ${parcelsQty}`.padEnd(20),
      `Items: ${itemsQty}`.padEnd(20),
      `Revenue: ${revenue}`.padEnd(20),
      `Weight: ${weight.toFixed(2)}`.padEnd(20)
    )
    parcelsOrder.map(p => {
      console.log(
        `\t${p.parcel_id}`.padEnd(20),
        `${p.quantity}`.padEnd(20),
        `${p.revenue}`.padEnd(20),
        `${p.weight.toFixed(2)}`.padEnd(20)
      )
      p.items.map(i => console.log(`\t\t${i.quantity} * ${i.name}`.padEnd(25),` ${i.weight}`.padEnd(10)))
    })
    */

    return {
      id: order.id,
      date: order.date,
      itemsQty,
      parcelsQty,
      revenue,
      weight: parseFloat(weight.toFixed(2)),
      parcels: parcelsOrder
    }
  })

  return await Promise.all(promises)
}
