import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-19'}).withConfig({useCdn: false, perspective: 'raw'})
if (client.config().projectId !== 'yv32mo3i' || client.config().dataset !== 'production') {
  throw new Error('This migration is only for the Sonder Origin production dataset.')
}

const {artists, homes} = await client.fetch(`{
  "artists": *[_type == "artist" && !(_id in path("drafts.**"))] | order(order asc, name asc) {_id},
  "homes": *[_id in ["siteSettings", "drafts.siteSettings"]]{_id,_rev,selectedArtists}
}`)
if (!artists.length || !homes.length) throw new Error('Published artists and a Home document are required.')
const references = artists.map(({_id}) => ({_type: 'reference', _key: _id, _ref: _id}))
let transaction = client.transaction()
let count = 0
for (const home of homes) {
  if (home.selectedArtists?.length) {
    console.log(`Keeping the existing artist list on ${home._id}.`)
    continue
  }
  transaction = transaction.patch(home._id, (patch) => patch.ifRevisionId(home._rev).set({selectedArtists: references}))
  count++
}
if (count && process.argv.includes('--apply')) {
  await transaction.commit()
  console.log(`Filled ${count} Home artist list(s) with ${artists.length} artists in their existing order. Other fields were preserved.`)
} else {
  console.log(`Preview: ${count} empty Home artist list(s) would receive ${artists.length} artists. Use --apply to save.`)
}
