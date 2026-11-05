---
title: "Three services in three months"
description: "Ticketing, booking and subscription services in Kotlin and Spring Boot, built from scratch in a three-month engagement, plus CI queue times cut from hours to minutes."
date: 2026-06-01
featured: true
status: completed
category: professional
technologies:
  - Kotlin
  - Spring Boot
  - GraphQL
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

In a three-month freelance engagement at CreativeDock I built three Kotlin/Spring Boot microservices from scratch (ticketing, booking and subscription) and fixed the CI and deployment plumbing they shipped through.

## What I built

- Ticketing, booking and subscription services with GraphQL APIs (Spring for GraphQL), their schemas and contracts defined up front; I led the architecture decisions for the engagement.
- Integration tests against real dependencies with SpringMockK and Testcontainers.

## CI that keeps up

The existing GitLab CI pipeline had stalled builds. I diagnosed them, expanded runner capacity and added a dedicated build-verification phase, and build queue times dropped **from hours to minutes**.

## Running in production

- I ran the Kubernetes workloads through Argo CD, with automated sync keeping deployments in line with the desired state.
- I shipped improvements to running production services in the existing AWS environment: S3 for images, SQS for messaging and CloudWatch for logs.

## Results

- Three services from zero in three months.
- CI build queues down from **hours to minutes**.
