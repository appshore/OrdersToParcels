import fetch from 'node-fetch'

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