import { setParcelsUniqId } from './parcels'

import { sortByDate } from './sort'
import { parcelsByOrder } from './parcels'

// list all orders
// ordersSort = true => clockwise
export const sortOrdersByDate = (orders, ordersSort = true) =>
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

// Weight by order
// work with items or parcels
export const weightByOrder = entities =>
  entities.reduce((acc, entity) => acc + parseFloat(entity.weight), 0.0)

// Revenue by order
// sum of each parcel
export const revenueByOrder = parcels =>
  parcels.reduce((acc, parcel) => acc + parseFloat(parcel.revenue), 0.0)

// process one order
export const processOrder = async (order, items) => {
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
}

// main fct that process all orders
export const processOrders = async (orders, items) => {
  // map the orders array which returns an array of promises 
  return await Promise.all(orders.map(async order => processOrder(order, items)))
}
