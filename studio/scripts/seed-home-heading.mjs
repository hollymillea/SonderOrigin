import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-19'}).withConfig({useCdn: false, perspective: 'raw'})
if (client.config().projectId !== 'yv32mo3i' || client.config().dataset !== 'production') {
  throw new Error('This migration is only for the Sonder Origin production dataset.')
}

const homes = await client.fetch('*[_id in ["siteSettings", "drafts.siteSettings"]]{_id,_rev,selectedArtistsHeading}')
if (!homes.length) throw new Error('No Home documents found.')
let transaction = client.transaction()
let count = 0
for (const home of homes) {
  if (home.selectedArtistsHeading?.trim()) continue
  transaction = transaction.patch(home._id, (patch) => patch.ifRevisionId(home._rev).set({selectedArtistsHeading: 'Selected artists'}))
  count++
}
if (count && process.argv.includes('--apply')) {
  await transaction.commit()
  console.log(`Filled ${count} empty Home heading(s). Other fields and custom headings were preserved.`)
} else {
  console.log(`Preview: ${count} empty Home heading(s). Use --apply to save.`)
}
