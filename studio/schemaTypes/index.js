import {defineArrayMember, defineField, defineType} from 'sanity'
import {HeadingTextInput, LinesTextInput, CountCheckboxInput, ShowreelSourceInput} from '../components/HomeTextInputs.jsx'
import {ArtistOrderInput} from '../components/ArtistOrderInput.jsx'

const required = (rule) => rule.required()
const paragraphs = (name, title) => defineField({
  name, title, type: 'array', of: [defineArrayMember({type: 'text'})],
})

const contentImage = defineType({
  name: 'contentImage', title: 'Image', type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({name: 'alt', title: 'Image description', type: 'string',
      description: 'Describe the image for people using screen readers.', validation: required}),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
    defineField({name: 'ratio', title: 'Gallery frame', type: 'string',
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
    defineField({name: 'name', title: 'Name', type: 'string', validation: required}),
    defineField({name: 'slug', title: 'Page address', type: 'slug',
      description: 'Generate once, then keep this address when changing the artist name.',
      options: {source: 'name', maxLength: 96}, validation: required}),
    defineField({name: 'order', title: 'Legacy order', type: 'number', hidden: true, readOnly: true}),
    defineField({name: 'description', title: 'Introduction', type: 'text', rows: 5, validation: required}),
    defineField({name: 'portrait', title: 'Portrait', type: 'contentImage', validation: required}),
    defineField({name: 'portraitZoom', title: 'Portrait zoom', type: 'number', initialValue: 1,
      description: '1 keeps the full crop; 1.1 adds a little zoom.',
      validation: (rule) => rule.min(1).max(2)}),
    defineField({name: 'chapters', title: 'Work chapters', type: 'array',
      of: [defineArrayMember({type: 'chapter'})], description: 'Add chapters and drag them into order.'}),
  ],
  preview: {select: {title: 'name', subtitle: 'description', media: 'portrait'}},
})

const about = defineType({
  name: 'about', title: 'About', type: 'document',
  fields: [
    defineField({name: 'name', title: 'Founder name', type: 'string', initialValue: 'Shan', validation: required}),
    defineField({name: 'title', title: 'Large title lines', type: 'array',
      of: [defineArrayMember({type: 'string'})], initialValue: ['by Shan'],
      validation: (rule) => rule.required().min(1)}),
    defineField({name: 'role', title: 'Role', type: 'string', initialValue: 'Founder, Sonder Origin'}),
    defineField({name: 'portrait', title: 'Portrait', type: 'contentImage', validation: required}),
    defineField({name: 'portraitZoom', title: 'Portrait zoom', type: 'number', initialValue: 1, validation: (rule) => rule.min(1).max(2)}),
    defineField({name: 'intro', title: 'Short introduction', type: 'text', rows: 3, validation: required}),
    paragraphs('bio', 'Biography paragraphs'),
    defineField({name: 'services', title: 'Services', type: 'array', of: [defineArrayMember({type: 'string'})]}),
  ],
  preview: {prepare: () => ({title: 'About Sonder Origin'})},
})

const gallery = defineType({
  name: 'gallery', title: 'Gallery', type: 'document',
  fields: [defineField({name: 'images', title: 'Gallery images', type: 'array',
    description: 'Drag images into order. Add an optional caption to each upload.',
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
    defineField({name: 'services', title: '3. Services', type: 'array', fieldset: 'homepageText',
      description: 'Press Enter for a new line.',
      of: [defineArrayMember({type: 'string'})], components: {input: LinesTextInput}}),
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

const navigation = defineType({
  name: 'navigation', title: 'Navigation', type: 'document',
  initialValue: {headerLinks: [
    {_key: 'gallery', _type: 'navigationLink', label: 'Gallery', destination: 'internal', page: {_type: 'reference', _ref: 'gallery'}},
    {_key: 'about', _type: 'navigationLink', label: 'About', destination: 'internal', page: {_type: 'reference', _ref: 'about'}},
    {_key: 'contact', _type: 'navigationLink', label: 'Contact', destination: 'internal', page: {_type: 'reference', _ref: 'contact'}},
  ]},
  fields: [defineField({name: 'headerLinks', title: 'Header links', type: 'array',
    description: 'Drag links into order. Hide a link to remove it from the header while keeping its page. An empty list shows only the home icon.',
    of: [defineArrayMember({name: 'navigationLink', title: 'Link', type: 'object',
      initialValue: {destination: 'internal', hidden: false},
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string', validation: required}),
        defineField({name: 'destination', title: 'Destination', type: 'string',
          options: {layout: 'radio', list: [{title: 'Page', value: 'internal'}, {title: 'External URL', value: 'external'}]}, validation: required}),
        defineField({name: 'page', title: 'Page', type: 'reference',
          to: [{type: 'siteSettings'}, {type: 'about'}, {type: 'gallery'}, {type: 'contact'}, {type: 'artist'}],
          hidden: ({parent}) => parent?.destination !== 'internal',
          validation: (rule) => rule.custom((value, context) => context.parent?.destination === 'internal' && !value?._ref ? 'Choose a page.' : true)}),
        defineField({name: 'url', title: 'External URL', type: 'url',
          hidden: ({parent}) => parent?.destination !== 'external',
          validation: (rule) => rule.uri({scheme: ['https', 'http']}).custom((value, context) => context.parent?.destination === 'external' && !value ? 'Enter a URL.' : true)}),
        defineField({name: 'hidden', title: 'Hide from navigation', type: 'boolean', initialValue: false}),
      ],
      preview: {select: {title: 'label', hidden: 'hidden', destination: 'destination'},
        prepare: ({title, hidden, destination}) => ({title, subtitle: hidden ? 'Hidden' : destination === 'external' ? 'External link' : 'Page link'})},
    })],
  })],
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

export const schemaTypes = [contentImage, chapter, siteSettings, about, gallery, contact, site, artist, navigation, logo]
