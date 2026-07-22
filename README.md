# Minimal Jekyll site

A deliberately small personal site: plain HTML/CSS + a sliver of JS,
Markdown posts, an RSS feed, and a devcontainer for VS Code. No build
tooling beyond Jekyll/Ruby, no CSS/JS frameworks.

> If you're an AI agent working on this repo, read `AGENTS.md` first —
> it's the concise, structural version of what follows.

## Structure

```
_config.yml             site settings, nav links, pages collection
_layouts/                default (nav+footer shell), home, post, cv
_includes/               head, nav, footer, gallery, notebook_embed
_pages/                  every standalone page: home, posts index, photos hub, photo albums, cv
_posts/                  Markdown blog posts (YYYY-MM-DD-title.md)
_drafts/                 unfinished posts — never built, local preview only
scripts/                 convert-notebooks.sh (run locally, not a project dependency)
assets/css/              one hand-written stylesheet (theme colors live here)
assets/js/               small scripts (mobile nav, lightbox, CV renderer)
assets/cv.json           your CV, in JSON Resume format (jsonresume.org)
assets/notebooks_src/    original .ipynb source files (tracked in git)
assets/notebooks/        generated static HTML output from notebooks
assets/photos/           your photo files, organized by album
.devcontainer/           VS Code Dev Container config
.github/workflows/deploy.yml   optional GitHub Actions deploy
```

## Run locally

### Option A — VS Code Dev Container (recommended)

1. Open the folder in VS Code.
2. Install the "Dev Containers" extension if you don't have it.
3. Command Palette → **Dev Containers: Reopen in Container**.
4. Once it's built:
   ```bash
   bundle exec jekyll serve --livereload
   ```
5. Open http://localhost:4000

### Option B — local Ruby install

```bash
bundle install
bundle exec jekyll serve --livereload
```

## Pages vs posts

Every standalone page (home, the posts index, the photos hub, each
photo album) lives in `_pages/` as a Jekyll collection. Each file sets
its own `permalink` in front matter, so URLs stay clean regardless of
where the file sits in the folder. The home page
(`_pages/home.md`) doubles as the about page — set `permalink: /` and
just write both in one place.

To add a new standalone page: copy an existing file in `_pages/`,
change its `title`/`permalink`, and (if you want it in the top nav)
add it to `nav_links` in `_config.yml`. The nav is kept short on
purpose — Photos and notebook-bearing posts are meant to be reached by
following a link from another page, not from the top bar.

## Writing a post

Add a file to `_posts/` named `YYYY-MM-DD-title.md`:

```markdown
---
layout: post
title: "My post title"
tags: [some, tags]
---

Body in Markdown.
```

## Drafts

`_drafts/` is a parking space for posts still in progress:

- never built by `jekyll build`, locally or on deploy
- visible only with `bundle exec jekyll serve --drafts`
- promote one to a real post by moving it to `_posts/` and adding a
  `YYYY-MM-DD-` prefix to the filename

No date is needed in a draft's filename.

## RSS

Handled entirely by the `jekyll-feed` plugin — nothing to configure.
Feed is published at `/feed.xml` and linked from the nav and footer.

## Jupyter notebooks

Notebooks are meant to live *inside* blog posts, not as their own
top-level pages. Conversion happens **locally, outside the project's
own dependencies** — the Jekyll site itself needs no Python and no
custom plugin, so it still builds with vanilla Jekyll/GitHub Pages.

1. Put your `.ipynb` file in `assets/notebooks_src/` (tracked in the
   repo — this is the source of truth for the original notebook).
2. On your own machine, install `jupyter`/`nbconvert` once. Using
   [uv](https://github.com/astral-sh/uv) (fast, keeps this out of any
   system Python):
   ```bash
   uv venv
   source .venv/bin/activate
   uv pip install jupyter nbconvert
   ```
   (or plain `pip install jupyter nbconvert`, if you'd rather not use
   a virtual environment). Either way, this dependency lives only on
   your machine — it's not part of the Jekyll project or its deploy.
   Then run:
   ```bash
   scripts/convert-notebooks.sh
   ```
   This renders each notebook to a self-contained static HTML file at
   `assets/notebooks/<name>.html`, isolated from the site's CSS/JS on
   purpose so notebook output never clashes with the theme.
3. Embed it in whichever post it belongs to:
   ```liquid
   {% include notebook_embed.html path="/assets/notebooks/<name>.html" title="..." %}
   ```
4. Commit `assets/notebooks_src/*.ipynb` and `assets/notebooks/*.html`
   — Jekyll just serves the already-generated HTML, nothing runs at
   build/deploy time.

Re-run the script (add `--force` to reconvert unchanged files) whenever
a notebook changes. See `_posts/2026-07-14-embedding-a-notebook.md`
for a working example.

Note: the generated HTML lives in `assets/notebooks/`, not `_site/`.
`_site/` is Jekyll's build output — wiped and regenerated from source
on every build (locally, on GitHub Pages, or in Actions), so anything
placed there directly is lost on the next build and never reaches the
deployed site. Files under `assets/` are copied into `_site/assets/...`
automatically by Jekyll, which is what actually gets them published.

## Math

Kramdown (the default Markdown processor, no extra gem needed)
understands `$$...$$` (block) and `\(...\)` (inline) math on its own.
Add `math: true` to a post/page's front matter to load MathJax on that
page only — every other page ships with zero extra JS. See
`_posts/2026-07-14-math-example.md` for a working example.

## Photo galleries

Photos are two-level: a hub page (`_pages/photos.md`) that links out
to individual album pages, and the albums themselves, each with the
actual gallery.

To add an album: copy `_pages/photos/photo-album-example.md`, set its
`permalink`, list photos in front matter (`src`, `alt`, optional
`caption`, optional `full` for a larger lightbox image than the
thumbnail), keep `album: true` so the hub page picks it up
automatically, and put the actual image files under
`assets/photos/<album>/`. The gallery itself is rendered by
`{% include gallery.html photos=page.photos %}` — a responsive CSS
grid; clicking a photo opens it larger in a lightbox built on the
native `<dialog>` element, no JS library.

## CV

Your CV lives in `assets/cv.json`, following the
[JSON Resume](https://jsonresume.org/) schema. `/cv/` renders it with
a small vanilla-JS script (`assets/js/cv.js`, loaded only on that
page) that fetches the JSON at runtime and builds the page from
whichever sections are present — no build step, no CV-specific gem or
npm package. Edit `assets/cv.json` directly (any standard JSON Resume
editor/validator works too, since it's the same schema) and refresh
the page to see changes; nothing needs to be regenerated or rebuilt.

Sections not present in your JSON (e.g. no `projects` or
`languages`) are simply skipped, so you don't need placeholder empty
arrays.

## Deploying to GitHub Pages

**Simplest path:** push to a `username.github.io` repo's `main` branch.
GitHub Pages builds Jekyll sites automatically — no Action required.
Just make sure, in the repo's Settings → Pages, the source is set to
"Deploy from a branch" → `main`.

**More control:** the included `.github/workflows/deploy.yml` builds
with the exact Ruby/Jekyll versions you choose and deploys via
Actions. To use it:
1. Settings → Pages → Source → "GitHub Actions".
2. Push to `main`; the workflow builds and deploys automatically.

Either way works — this project has no custom plugins, so it's
compatible with GitHub Pages' restricted automatic build.

Before deploying, edit `_config.yml`: set `title`, `url`, `author`,
`email`, `github_username`.

## Theming

All colors are CSS custom properties defined once, at the top of
`assets/css/style.css`, in `:root`:

```css
--color-bg:          /* page background */
--color-bg-alt:      /* slightly lifted panel background (dialogs, lightbox) */
--color-fg:          /* main text color */
--color-muted:       /* secondary/meta text (dates, captions) */
--color-border:      /* dividers, card/dialog borders */
--color-link:        /* link color */
--color-link-hover:  /* link color on hover/focus */
--color-code-bg:     /* background for <code> and <pre> */
--color-accent:      /* used sparingly: tag borders, blockquote rule, section headings on the CV page, focus outlines */
```

Everything else in the stylesheet references these variables, so
changing the palette is just editing these ~9 lines — no need to hunt
through the rest of the CSS.

The shipped palette is a single, deliberate dark theme (near-black
background, soft forest green links, warm parchment text, a touch of
antique gold) rather than one that adapts to system light/dark
preference. If you'd like it to follow the visitor's OS preference
instead, wrap a second copy of the block in
`@media (prefers-color-scheme: light) { :root { ... } }` with lighter
values — that was how earlier versions of this template worked, and
nothing else needs to change to bring it back.

Two font variables are also here: `--font-body` (system sans-serif
stack) and `--font-heading` (system serif stack, used for `h1–h3` and
the CV name/label, for a slightly more editorial/manuscript feel) —
both are OS-installed fonts, so there's no font file or web-font
request to manage.

One more spot to update if you change `--color-bg`: the
`<meta name="theme-color">` value in `_includes/head.html`, which
tints mobile browser chrome (address bar, etc.) to match.
