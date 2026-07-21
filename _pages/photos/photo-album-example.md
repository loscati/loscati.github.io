---
layout: default
title: Example Album
permalink: /photos/example-album/
album: true
photos:
  - src: /assets/photos/example-album/insieme.jpg
    alt: Description of photo one
    caption: An optional caption shown in the lightbox
  - src: /assets/photos/example-album/le_spezie.jpg
    alt: Description of photo two
  - src: /assets/photos/example-album/miele.jpg
    alt: Description of photo three
  - src: /assets/photos/example-album/spezie_tritate.jpg
    alt: Spezie
  - src: /assets/photos/example-album/persepolis.jpg
    alt: Persepolis
---

# Example Album

To add a new album: create a new page here (copy this file), drop the
actual image files into a folder under `assets/photos/`, list them in
the front matter above, and keep `album: true` so it's picked up by
the [Photos hub]({{ '/photos/' | relative_url }}) page automatically.

{% include gallery.html photos=page.photos %}