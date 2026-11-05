---
# Off the site since 2026-11-05 (Ivan). Set hidden: false and drop the /projects/ownira
# redirects in public/_redirects to bring it back.
hidden: true
description: "Compliance inbox pro úřední zprávy v datové schránce: z každé zprávy se stává sledovaná práce pro účetní a daňové kanceláře. V pilotním provozu."
summary: "Hlídá úřední zprávy v datové schránce pro účetní a daňové kanceláře. Stavím produkt, architekturu i celý stack."
tagline: "Každá zpráva z datové schránky má řešitele a termín."
facts:
  - label: "Pro koho"
    value: "Účetní a daňové kanceláře v Česku"
  - label: "Moje role"
    value: "Zakladatel: produkt, architektura, fullstack"
role: "Zakladatel"
timeframe: "[2025–dosud]"
---

## Přehled

Ownira mění úřední zprávy v datové schránce (ISDS) ve sledovanou práci: případy, úkoly, lhůty, komentáře, štítky a schvalování, k tomu odchozí odpovědi se sledováním doručení, notifikace a neměnnou auditní stopu (append-only).

Stavím ji pro účetní a daňové kanceláře, které spravují datové schránky svých klientů, a teď je v pilotním provozu.

## Problém

Jedna kancelář může spravovat datové schránky desítek klientů a lhůty se často evidují v tabulce. Nepřečtená zpráva se desátým dnem považuje za doručenou a zákonná lhůta začne běžet bez ohledu na to, jestli se do schránky někdo podíval. Ownira přidělí každé zprávě jmenovitě odpovědnou osobu, sledovanou lhůtu a auditní stopu. Na zprávu, která stále čeká, navíc upozorní ještě před uplynutím deseti dnů, aniž by ji otevřela.

## Moje role

Zakladatel: produkt, architektura a celý stack.

## Architektura

- Osm služeb ve Spring Bootu 4 v Kotlinu 2.2 na Javě 21, každá se nasazuje samostatně za jednou API gateway; každá služba, která ukládá data, má vlastní databázi PostgreSQL s migracemi ve Flyway.
- Služby spolu komunikují asynchronně přes Amazon SQS a dokumenty leží v S3.
- Identitu obstarává Keycloak s OpenID Connect.
- Návrhy AI mají jen poradní charakter, dokud je člověk nepřijme.
- Single-page aplikace v Reactu a TypeScriptu komunikuje pouze s gateway.
- Integrační testy běží s Testcontainers, messagingovou infrastrukturu popisuje Terraform a CI běží na GitHub Actions.

## Pro investory a partnery

[Napište mi](/cs/contact?topic=investing) a pošlu aktuální fázi a plány.
