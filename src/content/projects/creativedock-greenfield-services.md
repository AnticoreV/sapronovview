---
title: "Three services in three months"
description: "Ticketing, booking and subscription services in Kotlin and Spring Boot, built from scratch in a scoped three-month engagement — with CI queue times cut from hours to minutes."
date: 2026-06-01
featured: true
status: completed
category: professional
technologies:
  - Kotlin
  - Spring Boot
  - SpringMockK
  - Testcontainers
  - GitLab CI
  - Kubernetes
  - Argo CD
  - AWS S3
  - AWS SQS
  - CloudWatch
role: "Kotlin Backend Developer · freelance"
organization: "CreativeDock s.r.o."
timeframe: "2026"
order: 5
---

## Overview

A scoped three-month freelance engagement at CreativeDock: three Kotlin/Spring Boot microservices built from the ground up — ticketing, booking and subscription — plus the CI and deployment plumbing needed to ship them reliably.

## What I built

- **Three greenfield services.** Ticketing, booking and subscription, with their service APIs and contracts defined up front. I led the architecture decisions for the engagement.
- **Tests against real dependencies.** SpringMockK and Testcontainers for reliable integration coverage.

## CI that keeps up

The existing GitLab CI pipeline had stalled builds. I diagnosed them and expanded runner capacity, which cut build queue times **from hours to minutes**, and added a dedicated build-verification phase.

## Running in production

- Kubernetes workloads operated and monitored through Argo CD, with automated sync keeping deployments consistent with the desired state.
- An existing AWS environment — S3 for image storage, SQS for messaging, CloudWatch for logs — with improvements shipped to running production services.

## Results

- Three services from zero in three months.
- CI build queues from **hours to minutes**.
