---
title: "Self-service menu platform"
description: "Angular platform that lets US-market restaurant clients customise their menus themselves, on top of Java/Spring backend-for-frontend and aggregator services in a system serving ~2 million users."
date: 2025-09-01
featured: true
status: completed
category: professional
technologies:
  - Java
  - Spring
  - Microservices
  - Angular
  - GCP
  - Observability
  - LLM tooling
  - MCP
role: "Senior Fullstack Engineer"
organization: "NCR Voyix a.s."
timeframe: "2025 — 2026"
order: 4
---

## Overview

Part of a large distributed retail platform at NCR Voyix serving around two million users. I designed and maintained the JVM microservices that feed the client-facing applications, and built an Angular platform that lets US-market clients update their menus through self-service.

## Problem

Menu updates went through a manual process: clients requested changes and someone applied them. That was slow for clients and expensive to operate. On the backend, client applications needed data from many downstream services, and each consumer stitching that together on its own led to duplicated logic and inconsistent responses.

## My role

Senior fullstack engineer: microservice design and maintenance on the backend, the Angular self-service product on the frontend, production operations on GCP, and technical direction through code review and architecture input.

## Goals

- Replace the manual menu update process with self-service for clients.
- Give client applications one consistent, purpose-built API instead of many downstream calls.
- Run the services in production with full observability.

## Technical approach

- **Backend-for-Frontend.** A Java/Spring BFF tailored to what the client applications actually need, so the frontend stays simple and the downstream topology can change without breaking it.
- **Aggregator service.** Consolidates data from up to **8 downstream services** into a single coherent response.
- **Angular self-service platform.** Dynamic menu customisation with the workflows US-market clients need to publish their own changes.
- **GCP with production observability.** Metrics, logging and alerting for every service, so incidents are caught before clients notice.
- **AI tooling for the routine work.** LLM and agentic tooling, including MCP integrations, to automate test scaffolding and internal data lookups.

## Challenges

Consolidating eight downstream services means eight ways to be slow or unavailable. The aggregator had to degrade gracefully and stay observable enough to tell which dependency was the problem.

## Decisions & trade-offs

- **A BFF adds a hop but removes coupling.** The extra service is worth it when it lets the frontend evolve independently of a large distributed backend.
- **Self-service shifts responsibility to clients.** Guardrails and validation in the platform matter more than raw flexibility.

## Results

- US-market clients can update menus themselves, **replacing the manual update process**.
- Client applications consume one aggregated API instead of integrating with up to eight services.
- Services run on GCP with full metrics, logging and alerting for a system serving **~2 million users**.

## Lessons learned

In a system this size, observability is a feature, not an afterthought. And the fastest way to speed up a team is to automate its scaffolding and lookups, which is where the LLM tooling paid off.
