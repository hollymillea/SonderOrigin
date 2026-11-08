import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-19'}).withConfig({useCdn: false, perspective: 'raw'})
if (client.config().projectId !== 'yv32mo3i' || client.config().dataset !== 'production') {
  throw new Error('This import is only for the Sonder Origin production dataset.')
}
const documents = await client.fetch('*[_id in ["services", "drafts.services", "siteSettings", "about", "drafts.about"]]')
const byId = new Map(documents.map((document) => [document._id, document]))
const homeServices = byId.get('siteSettings')?.services
const aboutServices = byId.get('about')?.services
const items = Array.isArray(homeServices) ? homeServices : Array.isArray(aboutServices) ? aboutServices : []
let transaction = client.transaction()
if (!byId.has('services') && !byId.has('drafts.services')) {
  transaction = transaction.createIfNotExists({_id: 'services', _type: 'services', items})
  console.log(`Create shared Services with ${items.length} existing homepage services.`)
}
for (const id of ['about', 'drafts.about']) {
  const document = byId.get(id)
  if (!document) continue
  transaction = transaction.patch(id, (patch) => patch.ifRevisionId(document._rev)
    .setIfMissing({showSelectedArtistList: true, showServices: true}))
}
if (process.argv.includes('--apply')) {
  await transaction.commit()
  console.log('Shared services and About checkboxes are ready. Existing text and checkbox choices were preserved.')
} else {
  console.log('Preview only. Use --apply to save.')
}
