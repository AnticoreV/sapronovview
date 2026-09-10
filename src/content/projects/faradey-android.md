---
title: "Faradey for Android"
description: "Secure messenger built on the Matrix protocol, combining private communication with project management. I contributed a kanban board for task management in Kotlin."
date: 2024-01-01
featured: true
status: completed
category: open-source
technologies: ["Kotlin", "Android", "Matrix protocol", "Material Design"]
github: https://github.com/AnticoreV/Faradey-android
role: "Android developer"
organization: "[COMPANY / TEAM]"
timeframe: "[YEAR]"
order: 3
placeholder: true
---

## Overview

Faradey is an Android messenger that pairs end-to-end encrypted communication over the [Matrix protocol](https://matrix.org) with lightweight project-management features, so a team can chat and track work in the same place.

## Problem

Small teams often split their day between a secure messenger and a separate task tracker. Context gets lost between the two, and the tracker is usually the tool nobody keeps up to date.

## My role

I worked on the Android client, implementing the **kanban board** feature: columns, cards, drag-to-move and the state that keeps the board consistent with the underlying Matrix room.

## Technical approach

- Built the board UI natively in **Kotlin** on top of the existing client architecture.
- [Describe how board state was modelled — e.g. as Matrix room state events — and how conflicts were handled.]
- [Describe testing and release process.]

## Challenges

- [Keeping the board responsive while syncing over Matrix on flaky mobile networks.]
- [Fitting a task-tracking mental model into a chat-first codebase.]

## Decisions & trade-offs

[What you chose and why — e.g. persisting board state in room events vs. a separate backend.]

## Results

[Real outcomes only: shipped in version X, used by N teams, etc.]

## Lessons learned

[What the project taught you about mobile development, protocols or product scope.]
