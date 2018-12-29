import { sortByNumber, sortByString } from './sort'

// itemsSort = false => ascending
export const sortItemsByName = (items, itemsSort = false) =>
  items.sort((a, b) => sortByString(a.name, b.name, itemsSort))

export const sortItemsByWeight = (items, itemsSort = false) =>
  items.sort((a, b) => sortByNumber(a.weight, b.weight, itemsSort))
