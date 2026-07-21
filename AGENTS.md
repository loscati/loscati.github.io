# AGENTS.md — site spec

Reference for an agent editing/extending this site. Read this before
making structural changes. Prose in README.md is for humans; this is
the terse version for you.

## What this is

Minimal static personal site + blog. Jekyll only. No JS framework, no
CSS framework, no build step beyond Jekyll itself. Every added
capability (notebooks, CV, photos) was deliberately kept out of the
Jekyll build's dependency chain wherever possible.

## Stack

- Jekyll (Gemfile pins `github-pages` gem — matches GitHub Pages'
  production build exactly, so no custom plugins are used or allowed)
- Plain HTML/CSS in `_layouts`/`_includes`, one hand-written
  stylesheet, two small vanilla-JS files (nav toggle + lightbox,
  CV renderer)
- No npm, no bundler, no CSS/JS framework, no client-side router

## Directory map

```
_config.yml           nav_links, pages collection, exclude list
_layouts/              default (nav+footer shell) → home, post, cv
_includes/             head, nav, footer, gallery, notebook_embed
_pages/                every standalone page (see "Pages" below)
_posts/                blog posts, YYYY-MM-DD-title.md
_drafts/               unfinished posts, never built
scripts/               convert-notebooks.sh — local-only, not a project dep
assets/css/style.css   all styling, all theme colors as CSS vars in :root
assets/js/             main.js (nav+lightbox), cv.js (CV renderer)
assets/cv.json         CV data, JSON Resume schema (jsonresume.org)
assets/notebooks_src/  original .ipynb files (tracked)
assets/notebooks/      generated static HTML from notebooks (tracked)
assets/photos/         actual image files, one folder per album
.devcontainer/         VS Code Dev Container (Ruby/Jekyll only)
.github/workflows/     optional Actions deploy (not required — GH
                       Pages auto-build also works, no custom plugins)
```

## Pages (`_pages/`)

Collection named `pages` (config: `collections.pages`, `output: true`).
Each file sets its own `permalink:` in front matter — don't rely on
the collection's default permalink pattern for anything user-facing.
Loop over these documents via `site.collections.pages.docs` (NOT
`site.pages` — that name collision is real in Jekyll but avoid relying
on it; be explicit).

- `home.md` — home page AND about page, merged, `permalink: /`. Don't
  re-split these.
- `posts.md` — post index, `permalink: /posts/`
- `photos.md` — hub only, links to album pages, holds no gallery
  itself
- `photo-album-example.md` — one photo album; has `album: true` and a
  `photos:` list; hub page filters on `album: true`
- `cv.md` — mounts `layout: cv`; content is empty, actual data comes
  from `assets/cv.json` at runtime via `assets/js/cv.js`

## Nav (`_config.yml: nav_links`)

Kept deliberately short — currently Home, Posts, CV. Rule: a page goes
in nav only if it's a primary destination. Photos is reachable by
link, not nav. Individual notebook embeds live inside posts, never
get their own nav entry or top-level URL.

## Posts / Drafts

- `_posts/YYYY-MM-DD-title.md`, `layout: post`
- `_drafts/*.md` — no date needed, never built, preview with
  `jekyll serve --drafts`, promote by moving to `_posts/` + adding
  date prefix
- Math: kramdown parses `$$...$$` / `\(...\)` natively, no gem needed.
  Set `math: true` in a post's front matter to load MathJax on that
  page only (checked in `_includes/head.html`) — don't load it
  globally.

## Notebooks

Two-stage, deliberately decoupled from the Jekyll build:
1. `.ipynb` in `assets/notebooks_src/` (source of truth, tracked)
2. `scripts/convert-notebooks.sh` (run locally, needs
   `jupyter`/`nbconvert` on the operator's machine only — via `uv` or
   `pip`, never added to the Gemfile or project deps) → static
   self-contained HTML in `assets/notebooks/<slug>.html`

Embed the result inside a post with
`{% include notebook_embed.html path="/assets/notebooks/<slug>.html" title="..." %}`.
Never give a notebook its own top-level page/URL — if asked for that,
push back toward embedding in a post instead, per the user's explicit
preference.

Do not resurrect the custom-Jekyll-plugin version of this (a prior
iteration auto-generated page stubs via a Ruby generator plugin) — it
was deliberately replaced because it required Python in the Jekyll
build itself and broke GitHub Pages' plugin allowlist.

## Photos

Hub (`_pages/photos.md`) lists links; each album is its own page
under `_pages/` with `album: true` + `photos:` front matter (`src`,
`alt`, optional `caption`, optional `full`). Gallery rendered via
`{% include gallery.html photos=page.photos %}`. Lightbox is the
native `<dialog>` element, no JS library.

## CV

`assets/cv.json` = JSON Resume schema, edited directly, no generator.
`assets/js/cv.js` fetches it client-side and renders whatever sections
exist — missing sections are skipped, not required. Loaded only on
`/cv/` (via `_layouts/cv.html`), same "load JS only where needed"
pattern as MathJax.

## Theming

All color decisions are ~9 CSS custom properties at the top of
`assets/css/style.css`. Current palette: single dark theme (not
adaptive to `prefers-color-scheme`), near-black bg, soft green links,
antique-gold accent used sparingly — a restrained Celtic-manuscript
reference, chosen and contrast-checked (~8:1) for readability first.
If changing colors: edit only those variables; if changing `--color-bg`,
also update the `theme-color` meta tag in `_includes/head.html`.

## Deploy

Works via either GitHub Pages' automatic branch build or
`.github/workflows/deploy.yml` (Actions) — both valid, no custom
plugins force one over the other. Keep it that way; don't add a
custom Jekyll plugin without discussing the deploy-path tradeoff it
forces (see Notebooks history above).

## Design principles (apply these to any new feature request)

1. Prefer plain HTML/CSS/vanilla JS over adding a library.
2. Keep the Jekyll build itself dependency-light; push anything
   heavier (Python, image processing, etc.) to a local script run by
   the operator, not the build/deploy pipeline.
3. Load extra JS/CSS only on the page that needs it (MathJax, cv.js),
   not globally.
4. Every page/section is explicit (front matter, a real file) over
   generated/implicit — favor a copyable example file over a
   templating abstraction.
5. Nav stays minimal; new pages don't default into it.
6. When a feature request has a real tradeoff (e.g., custom plugin →
   deploy path lock-in), surface it rather than silently absorbing it.
