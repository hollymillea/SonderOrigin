import {createReadStream} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-19'}).withConfig({useCdn: false, perspective: 'raw'})
if (client.config().projectId !== 'yv32mo3i' || client.config().dataset !== 'production') throw new Error('Unexpected dataset.')
const sites = await client.fetch('*[_id in ["site", "drafts.site"]]{_id,_rev,cursorImage}')
const targets = sites.filter((site) => !site.cursorImage)
if (!targets.length) {
  console.log('A cursor image is already set (or General does not exist). No changes made.')
} else if (!process.argv.includes('--apply')) {
  console.log(`Preview: upload the current cursor into ${targets.length} General document(s). Use --apply to save.`)
} else {
  const source = fileURLToPath(new URL('../../public/images/cursor@2x.png', import.meta.url))
  const asset = await client.assets.upload('image', createReadStream(source), {filename: 'cursor.png', contentType: 'image/png'})
  let transaction = client.transaction()
  for (const site of targets) {
    transaction = transaction.patch(site._id, (patch) => patch.ifRevisionId(site._rev).setIfMissing({
      useCustomCursor: true,
      cursorImage: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
    }))
  }
  await transaction.commit()
  console.log(`Uploaded the current cursor into ${targets.length} General document(s).`)
}
