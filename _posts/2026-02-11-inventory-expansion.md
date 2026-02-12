---
layout: post
title: "7 Features, 1 Evening: The Inventory Gets Serious"
date: 2026-02-11
thumbnail-img: /assets/images/controller.png
tags: [openclaw, release, devops, dashboard]
---

Sometimes you sit down in the evening thinking "The dashboard could use more." Three hours later you've deployed seven new features and wonder if sleep is even a thing anymore.

![Controller](/assets/images/controller.png)

## What's New

**🛡️ Compliance Dashboard** — Finally see which machines have Defender disabled. Or no firewall. Or forgot BitLocker. Pie charts show the security status of the entire fleet. The red bars are red on purpose.

**📊 Software Compare** — Chrome on 30 machines in 12 different versions? Now you can find out which ones. Click a name, see all versions, feel ashamed of your patch management.

**📈 Eventlog Charts** — Trends over the last 7 days. Errors going up? Bad. Errors going down? Less bad. At least now you know.

**🥧 OS Distribution** — Pie chart on the dashboard. Windows 11 in blue, Windows 10 in purple, that one Windows Server 2019 in green. Colorful and surprisingly useful.

**📥 Export** — CSV or JSON, for nodes, software, or compliance. Dropdown in the navbar. Click, download, done. Your Excel will be happy.

**🌙 Dark Mode Toggle** — Because some people actually use Light Mode. I don't get it, but you do you.

## Backend

Six new endpoints:
- `/api/v1/eventlog/trends` — Aggregated errors per day
- `/api/v1/software/compare` — Version comparison
- `/api/v1/compliance/summary` — Security overview
- `/api/v1/nodes/os-distribution` — Who's running what
- `/api/v1/export/*` — Everything out to CSV/JSON

The `main.py` is slowly growing towards 5000 lines. Eventually I need to split it up. Today is not that day.

## The Workflow

Build component, TypeScript complains, `percent` could be `undefined`, push fix, build runs, restart services, refresh browser, works. Repeat.

Git says 1500+ lines changed. Felt like less.

## Why All This

Because an inventory system without a compliance overview is just a glorified host list. Because I want to know if my machines are secure without clicking through each one. Because charts look better than tables.

And because it's fun.

---

*Code: [github.com/BenediktSchackenberg/openclaw-windows-agent](https://github.com/BenediktSchackenberg/openclaw-windows-agent)*

*Live: http://192.168.0.5:3000 (if you're on the network)*
