import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes/index.js'
import {resolve} from './presentation/resolve.js'

const singletons = [
  {type: 'siteSettings', title: 'Home'},
  {type: 'about', title: 'About'},
  {type: 'gallery', title: 'Gallery'},
]
const singletonTypes = new Set(singletons.map(({type}) => type))

export default defineConfig({
  name: 'sonder-origin',
  title: 'Sonder Origin',
  projectId: 'yv32mo3i',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) => S.list().title('Sonder Origin').items([
        ...singletons.map(({type, title}) => S.listItem().title(title).id(type)
          .child(S.document().schemaType(type).documentId(type).title(title))),
        S.divider(),
        S.listItem().title('Artists').id('artists')
          .child(S.documentTypeList('artist').title('Artists')
            .defaultOrdering([{field: 'order', direction: 'asc'}])),
      ]),
    }),
    presentationTool({
      resolve,
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
