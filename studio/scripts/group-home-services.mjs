import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-19'}).withConfig({useCdn: false, perspective: 'raw'})
if (client.config().projectId !== 'yv32mo3i' || client.config().dataset !== 'production') throw new Error('Unexpected dataset.')
const homes = await client.fetch('*[_id in ["siteSettings", "drafts.siteSettings"]]{_id,_rev,servicesSection,useAboutServices,services}')
let transaction = client.transaction()
let count = 0
for (const home of homes) {
  if (home.servicesSection) continue
  transaction = transaction.patch(home._id, (patch) => patch.ifRevisionId(home._rev).setIfMissing({
    servicesSection: {
      _type: 'servicesSection',
      useAboutServices: home.useAboutServices ?? true,
      text: Array.isArray(home.services) ? home.services.join('\n') : '',
    },
  }))
  count++
}
if (count && process.argv.includes('--apply')) {
  await transaction.commit()
  console.log(`Grouped services controls on ${count} Home document(s). Text and checkbox choices were preserved.`)
} else console.log(`Preview: ${count} Home document(s). Use --apply to save.`)
