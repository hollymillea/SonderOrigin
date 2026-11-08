export const defaultHeaderLinks = [
  {label: 'Gallery', href: '/gallery/'},
  {label: 'About', href: '/about/'},
  {label: 'Contact', href: '/contact/'},
];

export const defaultHomeIcon = {src: '/images/icon.png', width: 200, height: 119};

const pagePaths = {gallery: '/gallery/', about: '/about/', contact: '/contact/'};

// The header has a fixed set of pages: editors only reorder, relabel or hide them.
export function navigationLinks(links) {
  if (!Array.isArray(links)) return defaultHeaderLinks;
  const seen = new Set();
  return links.flatMap((link) => {
    const href = pagePaths[link?.page];
    if (!href || seen.has(href)) return [];
    seen.add(href);
    if (link.show === false) return [];
    const fallback = defaultHeaderLinks.find((item) => item.href === href).label;
    return [{label: link.label?.trim() || fallback, href}];
  });
}
