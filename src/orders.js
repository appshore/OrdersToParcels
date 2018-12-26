import fetch from 'node-fetch'

import { orders } from '../data/orders.json'

import { sortByDate, sortByNumber } from './sort'

// list all orders
// ordersSort = true => clockwise
export const listOrders = (ordersSort = true) =>
  orders.sort((a, b) => sortByDate(a.date, b.date, ordersSort))

// retrieve each item in an order
export const itemsByOrder = (order, items) => {
  let its = []

  // build an array composed of each item
  order.items.map(o => {
    for (let i = 0; i < o.quantity; i++) {
      its.push(items.find(i => i.id === o.item_id))
    }
  })

  // sort the array by weight
  its.sort((a, b) => sortByNumber(a.weight, b.weight, false))

  // return for each order the complete item array
  return {
    id: order.id,
    date: order.date,
    items: its
  }
}

// compute the parcels per order
export const parcelsByOrder = order => {
  let parcels = []

  // combine the duplicate items and add their quantity
  parcels = order.items.reduce((arr, item) => {
    let found = false
    arr.map((a, i) => {
      let newWeight = arr[i].weight + parseFloat(item.weight)
      if (newWeight <= 30) {
        // add item to an existing parcel
        found = true
        arr[i].weight = newWeight
        arr[i].items.push(item)
      }
    })
    if (!found) {
      // create a new parcel
      fetch('https://helloacm.com/api/random/?n=15')
        .then(response => response.text())
        .then(res =>
          arr.push({
            order_id: order.id,
            parcelNbr: res,
            weight: parseFloat(item.weight),
            items: [item]
          })
        )
        .catch(error => console.error('Fetch error', error))
    }
    return arr
  }, [])

  return parcels
}

// compute total revenue, weight and parcels for each order
export const summaryByOrder = parcels => {
  let revenue = 0
  let weight = 0

  let priceWeight = [
    { min: 0, max: 1, price: 1 },
    { min: 1, max: 5, price: 2 },
    { min: 5, max: 10, price: 3 },
    { min: 10, max: 20, price: 5 },
    { min: 20, max: 30, price: 10 }
  ]

  // build an array composed of each item
  parcels.map(p => {
    priceWeight.map(pw => {
      if (pw.min > p.weight && p.weight <= pw.max) {
        revenue += pw.price
        weight += p.weight
      }
    })
  })

  // return for each order the complete item array
  return {
    revenue,
    weight,
    parcels
  }
}

export const processOrders = (orders, items) => {
  orders.map(o => {
    let itemsOrder = itemsByOrder(o, items)
    let parcelsOrder = parcelsByOrder(itemsOrder)
    let { revenue, weight, parcels } = summaryByOrder(parcelsOrder)
    console.log('order ', o.id, revenue, weight, parcels.length, parcels)
  })
}
