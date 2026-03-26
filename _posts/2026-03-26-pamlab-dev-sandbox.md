---
layout: post
title: "PAMlab: A Dev Sandbox for Privileged Access Automation 🔐"
subtitle: "Stop testing access provisioning scripts against production. Build a local mock environment in 30 seconds."
date: 2026-03-26
tags: [pamlab, pam, fudo, matrix42, active-directory, devops, security, automation]
author: Benedikt Schackenberg
---

Here's a scenario every sysadmin knows: Your boss asks you to automate the access provisioning workflow. New employee joins, gets added to the right AD groups, Fudo PAM picks up the change, access to production servers is granted — all triggered by a ticket in Matrix42.

Sounds straightforward on a whiteboard. Then you sit down to actually build it and realize: you can't test against production. Your Fudo appliance is locked down by the security team. The Matrix42 dev instance hasn't been updated since 2019. And nobody's going to give you a sandbox Active Directory with realistic data.

So you do what every sysadmin does: you test in production and pray. Or you write the script, send it to someone else, and wait three weeks for feedback.

There has to be a better way.

## What We Built

[PAMlab](https://github.com/BenediktSchackenberg/PAMlab) is a collection of mock APIs that simulate a complete enterprise access management stack. Three Node.js servers, each pretending to be a different system:

| System | What it pretends to be | Port |
|--------|----------------------|------|
| Fudo PAM | Privileged Access Management (sessions, passwords, JIT access) | 8443 |
| Matrix42 ESM | IT Service Management (tickets, assets, provisioning workflows) | 8444 |
| Active Directory | Directory services (users, groups, OUs, computers) | 8445 |

Start everything with one command:

```bash
git clone https://github.com/BenediktSchackenberg/PAMlab.git
cd PAMlab
docker-compose up
```

Three APIs running locally. With realistic data. Ready to be scripted against.

## Why This Matters

I've worked in environments where a single misconfigured provisioning script removed 200 users from their security groups. On a Friday afternoon. The helpdesk queue on Monday was not fun.

The problem wasn't that the script was wrong — the logic was fine. The problem was that nobody tested the edge cases:

- What happens when the AD group doesn't exist yet?
- What if the Fudo sync fails halfway through?
- What if the Matrix42 approval is denied after the AD change was already made?

These aren't theoretical problems. They're Tuesday at 2pm problems. And you can't catch them by reading the script. You need to run it against something.

## A Real Example: Onboarding with Temporary Access

Let's say a contractor needs RDP access to three production servers for 30 days. The workflow:

1. Someone creates an access request in Matrix42
2. The manager approves it
3. A PowerShell script adds the user to the right AD group
4. Fudo syncs from AD and grants access
5. After 30 days, the group membership expires

Here's what that looks like against PAMlab:

```powershell
Import-Module ./examples/powershell/_PAMlab-Module.psm1
Connect-PAMlab

# Step 1: Create the access request
$request = Invoke-M42 -Method POST -Endpoint "/access-requests" -Body @{
    user = "t.developer"
    target_type = "server_group"
    target = "GRP-RDP-Admins"
    access_type = "rdp"
    justification = "Database migration project"
    duration = "30d"
}
Write-Host "Access Request: $($request.id) — Status: $($request.status)"

# Step 2: Approve it
Invoke-M42 -Method POST -Endpoint "/access-requests/$($request.id)/approve" -Body @{
    approved_by = "admin"
    comment = "Approved for Q2 migration"
}

# Step 3: Add to AD group with 30-day expiry
Invoke-AD -Method POST -Endpoint "/groups/GRP-RDP-Admins/members/timed" -Body @{
    user = "t.developer"
    expires_at = (Get-Date).AddDays(30).ToString("yyyy-MM-ddTHH:mm:ssZ")
}

# Step 4: Trigger Fudo sync
$sync = Invoke-Fudo -Method POST -Endpoint "/user-directory/sync"
Write-Host "Sync complete: $($sync.users_added) added, $($sync.groups_synced) groups"

# Step 5: Verify
$groups = Invoke-Fudo -Method GET -Endpoint "/groups"
# Done. User has access. Auto-revokes in 30 days.
```

This script runs against localhost. No VPN to the production network. No "can you give me API access to the Fudo dev instance" emails. No waiting.

And the best part: when you're done testing, **the exact same script works against production**. You just swap the URLs:

```powershell
# Dev:
Connect-PAMlab  # → localhost:8443, :8444, :8445

# Prod:
Connect-PAMlab -ConfigFile ./config/production.env
# → fudo.company.com, matrix42.company.com, dc01.company.com
```

Same script. Same logic. Different targets.

## The Rollback Problem

Here's something I learned the hard way: you always need a rollback plan.

Your onboarding script adds a user to three AD groups and triggers a Fudo sync. The first two groups work fine. The third group add fails because someone renamed the group. Now you have a user with partial access — they can reach the database server but not the application server. 

PAMlab's mock APIs let you simulate these failures. The AD mock returns a 404 when you try to add a member to a non-existent group. Your script should catch that and undo the first two group additions. If it doesn't, you'll find out now — not when it happens for real.

```powershell
try {
    Invoke-AD -Method POST -Endpoint "/groups/GRP-DOES-NOT-EXIST/members" -Body @{
        members = @("t.developer")
    }
} catch {
    Write-Host "Failed! Rolling back..." -ForegroundColor Red
    # Undo previous steps
    Invoke-AD -Method DELETE -Endpoint "/groups/GRP-RDP-Admins/members/t.developer"
    Invoke-AD -Method DELETE -Endpoint "/groups/GRP-DB-Operators/members/t.developer"
    
    # Create incident ticket
    Invoke-M42 -Method POST -Endpoint "/tickets" -Body @{
        Subject = "FAILED: Onboarding t.developer"
        Priority = 1
        Category = "Access Management"
    }
}
```

Boring? Yes. Necessary? Ask the guy who had to manually fix 200 user accounts on a Monday morning.

## What's In The Box

The Fudo mock alone has over 70 endpoints. It's not just CRUD — it simulates the stuff you actually need for integration testing:

**Session lifecycle**: open connections, terminate sessions, pause/resume, get AI-generated session summaries. Useful when your monitoring script needs to react to suspicious sessions.

**Event stream**: Server-Sent Events endpoint that pushes random events every few seconds. Your SIEM integration can subscribe and test real-time processing.

**Password rotation**: Policies with rotation schedules. Trigger a rotation, check the history. See if your credential management workflow handles the new password correctly.

**Just-in-Time access**: Request temporary access, approve/deny, automatic expiration. The whole workflow that JIT access vendors love to put in their slides but nobody tests end-to-end.

The Matrix42 mock covers tickets, assets, provisioning workflows, software catalog, and compliance reports. The AD mock has users, groups (including timed membership for JIT), OUs, and computer objects.

## Where This Is Going

Right now, PAMlab supports Matrix42, Active Directory, and Fudo PAM. But the architecture is pluggable. We have epics planned for:

- **Jira Service Management** — for Atlassian shops
- **ServiceNow** — the 800-pound gorilla of ITSM
- **BMC Remedy** — still very common in healthcare and government

The bigger vision is a **pipeline engine** where you define your provisioning workflow as YAML and PAMlab executes it step by step against whatever combination of systems your organization uses. Matrix42 → AD → Fudo, or JSM → Azure AD → CyberArk, or ServiceNow → LDAP → BeyondTrust. Same engine, different connectors.

But even without the fancy stuff, just having three mock APIs on localhost that you can script against — that alone saves a stupid amount of time.

## Try It

```bash
git clone https://github.com/BenediktSchackenberg/PAMlab.git
cd PAMlab
docker-compose up
```

The repo has ready-to-use PowerShell scripts for seven common scenarios: onboarding, offboarding, role changes, JIT access, emergency revocation, password rotation, and audit reports.

Fork it, break it, add your own connectors. PRs welcome (signed commits required — we're a security project after all).

→ [github.com/BenediktSchackenberg/PAMlab](https://github.com/BenediktSchackenberg/PAMlab)
