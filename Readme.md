# Identity Risk Score Engine

**Bank of Baroda Hackathon 2026 — Cybersecurity & Fraud Domain**
**Theme: Identity Trust, Protection & Safety**

## Problem Statement

Banks need to continuously validate whether a login or account-recovery attempt
is genuinely coming from the legitimate account holder, or whether it shows signs
of account takeover, identity compromise, or fraudulent recovery.

## Our Approach

This project implements an **Identity Risk Score Engine** that evaluates each
login/account-recovery attempt against a set of behavioral and contextual signals,
assigns a risk score, classifies the attempt as **LOW / MEDIUM / HIGH** risk, and
generates a plain-English explanation of *why* it was flagged — making the system
explainable and audit-friendly for compliance teams.

### Signals currently used
- Device recognition (known vs. new/unrecognized device)
- Location recognition (known vs. unfamiliar location/IP)
- Time-of-day pattern (login during unusual hours)
- Recent failed login / recovery attempts (possible brute force or credential stuffing)

### Output
For each login attempt, the engine outputs:
- A numeric risk score
- A risk level (LOW / MEDIUM / HIGH)
- A plain-English explanation of which signals triggered the flag
- A recommended action (allow / step-up verification / block & alert)

## How to Run

```bash
git clone https://github.com/drstone1109/identity-risk-engine.git
cd identity-risk-engine
python3 risk_engine.py
```

No external dependencies required for this prototype — pure Python standard library.

## Project Roadmap

- [x] **v0.1 (current):** Rule-based risk scoring engine with synthetic login data
- [ ] **v0.2:** Larger synthetic dataset (CSV-based) covering more user behavior patterns
- [ ] **v0.3:** Flask-based dashboard to visualize flagged login attempts in real time
- [ ] **v0.4:** Replace templated explanations with a local LLM (LLaMA 3 via Ollama)
      that generates natural-language fraud-analyst explanations
- [ ] **v0.5:** Telegram-based alerting for HIGH risk events
- [ ] **v1.0:** Full prototype demo for jury evaluation

## Why This Approach

- **Explainability first:** Most fraud-detection demos output a black-box score.
  Banks need to justify decisions to regulators (RBI compliance), so every flag
  comes with a human-readable reason.
- **Low-cost & self-hostable:** Built entirely with open-source tooling and local
  models — no dependency on paid third-party APIs, making it realistic for
  smaller financial institutions to adopt.
- **Incremental complexity:** Starts as a transparent rule-based system (easy to
  audit and tune), with a clear path to ML-based anomaly detection as more data
  becomes available.

## Team

- Akshit (B.Tech CSE, TIET Patiala)
- Hrishit Arora (B.Tech CSE,IIIT UNA)

## License

MIT
