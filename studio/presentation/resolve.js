import {defineLocations} from 'sanity/presentation'

export const resolve = {
  locations: {
    artist: defineLocations({
      select: {name: 'name', slug: 'slug.current'},
      resolve: (document) => ({
        locations: [
          {
            title: document?.name || 'Artist',
            href: document?.slug ? `/artists/${document.slug}/` : '/',
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
