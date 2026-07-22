#!/usr/bin/env bash
#
# Converts every notebook in assets/notebooks_src/*.ipynb into a
# self-contained static HTML file at assets/notebooks/<slug>.html
# (rendered via `jupyter nbconvert`, isolated from the site's own
# CSS/JS so notebook output never clashes with the site theme).
#
# Notebooks are meant to live inside blog posts, not as standalone
# pages: once converted, embed one in a post with:
#
#   {% include notebook_embed.html path="/assets/notebooks/<slug>.html" title="..." %}
#
# Run this LOCALLY whenever you add or update a notebook, then commit
# the results (assets/notebooks_src/*.ipynb and assets/notebooks/*.html)
# to the repo. The Jekyll site itself needs no plugin and no Python —
# this script is the only thing that needs `jupyter nbconvert`, and
# only on your own machine.
#
# Requirements (only on your machine, not in the project):
#   pip install jupyter nbconvert
#   (or: pipx install nbconvert / conda install nbconvert)
#
# Usage:
#   scripts/convert-notebooks.sh              convert everything
#   scripts/convert-notebooks.sh my-notebook   convert just one (no .ipynb extension)
#   scripts/convert-notebooks.sh --force       reconvert even if HTML is newer than source

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ROOT="$(dirname "$SCRIPT_DIR")"
SRC_DIR="$SITE_ROOT/assets/notebooks_src"
HTML_OUT_DIR="$SITE_ROOT/assets/notebooks"

FORCE=0
ONLY=""

for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    *) ONLY="$arg" ;;
  esac
done

if ! command -v jupyter >/dev/null 2>&1; then
  echo "error: 'jupyter' not found. Install it locally with:" >&2
  echo "  pip install jupyter nbconvert" >&2
  exit 1
fi

mkdir -p "$HTML_OUT_DIR"

shopt -s nullglob
notebooks=("$SRC_DIR"/*.ipynb)
shopt -u nullglob

if [ ${#notebooks[@]} -eq 0 ]; then
  echo "No notebooks found in $SRC_DIR"
  exit 0
fi

for notebook_path in "${notebooks[@]}"; do
  slug="$(basename "$notebook_path" .ipynb)"

  if [ -n "$ONLY" ] && [ "$ONLY" != "$slug" ]; then
    continue
  fi

  html_out="$HTML_OUT_DIR/$slug.html"

  if [ "$FORCE" -eq 0 ] && [ -f "$html_out" ] && [ "$html_out" -nt "$notebook_path" ]; then
    echo "up to date: $slug (use --force to reconvert)"
    continue
  fi

  echo "converting: $slug"
  jupyter nbconvert \
    --to html \
    --template lab \
    --embed-images \
    --output-dir "$HTML_OUT_DIR" \
    --output "$slug" \
    "$notebook_path"
done

echo "Done. Embed a notebook in a post with:"
echo '  {% include notebook_embed.html path="/assets/notebooks/<slug>.html" title="..." %}'
