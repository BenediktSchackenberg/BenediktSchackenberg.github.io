---
layout: default
title: Blog
permalink: /blog/
---

<div class="page-header">
  <h1>Blog</h1>
  <p class="subtitle">Posts about infrastructure, databases, automation, and building tools.</p>
</div>

<div class="content">
{% for post in site.posts %}
<div style="margin-bottom: 1.5rem; padding: 1rem 1.25rem; border-radius: 8px; border: 1px solid #21262d; transition: border-color 0.2s;">
  <a href="{{ post.url }}" style="text-decoration: none;">
    <h3 style="font-size: 1.05rem; font-weight: 600; color: #f0f6fc; margin-bottom: 0.25rem;">{{ post.title }}</h3>
  </a>
  {% if post.subtitle %}<p style="font-size: 0.88rem; color: #8b949e; margin-bottom: 0.3rem;">{{ post.subtitle }}</p>{% endif %}
  <div style="font-size: 0.78rem; color: #6e7681;">
    {{ post.date | date: "%B %d, %Y" }}
    {% if post.tags.size > 0 %}
      &middot;
      {% for tag in post.tags limit:4 %}<span style="font-size: 0.68rem; padding: 0.1rem 0.4rem; border-radius: 99px; background: rgba(88,166,255,0.1); color: #58a6ff; font-weight: 500; margin-right: 0.25rem;">{{ tag }}</span>{% endfor %}
    {% endif %}
  </div>
</div>
{% endfor %}
</div>
