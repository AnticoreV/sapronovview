---
title: "Paymont wallet"
description: "Backend and web frontend for a payment wallet: a Java service packaged with Docker Compose, and a TypeScript client for account and transaction management."
date: 2025-01-01
featured: false
status: paused
category: personal
technologies: ["Java", "Gradle", "Docker", "TypeScript"]
github: https://github.com/AnticoreV/paymont-wallet-be
links:
  - label: "Frontend repository"
    href: https://github.com/AnticoreV/paymont-wallet-fe
role: "Fullstack engineer"
timeframe: "[YEAR]"
order: 40
placeholder: true
---

## Overview

Paymont is a payment wallet split into two repositories: a **Java backend** (Gradle, Dockerised with a Compose stack for local development) and a **TypeScript frontend** for day-to-day account and transaction management.

## Problem

[What was the wallet meant to solve? Personal finance, a client's payment flow, an experiment in ledger design?]

## Context

[Solo project or team? Timeline? Any regulatory constraints?]

## My role

I built both sides of the stack: the API and persistence layer on the backend, and the client application on the frontend.

## Technical approach

- [Backend: framework, persistence, how balances and transactions are modelled.]
- [Frontend: framework, state management, how it talks to the API.]
- Local development runs entirely through `docker compose up`.

## Architecture

[Describe the services and how money movement is represented — e.g. double-entry ledger, idempotent transfers.]

## Challenges

[Consistency of balances, idempotency, error handling…]

## Decisions & trade-offs

[e.g. Why Gradle over Maven, why a separate frontend repo.]

## Results

[Real outcomes only.]

## Lessons learned

[What you would do differently.]
