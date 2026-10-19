import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {getCliClient} from 'sanity/cli';
import {artists, artistSlug} from '../../src/data/local/artists.js';
import {about} from '../../src/data/local/about.js';
import {gallery} from '../../src/data/local/gallery.js';
import {getArtistWork} from '../../src/data/local/artistWork.js';
import {settings} from '../../src/data/local/settings.js';

const root = new URL('../../', import.meta.url);
const files = new Set([
  ...artists.map((artist) => artist.image), about.image.src, settings.showreelPoster.src,
  ...gallery.map((image) => image.src),
  ...artists.flatMap((_, index) => getArtistWork(index).flatMap((chapter) => chapter.images.map((image) => image.src))),
]);
const localPath = (src) => {
  if (!src.startsWith('/images/') || decodeURIComponent(src).includes('..')) throw new Error('Unexpected asset path.');
  return fileURLToPath(new URL(`public${src}`, root));
};

async function main() {
  // Preflight every file before uploading or creating any documents.
  await Promise.all([...files].map((src) => stat(localPath(src))));
  if (process.argv.includes('--dry-run')) {
    console.log(`Import preview: ${artists.length} artists, ${artists.length * 4} work chapters, ${gallery.length} gallery entries, About and site settings.`);
    console.log(`${files.size} unique images found. No uploads or document changes made.`);
    return;
  }

  const client = getCliClient({apiVersion: '2026-10-19'}).withConfig({useCdn: false, perspective: 'raw'});
  if (client.config().projectId !== 'yv32mo3i' || client.config().dataset !== 'production') {
    throw new Error('This import is only configured for Sonder Origin project yv32mo3i / production.');
  }
  if (!client.config().token) throw new Error('Sign in using `npx sanity login`, then run the import through its npm script.');
  // Membership is checked before uploading assets, even on a public dataset.
  await client.projects.getById('yv32mo3i');
  const existing = await client.fetch('*[_type in ["artist","about","gallery","siteSettings","site","contact"]]{_id,"slug":slug.current}');
  const ids = new Set(existing.map((document) => document._id.replace(/^drafts\./, '')));
  const slugs = new Set(existing.filter((document) => document.slug).map((document) => document.slug));
  const uploads = new Map();
  const image = async (source, fallbackAlt, key) => {
    if (!uploads.has(source.src)) {
      console.log(`Uploading ${decodeURIComponent(source.src.split('/').at(-1))}`);
      uploads.set(source.src, await client.assets.upload('image', createReadStream(localPath(source.src)), {
        filename: decodeURIComponent(source.src.split('/').at(-1)),
      }));
    }
    const asset = uploads.get(source.src);
    const [x, y] = (source.crop || '50% 50%').split(' ').map((part) => parseFloat(part) / 100);
    return {
      _type: 'contentImage', ...(key ? {_key: key} : {}),
      asset: {_type: 'reference', _ref: asset._id},
      alt: source.alt || fallbackAlt,
      hotspot: {_type: 'sanity.imageHotspot', x: Number.isFinite(x) ? x : 0.5, y: Number.isFinite(y) ? y : 0.5, width: 0.2, height: 0.2},
      ...(source.caption ? {caption: source.caption} : {}),
      ...(source.ratio ? {ratio: source.ratio} : {}),
    };
  };
  const documents = [];
  for (const [index, artist] of artists.entries()) {
    const slug = artistSlug(artist);
    const id = `artist-${slug}`;
    if (ids.has(id) || slugs.has(slug)) continue;
    const chapters = [];
    for (const [chapterIndex, chapter] of getArtistWork(index).entries()) {
      const images = [];
      for (const [imageIndex, source] of chapter.images.entries()) {
        images.push(await image(source, artist.name, `image-${imageIndex}`));
      }
      chapters.push({...chapter, _type: 'chapter', _key: `chapter-${chapterIndex}`, images});
    }
    documents.push({
      _id: id, _type: 'artist', name: artist.name, slug: {_type: 'slug', current: slug},
      order: index + 1, description: artist.description, portraitZoom: artist.cropZoom,
      portrait: await image({src: artist.image, crop: artist.crop}, artist.name), chapters,
    });
  }
  if (!ids.has('about')) {
    documents.push({
      _id: 'about', _type: 'about', name: about.name, title: about.title, role: about.role,
      intro: about.intro, bio: about.bio, services: about.services,
      portrait: await image(about.image, about.name), portraitZoom: about.image.zoom,
    });
  }
  if (!ids.has('gallery')) {
    const images = [];
    for (const [index, source] of gallery.entries()) images.push(await image(source, source.caption || 'Sonder Origin portfolio image', `image-${index}`));
    documents.push({_id: 'gallery', _type: 'gallery', images});
  }
  const {title, description, email, socialLinks, ...home} = settings;
  if (!ids.has('siteSettings')) {
    documents.push({...home, _id: 'siteSettings', _type: 'siteSettings',
      showreelPoster: await image(settings.showreelPoster, settings.showreelPoster.alt)});
  }
  if (!ids.has('site')) {
    documents.push({_id: 'site', _type: 'site', title, description});
  }
  if (!ids.has('contact')) {
    documents.push({_id: 'contact', _type: 'contact', email, ...(socialLinks ? {socialLinks} : {})});
  }
  if (!documents.length) {
    console.log('The content already exists. No documents changed.');
    return;
  }
  let transaction = client.transaction();
  documents.forEach((document) => { transaction = transaction.createIfNotExists(document); });
  await transaction.commit();
  console.log(`Imported ${documents.length} published documents. Existing documents and drafts were preserved.`);
}

main().catch((error) => {
  console.error(`Import failed: ${error.message}`);
  console.error('Check that the terminal is signed in with hollymillea.work@gmail.com and has access to project yv32mo3i.');
  process.exitCode = 1;
});
