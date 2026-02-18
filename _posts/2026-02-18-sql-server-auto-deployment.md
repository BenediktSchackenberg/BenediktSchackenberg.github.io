---
layout: post
title: "Automating SQL Server Deployments with Octofleet 🐙"
date: 2026-02-18
tags: [octofleet, sql-server, automation, devops, infrastructure]
cover-img: /assets/images/octofleet-sql-deployment.png
thumbnail-img: /assets/images/octofleet-sql-deployment.png
description: "No more manual SQL Server installations. Octofleet now handles disk preparation, storage configuration, and silent installation automatically. Deploy database servers in minutes, not hours."
---

# Automating SQL Server Deployments with Octofleet

![Octofleet SQL Server Deployment](/assets/images/octofleet-sql-deployment.png){: .mx-auto.d-block :}

Ever spent hours manually installing SQL Server on a new machine? Creating the right disk partitions, configuring storage for optimal performance, running through the setup wizard... again and again for each new database server?

I've been there. Too many times.

That's why I built automated SQL Server deployment into Octofleet.

---

## The Problem

Setting up a proper SQL Server installation isn't just clicking "Next" a few times. You need:

- Separate drives for Data, Logs, and TempDB (nobody wants all their eggs in one basket)
- 64KB allocation units for NTFS (SQL Server's sweet spot)
- Proper folder structure
- The actual installation with correct settings
- Post-install configuration

Do that across a dozen servers and you've lost a day. Do it wrong once, and you're troubleshooting performance issues for weeks.

## The Solution

With Octofleet, deploying SQL Server is now a three-step process:

1. Assign a SQL Server edition to a node in the dashboard
2. The system automatically prepares disks (or detects existing ones)
3. SQL Server installs itself with best-practice configuration

That's it. The agent handles everything:

- **Disk Preparation**: Automatically detects unconfigured disks, initializes them as GPT, formats with 64KB allocation units, and creates the proper folder structure (D:\Data, E:\Logs, F:\TempDB)
- **Drive Letter Management**: If your CD-ROM is hogging drive letter D, it gets politely moved aside
- **Smart Disk Assignment**: Got three disks? Largest goes to Data, smallest to Logs, middle to TempDB. Two disks? We'll share intelligently. One disk? We make it work.
- **Silent Installation**: SQL Server installs in the background with sane defaults

## Under the Hood

The magic happens through Octofleet's job system. When you create a SQL Server assignment, the MSSQL reconciler kicks in:

```
Assignment Created
      ↓
Reconciler detects new assignment
      ↓
Creates "Disk Prep" job → Agent runs PowerShell script
      ↓
Creates "Install SQL Server" job → Agent downloads & installs
      ↓
Node reports installed instance back to inventory
```

Each step is fully logged, can be monitored in real-time, and failures trigger automatic retries with exponential backoff.

## What's Next

This is just the beginning. Single-instance deployment is live now, but the roadmap includes:

- **AlwaysOn Availability Groups**: Automated cluster setup
- **Multi-Instance Support**: Different editions on the same box
- **Configuration Templates**: Save and reuse your preferred settings
- **Backup Integration**: Automated backup schedules right after install

## Try It Yourself

Octofleet is open source. Grab it from GitHub, spin up the Docker stack, and deploy your first SQL Server in minutes instead of hours:

```bash
git clone https://github.com/BenediktSchackenberg/octofleet.git
cd octofleet
docker compose up -d
```

The Windows agent auto-updates itself (yes, really — it pulls new versions directly from GitHub Releases), so once you've got it installed, you're always on the latest version.

---

*Octofleet v0.4.50: Now with SQL Server auto-deployment. Reach every endpoint in your fleet — even the database servers.* 🐙

**[Check it out on GitHub →](https://github.com/BenediktSchackenberg/octofleet)**
