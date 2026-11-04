---
title: "Tři služby za tři měsíce"
description: "Služby pro ticketing, rezervace a předplatné v Kotlinu a Spring Bootu, postavené od nuly během tříměsíční zakázky, a čekání ve frontě CI zkrácené z hodin na minuty."
---

## Přehled

Během tříměsíční freelance zakázky pro CreativeDock jsem od nuly postavil tři mikroslužby v Kotlinu/Spring Bootu (ticketing, rezervace a předplatné) a opravil CI a nasazovací infrastrukturu, přes kterou šly do produkce.

## Co jsem postavil

- Služby pro ticketing, rezervace a předplatné s GraphQL API (Spring for GraphQL), se schématy a kontrakty definovanými předem; architektonická rozhodnutí celé zakázky jsem vedl já.
- Integrační testy proti reálným závislostem se SpringMockK a Testcontainers.

## CI, které stíhá

Ve stávající GitLab CI pipeline se zasekávaly buildy. Diagnostikoval jsem je, navýšil kapacitu runnerů a přidal samostatnou fázi pro ověření buildu, takže čekání buildů ve frontě kleslo **z hodin na minuty**.

## Provoz v produkci

- Kubernetes workloady jsem provozoval přes Argo CD, kde automatická synchronizace drží nasazení v souladu s požadovaným stavem.
- Do běžících produkčních služeb ve stávajícím prostředí AWS jsem nasazoval vylepšení: S3 pro obrázky, SQS pro messaging a CloudWatch pro logy.

## Výsledky

- Tři služby od nuly za tři měsíce.
- Čekání buildů ve frontě CI **z hodin na minuty**.
