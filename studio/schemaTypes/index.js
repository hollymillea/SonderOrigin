import {defineArrayMember, defineField, defineType} from 'sanity'

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
  orderings: [{title: 'Roster order', name: 'rosterOrder', by: [{field: 'order', direction: 'asc'}]}],
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: required}),
    defineField({name: 'slug', title: 'Page address', type: 'slug',
      description: 'Generate once, then keep this address when changing the artist name.',
      options: {source: 'name', maxLength: 96}, validation: required}),
    defineField({name: 'order', title: 'Roster order', type: 'number', initialValue: 1,
      description: 'Lower numbers appear first.', validation: (rule) => rule.required().integer().min(1)}),
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
  name: 'siteSettings', title: 'Site settings', type: 'document',
  fields: [
    defineField({name: 'title', title: 'Site name', type: 'string', initialValue: 'Sonder Origin', validation: required}),
    defineField({name: 'description', title: 'Search description', type: 'text', rows: 3}),
    defineField({name: 'email', title: 'Contact email', type: 'string', validation: (rule) => rule.email()}),
    defineField({name: 'intro', title: 'Homepage introduction', type: 'text', rows: 3}),
    paragraphs('studioNote', 'Studio note lines'),
    defineField({name: 'services', title: 'Services', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'showreelUrl', title: 'Showreel video URL', type: 'url',
      description: 'A direct HTTPS video URL, such as an MP4.',
      validation: (rule) => rule.uri({scheme: ['https']})}),
    defineField({name: 'showreelPoster', title: 'Showreel poster', type: 'contentImage'}),
    defineField({name: 'socialLinks', title: 'Social links', type: 'array', of: [defineArrayMember({
      type: 'object', name: 'socialLink', fields: [
        defineField({name: 'label', title: 'Name', type: 'string', validation: required}),
        defineField({name: 'url', title: 'Link', type: 'url', validation: required}),
      ],
    })]}),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})

export const schemaTypes = [contentImage, chapter, artist, about, gallery, siteSettings]
