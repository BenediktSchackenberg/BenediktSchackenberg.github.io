---
title: "Building an Endpoint Management Platform from Scratch"
date: 2026-02-08 22:00:00 +0100
tag: openclaw
headerimage: /assets/images/openclaw-inventory-robots.jpg
description: "How I built OpenClaw Inventory - an open-source endpoint management platform for Windows fleets. Complete setup guide included."
---

I got tired of manually checking what's installed on my Windows machines. SSH into one, run some commands, note it down somewhere, repeat for the next one. You know the drill.

So I built something better.

## The Problem

I have about a dozen Windows machines scattered around my network. Some are workstations, some are servers, one is a test rig that I keep breaking and rebuilding. Keeping track of what's running on each one was becoming a nightmare.

Commercial solutions like SCCM or Intune exist, but they're either expensive, overcomplicated, or both. I wanted something lightweight that I could self-host and actually understand.

## What I Built

OpenClaw Inventory is an endpoint management platform that does a few things really well:

- **Collects hardware and software inventory** automatically from Windows machines
- **Deploys software** remotely (MSI/EXE with silent install flags)
- **Runs commands** on any machine from a central dashboard
- **Groups devices** however you want
- **Tracks security status** - firewall, BitLocker, UAC, local admins

It's basically what I wished existed when I started managing multiple Windows boxes.

## Architecture

The setup has four main pieces:

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Dashboard (Next.js)                   │
│         http://your-server:3000                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (FastAPI)                      │
│         http://your-server:8080                              │
│         • Inventory storage (PostgreSQL + TimescaleDB)       │
│         • Job queue and execution tracking                   │
│         • Package catalog                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   OpenClaw Gateway                           │
│         http://your-server:18789                             │
│         • Node communication hub                             │
│         • Command routing                                    │
└─────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
      ┌──────────┐      ┌──────────┐      ┌──────────┐
      │ Windows  │      │ Windows  │      │ Windows  │
      │  Agent   │      │  Agent   │      │  Agent   │
      │  (PC 1)  │      │  (PC 2)  │      │  (PC N)  │
      └──────────┘      └──────────┘      └──────────┘
```

The Windows agents are .NET 8 services that run in the background and report back to the gateway. The backend stores everything in PostgreSQL with TimescaleDB for time-series data. The frontend is a Next.js dashboard that makes it all usable.

## Prerequisites

Before we start, you'll need:

| Component | Version | Purpose |
|-----------|---------|---------|
| Ubuntu Server | 22.04+ | Host OS |
| PostgreSQL | 16+ | Database |
| TimescaleDB | 2.x | Time-series extension |
| Python | 3.12+ | Backend API |
| Node.js | 20+ | Frontend dashboard |
| OpenClaw Gateway | Latest | Node communication |

I'm running all of this on a single Ubuntu box, but you could split it up if you wanted to.

## Step 1: Database Setup

TimescaleDB is PostgreSQL with superpowers for time-series data. We'll use it to store inventory snapshots and job history efficiently.

```bash
# Add the TimescaleDB repository
sudo apt install -y gnupg postgresql-common apt-transport-https lsb-release wget
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y

echo "deb https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main" \
  | sudo tee /etc/apt/sources.list.d/timescaledb.list

wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo apt-key add -
sudo apt update

# Install PostgreSQL 16 with TimescaleDB
sudo apt install -y postgresql-16 timescaledb-2-postgresql-16

# Let TimescaleDB tune itself
sudo timescaledb-tune --quiet --yes
sudo systemctl restart postgresql

# Create the database
sudo -u postgres psql -c "CREATE USER openclaw WITH PASSWORD 'your-secure-password';"
sudo -u postgres psql -c "CREATE DATABASE inventory OWNER openclaw;"
sudo -u postgres psql -d inventory -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
```

Pick a real password. Don't use `your-secure-password`. I know you were about to.

## Step 2: Backend

The backend is a FastAPI app that handles all the API endpoints and database operations.

```bash
# Clone the repo
git clone https://github.com/BenediktSchackenberg/openclaw-windows-agent.git
cd openclaw-windows-agent

# Set up Python environment
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure the database connection
export DATABASE_URL="postgresql://openclaw:your-secure-password@localhost:5432/inventory"

# Start the backend
uvicorn main:app --host 0.0.0.0 --port 8080
```

For production, you'll want a systemd service so it starts on boot:

```bash
sudo tee /etc/systemd/system/openclaw-inventory.service << 'EOF'
[Unit]
Description=OpenClaw Inventory API
After=network.target postgresql.service

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/openclaw-windows-agent/backend
Environment="DATABASE_URL=postgresql://openclaw:your-secure-password@localhost:5432/inventory"
ExecStart=/path/to/openclaw-windows-agent/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8080
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now openclaw-inventory
```

Replace the paths and credentials with your actual values.

## Step 3: Frontend

The dashboard is a Next.js app. Pretty standard stuff.

```bash
cd ../frontend
npm install

# For development
npm run dev

# For production
npm run build
npm start
```

Production systemd service:

```bash
sudo tee /etc/systemd/system/openclaw-inventory-ui.service << 'EOF'
[Unit]
Description=OpenClaw Inventory UI
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/openclaw-windows-agent/frontend
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now openclaw-inventory-ui
```

## Step 4: Gateway

The OpenClaw Gateway is the communication hub. It handles the connection between the backend and all your Windows agents.

```bash
# Install OpenClaw
npm install -g openclaw

# Initialize config
openclaw init

# Edit the config
nano ~/.openclaw/openclaw.json
```

Here's a minimal config that works:

```json
{
  "gateway": {
    "bind": "lan",
    "port": 18789
  },
  "auth": {
    "mode": "token",
    "tokens": ["your-secret-token-here"]
  },
  "nodes": {
    "enabled": true,
    "allowCommands": ["*"]
  }
}
```

Generate a proper token. Something like `openssl rand -hex 24` works.

```bash
# Start the gateway
openclaw gateway start
```

## Step 5: Firewall

Open the ports you need:

```bash
sudo ufw allow 3000/tcp    # Frontend
sudo ufw allow 8080/tcp    # Backend API
sudo ufw allow 18789/tcp   # Gateway
```

## Step 6: Verify Everything Works

Quick sanity check:

| Service | URL | What you should see |
|---------|-----|---------------------|
| Frontend | `http://your-server:3000` | Dashboard loads |
| Backend API | `http://your-server:8080/docs` | Swagger UI |
| Gateway | `http://your-server:18789` | Connection accepted |

If any of these don't work, check systemd logs with `journalctl -u service-name -f`.

## Installing Windows Agents

Now for the fun part. On each Windows machine you want to manage, run this in an elevated PowerShell prompt:

```powershell
irm https://raw.githubusercontent.com/BenediktSchackenberg/openclaw-windows-agent/main/installer/Install-OpenClawAgent.ps1 -OutFile Install.ps1
.\Install.ps1 -GatewayUrl "http://YOUR-SERVER-IP:18789" -GatewayToken "your-secret-token-here"
```

The installer downloads the agent, verifies its hash, installs it to Program Files, and registers a Windows service. Takes about 30 seconds.

To update existing agents, just run the installer again - it preserves your config and only replaces the binary.

## A Note About Admin Rights

The agent needs admin rights for some features:

| Feature | Needs Admin |
|---------|-------------|
| MSI/EXE software installation | Yes |
| Windows Update operations | Yes |
| BitLocker status | Yes |
| Security Event Log | Yes |
| Basic inventory (CPU, RAM, software list) | No |

I recommend running the service as Local System or a dedicated admin service account.

## What's Next

Once everything's running, your Windows machines will start showing up in the dashboard. From there you can:

- Browse hardware and software inventory
- Deploy packages to devices or groups
- Run arbitrary commands
- Organize devices into groups

I'm still adding features - event log collection and a software vulnerability dashboard are on the roadmap. Check the [GitHub repo](https://github.com/BenediktSchackenberg/openclaw-windows-agent) if you want to follow along or contribute.

## Links

- [GitHub Repository](https://github.com/BenediktSchackenberg/openclaw-windows-agent)
- [OpenClaw Gateway](https://github.com/openclaw/openclaw)
- [Documentation](https://docs.openclaw.ai)
- [Discord Community](https://discord.com/invite/clawd)
