# Sonder Origin Studio

Sanity project: `yv32mo3i`. Dataset: `production`.

This is a separate editing application, alongside the existing Next.js site.
It contains schemas for artists and their work chapters, About, Gallery, and
site settings. About, Gallery, and settings each have one dedicated document.

From the repository root:

```sh
npm install --prefix studio
npm run studio
```

Open the local address printed by Sanity and sign in with an account that has
access to this project. `npm run studio:build` checks the production Studio build.

## Account access

The initial setup attempt could not access this project with the CLI's current
login. In Sanity Manage, verify the project ID and invite the intended Google
account to the project, or switch the CLI to the account owning the project:

```sh
cd studio
npx sanity logout
npx sanity login
```

Logins and API tokens stay outside the source code. Project IDs and dataset
names are public configuration.

## Content workflow

- Artists: set a roster order, generate a stable slug, upload a portrait, and
  add and reorder work chapters. Each chapter offers the existing page layouts.
- Images: choose a crop and hotspot, and provide an accessible description.
- About and Gallery: use their dedicated sections in the left navigation.
- Site settings: homepage text, contact email, services, social links, and reel.

## Import the existing site

The migration has a local dry run and a separate authenticated import. It
uploads the 10 unique images and creates 8 artists (32 chapters), Gallery,
About, and site settings. It preserves the current page addresses, image
framing and ordering. Existing documents and drafts are skipped; re-running
it does not overwrite edits. The source includes placeholder portfolio work
and draft About copy already present on the website; replace these in Studio.

First sign the terminal into **hollymillea.work@gmail.com**:

```sh
cd studio
npx sanity logout
npx sanity login
```

Then, from the repository root:

```sh
npm --prefix studio run import:preview
npm run content:import
npm run build
```

The import creates published content, matching the currently visible site.
Use the work Google account in the browser and terminal. Studio login and CLI
login are separate. The import verifies project membership before uploads.

## Website updates

`npm run dev` and `npm run build` fetch published Sanity content first. This
creates a generated local content snapshot shared by server and browser
components, keeping artist order, page addresses and artwork consistent.
Drafts and authentication tokens are never written into the snapshot.

After publishing an edit, restart the local website with `npm run dev` to
refresh its content, or run `npm run content:sync` while developing. A failed
fetch stops the build instead of silently deploying stale content. An empty
project uses the original local data until its first import. Once content
exists, at least one published artist is required to build.

For a private dataset, set `SANITY_READ_TOKEN` in `.env.local` and as a GitHub
Actions secret; the deployment workflow reads it only during the build. For
explicit offline work, run `SANITY_USE_LOCAL_CONTENT=true npm run dev`.

The live website is a static GitHub Pages export. Publishing in Sanity does
not deploy it automatically: after the integration changes are pushed to
GitHub, open **Actions → Deploy site to GitHub Pages → Run workflow** to
rebuild and deploy the latest published content. Studio hosting is separate.

The CMS controls artists, work, gallery images and frame ratios, About,
homepage text, services, contact email, and reel video/poster. Social links can
be stored in settings but do not yet have a display location in the design.

## Dependency status

The initial install uses Sanity 6.19.0. Its transitive dependencies currently
produce npm audit findings, including high-severity issues in CLI parsing
dependencies. npm's suggested automatic fix downgrades Sanity to another major
version; it has not been applied. Review upstream fixes before deployment.
