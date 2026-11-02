---
title: "Samoobslužná platforma pro správu menu"
description: "Platforma v Angularu, ve které si restaurační klienti z amerického trhu sami upravují menu. Stojí na službách v Javě/Springu (backend-for-frontend a agregátor) v systému s ~2 miliony uživatelů."
timeframe: "2025–2026"
---

## Přehled

Součást velké distribuované retailové platformy v NCR Voyix, která obsluhuje kolem dvou milionů uživatelů. Navrhoval jsem a udržoval JVM mikroslužby, které dodávají data klientským aplikacím, a postavil jsem platformu v Angularu, přes kterou si klienti z amerického trhu sami (self-service) aktualizují menu.

## Problém

Úpravy menu probíhaly ručně: klienti požádali o změnu a někdo ji provedl, což bylo pro klienty pomalé a provozně nákladné. Na backendu potřebovaly klientské aplikace data z mnoha downstream služeb, a protože si je každý konzument skládal dohromady sám, vznikala duplicitní logika a nekonzistentní odpovědi.

## Moje role

Senior fullstack engineer: návrh a údržba mikroslužeb na backendu, self-service produkt v Angularu na frontendu, produkční provoz na GCP a technické směřování prostřednictvím code review a podnětů k architektuře.

## Cíle

- Nahradit ruční úpravy menu self-service řešením pro klienty.
- Dát klientským aplikacím jedno konzistentní API na míru místo mnoha volání downstream služeb.
- Provozovat služby v produkci s plnou observabilitou.

## Technické řešení

- Backend-for-frontend v Javě/Springu postavený podle toho, co klientské aplikace potřebují, takže frontend zůstává jednoduchý a topologie downstream služeb se může měnit, aniž by ho rozbila.
- Agregační služba, která spojuje data až z **8 downstream služeb** do jedné odpovědi.
- Self-service platforma v Angularu s dynamickou úpravou menu a pracovními postupy, díky kterým klienti z amerického trhu sami publikují své změny.
- Metriky, logování a alerting pro každou službu na GCP, abychom incidenty zachytili dřív, než si jich klienti všimnou.
- LLM a agentní nástroje včetně MCP integrací, které automatizují scaffolding testů a interní dohledávání dat.

## Výzvy

Spojit osm downstream služeb znamená osm způsobů, jak být pomalý nebo nedostupný. Agregátor musel umět řízeně degradovat a zároveň zůstat natolik observabilní, aby bylo poznat, která závislost dělá problém.

## Rozhodnutí a kompromisy

- BFF přidá jeden síťový skok navíc, ale odstraní těsnou provázanost; služba navíc se vyplatí, když se frontend musí vyvíjet nezávisle na velkém distribuovaném backendu.
- Self-service přesouvá odpovědnost na klienty, takže mantinely a validace v platformě jsou důležitější než samotná flexibilita.

## Výsledky

- Klienti z amerického trhu si mohou menu upravovat sami, což **nahradilo ruční proces úprav**.
- Klientské aplikace používají jedno agregované API, místo aby se integrovaly až s osmi službami.
- Služby běží na GCP s kompletními metrikami, logováním a alertingem pro systém, který obsluhuje **~2 miliony uživatelů**.

## Co jsem se naučil

V systému takové velikosti beru observabilitu jako součást každé funkce od prvního commitu. LLM nástroje se nejvíc vyplatily u scaffoldingu a dohledávání dat, tedy u rutiny, která tým zdržuje.
