import { orders } from '../data/orders.test.json'
import { orders as ordersDateAsc } from '../data/orders.date.asc.json'
import { orders as ordersDateDesc } from '../data/orders.date.desc.json'

import { sortOrdersByDate } from './orders'

describe('Sort orders should return a list of orders sorted', () => {
  test('sortordersByDate ascending', () => {
    expect(sortOrdersByDate(orders, true)).toEqual(ordersDateAsc)
  })

  test('sortordersByDate descending', () => {
    expect(sortOrdersByDate(orders, false)).toEqual(ordersDateDesc)
  })
})
