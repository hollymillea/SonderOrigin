import {createReadStream} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-19'}).withConfig({useCdn: false, perspective: 'raw'})
if (client.config().projectId !== 'yv32mo3i' || client.config().dataset !== 'production') {
  throw new Error('This import is only for the Sonder Origin production dataset.')
}
const links = [['gallery', 'Gallery'], ['about', 'About'], ['contact', 'Contact']]
  .map(([page, label]) => ({_key: page, _type: 'navigationLink', page, label, show: true}))
const existing = await client.fetch('*[_id in ["navigation", "drafts.navigation"]]{_id}')
if (existing.length) {
  console.log('Navigation content already exists. No changes made.')
} else if (!process.argv.includes('--apply')) {
  console.log('Preview: upload the current home icon and create Navigation with Gallery, About and Contact. Use --apply to save.')
} else {
  const source = fileURLToPath(new URL('../../public/images/icon.png', import.meta.url))
  const asset = await client.assets.upload('image', createReadStream(source), {filename: 'icon.png', contentType: 'image/png'})
  await client.createIfNotExists({
    _id: 'navigation', _type: 'navigation', headerLinks: links,
    homeImage: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
  })
  console.log('Uploaded the current home icon and created the Navigation document.')
}
