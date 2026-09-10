---
title: "What ultralight flying taught me about checklists"
description: "Pilots don't trust memory. Neither should engineers. A few habits from the cockpit that translate directly to deployments and incident response."
pubDate: 2026-05-02
tags: ["aviation", "engineering", "process"]
featured: false
draft: false
placeholder: true
---

> **Sample article.** An example of a post that mixes a hobby with engineering. Edit it in `src/content/writing/` or delete it.

Before every flight there is a walk-around and a checklist. Not because pilots are forgetful, but because the cost of forgetting is high and memory is unreliable under pressure. Software has the same profile: routine tasks, occasional high stakes, and people who are tired.

## Read, do, verify

Aviation checklists come in two flavours. A **do-list** is read item by item while doing each action. A **challenge-response** list is run after the actions, to verify them. Deploy runbooks benefit from the second kind: do the work, then read back each line and confirm it.

## Sterile cockpit

Below a certain altitude, conversation in the cockpit is limited to the flight. During a production deploy or an incident, the same rule keeps the chat channel focused on what matters.

## Say it out loud

Verbalising a checklist item catches mistakes that silent reading misses. In a team, that is a pull-request template with the questions written out, not implied.

None of this is novel. What flying adds is the reminder that the discipline exists because good people make bad mistakes when the routine is skipped.
