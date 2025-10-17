---
title: "Blog"
layout: page
permalink: /blogme/
toc: false
---

<!-- 🎨 Retro-Blog Style (Kontrastoptimiert) -->
<style>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

.blog-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  font-family: 'VT323', monospace;
}

.blog-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px dashed #888;
  padding: 1rem 0.5rem;
  transition: all 0.2s ease-in-out;
}

.blog-item:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}

.blog-info {
  flex: 1;
  margin-right: 1rem;
}

.blog-date {
  font-size: 1rem;
  color: #444;
}

.blog-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #000;
  text-decoration: none;
  display: block;
  margin-top: 0.2rem;
}

.blog-title:hover {
  color: #ff3366;
  text-shadow: 0 0 3px #ff66cc;
}

.blog-excerpt {
  margin-top: 0.4rem;
  color: #333;
  font-size: 1rem;
  max-width: 70ch;
  line-height: 1.3;
}

.blog-thumb {
  width: 90px;
  height: 90px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 0 6px rgba(0,0,0,0.3);
  flex-shrink: 0;
  border: 2px solid #000;
  transition: transform 0.2s ease-in-out;
}

.blog-thumb:hover {
  transform: scale(1.05) rotate(-1deg);
  border-color: #ff3366;
}

h2.blog-heading {
  font-family:'VT323', monospace;
  font-size:2.2rem;
  color:#000;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
h2.blog-heading span.icon {
  font-size: 1.8rem;
}
@media (max-width: 600px) {
  .blog-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .blog-thumb {
    margin-top: 0.5rem;
    width: 100%;
    height: auto;
  }
}
</style>

<h2 class="blog-heading"><span class="icon">🕹️</span> Meine Blogposts</h2>

<ul class="blog-list">
  {% for post in site.posts %}
  <li class="blog-item">
    <div class="blog-info">
      <div class="blog-date">{{ post.date | date: "%d.%m.%Y" }}</div>
      <a class="blog-title" href="{{ post.url }}">{{ post.title }}</a>
      <p class="blog-excerpt">
        {{ post.excerpt | strip_html | truncate: 140 }}
      </p>
    </div>

    {% if post.image %}
      <img src="{{ post.image }}" alt="{{ post.title }}" class="blog-thumb">
    {% elsif post.header and post.header.image %}
      <img src="{{ post.header.image }}" alt="{{ post.title }}" class="blog-thumb">
    {% endif %}
  </li>
  {% endfor %}
</ul>
