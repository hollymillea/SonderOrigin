import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchContent, imageData, normalizeContent} from './content.mjs';

const image = {
  asset: {url: 'https://cdn.sanity.io/images/yv32mo3i/production/test-1000x1000.png', metadata: {dimensions: {width: 1000, height: 1000}}},
  alt: 'A portrait', crop: {left: 0.1, right: 0.1, top: 0.2, bottom: 0}, hotspot: {x: 0.7, y: 0.4},
};
const artist = {name: 'New artist name', slug: 'original-address', portrait: image, chapters: []};

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
test('queries request only published content; tokens stay in request headers', async () => {
  let request;
  await fetchContent({token: 'test-token', fetcher: async (url, options) => {
    request = {url, options};
    return {ok: true, json: async () => ({result: {artists: [artist]}})};
  }});
  assert.equal(request.url.searchParams.get('perspective'), 'published');
  assert.equal(request.options.headers.Authorization, 'Bearer test-token');
  assert.ok(!request.url.toString().includes('test-token'));
  await assert.rejects(fetchContent({fetcher: async () => ({ok: false, status: 403})}), /HTTP 403/);
});
