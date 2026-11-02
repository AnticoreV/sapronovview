---
title: "Dynamický formulářový engine"
description: "Formulářový engine v Angularu s podmíněnou validací, aktualizacemi v reálném čase a přizpůsobitelnými šablonami, postavený na službách v Javě/Kotlinu. Zkrátil vytvoření nového typu formuláře ze dnů na hodiny."
---

## Přehled

Konfigurovatelný formulářový engine pro administraci a zákaznickou aplikaci v CCA Group. Místo ručního vývoje každého nového formuláře skládají operátoři formuláře ze šablon a engine se postará o vykreslení, validaci i odeslání od začátku do konce.

## Problém

Každý nový typ formuláře byl vývojový úkol, který potřeboval vlastní komponenty, validační pravidla i zpracování na backendu. Vytvoření jednoho trvalo dny a drobné rozdíly mezi formuláři znamenaly nekonzistentní chování pro uživatele a duplicitní kód pro tým.

## Moje role

Měl jsem na starosti obě strany stacku: engine a knihovnu komponent v Angularu na frontendu i služby v Javě/Kotlinu za ním, včetně integračního kontraktu mezi nimi.

## Cíle

- Zkrátit vytvoření nového typu formuláře ze dnů na hodiny.
- Podporovat podmíněnou validaci a aktualizace v reálném čase bez vlastního kódu pro každý formulář.
- Udržet administraci a zákaznickou aplikaci konzistentní vzhledem i chováním.

## Technické řešení

- Engine v Angularu vykresluje pole podle přizpůsobitelných šablon, uplatňuje podmíněnou validaci a v reálném čase aktualizuje závislá pole, zatímco uživatel píše.
- Knihovnu silně typovaných Angular komponent a sdílených služeb používá administrace i zákaznická aplikace, takže se nový formulář v obou chová stejně.
- Služby v Javě/Springu obstarávají zpracování a odesílání formulářů přes REST API.
- Verzované REST kontrakty jsou zdokumentované v OpenAPI/Swaggeru a volání mezi frontendem v Angularu a backendem ve Springu jsou autentizovaná.

## Výzvy

Cesty na backendu citlivé na latenci volaly několik nezávislých downstream služeb za sebou. Tyto služby jsem refaktoroval z Javy do Kotlinu a pomocí coroutines (korutin) jsem nezávislá volání spustil souběžně.

## Rozhodnutí a kompromisy

- Šablony stojí trochu flexibility u neobvyklých formulářů, ale v běžných případech udělaly z vývojového úkolu konfiguraci.
- Na Kotlin jsem převedl jen služby citlivé na latenci místo přepisu všeho, takže riziko migrace zůstalo malé.

## Výsledky

- Vytvoření nového typu formuláře se zkrátilo **ze dnů na hodiny**.
- Souběžná downstream volání s coroutines **zkrátila p95 latenci zhruba na polovinu** při špičkové zátěži.
- Administrace a zákaznická aplikace sdílejí jednu knihovnu komponent.

## Co jsem se naučil

Největší hodnotu přinesly ty nudné části: solidní knihovna komponent a verzovaný kontrakt mezi frontendem a backendem. Samotný engine byl menší polovinou práce.
