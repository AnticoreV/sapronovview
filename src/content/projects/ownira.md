---
title: "Ownira"
description: "A compliance operations inbox for official Czech data-box mail (datová schránka): every message becomes tracked work for accounting and tax practices. In pilot."
summary: "Tracks official Czech data-box mail for accounting and tax practices. I build the product, the architecture and the full stack."
tagline: "Data-box mail with an owner and a deadline."
domain: "ownira.cz"
facts:
  - label: "For"
    value: "Accounting and tax practices in Czechia"
  - label: "My role"
    value: "Founder: product, architecture, full stack"
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
# Start date not confirmed yet; stays hidden until filled in.
timeframe: "[2025–present]"
order: 1
---

## Overview

Ownira turns official Czech data-box mail (the _datová schránka_, ISDS) into tracked work: cases, tasks, deadlines, comments, labels and approvals, with outbound replies and delivery tracking, notifications and an append-only audit trail.

I'm building it for accounting and tax practices that look after their clients' data boxes, and it's in pilot now.

## The problem

A practice can run the data boxes of dozens of clients, and the deadlines often live in a spreadsheet. An unread message counts as delivered on the tenth day, and the statutory clock starts whether or not anyone looked in the mailbox. Ownira gives every message a named owner, a tracked deadline and an audit trail. It also flags a message that is still waiting before the ten days run out, without opening it.

## My role

Founder: product, architecture and the full stack.

## Architecture

- Eight Spring Boot services in Kotlin 2.2 on Java 21 (Spring Boot 4), each deployed on its own behind one API gateway; every service that stores data has its own PostgreSQL database with Flyway migrations.
- Services talk asynchronously over Amazon SQS, and documents live in S3.
- Keycloak handles identity over OpenID Connect.
- AI suggestions stay advisory until a person accepts them.
- The React and TypeScript single-page app talks only to the gateway.
- Testcontainers runs the integration tests, Terraform describes the messaging infrastructure and GitHub Actions runs CI.

## For investors and partners

[Write to me](/contact?topic=investing) for the current stage and plans.
