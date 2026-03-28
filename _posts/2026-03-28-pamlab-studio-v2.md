---
layout: post
title: "PAMlab Studio: From 'It Works On My Machine' to 'It Works Everywhere' 🔧"
subtitle: "How I turned 7 mock APIs into a full-blown PAM workflow IDE with test sandboxes, flow visualization, and production export."
date: 2026-03-28
tags: [pamlab, pam, fudo, workflow-automation, devtools, react, typescript, security, active-directory, servicenow, jira]
author: Benedikt Schackenberg
---

Two days ago I [released PAMlab]({% post_url 2026-03-26-pamlab-dev-sandbox %}) — a sandbox with mock APIs for building PAM integration scripts. Three APIs, some PowerShell templates, a basic web UI. Cool, but kind of bare bones.

Today it's a completely different beast. And the story of how it got there is worth telling, because it touches on something I think most tooling projects get wrong: **the gap between "technically works" and "someone would actually use this."**

## The Problem With V1

PAMlab v1 had working mock APIs and a code editor. You could write PowerShell, hit Run, and see results. Mission accomplished, right?

Not really. Here's what happened when I sat down to actually *use* it:

1. I loaded the Onboarding template. It created a user called "Sarah Connor" in the AD mock.
2. I tweaked some params. Ran it again. **409 Conflict** — user already exists.
3. I opened the Emergency Revoke template. It tried to block a Fudo user by ID. The ID was `FROM_STEP_5`. **422 — "Valid user_id required."**
4. I clicked the Debug button. Nothing happened. Export? Nothing. Save? You guessed it.

The buttons were decorative. The templates had placeholder values that couldn't resolve. And running the same workflow twice was a guaranteed crash because the first run's test data polluted the second run.

This is the kind of thing that separates a proof of concept from a tool. And I had a proof of concept.

## The Fix: Everything

Instead of patching individual bugs, I decided to rebuild the entire user experience in one session. Here's what that looked like.

### Cross-Step References (The Non-Obvious Problem)

This was the most interesting engineering challenge. In a real provisioning workflow, steps depend on each other:

```
Step 1: Create Matrix42 Ticket     → returns ticket_id
Step 5: Create Fudo PAM User       → returns user_id
Step 6: Add User to Fudo Group     → needs Step 5's user_id
Step 8: Close Ticket               → needs Step 1's ticket_id
```

In production PowerShell, you'd write `$step5Result.id`. But in the PAMlab runner, the script is parsed into API calls and executed sequentially. There's no PowerShell runtime — just a JavaScript loop calling `fetch()`.

The solution was a step resolver that sits between the parser and the executor:

```typescript
// After each step, extract IDs from the response
stepResults[i + 1] = extractIds(res.data);

// Before executing the next step, resolve references
const resolvedCall = resolveStepReferences(calls[i], stepResults);
```

The resolver understands different response formats: Fudo returns `{ id: "..." }`, Matrix42 returns `{ ID: "..." }`, ServiceNow wraps everything in `{ result: { sys_id: "..." } }`, and Jira uses `{ key: "ITSM-12" }`. One function, five different ID extraction patterns.

It's the kind of plumbing that nobody notices when it works, but breaks everything when it doesn't.

### The Test Sandbox

The second big problem: running templates more than once. The Onboarding template creates "Sarah Connor" — run it twice and the AD mock returns 409 because Sarah already exists.

The fix was a test runner that generates random identities:

```
Template says: s.connor / Sarah Connor
Test run uses: test-a3f8b / Test User A3F8B
```

It replaces every known demo username in the generated script with a random identifier, runs it, and then offers a "Cleanup" button that deletes everything the test created. AD users, Fudo users, group memberships, tickets — all tracked during execution and reversible after.

Combined with a "Reset Mock Data" button that reloads all seed data across all 7 APIs, you can now iterate on workflows indefinitely without accumulating garbage state.

### Stable UUIDs (The Subtle Fix)

Here's a fun one. The Fudo mock used `uuidv4()` to generate IDs for all seed data — users, groups, safes, servers. Every time the API restarted, every ID changed.

This meant the workflow templates couldn't reference Fudo groups or safes by ID, because the IDs were different every time. I replaced all seed IDs with deterministic UUIDs:

```javascript
// Before: random every restart
{ id: uuidv4(), name: 'RDP-Server-Admins' }

// After: stable forever
{ id: '70000000-0000-0000-0000-000000000001', name: 'RDP-Server-Admins' }
```

Simple change, huge impact. Now templates can hard-reference `70000000-0000-0000-0000-000000000001` and it'll always be the RDP-Server-Admins group.

### Five Real Templates

With stable IDs and cross-step resolution, I could finally build templates that actually *work*:

| Template | Steps | Systems | What Happens |
|----------|-------|---------|-------------|
| Employee Onboarding | 8 | Matrix42 → AD → Fudo | Ticket → User → Groups → PAM → Policy → Close |
| Temp Server Access | 4 | Matrix42 → AD → Fudo | Ticket → Group → Time-Limited Policy → Close |
| Offboarding | 5 | AD → Fudo → ServiceNow | Remove → Block → Disable → Incident |
| Emergency Revoke | 5 | Fudo → AD → ServiceNow | 🚨 Block → Disable → Remove → Security Incident |
| Project Access | 4 | AD → Fudo → Jira | Group → Web Policy → DB Policy → Jira Issue |

All five templates verified end-to-end: **26 API calls, 26 successful responses.** You can load any of them, hit Run, and watch the entire flow execute with live status updates in the inline results panel.

### The Access Policy Model

While building templates, I realized the Fudo mock was missing a critical concept: **Access Policies**. In real Fudo, the access chain is:

```
AD Group (GRP-RDP-Admins)
  → linked via ad_group_dn to
Fudo Group (RDP-Server-Admins)
  → Access Policy binds to
Fudo Safe (IT-Administration)
  → contains
Servers (DC01, DB-PROD, FileServer01) + Accounts
  → accessed via
Listener (RDP / SSH)
```

A user in the group can access all servers in the safe through the listener. I implemented the full model:

- `POST /api/v2/access-policies` — create policies with group, safe, listener, time restrictions, and approval requirements
- `GET /api/v2/access-policies/check/:user_id/:safe_id` — check if a user has access to a specific safe
- Seed data with three pre-configured policies

This is the kind of domain modeling that makes mock APIs actually useful for testing — not just "does the API respond" but "does the business logic flow make sense."

### Fudo Mock Expansion

While at it, I expanded the infrastructure:

- **6 servers** (was 3): DC01, DB-PROD, APP-ERP, FileServer01, Web-PROD, Citrix01
- **4 safes** (was 2): IT-Administration, Application-Access, File-Server-Access, Web-Server-Deployment
- **6 accounts**: One per server with realistic names
- All servers in the Production pool

### Flow Visualization

The workflow builder now shows your steps as a visual flow diagram:

```
[Matrix42 🎫]──→──[AD 🏢]──→──[AD 🏢]──→──[Fudo 🔐]──→──[Fudo 🔐]──→──[Matrix42 🎫]
 Create Ticket    Create User   Add Group   Create User   Create Policy   Close Ticket
     ✅              ✅            ✅           ⏳            ⏸              ⏸
```

Each node is colored by system (blue=AD, green=Fudo, purple=Matrix42, orange=ServiceNow), shows the step label, and has a live status indicator. When you run the workflow, nodes light up one by one.

### Production Export

Mock scripts are useless if you can't deploy them. PAMlab Studio now has a production config system where you configure real system URLs and auth methods:

| System | Auth Method |
|--------|------------|
| Fudo PAM | API Token |
| Matrix42 | API Key |
| Active Directory | LDAP Bind |
| ServiceNow | OAuth2 (Client ID/Secret) |
| Jira SM | API Token |
| BMC Remedy | Basic Auth |

Hit "🏭 Export for Production" and the script is regenerated with proper auth blocks. Same workflow logic, different endpoints and credentials. The config can be exported/imported as JSON (with passwords masked).

### The Welcome Screen

New users no longer land on a dashboard with green dots and no context. There's now a welcome screen with:

- Feature overview (Build → Test → Ship)
- "Start with a Demo" button that loads the Onboarding template
- "Build from Scratch" option

It's skippable and only shows once (localStorage flag). Small thing, but it's the difference between "what am I looking at" and "oh, I should click this."

### Everything Else

- **Run History**: All executions saved in localStorage, viewable as a table with expandable details
- **Live Dashboard Stats**: Users, servers, groups, sessions, pending requests — fetched from Fudo API in real time
- **Quick Actions**: One-click cards for common demos (Onboarding, Emergency Revoke)
- **Keyboard Shortcuts**: Ctrl+Enter (Run), Ctrl+S (Save), Ctrl+E (Export)
- **Settings Redesign**: Three tabs — Mock APIs, Production Config, Preferences
- **Mock Data Reset**: POST /reset on all APIs to reload seed data

## Interactive Demo

Want to see it in action without cloning the repo? Here's an interactive walkthrough:

<div style="position: relative; width: 100%; padding-bottom: 56.25%; margin: 30px 0;">
<iframe src="https://raw.githack.com/BenediktSchackenberg/PAMlab/main/video-assets/demo-presentation-v2.html" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 2px solid #333; border-radius: 12px;" allowfullscreen></iframe>
</div>

*Use arrow keys or click the dots to navigate. Best viewed fullscreen.*

## The Numbers

Over the course of one (long) day:

- **1,400+ lines** of new TypeScript/React code
- **19 files** changed across frontend and all 7 mock APIs
- **6 new components**: Welcome, FlowDiagram, RunHistory, testRunner, stepResolver, productionConfig
- **5 workflow templates** verified end-to-end (26 API calls each)
- **0 production systems** were harmed in the making of this update

## What I Learned

Building developer tools is different from building user-facing products. The audience is smaller but way more demanding. They'll find every edge case in the first five minutes because that's literally what they do for a living.

The biggest lesson: **demo data matters more than features.** The test sandbox and mock data reset took maybe 20% of the development time but solved 80% of the usability problems. Nobody cares about your flow visualization if they can't run the same template twice.

The second lesson: **cross-system reference resolution is the hard part of workflow automation.** Not the individual API calls — those are straightforward. It's the `$step5Result.id` problem. Every orchestration tool eventually has to solve this, and most do it poorly.

## Try It

```bash
git clone https://github.com/BenediktSchackenberg/PAMlab.git
cd PAMlab
docker-compose up
# Open http://localhost:3000
```

Load a template. Hit Run. Watch 8 API calls cascade across three different systems. Then hit "🧪 Test Run" and do it again with random data. Then export the script, change the URLs, and run it against your real environment.

That's the whole point: **build once, test safely, deploy anywhere.**

[GitHub](https://github.com/BenediktSchackenberg/PAMlab) — Apache 2.0, contributions welcome.
