import { readdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

// Makes a WebP copy beside each photo in public/images, at a fraction of the
// size of the PNG and JPEG originals; the site references the WebP. Run with
// `npm run images` after adding or replacing a photo. Left alone: the
// halftone scans, which stay exactly as they are (numbered, e.g. 4.png, and
// the PAPER_ sheets), and the small UI images (cursor, icon, spiral), which
// need crisp edges
const directory = "public/images";
const skip = new Set(["cursor", "cursor@2x", "icon", "spiral"]);
const isHalftone = (name) => /^\d+$/.test(name) || name.startsWith("PAPER_");
const QUALITY = 80;

for (const file of await readdir(directory)) {
  const { name, ext } = parse(file);
  if (![".png", ".jpg", ".jpeg"].includes(ext.toLowerCase()) || skip.has(name) || isHalftone(name)) continue;
  const source = join(directory, file);
  const output = join(directory, `${name}.webp`);
  await sharp(source).webp({ quality: QUALITY }).toFile(output);
  const [before, after] = await Promise.all([stat(source), stat(output)]);
  console.log(`${file}: ${Math.round(before.size / 1024)}KB -> ${Math.round(after.size / 1024)}KB`);
}
