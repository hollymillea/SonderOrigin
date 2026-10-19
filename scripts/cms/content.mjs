export const projectId = 'yv32mo3i';
export const dataset = 'production';
export const apiVersion = '2026-10-19';

const imageProjection = '{...,asset->{url,metadata{dimensions}}}';
export const query = `{
  "artists": *[_type == "artist"] | order(order asc, name asc) {
    name, "slug": slug.current, description, portraitZoom,
    "portrait": portrait${imageProjection},
    chapters[]{title,text,layout,"images": images[]${imageProjection}}
  },
  "about": *[_id == "about"][0]{...,"portrait": portrait${imageProjection}},
  "gallery": *[_id == "gallery"][0]{"images": images[]${imageProjection}},
  "settings": *[_id == "siteSettings"][0]{...,"showreelPoster": showreelPoster${imageProjection}}
}`;

export function imageData(image) {
  if (!image?.asset?.url) throw new Error('A published image is missing its upload.');
  const {width, height} = image.asset.metadata.dimensions;
  const crop = image.crop || {};
  const x = Math.round((crop.left || 0) * width);
  const y = Math.round((crop.top || 0) * height);
  const w = Math.max(1, Math.round(width * (1 - (crop.left || 0) - (crop.right || 0))));
  const h = Math.max(1, Math.round(height * (1 - (crop.top || 0) - (crop.bottom || 0))));
  const url = new URL(image.asset.url);
  if (x || y || w !== width || h !== height) url.searchParams.set('rect', `${x},${y},${w},${h}`);
  url.searchParams.set('w', String(Math.min(w, 1800)));
  url.searchParams.set('auto', 'format');
  url.searchParams.set('q', '85');
  const focalX = Math.max(0, Math.min(100, ((image.hotspot?.x ?? 0.5) * width - x) / w * 100));
  const focalY = Math.max(0, Math.min(100, ((image.hotspot?.y ?? 0.5) * height - y) / h * 100));
  return {
    src: url.toString(), width: w, height: h,
    crop: `${focalX}% ${focalY}%`, alt: image.alt || '',
    ...(image.caption ? {caption: image.caption} : {}),
    ...(image.ratio ? {ratio: image.ratio} : {}),
  };
}

export function normalizeContent(result) {
  const artists = result.artists || [];
  if (!artists.length && !result.about && !result.gallery && !result.settings) return {};
  if (!artists.length) throw new Error('Publish at least one artist before building the CMS website.');
  const slugs = new Set();
  const normalizedArtists = artists.map((artist) => {
    if (!artist.name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(artist.slug || '')) {
      throw new Error(`Artist ${artist.name || '(unnamed)'} needs a valid published page address.`);
    }
    if (slugs.has(artist.slug)) throw new Error(`Duplicate artist page address: ${artist.slug}`);
    slugs.add(artist.slug);
    const portrait = imageData(artist.portrait);
    return {
      name: artist.name, slug: artist.slug, description: artist.description || '',
      image: portrait.src, crop: portrait.crop, cropZoom: artist.portraitZoom ?? 1,
      chapters: (artist.chapters || []).map((chapter) => {
        if (!['lead', 'bleed', 'pair', 'grid'].includes(chapter.layout)) throw new Error('Unknown work chapter layout.');
        return {...chapter, images: (chapter.images || []).map(imageData)};
      }),
    };
  });
  const about = result.about && {
    name: result.about.name, title: result.about.title || [result.about.name],
    role: result.about.role || '', intro: result.about.intro || '',
    bio: result.about.bio || [], services: result.about.services || [],
    image: {...imageData(result.about.portrait), zoom: result.about.portraitZoom ?? 1},
  };
  const settings = result.settings && {
    ...Object.fromEntries(['title', 'description', 'email', 'intro', 'services', 'studioNote', 'showreelUrl']
      .filter((key) => result.settings[key] !== undefined)
      .map((key) => [key, result.settings[key]])),
    showreelPoster: result.settings.showreelPoster ? imageData(result.settings.showreelPoster) : undefined,
  };
  return {
    artists: normalizedArtists,
    ...(about ? {about} : {}),
    ...(result.gallery ? {gallery: (result.gallery.images || []).map(imageData)} : {}),
    ...(settings ? {settings} : {}),
  };
}

export async function fetchContent({token, fetcher = fetch, perspective = 'published'} = {}) {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', perspective);
  const response = await fetcher(url, {
    headers: token ? {Authorization: `Bearer ${token}`} : {},
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Sanity returned HTTP ${response.status}. Check project access and dataset visibility.`);
  const body = await response.json();
  if (body.error || !body.result) throw new Error('Sanity did not return content.');
  return normalizeContent(body.result);
}
