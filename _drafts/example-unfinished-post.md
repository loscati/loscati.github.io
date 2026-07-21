---
title: "Example unfinished post"
tags: [meta]
---

This is a parking space for posts still in progress. Files in
`_drafts/` are:

- never built by `jekyll build` (locally, on GitHub Pages, or in
  Actions) — this is native Jekyll behavior, no config needed beyond
  the explicit `_drafts` line already added to `exclude:` as a safety
  net
- visible for local preview only with `bundle exec jekyll serve --drafts`
- promoted to a real post by moving the file to `_posts/` and adding a
  `YYYY-MM-DD-` date prefix to the filename

Unlike posts, drafts don't need a date in the filename — Jekyll uses
the file's last-modified time to order them when previewing with
`--drafts`.
