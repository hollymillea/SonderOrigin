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

The Next.js frontend still reads `src/data`. The next integration step is to
migrate that content and replace the local data imports with published Sanity
queries. Creating or publishing Studio documents does not update the website yet.

The website currently deploys as a static GitHub Pages export. Once queries are
wired in, published content will require a website rebuild. Hosting the Studio
is a separate deployment; the root website build does not publish it.

## Dependency status

The initial install uses Sanity 6.19.0. Its transitive dependencies currently
produce npm audit findings, including high-severity issues in CLI parsing
dependencies. npm's suggested automatic fix downgrades Sanity to another major
version; it has not been applied. Review upstream fixes before deployment.
