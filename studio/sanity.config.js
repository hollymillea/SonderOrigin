import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes/index.js'

const pages = [
  {type: 'siteSettings', title: 'Home'},
  {type: 'about', title: 'About'},
  {type: 'gallery', title: 'Gallery'},
  {type: 'contact', title: 'Contact'},
]
const singletons = [...pages, {type: 'site', title: 'Site settings'}, {type: 'navigation', title: 'Navigation'}, {type: 'logo', title: 'Logo'}, {type: 'services', title: 'Services'}]
const singletonTypes = new Set(singletons.map(({type}) => type))

export default defineConfig({
  name: 'sonder-origin',
  title: 'Sonder Origin',
  projectId: 'yv32mo3i',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) => S.list().title('Sonder Origin').items([
        S.listItem().title('Pages').id('pages')
          .child(S.list().title('Pages').items(
            pages.map(({type, title}) => S.listItem().title(title).id(type)
              .child(S.document().schemaType(type).documentId(type).title(title))),
          )),
        S.listItem().title('Artists').id('artists')
          .child(S.documentTypeList('artist').title('Artists')
            .defaultOrdering([{field: 'name', direction: 'asc'}])),
        S.listItem().title('Site settings').id('site')
          .child(S.list().title('Site settings').items([
            S.listItem().title('General').id('general')
              .child(S.document().schemaType('site').documentId('site').title('General')),
            S.listItem().title('Navigation').id('navigation')
              .child(S.document().schemaType('navigation').documentId('navigation').title('Navigation')),
          ])),
      ]),
    }),
    presentationTool({
      previewUrl: {
        initial: 'https://sonder-origin.vercel.app',
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, {schemaType}) => singletonTypes.has(schemaType)
      ? actions.filter(({action}) => !['duplicate', 'delete', 'unpublish'].includes(action))
      : actions,
  },
})
