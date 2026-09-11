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

Every new form type was a development task: new components, new validation rules, new backend handling. Creating one took days, and small variations between forms meant inconsistent behaviour for users and duplicated code for the team.

## My role

I owned both sides of the stack: the Angular engine and component library on the frontend, and the Java/Kotlin services behind it, including the integration contract between them.

## Goals

- Reduce the time to create a new form type from days to hours.
- Support conditional validation and real-time updates without custom code per form.
- Keep the admin panel and the customer-facing app visually and behaviourally consistent.

## Technical approach

- **Engine in Angular.** Forms are described by customisable templates; the engine renders fields, applies conditional validation and updates dependent fields in real time as users type.
- **Reusable component library.** A set of strongly-typed Angular components and shared services used across both the admin panel and the customer app, so new forms inherit consistent behaviour by default.
- **Backend services in Java/Spring.** Scalable services handle the complex form-processing and submission logic, exposed through well-structured REST APIs.
- **Contracts first.** Versioned REST contracts documented with OpenAPI/Swagger, plus secure authentication between the Angular frontend and the Spring backend.

## Challenges

The performance-critical backend paths made several independent downstream calls in sequence. I refactored those services from Java to Kotlin and used coroutines to run the independent calls concurrently.

## Decisions & trade-offs

- **Templates over code.** Encoding form behaviour in templates costs some flexibility for truly unusual forms, but it turned a development task into a configuration task for the common case.
- **Kotlin for the hot paths only.** Rather than rewriting everything, only the latency-sensitive services moved to Kotlin, keeping the migration risk contained.

## Results

- New form types went from **days to hours** to create.
- Concurrent downstream calls with coroutines **roughly halved p95 latency** under peak load.
- Consistency and code reuse improved across the admin panel and the customer-facing app.

## Lessons learned

Most of the value came from the boring parts: a good component library and a clean, versioned contract between frontend and backend. The engine itself was the smaller half of the work.
