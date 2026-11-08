import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchContent, imageData, normalizeContent} from './content.mjs';
import {defaultHeaderLinks, navigationLinks} from '../../src/data/navigation.mjs';
import {orderedArtists, moveArtist} from '../../studio/components/artist-order.mjs';

const image = {
  asset: {url: 'https://cdn.sanity.io/images/yv32mo3i/production/test-1000x1000.png', metadata: {dimensions: {width: 1000, height: 1000}}},
  alt: 'A portrait', crop: {left: 0.1, right: 0.1, top: 0.2, bottom: 0}, hotspot: {x: 0.7, y: 0.4},
};
const artist = {name: 'New artist name', slug: 'original-address', portrait: image, chapters: []};

test('logo preserves the original SVG URL and image dimensions', () => {
  const logo = {alt: 'Sonder Origin logo', image: {asset: {
    url: 'https://cdn.sanity.io/images/yv32mo3i/production/logo.svg',
    metadata: {dimensions: {width: 472.7, height: 251.8}},
  }}};
  assert.deepEqual(normalizeContent({artists: [artist], logo}).settings.logo, {
    src: logo.image.asset.url, width: 472.7, height: 251.8, alt: 'Sonder Origin logo',
  });
  assert.equal(normalizeContent({artists: [artist], settings: {}}).settings.logo, undefined);
  assert.equal(normalizeContent({artists: [artist], logo: {image: null}}).settings.logo, undefined);
});

test('artist order automatically includes new artists and removes deleted artists', () => {
  const current = [{_id: 'a', name: 'A'}, {_id: 'b', name: 'B'}, {_id: 'c', name: 'New artist'}];
  const references = [{_ref: 'b'}, {_ref: 'deleted'}, {_ref: 'a'}, {_ref: 'b'}];
  assert.deepEqual(orderedArtists(current, references).map(({id}) => id), ['b', 'a', 'c']);
  assert.deepEqual(orderedArtists(current, []).map(({id}) => id), ['a', 'b', 'c']);
});

test('artist order includes drafts once and reorders without changing membership', () => {
  const list = orderedArtists([
    {_id: 'a', name: 'Published'}, {_id: 'drafts.a', name: 'Edited name'}, {_id: 'drafts.b', name: 'New draft'},
  ], [{_ref: 'a'}]);
  assert.equal(list.length, 2);
  assert.equal(list[0].name, 'Edited name');
  assert.deepEqual(moveArtist(list, 1, 0).map(({id}) => id), ['b', 'a']);
  assert.deepEqual(list.map(({id}) => id), ['a', 'b']);
});

test('showreel supports uploads, links and off while preserving existing links', () => {
  const link = 'https://example.com/reel.mp4';
  const upload = 'https://cdn.sanity.io/files/yv32mo3i/production/reel.webm';
  const settingsFor = (settings) => normalizeContent({artists: [artist], settings}).settings;
  assert.equal(settingsFor({showreelUrl: link}).showreelUrl, link);
  assert.equal(settingsFor({showreelSource: 'upload', showreelFile: {asset: {url: upload}}, showreelUrl: link}).showreelUrl, upload);
  assert.equal(settingsFor({showreelSource: 'link', showreelFile: {asset: {url: upload}}, showreelUrl: link}).showreelUrl, link);
  assert.equal(settingsFor({showreelSource: 'off', showreelFile: {asset: {url: upload}}, showreelUrl: link}).showreelUrl, '');
  assert.equal(settingsFor({showreelSource: 'upload', showreelUrl: link}).showreelUrl, '');
  assert.equal(settingsFor({showreelSource: 'link', showreelFile: {asset: {url: upload}}}).showreelUrl, '');
});

test('navigation preserves link order, resolves pages, and omits hidden or unresolved links', () => {
  const result = normalizeContent({artists: [artist], navigation: {headerLinks: [
    {label: ' Contact us ', destination: 'internal', page: {_type: 'contact'}},
    {label: 'Hidden', destination: 'internal', page: {_type: 'gallery'}, hidden: true},
    {label: 'Artist', destination: 'internal', page: {_type: 'artist', slug: 'original-address'}},
    {label: 'Home', destination: 'internal', page: {_type: 'siteSettings'}},
    {label: 'External', destination: 'external', url: 'https://example.com/work'},
    {label: 'Unpublished', destination: 'internal', page: null},
  ]}});
  assert.deepEqual(result.settings.headerLinks, [
    {label: 'Contact us', href: '/contact/', external: false},
    {label: 'Artist', href: '/artists/original-address/', external: false},
    {label: 'Home', href: '/', external: false},
    {label: 'External', href: 'https://example.com/work', external: true},
  ]);
});

test('navigation keeps existing defaults while allowing an explicitly empty or hidden menu', () => {
  assert.deepEqual(navigationLinks(undefined), defaultHeaderLinks);
  assert.deepEqual(navigationLinks([]), []);
  assert.deepEqual(navigationLinks([{label: 'Hidden', hidden: true}]), []);
  assert.deepEqual(normalizeContent({artists: [artist], settings: {}}).settings.headerLinks, defaultHeaderLinks);
});

test('navigation rejects unsafe URLs, invalid artist slugs, and incomplete links', () => {
  assert.deepEqual(navigationLinks([
    {label: 'Unsafe', destination: 'external', url: 'javascript:alert(1)'},
    {label: 'Invalid', destination: 'external', url: 'example.com'},
    {label: 'Invalid page', destination: 'internal', page: {_type: 'artist', slug: '../other'}},
    {label: ' ', destination: 'internal', page: {_type: 'about'}},
    null,
  ]), []);
});

test('homepage list controls artist order while preserving unlisted artist pages', () => {
  const second = {...artist, name: 'Second artist', slug: 'second-artist'};
  const third = {...artist, name: 'Third artist', slug: 'third-artist'};
  const result = normalizeContent({artists: [artist, second, third], settings: {
    selectedArtists: ['second-artist', null, 'original-address', 'second-artist', 'unpublished'],
  }});
  assert.deepEqual(result.settings.selectedArtists, ['second-artist', 'original-address']);
  assert.deepEqual(result.artists.map(({slug}) => slug), ['second-artist', 'original-address', 'third-artist']);
});

test('homepage selection supports existing content and an empty selection', () => {
  const existing = normalizeContent({artists: [artist], settings: {intro: 'Hello'}});
  assert.equal(existing.settings.selectedArtists, undefined);
  const empty = normalizeContent({artists: [artist], settings: {selectedArtists: []}});
  assert.deepEqual(empty.settings.selectedArtists, []);
});

test('image crop and hotspot are mapped to the displayed cropped image', () => {
  const result = imageData(image);
  assert.equal(new URL(result.src).searchParams.get('rect'), '100,200,800,800');
  assert.equal(result.crop, '75% 25%');
  assert.equal(result.alt, 'A portrait');
});
test('saved slugs survive name changes, and empty chapters and gallery stay empty', () => {
  const result = normalizeContent({artists: [artist], gallery: {images: []}});
  assert.equal(result.artists[0].slug, 'original-address');
  assert.deepEqual(result.artists[0].chapters, []);
  assert.deepEqual(result.gallery, []);
});
test('empty projects bootstrap locally, but incomplete CMS content stops the build', () => {
  assert.deepEqual(normalizeContent({artists: []}), {});
  assert.throws(() => normalizeContent({artists: [], settings: {title: 'Test'}}), /at least one artist/);
  assert.throws(() => normalizeContent({artists: [artist, artist]}), /Duplicate/);
  assert.throws(() => normalizeContent({artists: [{...artist, slug: '../invalid'}]}), /page address/);
  assert.throws(() => normalizeContent({artists: [{...artist, portrait: null}]}), /missing its upload/);
});
test('queries default to published content, allow draft previews, and keep tokens in headers', async () => {
  let request;
  await fetchContent({token: 'test-token', fetcher: async (url, options) => {
    request = {url, options};
    return {ok: true, json: async () => ({result: {artists: [artist]}})};
  }});
  assert.equal(request.url.searchParams.get('perspective'), 'published');
  assert.equal(request.options.headers.Authorization, 'Bearer test-token');
  assert.ok(!request.url.toString().includes('test-token'));

  await fetchContent({token: 'test-token', perspective: 'drafts', fetcher: async (url, options) => {
    request = {url, options};
    return {ok: true, json: async () => ({result: {artists: [artist]}})};
  }});
  assert.equal(request.url.searchParams.get('perspective'), 'drafts');
  await assert.rejects(fetchContent({fetcher: async () => ({ok: false, status: 403})}), /HTTP 403/);
});
