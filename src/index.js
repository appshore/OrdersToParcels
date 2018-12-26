import { listItems } from './items'
import { listOrders, processOrders } from './orders'

let items = listItems()
// console.log(`${items.length} Items sorted by weigth descending`)
// console.log('Item name'.padEnd(30), 'Weigth'.padEnd(10), '\n')
// items.map(i => console.log(i.name.padEnd(30), i.weight.padStart(8)))

let orders = listOrders()
// console.log(`\n\n${orders.length} Orders sorted by date clockwise`)
// console.log('Order id'.padEnd(30), 'Date'.padEnd(30), '\n')
// orders.map(o => {
//   console.log(o.id.padEnd(30), o.date.padEnd(30))
// })

processOrders(orders, items)

