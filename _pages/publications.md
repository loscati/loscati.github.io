---
layout: page
title: publications
permalink: /publications
description: "List of publications"
---

<ul class="publications">
{% for pub in site.data.publications %}
  <li>
    {{ pub.authors }} ({{ pub.year }}). <strong>{{ pub.title }}</strong>.
    <em>{{ pub.journal }}</em>{% if pub.volume %}, {{ pub.volume }}{% endif %}{% if pub.number %}({{ pub.number }}){% endif %}{% if pub.pages %}, {{ pub.pages }}{% endif %}.
    {% if pub.doi %}<a href="https://doi.org/{{ pub.doi }}">DOI</a>{% endif %}
    {% if pub.pdf %} | <a href="/assets/pdf/{{ pub.pdf }}">PDF</a>{% endif %}
  </li>
{% endfor %}
</ul>
