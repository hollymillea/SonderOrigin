import {mkdir, writeFile, rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {fetchContent} from './cms/content.mjs';

try {
  const local = process.env.SANITY_USE_LOCAL_CONTENT === 'true';
  const content = local ? {} : await fetchContent({token: process.env.SANITY_READ_TOKEN});
  const directory = new URL('../src/data/generated/', import.meta.url);
  await mkdir(directory, {recursive: true});
  const output = new URL('content.js', directory);
  const temporary = `${fileURLToPath(output)}.tmp`;
  await writeFile(temporary, `// Generated from published Sanity content. Do not edit.\nexport default ${JSON.stringify(content, null, 2)};\n`);
  await rename(temporary, output);
  console.log(content.artists
    ? `Loaded ${content.artists.length} published artists from Sanity.`
    : 'Using the existing local content (CMS empty or local mode selected).');
} catch (error) {
  console.error(`Content sync failed: ${error.message}`);
  console.error('The build has stopped to avoid deploying stale or incomplete CMS content.');
  process.exitCode = 1;
}
