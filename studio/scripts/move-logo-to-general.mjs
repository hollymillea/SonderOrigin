import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-19'}).withConfig({useCdn: false, perspective: 'raw'})
if (client.config().projectId !== 'yv32mo3i' || client.config().dataset !== 'production') throw new Error('Unexpected dataset.')
const logo = await client.fetch('*[_id == "logo"][0]{image,alt}')
const sites = await client.fetch('*[_id in ["site", "drafts.site"]]{_id,_rev,logo}')
if (!logo?.image?.asset) {
  console.log('No published Logo document to move. No changes made.')
} else {
  let transaction = client.transaction()
  let count = 0
  for (const site of sites) {
    if (site.logo) continue
    transaction = transaction.patch(site._id, (patch) => patch.ifRevisionId(site._rev)
      .setIfMissing({logo: logo.image, logoAlt: logo.alt || 'Sonder Origin'}))
    count++
  }
  if (count && process.argv.includes('--apply')) {
    await transaction.commit()
    console.log(`Copied the logo into ${count} General document(s). The old Logo document is kept as a fallback.`)
  } else console.log(`Preview: copy the logo into ${count} General document(s). Use --apply to save.`)
}
