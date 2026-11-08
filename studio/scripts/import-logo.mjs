import {createReadStream} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-19'}).withConfig({useCdn: false, perspective: 'raw'})
if (client.config().projectId !== 'yv32mo3i' || client.config().dataset !== 'production') {
  throw new Error('This import is only for the Sonder Origin production dataset.')
}
const existing = await client.fetch('*[_id in ["logo", "drafts.logo"]]{_id}')
if (existing.length) {
  console.log('Logo content already exists. No changes made.')
} else if (!process.argv.includes('--apply')) {
  console.log('Preview: upload the current SVG logo and create the Logo document. Use --apply to save.')
} else {
  const source = fileURLToPath(new URL('../../public/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg', import.meta.url))
  const asset = await client.assets.upload('image', createReadStream(source), {
    filename: 'SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg', contentType: 'image/svg+xml',
  })
  await client.createIfNotExists({
    _id: 'logo', _type: 'logo', alt: 'Sonder Origin',
    image: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
  })
  console.log('Uploaded the existing SVG logo and created the Logo document.')
}
