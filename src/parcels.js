import fetch from 'node-fetch'

import { sortByNumber } from './sort'

// set uniq ids for each parcel
export const setParcelsUniqId = async parcels => {
  // while not the most elegant, for loop is the easiest way 
  // to augment the parcels without async side effect
  for (let i = 0; i < parcels.length; i++) {
    parcels[i].parcel_id = await getParcelUniqId()
  }
  return parcels
}

// retrieve uniqId from server

// this mockup url has some issue so I used the alternative below
// export const getParcelUniqId = async () =>
//   await fetch('https://helloacm.com/api/random/?n=15')
//     .then(res => res.text())
//     .then(data => data)
//     .catch(error => error)

// alternative mockup
export const getParcelUniqId = async () =>
  await fetch('https://randomuser.me/api/')
    .then(res => res.json())
    .then(data => data.info.seed)
    .catch(error => error)


// compute the parcels per order
export const parcelsByOrder = order => {

  // sort the order by item weight
  // true => lighter to heavier
  // if applied it will change the number of parcels and the potential revenue
  order.items.sort((a, b) => sortByNumber(a.weight, b.weight, false))

  // split the items into parcels
  let parcels = order.items.reduce((acc, item) => {
    let found = false

    // string formatted weight converted to float
    item.weight = parseFloat(item.weight)

    // map each parcel to find room for a item
    acc.every(ac => {
      // check that the weight no more 30
      let newWeight = ac.weight + item.weight
      if (newWeight <= 30.0) {
        // add item to an existing parcel
        found = true
        // add weight of item
        ac.weight = newWeight
        ac.quantity++
        // check if same item already exist in the parcel
        let idx = ac.items.findIndex(a => a.id === item.id)
        if (idx > -1) {
          ac.items[idx].quantity++
        } else {
          ac.items.push({ ...item, quantity: 1 })
        }
        return false
      }
      return true
    })

    if (!found) {
      // create a new parcel
      acc.push({
        order_id: order.id,
        quantity: 1,
        weight: parseFloat(item.weight),
        items: [{ ...item, quantity: 1 }]
      })
    }
    return acc
  }, [])

  const priceWeight = [
    { min: 0.0, max: 1.0, price: 1 },
    { min: 1.0, max: 5.0, price: 2 },
    { min: 5.0, max: 10.0, price: 3 },
    { min: 10.0, max: 20.0, price: 5 },
    { min: 20.0, max: 30.0, price: 10 }
  ]

  parcels.map(p => {
    // determine revenue by parcel according priceWeight
    let pw = priceWeight.find(pw => pw.min < p.weight && p.weight <= pw.max)
    p.revenue = pw.price
    // format weight with 2 decimals
    p.weight = parseFloat(p.weight.toFixed(2))
  })

  return parcels
}