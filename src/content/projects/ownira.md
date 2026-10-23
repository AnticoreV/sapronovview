---
title: "Ownira"
description: "A compliance operations inbox for official Czech data-box mail (datová schránka): every message becomes tracked work for accounting and tax practices. In pilot."
summary: "Official Czech data-box mail under control for accounting and tax practices. Product, architecture and the full stack."
tagline: "From datová schránka to done."
domain: "ownira.cz"
date: 2026-06-01
featured: true
status: pilot
category: professional
technologies:
  - Kotlin
  - Java 21
  - Spring Boot
  - PostgreSQL
  - Flyway
  - AWS SQS
  - AWS S3
  - Keycloak (OIDC)
  - Testcontainers
  - Terraform
  - GitHub Actions
  - React
  - TypeScript
role: "Founder"
organization: "Ownira"
# Start date not confirmed yet — stays hidden until filled in.
timeframe: "[2025 — present]"
order: 1
---

## Overview

Ownira keeps official Czech data-box mail — the _datová schránka_ (ISDS) — under control. Official messages and their attachments become tracked work: cases, tasks, deadlines, comments, labels and approvals, with outbound replies and delivery tracking, notifications and an append-only audit trail.

It is built for accounting and tax practices that look after their clients' data boxes. Ownira is in pilot.

## The problem

A practice can run the data boxes of dozens of clients, and the deadlines often live in a spreadsheet. An unread message counts as delivered on the tenth day, and the statutory clock starts whether or not anyone looked in the mailbox. Ownira gives every message a named owner, a tracked deadline and an audit trail — and flags a message that is still waiting before the ten days run out, without opening it.

## My role

Founder: product, architecture and the full stack.

## Architecture

- **Backend.** Kotlin 2.2 on Java 21 with Spring Boot 4: eight independently deployable Spring Boot services behind a single API gateway, one PostgreSQL database per service with Flyway migrations.
- **Async first.** Services talk over Amazon SQS; documents are stored in S3.
- **Identity.** Keycloak with OpenID Connect.
- **AI under human review.** AI suggestions are advisory until a person accepts them.
- **Frontend.** A React and TypeScript single-page app that talks only to the gateway.
- **Delivery.** Integration tests with Testcontainers, Terraform for the messaging infrastructure, CI on GitHub Actions.

## For investors and partners

Stage, progress and plans — [let's talk](/contact?topic=investing).
