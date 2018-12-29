import {items} from '../data/items.test.json'
import {items as itemsNameAsc} from '../data/items.name.asc.json'
import {items as itemsNameDesc} from '../data/items.name.desc.json'
import {items as itemsWeightAsc} from '../data/items.weight.asc.json'
import {items as itemsWeightDesc} from '../data/items.weight.desc.json'

import { sortItemsByName, sortItemsByWeight } from './items'

describe('listItems should return a list of items sorted', () => {
  test('sortItemsByName ascending', () => {
    expect(
      sortItemsByName(
        items,
        true
      )
    ).toEqual(itemsNameAsc)
  })

  test('sortItemsByName descending', () => {
    expect(
      sortItemsByName(
        items,
        false
      )
    ).toEqual(itemsNameDesc)
  })

  test('sortItemsByWeight ascending', () => {
    expect(
      sortItemsByWeight(
        items,
        true
      )
    ).toEqual(itemsWeightAsc)
  })

  test('sortItemsByWeight descending', () => {
    expect(
      sortItemsByWeight(
        items,
        false
      )
    ).toEqual(itemsWeightDesc)
  })
})
