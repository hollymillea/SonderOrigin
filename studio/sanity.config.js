import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes/index.js'

const singletons = [
  {type: 'about', title: 'About'},
  {type: 'gallery', title: 'Gallery'},
  {type: 'siteSettings', title: 'Site settings'},
]
const singletonTypes = new Set(singletons.map(({type}) => type))

export default defineConfig({
  name: 'sonder-origin',
  title: 'Sonder Origin',
  projectId: 'yv32mo3i',
  dataset: 'production',
  plugins: [structureTool({
    structure: (S) => S.list().title('Sonder Origin').items([
      S.documentTypeListItem('artist').title('Artists'),
      S.divider(),
      ...singletons.map(({type, title}) => S.listItem().title(title).id(type)
        .child(S.document().schemaType(type).documentId(type).title(title))),
    ]),
  })],
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
