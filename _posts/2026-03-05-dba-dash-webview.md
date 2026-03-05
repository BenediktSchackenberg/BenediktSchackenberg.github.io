---
layout: post
title: "We Built a Web UI for DBA Dash — and It's Free"
subtitle: "40+ pages, management dashboards, and a proper tree view for your SQL Server fleet"
date: 2026-03-05
tags: [sql-server, dba-dash, monitoring, open-source, webdev, dotnet, react]
---

Let me get one thing straight right away: **[DBA Dash](https://github.com/trimble-oss/dba-dash) is incredible.** The team at Trimble and David Wiseman built one of the best SQL Server monitoring tools out there — open source, battle-tested, and packed with features that commercial tools charge thousands for. If you're a DBA and you haven't tried it, go do that first. Seriously. [dbadash.com](https://dbadash.com).

This post isn't about replacing DBA Dash. It's about a side project born from a very specific itch: **we wanted to see our fleet data in a browser.**

## The Problem

We run about 200 SQL Servers. DBA Dash collects everything beautifully into `DBADashDB` — CPU stats, backup history, wait stats, job execution, drive space, you name it. The native GUI is powerful, but it's a Windows desktop app. That means:

- Our Linux/Mac folks can't easily check on things
- Sharing a quick overview with a manager means screenshots or screen sharing
- Checking from a phone or tablet? Forget it
- Standing up a NOC display means dedicating a Windows machine

So we did what any reasonable person would do on a Wednesday evening: we started building a web frontend.

## What We Built

**[DBA Dash WebView](https://github.com/BenediktSchackenberg/dbadashwebview)** — an ASP.NET Core 8 + React app that reads directly from your existing DBADashDB. No agents, no schema changes, no impact on your DBA Dash setup. Just point it at your database, deploy to IIS, and go.

Here's the quick rundown of what's in there right now:

### The Tree

If you've used DBA Dash, you know the instance tree on the left. We replicated that — instances grouped by SQL Server version (2025, 2022, 2019...), expandable with categories like Configuration, HA/DR, Storage, Databases, Jobs. Click a node, you see only that server's data. No more scrolling through 200 instances to find the one you want.

### Performance Summary

A single table showing your entire fleet — CPU %, wait stats, IO latency, IOPs per instance. Sortable, auto-refreshes every 30 seconds. You can set your own warning/critical thresholds so the cells light up when something needs attention. No colors by default — your rules, your thresholds.

### Management Reporting

This is where it gets fun. We built three reports specifically for the "hey, can you give me a quick overview?" meetings:

**License Overview** — Pie chart of SQL Server versions, bar chart of editions, total core count, total RAM, and an end-of-support timeline. That last one is handy when someone asks "how many 2016 instances do we still have?" and you can just pull up the page.

**Underutilized Servers** — Every instance that averaged less than 5% CPU over the past two weeks. With estimated annual savings based on typical SQL Server list pricing ($15K/core for Enterprise, $4K for Standard). Turns out there's always a few servers nobody remembers deploying.

**Fleet Statistics** — CPU distribution across the fleet, top 10 consumers, RAM allocation, storage usage. The bird's-eye view.

### Backup & Recovery Dashboard

This one was the last thing we built today and probably the most useful for management. Every instance as an expandable card, sorted by CPU load (business-critical servers first). Click to see each database's backup status — Full, Diff, Log — with age indicators, estimated recovery time, and an RPO rating (Excellent down to Critical).

Three KPI cards at the top: number of backups in the last 24 hours, total backup size, and average estimated recovery time. At the bottom, a Recovery Impact Assessment that tells you in plain English what the worst-case scenario looks like.

### Everything Else

There's about 40 pages total — running queries, blocking chains, slow query analysis, wait statistics, memory breakdown, IO performance, job timelines, schema change tracking, patching history, identity column monitoring, TempDB analysis, and more. Each one reads from the existing DBA Dash tables and stored procedures.

## The Stack

Nothing exotic:

- **Backend:** ASP.NET Core 8 Minimal API — reads DBADashDB via SqlClient, serves a React SPA, handles JWT auth
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Recharts + Framer Motion
- **Auth:** Local admin account + optional Active Directory via LDAP
- **Deployment:** IIS with the ASP.NET Core Hosting Bundle (one ZIP, extract, configure connection string, done)
- **CI/CD:** GitHub Actions builds it, creates a release ZIP

The whole thing is read-only against DBADashDB. No writes, no schema modifications, no stored procedure installations. If you can do `SELECT` and `EXEC` on the DBA Dash stored procs, you're good.

## How to Try It

1. You need a running DBA Dash setup with a populated `DBADashDB`
2. Grab the latest release from [GitHub](https://github.com/BenediktSchackenberg/dbadashwebview/releases)
3. Extract to `C:\inetpub\dbadash` (or wherever)
4. Edit `appsettings.json` with your SQL connection string
5. Set up an IIS site pointed at that folder
6. Browse to it, login with `admin`/`admin`

That's it. Five minutes if you already have the Hosting Bundle installed.

## What This Is (and Isn't)

Let's be clear about what this project is:

- **It's a frontend.** All the heavy lifting — data collection, aggregation, the actual monitoring — that's DBA Dash. We just read the data and show it in a browser.
- **It's tailored to our needs.** We built the views we wanted. Your priorities might be different.
- **It's free and open source.** MIT licensed. Fork it, modify it, use it however you want.
- **It's not affiliated with DBA Dash or Trimble.** We're just fans who wanted a web UI.

## Feedback Welcome

This is very much a work in progress. We're running it against our 200-server environment and finding rough edges every day. If you try it out, find bugs, want features, or just want to say hi:

- [Open an issue on GitHub](https://github.com/BenediktSchackenberg/dbadashwebview/issues)
- Star the repo if you find it useful
- PRs are welcome

And seriously — go check out [DBA Dash](https://github.com/trimble-oss/dba-dash) if you haven't. The real magic happens there.

---

*Built during a productive evening session. The kind where you start with "let me just add one feature" and end up with three new reporting pages and a complete backup management dashboard. We've all been there.*
