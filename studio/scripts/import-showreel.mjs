import {createReadStream} from 'node:fs'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-19'}).withConfig({useCdn: false, perspective: 'raw'})
if (client.config().projectId !== 'yv32mo3i' || client.config().dataset !== 'production') throw new Error('Unexpected dataset.')
const originalUrl = 'https://freight.cargo.site/m/V2402719754386806942896197344540/Shan_Reel_2025_v2.MP4'
const expectedUrl = process.argv.find((argument) => argument.startsWith('--replace-url='))?.slice(14) || originalUrl
const homes = await client.fetch('*[_id in ["siteSettings", "drafts.siteSettings"]]{_id,_rev,showreelSource,showreelUrl}')
const eligible = homes.filter((home) => home.showreelUrl === expectedUrl && home.showreelSource !== 'off')
const input = process.argv.find((argument) => argument.startsWith('--file='))?.slice(7)
if (!process.argv.includes('--apply')) {
  console.log(`Preview: move the current showreel to Sanity on ${eligible.length} Home document(s). Use --file=/absolute/path.mp4 --apply.`)
} else if (!eligible.length) {
  console.log('No Home document uses the expected reel. No changes made.')
} else {
  if (!input?.startsWith('/')) throw new Error('Pass an absolute local MP4 path with --file.')
  const asset = await client.assets.upload('file', createReadStream(input), {
    filename: 'Sonder_Origin_Showreel.mp4', contentType: 'video/mp4',
    source: {id: originalUrl, name: 'Original Cargo showreel', url: originalUrl},
  })
  let transaction = client.transaction()
  for (const home of eligible) {
    transaction = transaction.patch(home._id, (patch) => patch.ifRevisionId(home._rev).set({
      showreelSource: 'upload',
      showreelFile: {_type: 'file', asset: {_type: 'reference', _ref: asset._id}},
      // Existing website deployments also read this field.
      showreelUrl: asset.url,
    }))
  }
  await transaction.commit()
  console.log(`Uploaded the same reel to Sanity and updated ${eligible.length} Home document(s). Other fields and different draft reel choices were preserved.`)
}
