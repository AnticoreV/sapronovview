---
description: "Compliance inbox pro úřední zprávy v datové schránce: z každé zprávy se stává sledovaná práce pro účetní a daňové kanceláře. V pilotním provozu."
summary: "Úřední zprávy v datové schránce pod kontrolou – pro účetní a daňové kanceláře. Produkt, architektura a celý stack."
tagline: "Od datové schránky k vyřízení."
facts:
  - label: "Pro koho"
    value: "Účetní a daňové kanceláře v Česku"
  - label: "Moje role"
    value: "Zakladatel – produkt, architektura, fullstack"
role: "Zakladatel"
timeframe: "[2025 – dosud]"
---

## Přehled

Ownira drží pod kontrolou úřední zprávy v datové schránce (ISDS). Z úředních zpráv a jejich příloh se stává sledovaná práce: případy, úkoly, lhůty, komentáře, štítky a schvalování, k tomu odchozí odpovědi se sledováním doručení, notifikace a neměnná auditní stopa (append-only).

Je určená pro účetní a daňové kanceláře, které spravují datové schránky svých klientů. Ownira je v pilotním provozu.

## Problém

Jedna kancelář může spravovat datové schránky desítek klientů a lhůty se často evidují v tabulce. Nepřečtená zpráva se desátým dnem považuje za doručenou a zákonná lhůta začne běžet bez ohledu na to, jestli se do schránky někdo podíval. Ownira přidělí každé zprávě jmenovitě odpovědnou osobu, sledovanou lhůtu a auditní stopu – a na zprávu, která stále čeká, upozorní ještě před uplynutím deseti dnů, aniž by ji otevřela.

## Moje role

Zakladatel: produkt, architektura a celý stack.

## Architektura

- **Backend.** Kotlin 2.2 na Javě 21 se Spring Bootem 4: osm samostatně nasaditelných Spring Boot služeb za jednou API gateway; každá služba, která ukládá data, má vlastní databázi (PostgreSQL s migracemi ve Flyway).
- **Primárně asynchronně.** Služby spolu komunikují přes Amazon SQS; dokumenty se ukládají do S3.
- **Identita.** Keycloak s OpenID Connect.
- **AI pod dohledem člověka.** Návrhy AI mají jen poradní charakter, dokud je člověk nepřijme.
- **Frontend.** Single-page aplikace v Reactu a TypeScriptu, která komunikuje pouze s gateway.
- **Delivery.** Integrační testy s Testcontainers, Terraform pro messagingovou infrastrukturu, CI na GitHub Actions.

## Pro investory a partnery

Fáze, pokrok a plány – [pojďme si promluvit](/cs/contact?topic=investing).
