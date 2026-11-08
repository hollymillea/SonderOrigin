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

- Pages → About → Services: edit the shared list for About and Home, one service
  per line. Home has a Use About services checkbox: tick it to use this list,
  or untick it to enter separate homepage text. Unticking starts from an empty box.
  Home also has an Edit services in About shortcut. About has Show
  selected artist list and Show services checkboxes. Older services data is
  preserved as a fallback, with no separate Services section in Site settings.
- Site settings → General: replace the main logo and edit its description
  (shared by Home, About and Contact), and choose the cursor. Untick Use custom
  cursor for the normal mouse pointer, or upload a small square cursor image
  (shown at 32 × 32, clicking at its centre). Empty images keep the current
  logo and spiral cursor. Copy the logo from the old Logo document with
  `sanity exec scripts/move-logo-to-general.mjs --with-user-token -- --apply`
  from the Studio directory; the old document stays as a fallback. Website
  source changes need deploying first.
- Site settings → Navigation: replace the Home button image (the icon at the
  start of the header; use black on transparent, as the header inverts it).
  Header links are fixed to Gallery, About and Contact: drag to reorder, edit
  labels, and untick a link's checkbox to hide it. Links can't be added or
  removed. Publish to save. Until a Navigation document is published the site
  uses the built-in icon and links. Create it with the current icon via
  `sanity exec scripts/import-navigation.mjs --with-user-token -- --apply`
  from the Studio directory. Website source changes must be deployed first.
- Pages → Home → Homepage artists: drag artists into order, or use the up/down
  buttons. All artists appear automatically, including newly created drafts.
  Create and edit artists in Artists. Publish an artist to show them on the
  website. Home only allows reordering, with no add, remove or replace controls.
  This order also controls artist page navigation. New artists appear at the
  end until reordered. Artist profiles no longer need numeric roster orders.
  The Homepage text section follows page order: Selected artists, Introduction,
  services (shared or custom) and Studio note. Press Enter for line breaks in
  Studio note. Show artist count toggles the number beneath Selected artists.
  Artist order and Showreel are collapsible sections below the text boxes.
  In Showreel, choose Upload a video, Use a video link, or Off. Upload MP4 or
  WebM files, or paste a direct HTTPS video link. YouTube and Vimeo page links
  are not supported. Switching options keeps the saved upload and link.
- Artists: the page address comes from the name (Olivia Dean →
  /artists/olivia-dean/), so renaming an artist changes it. Upload a portrait, and
  add and reorder work chapters. Each chapter offers the existing page layouts.
- Images: choose a crop and hotspot, and provide an accessible description.
- About: edit Title lines and upload an Image with a description for screen
  readers. The image fills its frame automatically. Founder name, manual zoom,
  image captions and gallery frames are hidden; existing data is preserved.
- Gallery: use its dedicated section in the left navigation.
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

## Automatic website rebuilds

A Sanity webhook ("Rebuild website on publish", in Sanity Manage → API →
Webhooks) calls a Vercel deploy hook ("Sanity publish", in Vercel → Settings →
Git → Deploy Hooks) whenever site content is published, unpublished or deleted.
Drafts do not trigger it. Vercel then rebuilds `main` from GitHub, which picks
up new or renamed artist pages, the tab icon and the search description. To
stop automatic rebuilds, disable the webhook in Sanity.
