---
layout: post
title: "A post with an embedded notebook"
tags: [meta]
---

Notebooks live alongside blog posts, not as separate top-level pages.
Convert one locally with `scripts/convert-notebooks.sh`, then embed it
right in a post's body:

```liquid
{% raw %}{% include notebook_embed.html path="/assets/notebooks/example-notebook.html" title="Example Notebook" %}{% endraw %}
```

Which renders like this once `assets/notebooks/example-notebook.html`
has been generated:

{% include notebook_embed.html path="/assets/notebooks/example-notebook.html" title="Example Notebook" %}
