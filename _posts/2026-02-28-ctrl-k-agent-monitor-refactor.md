---
layout: post
title: "Ctrl+K Everything: Command Palettes, Live Agent Feeds & a 5,000-Line Diet 🎯"
subtitle: "Octofleet v0.5.6 — because a 16k-line main.py is a cry for help"
date: 2026-02-28
tags: [octofleet, refactoring, ux, monitoring, open-source, devops]
thumbnail-img: /assets/images/octofleet-agent-monitor-2026-02-28.png
share-img: /assets/images/octofleet-agent-monitor-2026-02-28.png
---

There's a moment in every project where you open your main file, scroll for what feels like 30 seconds, and think: *this has to stop.* Today was that day.

## The 5,000-Line Diet 🏋️

Let's address the elephant in the repo: `main.py` was **15,900 lines.** One file. Fifteen thousand nine hundred lines of FastAPI endpoints, SQL queries, SSE streams, and business logic all living together like a college dorm room.

Today it went on a diet. A serious one.

```
main.py:  15,900 → 11,500 lines  (-28%)
```

The extracted modules:

| New File | What It Does |
|----------|-------------|
| `routers/dashboard.py` | Dashboard summary API |
| `routers/groups.py` | Group CRUD, dynamic groups, tags |
| `app/core/rules.py` | Dynamic group rule evaluation engine |
| `app/db/nodes.py` | Node upsert, auto-onboard, group membership |
| `dependencies.py` | Shared auth, DB pool, error helpers |
| `app/core/config.py` | Centralized env-based settings |

Is 11.5k still too much? Absolutely. But Rome wasn't burned in a day. Or however that saying goes.

The tricky part wasn't the extraction itself — it was making sure `dependencies.py` properly shares the database pool and auth verification across all routers without circular imports. FastAPI's `Depends()` injection pattern makes this surprisingly clean once you get the wiring right.

## Command Palette: Ctrl+K 🔍

Every tool I love has a command palette. VS Code, Slack, Notion, Linear — they all let you hit `Ctrl+K` and just *go* somewhere. Octofleet now does too.

Hit `Ctrl+K` (or `⌘+K` on Mac) from anywhere and you get:

- **Live node search** — type a hostname, see online/offline status in real-time
- **Page navigation** — jump to any page without touching the sidebar
- **Keyboard-first** — arrow keys, Enter to navigate, Escape to close

It's one of those features that takes 329 lines to build but saves you thousands of clicks over time. The search hits the `/api/v1/nodes` endpoint and shows results with colored status dots — green for online, gray for offline. Simple, but it *feels* right.

The implementation lives in a single `CommandPalette.tsx` component that gets mounted in the root layout. It listens for the keyboard shortcut globally and renders a dialog overlay with a filtered list. Nothing revolutionary, but the kind of polish that makes a tool feel like a product instead of a prototype.

## Agent Activity Monitor: The Eye of Sauron 👁️

Here's the new toy I'm most excited about.

Go to **Admin → Agent Monitor** and you see every single thing your agents are doing. Right now. In real-time.

The left side shows all your agents as clickable cards — hostname, version, status (active/idle/stale/offline), running jobs, pending remediation. Click one and the activity feed on the right filters to show only that agent's traffic.

The feed itself is a live stream of events:
- **Job polls** — agent checking for new work
- **Terminal/Shell/Screen polls** — remote access heartbeats  
- **Health reports** — periodic system stats
- **Remediation results** — patch job outcomes
- **Job results** — command execution completions

Under the hood, it works like this:

1. An **HTTP middleware** intercepts every request matching agent-known URL patterns (`/jobs/pending/`, `/terminal/pending/`, `/agents/*/health`, etc.)
2. Events go into an **in-memory ring buffer** (capped at 500 — no DB overhead)
3. A **Server-Sent Events** endpoint streams new events + periodic node status to connected browsers
4. The frontend also polls every 10s as a fallback because SSE reconnection isn't always instant

The middleware approach means zero changes to existing endpoints. It just watches the traffic and records what it sees. Completely non-invasive.

The summary cards at the top give you the instant overview: how many agents are active, total count, running jobs, pending remediation. It's the kind of dashboard you leave open on a second monitor.

## The Merge That Almost Wasn't 🔀

Here's the real story of today. I had a feature branch (`testdevelop`) with the refactoring and command palette work, but it was based on a commit from *before* nine important bugfixes and the entire Agent Monitor feature had landed on `main`.

The rebase went clean (git gods were smiling), but testing revealed five issues:

1. **Missing `Search` icon import** in Navbar — TypeScript caught it, but only during the Docker build. 30 seconds of build time to find a missing import. Classic.
2. **Phantom `trigger_alert` import** in the extracted `jobs.py` — referenced a function that doesn't exist in `alerting.py`. Imported but never called. Dead code that only explodes when you move it.
3. **`API_KEY` vs `INVENTORY_API_KEY`** — the new `config.py` looked for `INVENTORY_API_KEY`, but Docker Compose sets `API_KEY`. Every single endpoint returned 401. Took longer to find than I'd like to admit.
4. **UUID vs TEXT column mismatch** — `job_instances.node_id` is TEXT, `nodes.id` is UUID. Postgres does not silently cast these. It will, however, silently ruin your evening.
5. **Duplicate router registration** — `groups_router` was included twice. FastAPI doesn't complain, but you get duplicate routes in the OpenAPI schema.

All fixed, all tested, all green. The merge commit is clean and every endpoint responds with 200.

## What's Next

The backend still needs more slimming — 11.5k lines is better but not great. The security endpoints alone account for a huge chunk and should probably move to their own router module.

There's also the lingering `current_state_version` column error on service assignments, and `/repo/files` has a missing `download_count` column. Neither is from today's changes, but they're on the list.

For now though, I'm going to enjoy the fact that I can hit `Ctrl+K`, type "BALT", and instantly jump to my BALTASA node's detail page. It's the little things.

---

*Octofleet is open source. [Check it out on GitHub](https://github.com/BenediktSchackenberg/octofleet) if you're into endpoint management, or just want to see a 11,500-line main.py and feel better about your own codebase.*
