import {defineArrayMember, defineField, defineType} from 'sanity'
import {HeadingTextInput, LinesTextInput, CountCheckboxInput, ShowreelSourceInput, SharedServicesInput, ServicesSectionInput, ShortcutField} from '../components/HomeTextInputs.jsx'
import {ArtistOrderInput} from '../components/ArtistOrderInput.jsx'
import {NavigationLinkItem} from '../components/NavigationLinkItem.jsx'

const required = (rule) => rule.required()
const paragraphs = (name, title) => defineField({
  name, title, type: 'array', of: [defineArrayMember({type: 'text'})],
})

// Artist portraits are named after the artist and never framed or captioned.
const isArtistPortrait = ({document, path}) => document?._type === 'artist' && path?.[0] === 'portrait'

const contentImage = defineType({
  name: 'contentImage', title: 'Image', type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({name: 'alt', title: 'Image description', type: 'string',
      description: 'Describe the image for people using screen readers.',
      hidden: isArtistPortrait,
      validation: (rule) => rule.custom((value, context) => isArtistPortrait(context) || value ? true : 'Required')}),
    defineField({name: 'caption', title: 'Caption', type: 'string',
      hidden: (context) => context.document?._type === 'about' || isArtistPortrait(context)}),
    defineField({name: 'ratio', title: 'Gallery frame', type: 'string',
      hidden: (context) => context.document?._type === 'about' || isArtistPortrait(context),
      options: {list: [{title: 'Automatic', value: ''}, {title: 'Landscape', value: '16 / 10'}, {title: 'Square', value: '1 / 1'}, {title: 'Portrait', value: '4 / 5'}]}}),
  ],
  preview: {select: {title: 'alt', subtitle: 'caption', media: 'asset'}},
})

const chapter = defineType({
  name: 'chapter', title: 'Work chapter', type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: required}),
    defineField({name: 'text', title: 'Description', type: 'text', rows: 4}),
    defineField({name: 'layout', title: 'Image layout', type: 'string', initialValue: 'lead',
      options: {list: [
        {title: 'Lead — wide image, then a pair', value: 'lead'},
        {title: 'Full width — one image', value: 'bleed'},
        {title: 'Pair — two portraits, then a wide image', value: 'pair'},
        {title: 'Grid — staggered squares', value: 'grid'},
      ]}, validation: required}),
    defineField({name: 'images', title: 'Images', type: 'array',
      of: [defineArrayMember({type: 'contentImage'})],
      description: 'Drag images to change their order.',
      validation: (rule) => rule.required().min(1).custom((images, context) => {
        const layout = context.parent?.layout
        const count = images?.length || 0
        if (layout === 'bleed' && count !== 1) return 'Full width needs exactly one image.'
        if (['lead', 'pair'].includes(layout) && count !== 3) return 'This layout needs exactly three images.'
        return true
      }),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'layout', media: 'images.0'}},
})

const artist = defineType({
  name: 'artist', title: 'Artist', type: 'document',
  orderings: [{title: 'Name', name: 'artistName', by: [{field: 'name', direction: 'asc'}]}],
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: required,
      description: 'Also sets the page address, e.g. Olivia Dean → /artists/olivia-dean/.'}),
    // The page address now comes from the name; older saved addresses are kept but unused.
    defineField({name: 'slug', title: 'Legacy page address', type: 'slug', hidden: true, readOnly: true}),
    defineField({name: 'order', title: 'Legacy order', type: 'number', hidden: true, readOnly: true}),
    defineField({name: 'description', title: 'Introduction', type: 'text', rows: 5, validation: required}),
    defineField({name: 'portrait', title: 'Portrait', type: 'contentImage', validation: required,
      description: 'This is the image used on the home page when this artist is selected in the list. It also appears at the top of their artist page.'}),
    defineField({name: 'portraitZoom', title: 'Legacy portrait zoom', type: 'number', hidden: true, readOnly: true}),
    defineField({name: 'chapters', title: 'Work chapters', type: 'array',
      of: [defineArrayMember({type: 'chapter'})], description: 'Add chapters and drag them into order. Click a chapter to add or edit its pictures, title and description.'}),
  ],
  preview: {select: {title: 'name', subtitle: 'description', media: 'portrait'}},
})

const about = defineType({
  name: 'about', title: 'About', type: 'document',
  fields: [
    defineField({name: 'name', title: 'Legacy founder name', type: 'string', hidden: true, readOnly: true}),
    defineField({name: 'title', title: 'Title lines', type: 'array',
      of: [defineArrayMember({type: 'string'})], initialValue: ['by Shan'],
      validation: (rule) => rule.required().min(1)}),
    defineField({name: 'role', title: 'Role', type: 'string', initialValue: 'Founder, Sonder Origin'}),
    defineField({name: 'portrait', title: 'Image', type: 'contentImage', validation: required,
      description: 'Upload a photo. Add an image description for screen readers.', options: {hotspot: false}}),
    defineField({name: 'portraitZoom', title: 'Legacy portrait zoom', type: 'number', hidden: true, readOnly: true}),
    defineField({name: 'intro', title: 'Short introduction', type: 'text', rows: 3, validation: required}),
    paragraphs('bio', 'Biography paragraphs'),
    defineField({name: 'showSelectedArtistList', title: 'Show selected artist list', type: 'boolean',
      initialValue: true, options: {layout: 'checkbox'}, components: {input: CountCheckboxInput}}),
    defineField({name: 'showServices', title: 'Show services', type: 'boolean',
      initialValue: true, options: {layout: 'checkbox'}, components: {input: CountCheckboxInput}}),
    defineField({name: 'services', title: 'Services', type: 'array',
      description: 'One service per line. Also used on Home.',
      of: [defineArrayMember({type: 'string'})], components: {input: LinesTextInput}}),
  ],
  preview: {prepare: () => ({title: 'About Sonder Origin'})},
})

const gallery = defineType({
  name: 'gallery', title: 'Gallery', type: 'document',
  fields: [defineField({name: 'images', title: 'Gallery images', type: 'array',
    description: 'Drag images to change the order. Click an image row to edit its caption, image description and frame.',
    of: [defineArrayMember({type: 'contentImage'})]})],
  preview: {prepare: () => ({title: 'Gallery'})},
})

const siteSettings = defineType({
  name: 'siteSettings', title: 'Home', type: 'document',
  fieldsets: [
    {name: 'homepageText', title: 'Homepage text — left to right', options: {collapsible: false}},
    {name: 'artists', title: 'Artist order', options: {collapsible: true, collapsed: false}},
    {name: 'reel', title: 'Showreel', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // Older Home documents still supply fallbacks to the website. Keep these
    // fields recognised without showing duplicate controls in the editor.
    defineField({name: 'title', title: 'Legacy site name', type: 'string', hidden: true, readOnly: true}),
    defineField({name: 'description', title: 'Legacy search description', type: 'text', hidden: true, readOnly: true}),
    defineField({name: 'email', title: 'Legacy email', type: 'string', hidden: true, readOnly: true}),
    defineField({name: 'selectedArtistsHeading', title: '1. Selected artists', type: 'string', fieldset: 'homepageText',
      initialValue: 'Selected artists',
      components: {input: HeadingTextInput}}),
    defineField({name: 'showArtistCount', title: 'Show artist count', type: 'boolean', fieldset: 'homepageText',
      initialValue: true, options: {layout: 'checkbox'},
      components: {input: CountCheckboxInput}}),
    defineField({name: 'intro', title: '2. Introduction', type: 'text', rows: 3, fieldset: 'homepageText'}),
    defineField({name: 'useAboutServices', title: 'Legacy services option', type: 'boolean', hidden: true, readOnly: true}),
    defineField({name: 'services', title: 'Legacy homepage services', type: 'array', hidden: true, readOnly: true,
      of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'servicesSection', title: '3. Services', type: 'object', fieldset: 'homepageText',
      options: {collapsible: false}, initialValue: {useAboutServices: true},
      components: {input: ServicesSectionInput},
      fields: [
        defineField({name: 'useAboutServices', title: 'Use About services', type: 'boolean',
          initialValue: true, options: {layout: 'checkbox'}, components: {input: CountCheckboxInput}}),
        defineField({name: 'editAboutServices', title: ' ', type: 'string', readOnly: true,
          hidden: ({parent}) => parent?.useAboutServices === false,
          components: {input: SharedServicesInput, field: ShortcutField}}),
        defineField({name: 'text', title: 'Homepage text', type: 'text', rows: 3,
          hidden: ({parent}) => parent?.useAboutServices !== false}),
      ],
    }),
    defineField({name: 'studioNote', title: '4. Studio note', type: 'array', fieldset: 'homepageText',
      description: 'Press Enter for a new line.',
      of: [defineArrayMember({type: 'text'})], components: {input: LinesTextInput}}),
    defineField({name: 'selectedArtists', title: 'Homepage artists', type: 'array', fieldset: 'artists',
      description: 'Drag to change the order. New artists appear here automatically. Create and edit artists in Artists.',
      components: {input: ArtistOrderInput},
      of: [defineArrayMember({type: 'reference', to: [{type: 'artist'}], options: {disableNew: true}})],
      validation: (rule) => rule.unique()}),
    defineField({name: 'showreelSource', title: 'Video source', type: 'string', fieldset: 'reel',
      initialValue: 'upload', components: {input: ShowreelSourceInput},
      options: {layout: 'radio', list: [
        {title: 'Upload a video', value: 'upload'},
        {title: 'Use a video link', value: 'link'},
        {title: 'Off', value: 'off'},
      ]}}),
    defineField({name: 'showreelFile', title: 'Video', type: 'file', fieldset: 'reel',
      description: 'Upload an MP4 or WebM video.', options: {accept: 'video/mp4,video/webm'},
      hidden: ({document}) => document?.showreelSource !== 'upload',
      validation: (rule) => rule.custom((value, context) => context.document?.showreelSource === 'upload' && !value?.asset?._ref ? 'Upload a video.' : true)}),
    defineField({name: 'showreelUrl', title: 'Video link', type: 'url', fieldset: 'reel',
      description: 'Paste a direct MP4 or WebM link. YouTube and Vimeo page links won’t play here.',
      hidden: ({document}) => (document?.showreelSource ?? (document?.showreelUrl ? 'link' : 'off')) !== 'link',
      validation: (rule) => rule.uri({scheme: ['https']}).custom((value, context) => context.document?.showreelSource === 'link' && !value ? 'Add a video link.' : true)}),
  ],
  preview: {prepare: () => ({title: 'Home'})},
})

const site = defineType({
  name: 'site', title: 'Site settings', type: 'document',
  description: 'Site-wide details that do not appear on the homepage itself.',
  fields: [
    defineField({name: 'title', title: 'Site name', type: 'string', initialValue: 'Sonder Origin', validation: required}),
    defineField({name: 'description', title: 'Search description', type: 'text', rows: 3}),
    defineField({name: 'logo', title: 'Logo', type: 'image',
      description: 'The main logo on the Home, About and Contact pages. Leave empty to use the current logo.'}),
    defineField({name: 'logoAlt', title: 'Logo description', type: 'string', initialValue: 'Sonder Origin'}),
    defineField({name: 'useCustomCursor', title: 'Use custom cursor', type: 'boolean', initialValue: true,
      description: 'Untick to use the visitor’s normal mouse pointer.'}),
    defineField({name: 'cursorImage', title: 'Cursor image', type: 'image',
      description: 'A small square image, ideally 64 × 64 pixels; it is shown at 32 × 32 and its centre is the click point. Leave empty to use the current spiral cursor.',
      hidden: ({document}) => document?.useCustomCursor === false}),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})

const contact = defineType({
  name: 'contact', title: 'Contact', type: 'document',
  fields: [
    defineField({name: 'email', title: 'Email', type: 'string', validation: (rule) => rule.email()}),
    defineField({name: 'socialLinks', title: 'Social links', type: 'array',
      description: 'Shown under Follow on the Contact page. Drag to change their order.',
      of: [defineArrayMember({
        type: 'object', name: 'socialLink', fields: [
          defineField({name: 'label', title: 'Name', type: 'string', validation: required}),
          defineField({name: 'url', title: 'Link', type: 'url', validation: required}),
        ],
      })]}),
  ],
  preview: {prepare: () => ({title: 'Contact'})},
})

const navigationPages = [
  {title: 'Gallery', value: 'gallery'},
  {title: 'About', value: 'about'},
  {title: 'Contact', value: 'contact'},
]
const navigation = defineType({
  name: 'navigation', title: 'Navigation', type: 'document',
  initialValue: {headerLinks: navigationPages.map(({title, value}) => (
    {_key: value, _type: 'navigationLink', page: value, label: title, show: true}
  ))},
  fields: [
    defineField({name: 'homeImage', title: 'Home button image', type: 'image',
      description: 'The icon at the start of the header that links home. Use a black image on a transparent background; the header inverts it to white.'}),
    defineField({name: 'headerLinks', title: 'Header links', type: 'array',
      description: 'Drag links into order. Untick a link’s checkbox to hide it from the header while keeping its page.',
      options: {disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate']},
      validation: (rule) => rule.custom((links) => {
        const pages = (links || []).map(({page}) => page)
        return navigationPages.every(({value}) => pages.filter((page) => page === value).length === 1)
          && pages.length === navigationPages.length ? true : 'The header needs exactly one Gallery, About and Contact link.'
      }),
      of: [defineArrayMember({name: 'navigationLink', title: 'Link', type: 'object',
        components: {item: NavigationLinkItem},
        fields: [
          defineField({name: 'page', title: 'Page', type: 'string', readOnly: true,
            options: {list: navigationPages}}),
          defineField({name: 'label', title: 'Label', type: 'string', validation: required}),
          defineField({name: 'show', title: 'Show', type: 'boolean', initialValue: true}),
        ],
        preview: {select: {title: 'label', page: 'page', show: 'show'},
          prepare: ({title, page, show}) => ({
            title: title || navigationPages.find(({value}) => value === page)?.title,
            subtitle: show === false ? 'Hidden' : 'Shown',
          })},
      })],
    }),
  ],
  preview: {prepare: () => ({title: 'Navigation'})},
})

const logo = defineType({
  name: 'logo', title: 'Logo', type: 'document',
  fields: [
    defineField({name: 'image', title: 'Logo', type: 'image', validation: required,
      description: 'Upload your logo here.'}),
    defineField({name: 'alt', title: 'Image description', type: 'string', initialValue: 'Sonder Origin'}),
  ],
  preview: {select: {media: 'image'}, prepare: ({media}) => ({title: 'Logo', media})},
})

const services = defineType({
  name: 'services', title: 'Legacy services', type: 'document',
  fields: [defineField({name: 'items', title: 'Legacy services', type: 'array', readOnly: true, hidden: true,
    of: [defineArrayMember({type: 'string'})], components: {input: LinesTextInput}})],
  preview: {prepare: () => ({title: 'Legacy services — edit in About'})},
})

export const schemaTypes = [contentImage, chapter, siteSettings, about, gallery, contact, site, artist, navigation, logo, services]
