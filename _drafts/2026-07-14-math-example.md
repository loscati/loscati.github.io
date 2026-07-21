---
layout: post
title: "A note with some math"
tags: [meta, math]
math: true
---

Set `math: true` in a post's front matter to load MathJax on that page
only (it stays off everywhere else, so most pages ship zero extra JS).

Inline math: \\(E = mc^2\\).

Block math:

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

Kramdown (the default Markdown parser on GitHub Pages) recognizes this
syntax on its own — no extra gem, just the MathJax script above.
