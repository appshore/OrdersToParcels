import { items } from '../data/items.json'

import { sortByNumber } from './sort'

// itemsSort = false => ascending
export const listItems = (itemsSort = false) =>
  items.sort((a, b) => sortByNumber(a.weight, b.weight, itemsSort))
