---
title: "Dynamic form engine"
description: "Angular form engine with conditional validation, real-time updates and customisable templates, backed by Java/Kotlin services. Cut the effort to create new form types from days to hours."
date: 2024-06-01
featured: true
status: completed
category: professional
technologies:
  - Angular
  - RxJS
  - TypeScript
  - Java
  - Kotlin
  - Kotlin Coroutines
  - Spring
  - REST
  - OpenAPI / Swagger
role: "Fullstack Engineer"
organization: "CCA Group a.s."
timeframe: "2024"
order: 3
---

## Overview

A configurable form engine for an admin panel and a customer-facing application at CCA Group. Instead of hand-building each new form, operators compose forms from templates, and the engine handles rendering, validation and submission end to end.

## Problem

Every new form type was a development task that needed its own components, validation rules and backend handling. Creating one took days, and small variations between forms meant inconsistent behaviour for users and duplicated code for the team.

## My role

I owned both sides of the stack: the Angular engine and component library on the frontend, and the Java/Kotlin services behind it, including the integration contract between them.

## Goals

- Reduce the time to create a new form type from days to hours.
- Support conditional validation and real-time updates without custom code per form.
- Keep the admin panel and the customer-facing app visually and behaviourally consistent.

## Technical approach

- An Angular engine that renders fields from customisable templates, applies conditional validation and updates dependent fields in real time as users type.
- A library of strongly-typed Angular components and shared services used by both the admin panel and the customer app, so a new form behaves the same in both by default.
- Java/Spring services that handle form processing and submission behind REST APIs.
- Versioned REST contracts documented with OpenAPI/Swagger, and authenticated calls between the Angular frontend and the Spring backend.

## Challenges

The latency-sensitive backend paths made several independent downstream calls in sequence. I refactored those services from Java to Kotlin and used coroutines to run the independent calls concurrently.

## Decisions & trade-offs

- Templates cost some flexibility for unusual forms, but they turned a development task into a configuration task for the common case.
- I moved only the latency-sensitive services to Kotlin instead of rewriting everything, which kept the migration risk small.

## Results

- New form types went from **days to hours** to create.
- Concurrent downstream calls with coroutines **roughly halved p95 latency** under peak load.
- The admin panel and the customer-facing app share one component library.

## Lessons learned

Most of the value came from the boring parts: a solid component library and a versioned contract between frontend and backend. The engine itself was the smaller half of the work.
