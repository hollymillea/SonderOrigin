export const defaultHeaderLinks = [
  {label: 'Gallery', href: '/gallery/'},
  {label: 'About', href: '/about/'},
  {label: 'Contact', href: '/contact/'},
];

const pagePaths = {siteSettings: '/', about: '/about/', gallery: '/gallery/', contact: '/contact/'};

export function navigationLinks(links) {
  if (!Array.isArray(links)) return defaultHeaderLinks;
  return links.flatMap((link) => {
    if (!link || link.hidden || !link.label?.trim()) return [];
    let href;
    if (link.destination === 'external') {
      try {
        const url = new URL(link.url);
        if (!['https:', 'http:'].includes(url.protocol)) return [];
        href = url.toString();
      } catch { return []; }
    } else if (link.page?._type === 'artist') {
      const slug = link.page.slug;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) return [];
      href = `/artists/${slug}/`;
    } else {
      href = pagePaths[link.page?._type];
    }
    return href ? [{label: link.label.trim(), href, external: link.destination === 'external'}] : [];
  });
}
