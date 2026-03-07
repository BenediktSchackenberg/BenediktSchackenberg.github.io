---
layout: post
title: "The Day We Tore Apart a 12,800-Line Python File (And Lived to Tell About It) 🧹"
subtitle: "How we modularized Octofleet's backend from one massive main.py into 30 focused router modules — plus a security audit of our own frontend"
date: 2026-03-07
tags: [octofleet, refactoring, python, fastapi, architecture, devops, backend, frontend, clean-code]
thumbnail-img: /assets/img/patch-management-thumb.png
share-img: /assets/img/patch-management-thumb.png
---

There's a moment in every project where you open a file, scroll down, keep scrolling, *keep scrolling*, and realize: this file has become a monster. For Octofleet, that file was `main.py`. **12,827 lines**. One file. 509 API endpoints. The entire backend of an endpoint management platform living in a single Python module.

Today we fixed that. And a few other things. Here's the full story.

---

## 📏 The Problem: main.py Was Too Damn Big

Let me paint you a picture. Our `main.py` had:

- **509 route handlers** — every GET, POST, PUT, DELETE for the entire platform
- **12,827 lines** of Python code
- Route groups for 40+ different API domains (nodes, jobs, patches, security, terminal, remediation...)
- Helper functions, Pydantic models, WebSocket handlers, SSE streams, all crammed together
- An import section that looked like a CVS receipt

We'd already started extracting routers months ago. `dashboard.py`, `groups.py`, `query_engine.py`, `software_metering.py`, `content_lifecycle.py` — the pattern was there. But the bulk of the code? Still squished into one massive file.

The symptoms were real:
- IDE autocomplete took seconds
- `git blame` was useless (every line touched by the same refactoring commits)
- New developers (and our future selves) would need a GPS to find anything
- CI ran the entire file through linting even for a one-line change

---

## 🔪 The Surgery: Extracting 10 Routers in One Session

We identified the biggest remaining blocks and extracted them systematically:

| New Router | Domain | Routes | Lines |
|-----------|--------|--------|-------|
| `remediation.py` | Auto-remediation engine | 23 | 500 |
| `patches.py` | Patch catalog & deployments | 21 | 404 |
| `baselines.py` | Config baselines & CIS benchmarks | 32 | 918 |
| `services_mgmt.py` | Service orchestration | 16 | 582 |
| `reports.py` | PDF/Excel report generation | 13 | 1,238 |
| `monitoring_mgmt.py` | Security monitoring & evidence | 33 | 750 |
| `terminal.py` | Remote terminal & screen sharing | 20 | 670 |
| `packages_mgmt.py` | Package management & repo | 23 | 731 |
| `vulnerabilities.py` | CVE tracking & fleet view | 8 | 234 |
| `hardware.py` | Hardware fleet aggregation | 3 | 265 |

**Result: 12,827 → 6,794 lines** (47% reduction). That's 6,033 lines moved to where they belong.

### The Pattern

Every extracted router follows the same pattern:

```python
# backend/routers/remediation.py
from fastapi import APIRouter, Depends
from dependencies import get_db_pool, verify_api_key, require_auth

router = APIRouter(tags=["Remediation"])

@router.get("/api/v1/remediation/summary")
async def get_remediation_summary():
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        # ... exact same code as before
```

And in `main.py`:

```python
from routers.remediation import router as remediation_router
app.include_router(remediation_router)
```

That's it. No behavior change. No endpoint renames. Just organization.

### The Tricky Parts

**Shared dependencies** — Many routes need `db_pool`, `verify_api_key`, `require_auth`, and various helper functions. These were all defined in `main.py`. We already had a `dependencies.py` module from the first round of extraction, but it needed extending. The key: making `db_pool` accessible as a late-bound reference (since the pool is created at startup, not import time).

**WebSocket handlers** — Terminal and screen sharing use WebSocket connections, which have different lifecycle semantics than REST routes. These got extracted to `terminal.py` with careful handling of the `websocket.accept()` / `websocket.close()` flow.

**SSE streams** — Remediation and agent monitoring use Server-Sent Events (StreamingResponse). These needed the `asyncio` generators to be properly scoped within the router module.

**Cross-router imports** — Some routes call helper functions defined alongside other routes. We had to trace every call graph to ensure nothing was left dangling. Python's `ImportError` at startup is actually your friend here — it fails fast.

---

## 🏗️ The Final Architecture: 30 Router Modules

After this cleanup, the backend is organized into 30 focused modules:

**Core:**
`auth` · `nodes` · `groups` · `inventory` · `dashboard` · `jobs` · `deployments`

**Security:**
`security` · `monitoring_mgmt` · `baselines` · `vulnerabilities` · `remediation`

**Operations:**
`patches` · `packages_mgmt` · `services_mgmt` · `terminal` · `hardware` · `reports`

**Platform:**
`query_engine` · `content_lifecycle` · `software_metering` · `alerting` · `metrics` · `mssql`

**Provisioning:**
`provisioning` · `provisioning_iso` · `provisioning_vm` · `provisioning_domain` · `provisioning_linux_boot` · `provisioning_postinstall`

The numbers:
- **main.py**: 6,794 lines (startup, middleware, 150 remaining routes, shared config)
- **routers/**: 13,940 lines across 30 files
- **Total endpoints**: 509
- **Average router size**: 465 lines

Not perfect yet — `main.py` still has ~150 routes that should be extracted (nodes, jobs, settings, admin). But it's manageable now. You can open `patches.py` and see *only* patch-related code. That's the goal.

---

## 🔑 The Other Cleanup: Killing the Hardcoded Dev Key

While we were at it, we tackled a piece of tech debt that had been bugging us for weeks.

**16 frontend files** contained this pattern:

```typescript
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "octofleet-dev-key";
```

That `"octofleet-dev-key"` fallback was a relic from early development. The problem? It doesn't match any real API key in production. If the environment variable wasn't set, every API call would silently fail with a 401.

Even worse: some files had already been migrated to use `getAuthHeader()` (our centralized auth function that sends the JWT Bearer token from the logged-in session), but the dead `API_KEY` constant was still there, confusing anyone reading the code.

**The fix:** Replace all 16 occurrences with `getAuthHeader()`:

```typescript
// Before (16 files)
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "octofleet-dev-key";
headers: { "X-API-Key": API_KEY }

// After (16 files)
import { getAuthHeader } from "@/lib/auth-context";
headers: getAuthHeader()
```

`getAuthHeader()` does the right thing automatically:
1. If the user is logged in → sends `Authorization: Bearer <jwt>`
2. If a server-side API key is configured → sends `X-API-Key: <key>`
3. If neither → sends nothing (and the request properly fails)

No more silent fallback to a fake key. No more debugging "why doesn't this page load?" only to find it's sending `octofleet-dev-key` to an endpoint that expects a real token.

Files cleaned:
- `eventlog/page.tsx`, `software-compare/page.tsx`
- `deployments/page.tsx`, `deployments/[id]/page.tsx`
- `services/page.tsx`, `services/[serviceId]/page.tsx`
- `nodes/[nodeId]/page.tsx`, `nodes/[nodeId]/terminal/page.tsx`
- `EventlogChart.tsx`, `OsDistributionChart.tsx`, `GlobalSearch.tsx`
- `create-group-dialog.tsx`, `create-tag-dialog.tsx`, `manage-tags-dialog.tsx`
- `create-deployment-dialog.tsx`, `create-dynamic-group-dialog.tsx`

---

## 📋 GitHub Housekeeping: Closing 5 Completed Epics

We also closed 5 epic issues that were fully implemented but still open on GitHub:

| Issue | Epic | Status |
|-------|------|--------|
| #105 | E30: Patch & Update Orchestration | ✅ Closed |
| #106 | E31: Configuration Baselines & Drift | ✅ Closed |
| #108 | E33: Content Repository & Lifecycle | ✅ Closed |
| #109 | E34: Real-time Query Engine | ✅ Closed |
| #122 | E38: Software Metering & License Tracking | ✅ Closed |

These were all fully implemented across 3-4 phases each, with working frontends, backend APIs, and database schemas. They'd been open because we kept adding Phase 2/3 features and never went back to close the tracking issues.

Small thing, but open issue counts matter for project perception. A new contributor seeing 15 open issues is more approachable than 20 — especially when 5 of them are "done but forgot to close."

---

## ✅ The Proof: 40/40 E2E Tests Pass

After all the changes — the router extraction, the dev-key removal, the frontend rebuild — we ran the full Playwright E2E suite against the test server:

```
Running 44 tests using 1 worker

  ✓  01-auth.spec.ts (1 test, 3 skipped)
  ✓  02-navigation.spec.ts (6 tests, 1 skipped)
  ✓  03-crud.spec.ts (7 tests)
  ✓  04-features.spec.ts (4 tests)
  ✓  05-rbac.spec.ts (3 tests)
  ✓  06-services.spec.ts (9 tests)
  ✓  07-reports.spec.ts (10 tests)

  40 passed, 4 skipped (52.6s)
```

Zero regressions. The 4 skipped tests are intentional (auth state conflicts with the global login setup). Every page loads, every API call returns data, every CRUD operation works.

This is why you write E2E tests before refactoring. They're your safety net. Without them, a 6,000-line code move is a prayer. With them, it's Tuesday.

---

## 📊 By the Numbers

| Metric | Before | After |
|--------|--------|-------|
| `main.py` lines | 12,827 | 6,794 |
| Router modules | 20 | 30 |
| Total endpoints | 509 | 509 |
| Files with hardcoded dev key | 16 | 0 |
| Open epic issues | 11 | 6 |
| E2E tests passing | 40/40 | 40/40 |
| Reduction | — | **47%** |

---

## 🎯 What's Next

The remaining 6,794 lines in `main.py` still have ~150 routes that could be extracted: node management, job management, settings, admin utilities, and various one-off endpoints. We'll chip away at these incrementally.

On the feature side, the remaining epics are:
- **E35** — Enterprise Reporting Suite (P3)
- **E36** — RBAC Delegation & Audit-Grade Governance (P3)
- **E32** — Smart Proxy / Edge Infrastructure (P4)
- **E37** — Cloud Attach / Co-Management (P5)

But today was about hygiene. The kind of work that doesn't show up in feature lists or release notes, but makes everything else possible. A well-organized codebase is faster to debug, easier to contribute to, and less likely to accumulate the kind of hidden bugs that bite you at 3 AM.

Sometimes the most productive thing you can do is clean up.

---

*The full source is on [GitHub](https://github.com/BenediktSchackenberg/octofleet) — MIT licensed. We accept PRs for the remaining modularization too, if you're into that kind of thing.* 🐙
