---
title: "Samoobslužná platforma pro správu menu"
description: "Platforma v Angularu, ve které si restaurační klienti z amerického trhu sami upravují menu. Stojí na službách v Javě/Springu – backend-for-frontend a agregátoru – v systému s ~2 miliony uživatelů."
timeframe: "2025–2026"
---

## Přehled

Součást velké distribuované retailové platformy v NCR Voyix, která obsluhuje kolem dvou milionů uživatelů. Navrhoval jsem a udržoval JVM mikroslužby, které dodávají data klientským aplikacím, a postavil jsem platformu v Angularu, přes kterou si klienti z amerického trhu sami (self-service) aktualizují menu.

## Problém

Úpravy menu probíhaly ručně: klienti požádali o změnu a někdo ji provedl. Pro klienty to bylo pomalé a provozně nákladné. Na backendu potřebovaly klientské aplikace data z mnoha downstream služeb, a protože si je každý konzument skládal dohromady sám, vznikala duplicitní logika a nekonzistentní odpovědi.

## Moje role

Senior fullstack engineer: návrh a údržba mikroslužeb na backendu, self-service produkt v Angularu na frontendu, produkční provoz na GCP a technické směřování prostřednictvím code review a podnětů k architektuře.

## Cíle

- Nahradit ruční úpravy menu self-service řešením pro klienty.
- Dát klientským aplikacím jedno konzistentní API na míru místo mnoha volání downstream služeb.
- Provozovat služby v produkci s plnou observabilitou.

## Technické řešení

- **Backend-for-Frontend.** BFF v Javě/Springu přizpůsobený tomu, co klientské aplikace skutečně potřebují, takže frontend zůstává jednoduchý a topologie downstream služeb se může měnit, aniž by ho rozbila.
- **Agregační služba.** Spojuje data až z **8 downstream služeb** do jedné ucelené odpovědi.
- **Self-service platforma v Angularu.** Dynamická úprava menu s pracovními postupy, které klienti z amerického trhu potřebují, aby mohli sami publikovat své změny.
- **GCP s produkční observabilitou.** Metriky, logování a alerting pro každou službu, aby se incidenty zachytily dřív, než si jich klienti všimnou.
- **AI nástroje na rutinní práci.** LLM a agentní nástroje včetně MCP integrací pro automatizaci scaffoldingu testů a interního dohledávání dat.

## Výzvy

Spojit osm downstream služeb znamená osm způsobů, jak být pomalý nebo nedostupný. Agregátor musel umět řízeně degradovat a zároveň zůstat natolik observabilní, aby bylo poznat, která závislost dělá problém.

## Rozhodnutí a kompromisy

- **BFF přidá jeden skok navíc, ale odstraní těsnou provázanost.** Služba navíc se vyplatí, když se díky ní může frontend vyvíjet nezávisle na velkém distribuovaném backendu.
- **Self-service přesouvá odpovědnost na klienty.** Mantinely a validace v platformě jsou důležitější než samotná flexibilita.

## Výsledky

- Klienti z amerického trhu si mohou menu upravovat sami, což **nahradilo ruční proces úprav**.
- Klientské aplikace používají jedno agregované API, místo aby se integrovaly až s osmi službami.
- Služby běží na GCP s kompletními metrikami, logováním a alertingem pro systém, který obsluhuje **~2 miliony uživatelů**.

## Co jsem se naučil

V systému takové velikosti je observabilita feature, ne dodatek na poslední chvíli. A nejrychlejší způsob, jak tým zrychlit, je automatizovat mu scaffolding a dohledávání – a právě tam se LLM nástroje vyplatily.
