---
layout: post
title: "PAMlab: The Day I Fixed Everything That Wasn't Actually Broken (Until You Tested It)"
subtitle: "Auth validation, webhook endpoints, async pipeline engine, and 124 green tests — one productive Monday."
date: 2026-03-31
tags: [pamlab, pam, fudo-pam, active-directory, matrix42-automation, matrix42-esm, servicenow, jira-service-management, bmc-remedy, security-automation, itsm-integration, access-management, privileged-access-management, webhook-automation, pipeline-engine, devops, open-source]
author: Benedikt Schackenberg
---

You know that moment when your test suite is green, your README looks great, and then someone actually *uses* your project and finds that the login endpoint accepts literally any password?

Yeah. That was my Monday morning.

## The Problem Nobody Noticed

PAMlab has been running for a while now — six mock APIs simulating Active Directory, Fudo PAM, Matrix42 ESM, ServiceNow, JSM, and BMC Remedy. The whole point is to build and test access management workflows without touching production. And it worked. Technically.

But there was a catch. When I sat down to do a proper integration test — not just "does the endpoint return 200" but "does the **security behavior** make sense" — things fell apart fast.

The Active Directory mock? You could bind with any password:

```bash
# This should fail. It didn't.
curl -X POST http://localhost:8445/api/ad/auth/bind \
  -H "Content-Type: application/json" \
  -d '{"dn": "CN=Administrator,OU=Users,DC=corp,DC=local", "password": "totallyWrong"}'

# → 200 OK, here's your token. Come on in.
```

Same story with the Remedy mock. `POST /api/jwt/login` with garbage credentials? Here's a valid JWT, no questions asked.

For a PAM sandbox — a project specifically about **access management** — that's embarrassing. If your mock doesn't reject bad passwords, every downstream integration test that depends on auth behavior is lying to you.

## The Auth Fix

The fix itself was straightforward. AD bind now validates against a credential allowlist:

```bash
# Wrong password → 401
curl -s -w " [HTTP %{http_code}]" -X POST http://localhost:8445/api/ad/auth/bind \
  -H "Content-Type: application/json" \
  -d '{"dn": "CN=Administrator,OU=Users,DC=corp,DC=local", "password": "totallyWrong"}'
# → {"error":"Invalid credentials","message":"LDAP bind failed: wrong password"} [HTTP 401]

# Correct password → 200
curl -s -w " [HTTP %{http_code}]" -X POST http://localhost:8445/api/ad/auth/bind \
  -H "Content-Type: application/json" \
  -d '{"dn": "CN=Administrator,OU=Users,DC=corp,DC=local", "password": "admin"}'
# → {"token":"...","bind_dn":"CN=Administrator,...","message":"Bind successful"} [HTTP 200]
```

Basic Auth got the same treatment — both on the AD mock and the Remedy mock. The Remedy JWT endpoint now returns a proper `401 "Authentication failed: invalid password"` instead of handing out tokens like candy.

It's a mock, sure. But mocks that don't enforce auth boundaries train you to write integrations that don't handle auth failures. And that's exactly the kind of bug that shows up at 3 AM in production.

## The Missing Webhooks

While I was at it, I noticed two more gaps. Matrix42 and JSM both claim to support event-driven workflows in the README — but neither had webhook endpoints.

Matrix42 webhook registration:

```bash
curl -s -X POST http://localhost:8444/m42Services/api/webhooks \
  -H "Authorization: Bearer pamlab-dev-token" \
  -H "Content-Type: application/json" \
  -d '{"url": "http://example.com/hook", "events": ["ticket.created"]}'
# → 201, returns webhook ID + event subscription
```

JSM got a similar treatment with `/rest/webhooks/1.0/webhook` — the standard Atlassian webhook path. Now you can actually test event-driven approval flows without pretending the webhook exists.

## Fudo Account Sync: The Silent Breaker

This one was subtle. The Fudo PAM mock required a `server_id` when creating accounts. Makes sense in production — you need to know which server the account lives on. But in an onboarding pipeline, the first thing you do is create the account. You don't necessarily have the server mapping yet.

The fix: auto-assign the first available server when `server_id` is omitted. The pipeline keeps flowing, and the mapping can be refined later. Small change, big difference for anyone trying the onboarding demo.

```bash
# No server_id → auto-assigns to first available server
curl -s -X POST http://localhost:8443/api/v2/accounts \
  -H "Authorization: Bearer pamlab-dev-token" \
  -H "Content-Type: application/json" \
  -d '{"name": "new-account", "login": "testuser"}'
# → 201, server_id: "20000000-0000-0000-0000-000000000001"
```

## The Code Quality Pass

Fixing bugs is satisfying. But the codebase had accumulated some debt that was bugging me.

**The double exports.** Every single `server.js` — all seven of them — ended with:

```js
module.exports = app;

module.exports = app;
```

Harmless, but it screams "nobody reviewed this." Gone now.

**Compressed server files.** The Express app setup was crammed into as few lines as possible. Health endpoints were one-liners. No section comments. Reading a server.js felt like decoding morse code. I reformatted all of them with consistent sections:

```js
// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Public Routes ---
app.use('/api/ad/auth', require('./routes/auth'));

// --- Protected Routes ---
app.use('/api/ad/users', authMiddleware, require('./routes/users'));

// --- Health & Admin ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ad-mock-api', domain: 'corp.local' });
});
```

**The pipeline engine.** This one was worse. Synchronous file reads everywhere — `fs.readFileSync` in async handlers, `fs.existsSync` before every read, `fs.readdirSync` for listing pipelines. In a web server. Serving API requests.

Converted everything to `fs.promises.*` with proper async/await. Added input validation (the pipeline runner would happily try to execute `undefined`). Added structured JSON logging instead of bare `console.log`.

**Prettier + ESLint.** Added `.prettierrc.json` and `.eslintrc.json` to the repo root. Ran Prettier across all 115 source files. Now `npm run format` and `npm run lint` work from the project root.

## The Matrix42 Fragment API

This was a documentation problem that became a code problem. The Matrix42 mock had fragments — data objects organized by data definition name. You could create them, read them by ID, update them. But:

- `GET /api/data/fragments/:ddName` (without an ID) → 404. No way to list fragments.
- `DELETE /api/data/fragments/:ddName/:fragmentId` → didn't exist.

So CRUD was missing the L and the D. Added both:

```bash
# List all fragments for a data definition
curl -s http://localhost:8444/m42Services/api/data/fragments/SPSUserClassBase \
  -H "Authorization: Bearer pamlab-dev-token" | jq '.items | length'
# → 10

# Delete a specific fragment
curl -s -X DELETE http://localhost:8444/m42Services/api/data/fragments/SPSUserClassBase/some-id \
  -H "Authorization: Bearer pamlab-dev-token"
# → 204 No Content
```

## The Smoke Test

I wrote `scripts/smoke-test.sh` — one script that tests the complete onboarding path:

1. Health checks on all 6 services
2. AD auth (valid + invalid credentials)
3. Remedy auth (valid + invalid)
4. Matrix42 ticket creation
5. AD user creation + group assignment
6. Fudo account creation (without server_id)
7. Matrix42 webhook registration
8. JSM webhook registration
9. Pipeline dry-run

Each step prints `[PASS]` or `[FAIL]`. Exit code 0 means everything works. CI-ready.

## The README Restructure

The README got feedback that it was too dense up front. Fair point — the first thing you saw was a 9-row system table, a "Problem" section, and a "Solution" section, before you even got to `docker-compose up`.

Restructured it: **TL;DR → Getting Started → Minimal Quickstart → Architecture**. The system table moved below the quick start. Added a "Minimal Quickstart" section that goes from zero to working in three curl commands (Matrix42 ticket → AD user → group assignment). CyberArk is now clearly marked as optional.

Also added a "Mock API Realism" section. Because this is a sandbox, not a production clone, and that should be obvious to anyone evaluating it.

## The Numbers

Before today:
- 82 tests passing, 8 failing, 8 warnings
- Auth validation: non-existent
- Webhooks: missing
- Code style: inconsistent

After today:
- **124 tests passing, 0 failing, 0 warnings**
- Auth rejects invalid credentials across all services
- Webhooks work for Matrix42 and JSM
- Prettier + ESLint across the entire codebase
- One-command smoke test for the full onboarding path

## What I Learned

Mock APIs are deceptively easy to get wrong. The happy path works from day one — but the error paths, the auth validation, the edge cases in CRUD operations? Those are what make a sandbox actually useful for development.

If your mock accepts any password, your integration code will never handle auth failures. If your mock doesn't have webhooks, your event-driven workflows are built on assumptions. If your test report has warnings that you've been ignoring, your quality story has holes.

Today was about closing those holes. Not glamorous, but the kind of work that separates a demo from a tool.

---

*PAMlab is open source under Apache 2.0: [github.com/BenediktSchackenberg/PAMlab](https://github.com/BenediktSchackenberg/PAMlab)*

*Previous posts: [Introducing PAMlab]({% post_url 2026-03-26-pamlab-dev-sandbox %}) · [PAMlab Studio V2]({% post_url 2026-03-28-pamlab-studio-v2 %})*
