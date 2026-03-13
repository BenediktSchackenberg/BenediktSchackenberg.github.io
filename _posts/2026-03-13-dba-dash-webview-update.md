---
layout: post
title: "DBA Dash WebView: Two Weeks In — What Changed"
subtitle: "Backup Ampel, SQL Monitor, AG awareness, and a proper alert feed for your SQL Server fleet"
date: 2026-03-13
tags: [sql-server, dba-dash, monitoring, open-source, webdev, dotnet, react]
---

It's been about a week since I [wrote about DBA Dash WebView](/2026-03-05-dba-dash-webview) — the web frontend we built on top of [DBA Dash](https://github.com/trimble-oss/dba-dash). Back then it was already usable with ~40 pages covering most DBA workflows. Since then, things escalated a bit.

Here's what happened.

## The Backup Ampel

This one came from a real need. We have ~200 SQL Servers and a bunch of AlwaysOn Availability Groups. The question "are all our backups OK?" sounds simple, but it's surprisingly hard to answer when you have AG secondaries, Simple Recovery databases, and dozens of instances.

So we built a traffic-light report. Every instance gets a status:

- **Green** — Full backup within 24 hours, log backup within 15 minutes
- **Yellow** — Full within 48 hours, log within 30 minutes
- **Red** — Everything else

Sounds easy enough, right? It wasn't. The first version showed everything as red. Turns out when you run `MIN(latest_log_backup)` across all databases in an instance, you're also including Simple Recovery databases — which by design never have log backups. NULL minimum = no backup = red. Every single instance.

The fix: a separate CTE that filters `recovery_model IN (1, 2)` before evaluating log backup compliance. Simple Recovery databases show "N/A" instead of a false alarm.

Then there was the AG problem. AlwaysOn secondaries don't run backups — the preferred replica does. So a secondary with no recent backup isn't a problem, it's expected behavior. We now JOIN against `dbo.DatabasesHADR` with `is_local = 1` and exclude `is_primary_replica = 0` from the evaluation. Secondaries show "via Primary" in the detail view instead of angry red timestamps.

The result is a page where you can actually trust the colors. Green means green. Red means something needs attention.

## SQL Monitor

I've always liked the card-based approach that tools like Redgate SQL Monitor use — you see your entire fleet as a grid of cards, each showing the instance name, health status, and current CPU. At a glance you know what's going on.

Our version pulls data from DBA Dash's `Summary_Get` stored procedure and `dbo.CPU` table. Each card shows health indicators based on 7 status keys (full backup, log backup, DBCC, drives, jobs, AG, corruption). Status values from DBA Dash are 1=OK, 2=Warning, 3=N/A, 4=Critical. We learned the hard way that `>= 2` catches N/A as a warning — the correct check is `== 2 || == 4`.

There's also an alert sidebar that shows the latest collection errors and failed jobs in real time. Click any card to jump straight to the instance detail page.

## Instance Detail, Rebuilt

The old instance detail page had an Overview tab that was basically a worse version of the summary. We ripped it out and made Performance the default tab instead. When I click on an instance, I want to see the CPU chart — not a list of metadata I already saw in the card.

The header now shows status badges inline (compact, always visible), with N/A statuses hidden entirely. CPU KPI cards sit above the chart: current, 24h average, 24h peak. The Databases tab got AG Role and Sync State columns. The Backups tab is fully AG-aware.

## Alerts That Actually Help

The alerts page was... not great. It was dumping raw JSON from `dbo.Alerts` into a list. If you've ever looked at a wall of `{"InstanceID":42,"ErrorDate":"2026-03-12T...",...}` and tried to figure out what went wrong, you know the pain.

The new version combines two data sources: `CollectionErrorLog` (actual collection errors) and `JobHistory` (failed jobs from the last 48 hours). Each alert shows the instance name, a readable error message, severity (guessed from keywords — not perfect but useful), and a relative timestamp. There's a detail panel on the right where you can read the full error message and click through to the instance.

The severity filter strip at the top doubles as a KPI row — you immediately see "12 Critical, 3 Warning, 8 Info" and can click to filter. There's also a "per server" breakdown in the sidebar showing which instances are generating the most noise.

## AG Page Search

Small feature, big impact. The AlwaysOn Availability Groups page now has a search box that filters across server names, AG names, and database names. When you have 10+ clusters with dozens of databases each, being able to type "ASES" and immediately see only the matching AG with its databases expanded — that's just nice to have.

## The DBA Dash Schema

Working directly against the DBA Dash database taught us a lot about the schema. A few things that might save someone else some debugging time:

- `dbo.Databases.recovery_model` is a TINYINT (1=FULL, 2=BULK_LOGGED, 3=SIMPLE), not the `_desc` NVARCHAR variant
- `dbo.CPU` has `SQLProcessCPU` and `SystemIdleCPU` but no `SystemCPU` column — you calculate it as `100 - SystemIdleCPU - SQLProcessCPU`
- The table is called `dbo.DBIOStats`, not `dbo.IOStats`
- `dbo.AvailabilityGroups` uses `name`, not `group_name`
- `dbo.AvailabilityReplicas` (not `AvailabilityGroupReplicas`) doesn't store `role_desc`
- Status values across Summary_Get: 1=OK, 2=Warning, 3=N/A, 4=Critical — and 3 should almost never trigger an alert

We verified all of this against the [DBA Dash source on GitHub](https://github.com/trimble-oss/dba-dash). When in doubt, read the source — the schema definitions in the repo are the ground truth.

## What's Next

There's still plenty to do. About 20 pages could benefit from smarter auto-refresh (delta queries instead of full reloads). We want to add CSV/Excel export to every table. SignalR for real-time push updates instead of polling. PDF reports on a schedule. Mobile-optimized views for the on-call DBA checking their phone at 2 AM.

But honestly, even right now it's genuinely useful. We use it daily to check on our fleet, and the NOC display runs the SQL Monitor page full-time.

## Thanks

Huge thanks to the [DBA Dash](https://github.com/trimble-oss/dba-dash) team and [David Wiseman](https://github.com/DavidWiseman) for building such a solid foundation. The data collection, the stored procedures, the schema — it's all well thought out and consistent. Building a web frontend on top of it was remarkably smooth precisely because the underlying tool is so well engineered.

If you're running SQL Server at any scale and not using DBA Dash, seriously, go check it out at [dbadash.com](https://dbadash.com).

DBA Dash WebView is open source under MIT: **[github.com/BenediktSchackenberg/dbadashwebview](https://github.com/BenediktSchackenberg/dbadashwebview)**

---

*Previously: [We Built a Web UI for DBA Dash — and It's Free](/2026-03-05-dba-dash-webview)*
