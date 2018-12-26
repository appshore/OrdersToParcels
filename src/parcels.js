import fetch from 'node-fetch'

export const getParcelUniqId = async () => {
  return await fetch('https://helloacm.com/api/random/?n=15').then(response =>
    response.text()
  ).catch(error => console.error('Fetch error', error))
}
