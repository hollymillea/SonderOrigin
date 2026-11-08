import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-19'}).withConfig({useCdn: false, perspective: 'raw'})
if (client.config().projectId !== 'yv32mo3i' || client.config().dataset !== 'production') {
  throw new Error('This migration is only for the Sonder Origin production dataset.')
}
const documents = await client.fetch('*[_id in ["siteSettings", "drafts.siteSettings", "site", "drafts.site", "contact", "drafts.contact"]]')
const byId = new Map(documents.map((document) => [document._id, document]))
let transaction = client.transaction()
let count = 0
for (const prefix of ['', 'drafts.']) {
  const home = byId.get(`${prefix}siteSettings`)
  if (!home) continue
  for (const [type, fields] of [['site', ['title', 'description']], ['contact', ['email']]]) {
    const destination = byId.get(`${prefix}${type}`)
    // Existing draft and published values always win. Never publish draft copy
    // or remove the legacy fields still used by older website deployments.
    if (!destination) continue
    const missing = Object.fromEntries(fields
      .filter((field) => destination[field] === undefined && home[field] !== undefined)
      .map((field) => [field, home[field]]))
    if (!Object.keys(missing).length) continue
    transaction = transaction.patch(destination._id, (patch) => patch.ifRevisionId(destination._rev).setIfMissing(missing))
    console.log(`Fill ${Object.keys(missing).join(', ')} on ${destination._id}.`)
    count++
  }
}
if (count && process.argv.includes('--apply')) {
  await transaction.commit()
  console.log(`Updated ${count} document(s). Existing values and legacy fields were preserved.`)
} else {
  console.log(`Preview: ${count} document(s) need missing settings. Use --apply to save.`)
}
