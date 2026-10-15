import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const textExtensions = new Set([".html", ".css", ".js", ".json", ".txt"]);

// Public assets use root-relative URLs locally. Prefix the exported versions
// for a GitHub project site without changing the application's source files.
async function prepare(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await prepare(path);
    } else if (textExtensions.has(extname(entry.name))) {
      const original = await readFile(path, "utf8");
      const updated = original.replace(/(["'(])\/(images|fonts)\//g, `$1${basePath}/$2/`);
      if (updated !== original) await writeFile(path, updated);
    }
  }
}

await prepare("out");
await writeFile("out/.nojekyll", "");
console.log(`Prepared GitHub Pages assets for ${basePath || "/"}.`);
