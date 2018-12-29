import util from 'util'

import { items } from '../data/items.json'
import { orders } from '../data/orders.json'

import { sortItemsByName, sortItemsByWeight } from './items'
import { processOrders, sortOrdersByDate } from './orders'

// select the sort property and rank (true = ascending)
// let items = sortItemsByName(items, false)
let sortedItems = sortItemsByWeight(items, true)

/*
// uncomment to see all items before processing
console.log(`${sortedItems.length} Items sorted by weigth descending`)
console.log('Item name'.padEnd(30), 'Weigth'.padEnd(10), '\n')
sortedItems.map(i => console.log(i.name.padEnd(30), i.weight.padStart(8)))
*/


// select the sort property and rank (true = ascending)
let sortedOrders = sortOrdersByDate(orders, true)
/*
// uncomment to see all orders before processing
console.log(`\n\n${sortedOrders.length} Orders sorted by date clockwise`)
console.log('Order id'.padEnd(30), 'Date'.padEnd(30), '\n')
sortedOrders.map(o => {
  console.log(o.id.padEnd(30), o.date.padEnd(30))
})
*/


console.log(`Processing of ${sortedOrders.length} orders in progress`)

// this async function will output an array of all processed orders
processOrders(sortedOrders, sortedItems).then(processedOrders =>
  console.log(util.inspect(processedOrders, { colors: true, depth: null }))
)
