---
title: "OpenClaw Inventory Platform - Complete Server Setup Guide"
date: 2026-02-08 22:00:00 +0100
tag: openclaw
headerimage: /assets/images/openclaw-inventory-robots.jpg
description: "Komplette Anleitung zur Installation der OpenClaw Inventory Platform - PostgreSQL, Backend, Frontend, Gateway und Windows Agent."
---

# 🖥️ OpenClaw Inventory Platform

Du willst wissen, was auf all deinen Windows-Rechnern installiert ist? Software remote ausrollen? Befehle auf 50 Maschinen gleichzeitig ausführen? Dann ist OpenClaw Inventory genau das Richtige.

## 🎯 Was ist das?

OpenClaw Inventory ist eine **Open-Source Endpoint Management Platform** für Windows-Flotten:

- 📊 **Hardware & Software Inventar** automatisch sammeln
- 📦 **Software deployen** (MSI/EXE mit Silent Install)
- 🎮 **Remote Commands** auf allen Maschinen ausführen
- 🏷️ **Geräte gruppieren** und organisieren
- 🔒 **Security-Status tracken** (Firewall, BitLocker, UAC, lokale Admins)

Think of it as a lightweight alternative to SCCM/Intune für kleinere Umgebungen, Labs oder Homelabs.

---

## 🏗️ Architektur

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

---

## 📋 Voraussetzungen

| Komponente | Version | Zweck |
|-----------|---------|---------|
| 🐧 **Ubuntu Server** | 22.04+ | Host OS |
| 🐘 **PostgreSQL** | 16+ | Datenbank |
| ⏱️ **TimescaleDB** | 2.x | Time-series Extension |
| 🐍 **Python** | 3.12+ | Backend API |
| 📦 **Node.js** | 20+ | Frontend Dashboard |
| 🔗 **OpenClaw Gateway** | Latest | Node-Kommunikation |

---

## 🚀 Step 1: PostgreSQL + TimescaleDB installieren

```bash
# TimescaleDB Repository hinzufügen
sudo apt install -y gnupg postgresql-common apt-transport-https lsb-release wget
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y

echo "deb https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main" \
  | sudo tee /etc/apt/sources.list.d/timescaledb.list

wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo apt-key add -
sudo apt update

# PostgreSQL 16 mit TimescaleDB installieren
sudo apt install -y postgresql-16 timescaledb-2-postgresql-16

# TimescaleDB aktivieren
sudo timescaledb-tune --quiet --yes
sudo systemctl restart postgresql

# Datenbank erstellen
sudo -u postgres psql -c "CREATE USER openclaw WITH PASSWORD 'dein-sicheres-passwort';"
sudo -u postgres psql -c "CREATE DATABASE inventory OWNER openclaw;"
sudo -u postgres psql -d inventory -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
```

---

## 🐍 Step 2: Backend Setup

```bash
# Repository klonen
git clone https://github.com/BenediktSchackenberg/openclaw-windows-agent.git
cd openclaw-windows-agent

# Python Virtual Environment
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Datenbank-Verbindung konfigurieren
export DATABASE_URL="postgresql://openclaw:dein-sicheres-passwort@localhost:5432/inventory"

# Backend starten
uvicorn main:app --host 0.0.0.0 --port 8080
```

### 🔧 Production: Systemd Service

```bash
sudo tee /etc/systemd/system/openclaw-inventory.service << 'EOF'
[Unit]
Description=OpenClaw Inventory API
After=network.target postgresql.service

[Service]
Type=simple
User=dein-user
WorkingDirectory=/pfad/zu/openclaw-windows-agent/backend
Environment="DATABASE_URL=postgresql://openclaw:dein-sicheres-passwort@localhost:5432/inventory"
ExecStart=/pfad/zu/openclaw-windows-agent/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8080
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now openclaw-inventory
```

---

## ⚛️ Step 3: Frontend Setup

```bash
cd ../frontend
npm install

# Development
npm run dev

# Production
npm run build
npm start
```

### 🔧 Production: Systemd Service

```bash
sudo tee /etc/systemd/system/openclaw-inventory-ui.service << 'EOF'
[Unit]
Description=OpenClaw Inventory UI
After=network.target

[Service]
Type=simple
User=dein-user
WorkingDirectory=/pfad/zu/openclaw-windows-agent/frontend
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now openclaw-inventory-ui
```

---

## 🔗 Step 4: OpenClaw Gateway

Der Gateway ist der Kommunikations-Hub zwischen Backend und Windows Agents.

```bash
# OpenClaw via npm installieren
npm install -g openclaw

# Konfiguration initialisieren
openclaw init

# Config bearbeiten
nano ~/.openclaw/openclaw.json
```

### Minimum Gateway Config

```json
{
  "gateway": {
    "bind": "lan",
    "port": 18789
  },
  "auth": {
    "mode": "token",
    "tokens": ["dein-geheimer-token"]
  },
  "nodes": {
    "enabled": true,
    "allowCommands": ["*"]
  }
}
```

```bash
# Gateway starten
openclaw gateway start
```

---

## 🔥 Step 5: Firewall konfigurieren

```bash
sudo ufw allow 3000/tcp    # Frontend
sudo ufw allow 8080/tcp    # Backend API
sudo ufw allow 18789/tcp   # Gateway (für Windows Agents)
```

---

## ✅ Step 6: Installation prüfen

| Service | URL | Erwartet |
|---------|-----|----------|
| 🌐 Frontend | `http://dein-server:3000` | Dashboard lädt |
| 📡 Backend API | `http://dein-server:8080/docs` | Swagger UI |
| 🔗 Gateway | `http://dein-server:18789` | Connection accepted |

---

## 💻 Windows Agent Installation

Jetzt können wir Agents auf den Windows-Maschinen installieren:

```powershell
# Als Administrator ausführen!
irm https://raw.githubusercontent.com/BenediktSchackenberg/openclaw-windows-agent/main/installer/Install-OpenClawAgent.ps1 -OutFile Install.ps1
.\Install.ps1 -GatewayUrl "http://DEIN-SERVER-IP:18789" -GatewayToken "dein-geheimer-token"
```

Der Installer macht automatisch:
1. ✅ Download des Agents von GitHub Releases
2. ✅ SHA256 Hash-Verifikation
3. ✅ Installation nach `C:\Program Files\OpenClaw\Agent`
4. ✅ Windows Service registrieren (Auto-Start)
5. ✅ Verbindung zum Gateway herstellen

### 🔄 Bestehende Agents updaten

```powershell
.\Install.ps1  # Behält Config, updated nur Binary
```

---

## ⚠️ Agent: Admin-Rechte

Der Windows Agent **sollte als Administrator laufen** für volle Funktionalität:

| Feature | Braucht Admin |
|---------|----------------|
| MSI/EXE Software-Installation | ✅ Ja |
| Windows Update Operationen | ✅ Ja |
| BitLocker Status | ✅ Ja |
| Security Event Log | ✅ Ja |
| Basis-Inventar (CPU, RAM, Software) | ❌ Nein |

**Empfehlung:** Service als `Local System` oder dedizierter Admin-Account laufen lassen.

---

## 🎉 Fertig!

Nach der Installation sollten die Windows-Maschinen im Dashboard erscheinen. Von dort aus kannst du:

- 📊 Hardware & Software Inventar einsehen
- 📦 Pakete auf Geräte oder Gruppen deployen
- 🎮 Remote Commands ausführen
- 🏷️ Geräte in Gruppen organisieren

---

## 🔗 Links

- [GitHub Repository](https://github.com/BenediktSchackenberg/openclaw-windows-agent)
- [OpenClaw Gateway](https://github.com/openclaw/openclaw)
- [Documentation](https://docs.openclaw.ai)
- [Discord Community](https://discord.com/invite/clawd)
