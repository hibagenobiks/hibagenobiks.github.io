---
title: Publications
intro: Peer-reviewed articles and preprints. To add one, edit _data/publications.yml.
permalink: /publications/
---

<ol class="pub-list">
{%- for pub in site.data.publications -%}
  {% include pub-entry.html pub=pub %}
{%- endfor -%}
</ol>
