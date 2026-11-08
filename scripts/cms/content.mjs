import {navigationLinks} from '../../src/data/navigation.mjs';
import {artistSlug} from '../../src/data/artist-slug.mjs';

export const projectId = 'yv32mo3i';
export const dataset = 'production';
export const apiVersion = '2026-10-19';

const imageProjection = '{...,asset->{url,metadata{dimensions}}}';
export const query = `{
  "artists": *[_type == "artist"] | order(_createdAt asc, name asc) {
    name, description,
    "portrait": portrait${imageProjection},
    chapters[]{title,text,layout,"images": images[]${imageProjection}}
  },
  "about": *[_id == "about"][0]{...,"portrait": portrait${imageProjection}},
  "gallery": *[_id == "gallery"][0]{"images": images[]${imageProjection}},
  "settings": *[_id == "siteSettings"][0]{...,"selectedArtists": selectedArtists[]->name,"showreelFile": showreelFile{asset->{url}}},
  "site": *[_id == "site"][0]{...,"logo": logo${imageProjection},"cursorImage": cursorImage{asset->{url,metadata{dimensions}}},"tabIcon": tabIcon{asset->{url}}},
  "contact": *[_id == "contact"][0]{email, socialLinks},
  "navigation": *[_id == "navigation"][0]{headerLinks[]{label,page,show},"homeImage": homeImage{asset->{url,metadata{dimensions}}}},
  "logo": *[_id == "logo"][0]{alt,"image": image${imageProjection}},
  "services": *[_id == "services"][0]{items}
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
  if (!artists.length && !result.about && !result.gallery && !result.settings && !result.site && !result.contact && !result.navigation && !result.logo && !result.services) return {};
  if (!artists.length) throw new Error('Publish at least one artist before building the CMS website.');
  const slugs = new Set();
  const normalizedArtists = artists.map((artist) => {
    const slug = artistSlug(artist);
    if (!slug) throw new Error(`Artist ${artist.name || '(unnamed)'} needs a name with letters or numbers.`);
    if (slugs.has(slug)) throw new Error(`Duplicate artist name: two artists would share the page /artists/${slug}/`);
    slugs.add(slug);
    const portrait = imageData(artist.portrait);
    return {
      name: artist.name, slug, description: artist.description || '',
      image: portrait.src, crop: portrait.crop,
      chapters: (artist.chapters || []).map((chapter) => {
        if (!['lead', 'bleed', 'pair', 'grid'].includes(chapter.layout)) throw new Error('Unknown work chapter layout.');
        return {...chapter, images: (chapter.images || []).map(imageData)};
      }),
    };
  });
  const serviceItems = Array.isArray(result.about?.services) ? result.about.services : result.services?.items;
  const sharedServices = Array.isArray(serviceItems)
    ? serviceItems.filter((item) => typeof item === 'string' && item.trim()) : null;
  const about = result.about && {
    name: result.about.name || 'Sonder Origin', title: result.about.title || [result.about.name || 'About'],
    role: result.about.role || '', intro: result.about.intro || '',
    bio: result.about.bio || [],
    services: sharedServices ?? result.about.services ?? [],
    showSelectedArtistList: result.about.showSelectedArtistList ?? true,
    showServices: result.about.showServices ?? true,
    image: {...imageData(result.about.portrait), zoom: 1},
  };
  // Home, Site settings and Contact each hold part of the settings. Later
  // documents win, so values still left on older documents act as fallbacks.
  const merged = {...(result.settings || {}), ...(result.site || {}), ...(result.contact || {})};
  const settings = (result.settings || result.site || result.contact || result.navigation || result.logo || result.services) && Object.fromEntries(
    ['title', 'description', 'email', 'socialLinks', 'intro', 'services', 'studioNote', 'showreelUrl']
      .filter((key) => merged[key] !== undefined)
      .map((key) => [key, merged[key]]),
  );
  if (settings) settings.headerLinks = navigationLinks(result.navigation?.headerLinks);
  if (settings && result.navigation?.homeImage?.asset?.url) {
    const asset = result.navigation.homeImage.asset;
    settings.homeIcon = {
      src: asset.url,
      width: asset.metadata?.dimensions?.width || 200,
      height: asset.metadata?.dimensions?.height || 119,
    };
  }
  if (settings) {
    const section = result.settings?.servicesSection;
    settings.useAboutServices = section?.useAboutServices ?? result.settings?.useAboutServices ?? true;
    if (!settings.useAboutServices) {
      settings.services = section
        ? (typeof section.text === 'string' ? section.text.split('\n') : [])
        : Array.isArray(result.settings?.services) ? result.settings.services : [];
    } else if (sharedServices !== null) {
      settings.services = sharedServices;
    }
  }
  // General holds the logo; the older Logo document stays as a fallback.
  const logoSource = result.site?.logo?.asset?.url
    ? {image: result.site.logo, alt: result.site.logoAlt} : result.logo;
  if (settings && logoSource?.image?.asset?.url) {
    const asset = logoSource.image.asset;
    settings.logo = {
      src: asset.url,
      width: asset.metadata?.dimensions?.width || 473,
      height: asset.metadata?.dimensions?.height || 252,
      alt: logoSource.alt || 'Sonder Origin',
    };
  }
  if (settings && result.site?.tabIcon?.asset?.url) {
    const url = new URL(result.site.tabIcon.asset.url);
    Object.entries({w: '512', h: '512', fit: 'crop', fm: 'png'}).forEach(([key, value]) => url.searchParams.set(key, value));
    settings.tabIcon = url.toString();
  }
  if (settings && result.site && (result.site.useCustomCursor !== undefined || result.site.cursorImage)) {
    settings.cursor = {enabled: result.site.useCustomCursor ?? true};
    const asset = result.site.cursorImage?.asset;
    if (settings.cursor.enabled && asset?.url) {
      const {width = 32, height = 32} = asset.metadata?.dimensions || {};
      const sized = (w) => {
        const url = new URL(asset.url);
        url.searchParams.set('w', String(w));
        url.searchParams.set('fm', 'png');
        return url.toString();
      };
      // Shown 32px wide, so the click point is the image centre at that size
      Object.assign(settings.cursor, {
        src: sized(32), src2x: sized(64),
        hotspot: [16, Math.min(127, Math.round(16 * height / width))],
      });
    }
  }
  if (settings) {
    settings.selectedArtistsHeading = result.settings?.selectedArtistsHeading?.trim() || 'Selected artists';
    settings.showArtistCount = result.settings?.showArtistCount ?? true;
    const source = result.settings?.showreelSource;
    if (source !== undefined && source !== null) {
      settings.showreelUrl = source === 'upload'
        ? result.settings?.showreelFile?.asset?.url || ''
        : source === 'link' ? result.settings?.showreelUrl || '' : '';
    }
  }
  if (settings && Array.isArray(result.settings?.selectedArtists)) {
    // Ignore unpublished references and preserve the editor's selection order.
    settings.selectedArtists = [...new Set(result.settings.selectedArtists.map((name) => artistSlug({name})).filter((slug) => slugs.has(slug)))];
  }
  const selectedSlugs = settings?.selectedArtists || [];
  const bySlug = new Map(normalizedArtists.map((artist) => [artist.slug, artist]));
  const selectedSet = new Set(selectedSlugs);
  return {
    artists: [
      ...selectedSlugs.map((slug) => bySlug.get(slug)),
      ...normalizedArtists.filter((artist) => !selectedSet.has(artist.slug)),
    ],
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
