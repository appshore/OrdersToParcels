import { sortByDate, sortByNumber, sortByString } from './sort'

describe('sort fcts should return a number positive or negative or zero', () => {
  test('sortByDate', () => {
    expect(
      sortByDate(
        'Wed Aug 15 2018 13:57:04 GMT+0000 (UTC)',
        'Wed Aug 15 2018 13:57:04 GMT+0000 (UTC)'
      )
    ).toBe(0)
    expect(
      sortByDate(
        'Wed Aug 15 2018 13:57:04 GMT+0000 (UTC)',
        'Tue Oct 02 2018 09:33:28 GMT+0000 (UTC)'
      )
    ).toBeLessThanOrEqual(0)
    expect(
      sortByDate(
        'Wed Aug 15 2018 13:57:04 GMT+0000 (UTC)',
        'Tue Oct 02 2018 09:33:28 GMT+0000 (UTC)',
        true
      )
    ).toBeLessThanOrEqual(0)
    expect(
      sortByDate(
        'Tue Oct 02 2018 09:33:28 GMT+0000 (UTC)',
        'Wed Aug 15 2018 13:57:04 GMT+0000 (UTC)',
        true
      )
    ).toBeGreaterThanOrEqual(0)
    expect(
      sortByDate(
        'Tue Oct 02 2018 09:33:28 GMT+0000 (UTC)',
        'Wed Aug 15 2018 13:57:04 GMT+0000 (UTC)',
        false
      )
    ).toBeLessThanOrEqual(0)
  })

  test('sortByNumber', () => {
    expect(sortByNumber(123, 123)).toBe(0)
    expect(sortByNumber(-123, -123)).toBe(0)
    expect(sortByNumber(1, 2)).toBeLessThanOrEqual(0)
    expect(sortByNumber(1, 2, true)).toBeLessThanOrEqual(0)
    expect(sortByNumber(2, 1, true)).toBeGreaterThanOrEqual(0)
    expect(sortByNumber(2, 1, false)).toBeLessThanOrEqual(0)
  })

  test('sortByString', () => {
    expect(sortByString('abc', 'abc')).toBe(0)
    expect(sortByString('abc', 'cba')).toBeLessThanOrEqual(0)
    expect(sortByString('abc', 'cba', false)).toBeGreaterThanOrEqual(0)
    expect(sortByString('cba', 'abc', false)).toBeLessThanOrEqual(0)
    expect(sortByString('cba', 'abc', true)).toBeGreaterThanOrEqual(0)
  })
})
