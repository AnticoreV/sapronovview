---
title: "Dynamický formulářový engine"
description: "Formulářový engine v Angularu s podmíněnou validací, aktualizacemi v reálném čase a přizpůsobitelnými šablonami, postavený na službách v Javě/Kotlinu. Zkrátil vytvoření nového typu formuláře ze dnů na hodiny."
---

## Přehled

Konfigurovatelný formulářový engine pro administraci a zákaznickou aplikaci v CCA Group. Místo ručního vývoje každého nového formuláře skládají operátoři formuláře ze šablon a engine se postará o vykreslení, validaci i odeslání od začátku do konce.

## Problém

Každý nový typ formuláře byl vývojový úkol: nové komponenty, nová validační pravidla, nové zpracování na backendu. Vytvoření jednoho trvalo dny a drobné rozdíly mezi formuláři znamenaly nekonzistentní chování pro uživatele a duplicitní kód pro tým.

## Moje role

Měl jsem na starosti obě strany stacku: engine a knihovnu komponent v Angularu na frontendu i služby v Javě/Kotlinu za ním, včetně integračního kontraktu mezi nimi.

## Cíle

- Zkrátit vytvoření nového typu formuláře ze dnů na hodiny.
- Podporovat podmíněnou validaci a aktualizace v reálném čase bez vlastního kódu pro každý formulář.
- Udržet administraci a zákaznickou aplikaci konzistentní vzhledem i chováním.

## Technické řešení

- **Engine v Angularu.** Formuláře jsou popsané přizpůsobitelnými šablonami; engine vykresluje pole, uplatňuje podmíněnou validaci a v reálném čase aktualizuje závislá pole, zatímco uživatel píše.
- **Znovupoužitelná knihovna komponent.** Sada silně typovaných Angular komponent a sdílených služeb, které používá administrace i zákaznická aplikace, takže nové formuláře automaticky přebírají konzistentní chování.
- **Backendové služby v Javě/Springu.** Škálovatelné služby obstarávají složitou logiku zpracování a odesílání formulářů a jsou dostupné přes dobře strukturovaná REST API.
- **Nejdřív kontrakty.** Verzované REST kontrakty zdokumentované v OpenAPI/Swaggeru a k tomu bezpečná autentizace mezi frontendem v Angularu a backendem ve Springu.

## Výzvy

Výkonově kritické cesty na backendu volaly několik nezávislých downstream služeb za sebou. Tyto služby jsem refaktoroval z Javy do Kotlinu a pomocí coroutines (korutin) jsem nezávislá volání spustil souběžně.

## Rozhodnutí a kompromisy

- **Šablony místo kódu.** Popsat chování formuláře šablonou stojí trochu flexibility u opravdu neobvyklých formulářů, ale v běžných případech se z vývojového úkolu stala konfigurace.
- **Kotlin jen pro kritické cesty.** Místo přepisu všeho přešly na Kotlin jen služby citlivé na latenci, takže riziko migrace zůstalo pod kontrolou.

## Výsledky

- Vytvoření nového typu formuláře se zkrátilo **ze dnů na hodiny**.
- Souběžná downstream volání s coroutines **zkrátila p95 latenci zhruba na polovinu** při špičkové zátěži.
- Zlepšila se konzistence a znovupoužitelnost kódu napříč administrací a zákaznickou aplikací.

## Co jsem se naučil

Největší hodnotu přinesly ty nudné části: dobrá knihovna komponent a čistý, verzovaný kontrakt mezi frontendem a backendem. Samotný engine byl menší polovinou práce.
