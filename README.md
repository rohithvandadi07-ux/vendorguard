# VendorGuard 🛡️

<div align="center">

![VendorGuard Banner](https://img.shields.io/badge/VendorGuard-Cybersecurity%20Intelligence-6C47FF?style=for-the-badge)

### AI-Augmented Vendor Security Intelligence Platform

VendorGuard is a modern cybersecurity platform designed to assess the security posture of third-party vendors, domains, and external infrastructure before organizational integration.

Built as a production-style full-stack cybersecurity SaaS platform using FastAPI, React, PostgreSQL, Docker, and modern security analysis workflows.

![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-success?style=flat-square)

</div>

---

# 🚀 Overview

Modern organizations heavily depend on third-party vendors, SaaS providers, APIs, and external services. A single insecure vendor can become an entry point for major cyberattacks.

VendorGuard helps security teams proactively evaluate vendor security posture by automatically analyzing:

- SSL/TLS configurations
- DNS & WHOIS intelligence
- Security headers
- Open ports
- Infrastructure exposure
- Threat reputation signals
- Vendor risk severity

The platform then generates a consolidated cybersecurity risk score and severity classification for rapid assessment and decision-making.

---

# ✨ Core Features

## 🔍 Vendor Security Scanning
Perform automated reconnaissance and security analysis against domains and external infrastructure.

### Included Security Checks
- DNS & WHOIS Analysis
- SSL/TLS Certificate Inspection
- Security Header Validation
- Open Port Detection
- Reputation Intelligence Checks
- Infrastructure Exposure Analysis

---

## 📊 Risk Scoring Engine
VendorGuard calculates a unified vendor risk score ranging from:

| Score Range | Severity |
|---|---|
| 0 – 25 | Low |
| 26 – 50 | Medium |
| 51 – 75 | High |
| 76 – 100 | Critical |

The scoring engine combines results from multiple scanners into a centralized security posture assessment.

---

## 📈 Interactive Dashboard
Modern cyber-themed dashboard with:

- Real-time scan metrics
- Vendor risk analytics
- Security trends visualization
- Scan history tracking
- Severity indicators

---

## 🔐 Authentication & Security
- JWT-based authentication
- Secure password hashing
- Protected API routes
- Token-based session management

---

## 🐳 Containerized Infrastructure
Fully Dockerized architecture for:

- Easy deployment
- Environment consistency
- Local development
- Production portability

---

# 🛠️ Technology Stack

## Backend
- Python 3.11
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Passlib

## Frontend
- React
- Vite
- TailwindCSS
- Axios
- Recharts

## Infrastructure
- Docker
- Docker Compose

---

# 🏗️ System Architecture

```text
Frontend (React + Tailwind)
            │
            ▼
Backend API (FastAPI)
            │
 ┌──────────┼──────────┐
 ▼          ▼          ▼
Scanners  Risk Engine  Auth System
            │
            ▼
     PostgreSQL Database
