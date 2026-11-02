---
title: "Tři služby za tři měsíce"
description: "Služby pro ticketing, rezervace a předplatné v Kotlinu a Spring Bootu, postavené od nuly během tříměsíční zakázky s vymezeným rozsahem – a čekání ve frontě CI zkrácené z hodin na minuty."
---

## Přehled

Tříměsíční freelance zakázka s vymezeným rozsahem pro CreativeDock: tři mikroslužby v Kotlinu/Spring Bootu postavené od nuly – ticketing, rezervace a předplatné – a k tomu CI a nasazovací infrastruktura, aby šly spolehlivě dostat do produkce.

## Co jsem postavil

- **Tři greenfield služby.** Ticketing, rezervace a předplatné, s API a kontrakty služeb definovanými předem. Vedl jsem architektonická rozhodnutí celé zakázky.
- **Testy proti reálným závislostem.** SpringMockK a Testcontainers pro spolehlivé pokrytí integračními testy.

## CI, které stíhá

Ve stávající GitLab CI pipeline se zasekávaly buildy. Diagnostikoval jsem je a navýšil kapacitu runnerů, čímž se čekání buildů ve frontě zkrátilo **z hodin na minuty**, a přidal jsem samostatnou fázi pro ověření buildu.

## Provoz v produkci

- Kubernetes workloady provozované a monitorované přes Argo CD, kde automatická synchronizace drží nasazení v souladu s požadovaným stavem.
- Stávající prostředí AWS – S3 pro ukládání obrázků, SQS pro messaging, CloudWatch pro logy – včetně vylepšení nasazených do běžících produkčních služeb.

## Výsledky

- Tři služby od nuly za tři měsíce.
- Čekání buildů ve frontě CI **z hodin na minuty**.
