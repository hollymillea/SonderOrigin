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

test('grouped Home services preserve the selected source and custom line breaks', () => {
  const content = {artists: [artist], about: {portrait: image, services: ['About service']},
    settings: {useAboutServices: true, services: ['Old text'],
      servicesSection: {useAboutServices: false, text: 'Homepage text\n\nSecond line'}}};
  const custom = normalizeContent(content);
  assert.deepEqual(custom.settings.services, ['Homepage text', '', 'Second line']);
  assert.equal(custom.settings.useAboutServices, false);
  const shared = normalizeContent({...content, settings: {...content.settings,
    useAboutServices: false, servicesSection: {useAboutServices: true, text: 'Saved text'}}});
  assert.deepEqual(shared.settings.services, ['About service']);
  const empty = normalizeContent({...content, settings: {servicesSection: {useAboutServices: false}}});
  assert.deepEqual(empty.settings.services, []);
});

test('Home can use About services or separate text without changing About', () => {
  const content = {artists: [artist], about: {portrait: image, services: ['About service']},
    settings: {services: ['Homepage text', '', 'Second line'], useAboutServices: false}};
  const custom = normalizeContent(content);
  assert.deepEqual(custom.settings.services, ['Homepage text', '', 'Second line']);
  assert.deepEqual(custom.about.services, ['About service']);
  assert.equal(custom.settings.useAboutServices, false);
  const shared = normalizeContent({...content, settings: {...content.settings, useAboutServices: true}});
  assert.deepEqual(shared.settings.services, ['About service']);
  assert.equal(shared.settings.useAboutServices, true);
  const empty = normalizeContent({...content, settings: {useAboutServices: false}});
  assert.deepEqual(empty.settings.services, []);
});

test('About services supply both pages and preserve visibility choices', () => {
  const result = normalizeContent({artists: [artist],
    settings: {services: ['Old Home service']},
    about: {portrait: image, services: ['Shared service', '', '   ', 'Another service'], showServices: false, showSelectedArtistList: false},
    services: {items: ['Old shared service']},
  });
  assert.deepEqual(result.settings.services, ['Shared service', 'Another service']);
  assert.deepEqual(result.about.services, result.settings.services);
  assert.equal(result.about.showServices, false);
  assert.equal(result.about.showSelectedArtistList, false);
});

test('shared services can be emptied while older content remains compatible', () => {
  const content = {artists: [artist], settings: {services: ['Home service']}, about: {portrait: image, services: ['About service']}};
  const legacy = normalizeContent(content);
  assert.deepEqual(legacy.settings.services, ['About service']);
  assert.deepEqual(legacy.about.services, ['About service']);
  assert.equal(legacy.about.showServices, true);
  assert.equal(legacy.about.showSelectedArtistList, true);
  const empty = normalizeContent({...content, about: {...content.about, services: []}, services: {items: ['Legacy service']}});
  assert.deepEqual(empty.settings.services, []);
  assert.deepEqual(empty.about.services, []);
  const fallback = normalizeContent({...content, about: {portrait: image}, services: {items: ['Legacy service']}});
  assert.deepEqual(fallback.settings.services, ['Legacy service']);
});

test('About works without a founder name and uses automatic image framing', () => {
  const result = normalizeContent({artists: [artist], about: {
    title: ['About', 'Sonder Origin'], portrait: image, portraitZoom: 1.8,
  }});
  assert.deepEqual(result.about.title, ['About', 'Sonder Origin']);
  assert.equal(result.about.image.alt, image.alt);
  assert.equal(result.about.image.zoom, 1);
  assert.equal(result.about.name, 'Sonder Origin');
});

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

test('navigation keeps the editor order, relabels links, and omits hidden ones', () => {
  const result = normalizeContent({artists: [artist], navigation: {headerLinks: [
    {page: 'contact', label: ' Contact us ', show: true},
    {page: 'gallery', label: 'Gallery', show: false},
    {page: 'about', label: ' '},
  ]}});
  assert.deepEqual(result.settings.headerLinks, [
    {label: 'Contact us', href: '/contact/'},
    {label: 'About', href: '/about/'},
  ]);
});

test('navigation keeps existing defaults while allowing every link to be hidden', () => {
  assert.deepEqual(navigationLinks(undefined), defaultHeaderLinks);
  assert.deepEqual(navigationLinks([{page: 'about', label: 'About', show: false}]), []);
  assert.deepEqual(normalizeContent({artists: [artist], settings: {}}).settings.headerLinks, defaultHeaderLinks);
});

test('navigation ignores unknown pages and duplicates', () => {
  assert.deepEqual(navigationLinks([
    {page: 'about', label: 'About'},
    {page: 'about', label: 'Again'},
    {page: 'artist', label: 'Artist'},
    {label: 'External', url: 'https://example.com'},
    null,
  ]), [{label: 'About', href: '/about/'}]);
});

test('home button image uses the Navigation upload, falling back to the built-in icon', () => {
  const upload = 'https://cdn.sanity.io/images/yv32mo3i/production/icon.png';
  const settingsFor = (navigation) => normalizeContent({artists: [artist], settings: {}, navigation}).settings;
  assert.deepEqual(settingsFor({homeImage: {asset: {url: upload, metadata: {dimensions: {width: 400, height: 238}}}}}).homeIcon,
    {src: upload, width: 400, height: 238});
  assert.equal(settingsFor({}).homeIcon, undefined);
});

test('logo comes from General, falling back to the older Logo document', () => {
  const image = (url) => ({asset: {url, metadata: {dimensions: {width: 100, height: 50}}}});
  const old = {alt: 'Old', image: image('https://cdn.sanity.io/old.svg')};
  assert.equal(normalizeContent({artists: [artist], logo: old}).settings.logo.src, 'https://cdn.sanity.io/old.svg');
  const logo = normalizeContent({artists: [artist], logo: old, site: {logo: image('https://cdn.sanity.io/new.svg'), logoAlt: 'New'}}).settings.logo;
  assert.deepEqual(logo, {src: 'https://cdn.sanity.io/new.svg', width: 100, height: 50, alt: 'New'});
});

test('cursor can be switched off or replaced, and is untouched when never set', () => {
  const cursorFor = (site) => normalizeContent({artists: [artist], site}).settings.cursor;
  assert.equal(cursorFor({title: 'Sonder Origin'}), undefined);
  assert.deepEqual(cursorFor({useCustomCursor: true}), {enabled: true});
  const upload = {asset: {url: 'https://cdn.sanity.io/images/cursor.png', metadata: {dimensions: {width: 64, height: 64}}}};
  assert.deepEqual(cursorFor({useCustomCursor: false, cursorImage: upload}), {enabled: false});
  const cursor = cursorFor({cursorImage: upload});
  assert.equal(cursor.enabled, true);
  assert.equal(new URL(cursor.src).searchParams.get('w'), '32');
  assert.equal(new URL(cursor.src2x).searchParams.get('w'), '64');
  assert.deepEqual(cursor.hotspot, [16, 16]);
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
