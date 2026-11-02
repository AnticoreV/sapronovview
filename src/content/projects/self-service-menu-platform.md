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
timeframe: "2025–2026"
order: 4
---

## Overview

Part of a large distributed retail platform at NCR Voyix serving around two million users. I designed and maintained the JVM microservices that feed the client-facing applications, and built an Angular platform that lets US-market clients update their menus through self-service.

## Problem

Menu updates went through a manual process: clients requested changes and someone applied them, which was slow for clients and expensive to operate. On the backend, client applications needed data from many downstream services, and each consumer stitching that together on its own led to duplicated logic and inconsistent responses.

## My role

Senior fullstack engineer: microservice design and maintenance on the backend, the Angular self-service product on the frontend, production operations on GCP, and technical direction through code review and architecture input.

## Goals

- Replace the manual menu update process with self-service for clients.
- Give client applications one consistent, purpose-built API instead of many downstream calls.
- Run the services in production with full observability.

## Technical approach

- A Java/Spring backend-for-frontend shaped around what the client applications need, so the frontend stays simple and the downstream topology can change without breaking it.
- An aggregator service that combines data from up to **8 downstream services** into one response.
- An Angular self-service platform with dynamic menu customisation and the workflows US-market clients need to publish their own changes.
- Metrics, logging and alerting for every service on GCP, so we catch incidents before clients notice.
- LLM and agentic tooling, including MCP integrations, to automate test scaffolding and internal data lookups.

## Challenges

Consolidating eight downstream services means eight ways to be slow or unavailable. The aggregator had to degrade gracefully and stay observable enough to tell which dependency was the problem.

## Decisions & trade-offs

- A BFF adds a network hop but removes coupling, and the extra service pays off when the frontend has to evolve independently of a large distributed backend.
- Self-service moves responsibility to the clients, so guardrails and validation in the platform matter more than raw flexibility.

## Results

- US-market clients can update menus themselves, **replacing the manual update process**.
- Client applications consume one aggregated API instead of integrating with up to eight services.
- Services run on GCP with full metrics, logging and alerting for a system serving **~2 million users**.

## Lessons learned

In a system this size I treat observability as part of each feature from the first commit. The LLM tooling paid off most on scaffolding and data lookups, the routine work that slows a team down.
