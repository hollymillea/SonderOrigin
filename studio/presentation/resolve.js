import {defineLocations} from 'sanity/presentation'

// Matches src/data/artist-slug.mjs
const artistSlug = (name) => (name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const resolve = {
  locations: {
    navigation: defineLocations({
      select: {},
      resolve: () => ({locations: [{title: 'Site header', href: '/'}]}),
    }),
    artist: defineLocations({
      select: {name: 'name'},
      resolve: (document) => ({
        locations: [
          {
            title: document?.name || 'Artist',
            href: artistSlug(document?.name) ? `/artists/${artistSlug(document.name)}/` : '/',
          },
          {title: 'Selected artists', href: '/'},
        ],
      }),
    }),
    about: defineLocations({
      select: {name: 'name'},
      resolve: (document) => ({
        locations: [{title: document?.name ? `About ${document.name}` : 'About', href: '/about/'}],
      }),
    }),
    gallery: defineLocations({
      select: {},
      resolve: () => ({locations: [{title: 'Gallery', href: '/gallery/'}]}),
    }),
    siteSettings: defineLocations({
      select: {},
      resolve: () => ({locations: [{title: 'Home', href: '/'}]}),
    }),
    contact: defineLocations({
      select: {},
      resolve: () => ({locations: [{title: 'Contact', href: '/contact/'}]}),
    }),
    site: defineLocations({
      select: {},
      resolve: () => ({locations: [{title: 'Home', href: '/'}]}),
    }),
  },
}
