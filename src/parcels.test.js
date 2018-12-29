import { getParcelUniqId } from './parcels'


describe('Retrieve uniqId from server', () => {
  // async/await can be used.
  it('works with async/await', async () => {
    const data = await getParcelUniqId()
    expect(typeof data).toBe('string')
    expect(data.length).toBeGreaterThan(15)
  })
})
