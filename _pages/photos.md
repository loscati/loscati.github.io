---
layout: default
title: Photos
permalink: /photos/
markdown: true
---

# Photos

{% assign album_pages = site.pages | where: "album", true %}
<ul class="post-list">
  {% for p in album_pages %}
  <li><a class="post-list-link" href="{{ p.url | relative_url }}">{{ p.title }}</a></li>
  {% endfor %}
</ul>

<p class="post-meta">
  Each album is its own page under <code>_pages/photos/</code>, with a
  <code>photos:</code> list in front matter and
  <code>album: true</code> so it shows up here. See
  <code>_pages/photos/photo-album-example.md</code> for the pattern.
</p>
