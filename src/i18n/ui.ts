/**
 * UI dictionary: every interface string in English and Czech. `cs` must have exactly the
 * keys of `en` (type-checked). Use `useT(locale)` in components: `t("nav.about")`,
 * `t("countries", { n: 11 })`. Czech strings get Czech typography (non-breaking space
 * after one-letter prepositions) automatically — write plain spaces here.
 *
 * Content (projects, experience, hobbies, now) lives in the collections (`cs/` folders);
 * longer page copy and data live in src/data/* as `{ en, cs }` records.
 */
import { czTypo } from "@/i18n/typo";
import type { Locale } from "@/i18n/locales";

const en = {
  // Layout
  skip: "Skip to content",
  "nav.main": "Main",
  "nav.products": "Products",
  "nav.capabilities": "Capabilities",
  "nav.cases": "Cases",
  "nav.experience": "Experience",
  "nav.about": "About",
  "nav.home": "Home",
  "nav.projects": "Projects",
  "nav.writing": "Writing",
  "nav.hobbies": "Hobbies",
  "nav.adventures": "Adventures",
  "nav.now": "Now",
  "nav.contact": "Contact",
  "nav.rss": "RSS",
  "nav.sitemap": "Sitemap",
  "menu.open": "Open menu",
  "menu.close": "Close menu",
  "menu.label": "Site menu",
  "menu.pages": "All pages",
  "menu.getInTouch": "Get in touch",
  "lang.label": "Language",
  "lang.switchTo": "Switch to English",
  "theme.label": "Dark theme",
  "theme.title": "Light / dark theme",
  "status.prefix": "Availability: ",
  "status.open": "OPEN TO PROJECTS",
  "status.limited": "LIMITED AVAILABILITY",
  "status.closed": "NOT AVAILABLE",
  "status.openLabel": "Open to projects",
  "footer.label": "Footer",
  "footer.city": "PRAGUE",
  "footer.healthy": "ALL SERVICES HEALTHY",
  "footer.operator":
    "Ivan Sapronov · IČO 23157852 · Argentinská 1624/32, 170 00 Prague 7, Czech Republic · Sole trader registered in the Czech Trade Register",
  "breadcrumb.label": "Breadcrumb",
  "copy.button": "Copy",
  "copy.done": "Copied",
  "copy.fallback": "Select & copy",
  "copy.label": "Copy email address",
  more: "Read more",
  // Words screen readers hear for the drawn glyphs (src/components/ui/Glyphs.astro)
  "glyph.to": "to",
  "glyph.from": "from",
  "glyph.approx": "approximately",

  // Contact panel
  "contact.eyebrow": "GET IN TOUCH",
  "contact.title1": "Ready to ship",
  "contact.title2": "your project.",

  // Home
  "hero.email": "Email me",
  "hero.build": "What I build",
  "hero.legend.drawn": "DRAWN",
  "hero.legend.idea": "IDEA",
  "hero.legend.built": "BUILT · SHIPPED",
  "hero.legend.tested": "TESTED · RUNNING",
  "hero.legend.review": "REVIEW · AGENT LOOP",
  "hero.legend.line": "SKETCH → BUILD → SHIP → LEARN",
  // Empty: screen readers hear the line with "to" for each arrow (Glyphs).
  "hero.legend.spoken": "",
  // Callouts drawn into the 3D scene (src/scripts/hero3d.ts)
  "hero3d.idea": "IDEA",
  "hero3d.validate": "VALIDATE",
  "hero3d.frontend": "FRONTEND",
  "hero3d.backend": "BACKEND",
  "hero3d.services": "SERVICES",
  "hero3d.arch": "ARCHITECTURE",
  "hero3d.tests": "TESTS",
  "hero3d.review": "REVIEW · 1 CHANGE",
  "hero3d.cicd": "CI/CD",
  "hero3d.deploy": "DEPLOY",
  "hero3d.observe": "OBSERVE",
  "hero3d.agent": "AGENT LOOP",
  "hero.description":
    "An isometric technical drawing builds itself: three idea sketches, two struck out at a validation gate; the architecture (frontend, backend, services) is drawn stroke by stroke and filled with colour; tests stamp checks; a rose review mark erases one link and redraws it through a queue; dashed CI/CD arrows carry a package to a deploy target where service blocks extrude; a sparkline draws on an observe card; a rose pen-orb flies back along the agent loop and sketches the next idea while the sheet clears.",
  "proof.label": "Proof in numbers",
  "proof.list": "Proof numbers",
  "proof.workedWith": "WORKED WITH NCR VOYIX · CREATIVEDOCK · CCA GROUP · ABLENEO · VODA HORY",
  "who.label": "Who I am",
  "who.heading": "Engineer and founder.",
  "who.now": "Now: {focus}.",
  "who.basedIn": "Based in",
  "who.role": "Role",
  "who.roleValue": "Engineer · founder",
  "who.languages": "Languages",
  "who.experience": "Experience",
  "who.status": "Status",
  "who.portrait": "Portrait",
  "contents.label": "On this page",
  "contents.title": "Before you hire, invest or partner",
  "build.title": "What I'm building",
  "build.tag": "OWN PRODUCT · FOR PARTNERS AND INVESTORS",
  "build.tagMany": "OWN PRODUCTS · FOR PARTNERS AND INVESTORS",
  "can.title": "What I can do",
  "can.tag": "BUILD · DIRECT · AUTOMATE · SHIP & RUN",
  "work.title": "Proof in production",
  "work.all": "All projects",
  "record.title": "Track record",
  "record.cvRequest": "CV on request",
  "record.cvDownload": "Download CV",
  "record.years": "Years",
  "record.company": "Company",
  "record.role": "Role",
  "record.shipped": "Shipped",
  "record.full": "Full experience",
  "offduty.title": "Off duty",
  "offduty.line": "ULL pilot in training · motorcycle touring · {countries} on the map · sport",
  "offduty.link": "Hobbies & map",
  "writing.title": "Writing",
  "writing.all": "All posts",

  // Projects
  "project.readCase": "Read the case",
  "project.status": "Status",
  "project.web": "Web",
  "project.product": "Product",
  "project.caseStudy": "Case study",
  "project.role": "Role",
  "project.proof": "Proof numbers",
  "project.stack": "Stack",
  "project.liveSite": "Live site",
  "project.letsTalk": "Let's talk",
  "project.discuss": "Discuss a similar project",
  "project.allProjects": "All projects",
  "project.more": "More projects",
  "projects.title": "Projects",
  "projects.description":
    "Own products and client systems — Ownira, a self-service menu platform, a dynamic form engine and greenfield Kotlin services — each written up as a case study, plus code on GitHub.",
  "projects.eyebrow": "Products · client work · case studies",
  "projects.intro":
    "Own products and the client systems I built — each written up as a case study, with only the numbers that are real.",
  "projects.featured": "Products and featured work",
  "projects.archive": "Archive",
  "projects.code": "Code on GitHub",
  "projects.codeTag": "PUBLIC REPOSITORIES",
  "filters.label": "Filter projects by category",
  "filters.all": "All",
  "filters.shown": "Projects shown: {n}",

  // Experience
  "experience.title": "Experience",
  "experience.description":
    "Track record of {name}: every position since 2021 with what I built and what changed because of it — JVM services, Angular products, identity, Kafka, Kubernetes and cloud.",
  "experience.eyebrow": "Experience · since 2021",
  "experience.intro":
    "Where I've worked, what I owned and what changed because of it — from a freelance CRM in 2021 to Kotlin microservices and a platform serving around two million users.",
  "experience.summary": "Track record summary",
  "experience.positions": "Positions",
  "experience.milestones": "Education, credentials & community",
  "experience.present": "Present",
  "experience.technologies": "Technologies",

  // About
  "about.title": "About",
  "about.description":
    "Who {name} is: backend & fullstack engineer and founder in Prague — career story, how I work, what I value and the languages I speak.",
  "about.story": "Career story",
  "about.how": "How I work",
  "about.value": "What I value",
  "about.languages": "Languages",
  "about.enjoy": "What I enjoy working on",
  "about.stack": "Stack I ship with",
  "about.facts": "Facts",
  "about.valuesLabel": "Values, languages and focus",

  // Hobbies / adventures
  "hobbies.title": "Hobbies",
  "hobbies.description":
    "Off duty: ultralight aviation, motorcycles, adventures and country visiting, and sport — the part of the site that isn't a résumé.",
  "hobbies.eyebrow": "Off duty",
  "hobbies.h1": "Wings, wheels and wanderlust",
  "hobbies.intro":
    "What I do when the laptop is closed. Flying rewards preparation, riding rewards attention, travel rewards curiosity — the same habits I bring to a codebase.",
  "hobbies.jump": "Jump to hobby",
  "hobbies.module": "OFF DUTY {n} · {category}",
  "hobbies.teaser": "Adventures · globe",
  "hobbies.teaserText": "Where I've been, home in Prague, and the places still on the list.",
  "hobbies.mapLine": "{countries} on the map",
  "hobbies.openGlobe": "Open the globe",
  "adventures.title": "Adventures",
  "adventures.description":
    "A paper globe of the countries I've visited, home in Prague and the places still on the list — drag to turn it.",
  "adventures.eyebrow": "Off duty · adventures",
  "adventures.intro": "Where I've been, home in Prague, and the places still on the list.",
  "adventures.copyGlobe":
    "Drag the globe to turn it; pick a country or a place in the list to fly there.",
  "adventures.copyMap": "Pick a country or a place in the list to see it on the map.",
  "adventures.places": "Countries & places",
  "adventures.home": "Home base · {place}",
  "adventures.visited": "Visited · {countries}",
  "adventures.wishlist": "Want to visit · {n}",
  "adventures.statusVisited": "Visited",
  "adventures.statusWishlist": "Want to visit",
  "adventures.bucketList": "Bucket list",
  "adventures.someday": "Someday",
  "adventures.close": "Close details",
  "adventures.country": "Country",
  "adventures.why": "Why: ",
  "adventures.shown": "{name}. Details shown.",
  "adventures.closed": "Details closed.",
  "adventures.legend": "Map legend",
  "adventures.legendHome": "Home",
  "adventures.legendVisited": "Visited",
  "adventures.legendWishlist": "Want to visit",
  "adventures.legendRoute": "Route from Prague",
  "adventures.globeAlt":
    "Globe centred on Europe: {n} visited countries in ink, home in the Czech Republic highlighted in blue, routes from Prague to every visited place, wishlist countries outlined.",
  "adventures.mapCaption":
    "World map: {n} visited countries in ink, home in the Czech Republic highlighted, wishlist countries outlined. Use the country list to pick a place.",

  // Now
  "now.title": "Now",
  "now.description": "What I'm working on, learning and reading right now.",
  "now.updated": "Updated {date}",
  "now.h1": "What I'm doing now",
  "now.working": "Working on",
  "now.learning": "Learning",
  "now.reading": "Reading",
  "now.projects": "Projects",
  "now.interests": "Interests",

  // Writing
  "writing.description": "Engineering notes on the JVM, identity, delivery and automation.",
  "writing.eyebrow": "Notes · articles",
  "writing.intro":
    "Things I learned the hard way, written down so I don't have to learn them twice.",
  "writing.empty": "No posts published yet",
  "writing.emptyText": "New notes will appear here.",
  "writing.rss": "RSS feed",
  "writing.tagTitle": "Posts tagged “{tag}”",
  "writing.tagDescription": "{articles} tagged {tag}.",
  "writing.tagEyebrow": "Tag · {articles}",
  "writing.tagsLabel": "Tags",
  "writing.article": "Article",
  "writing.minRead": "{n} min read",
  "writing.min": "{n} min",
  "writing.updated": "Updated",
  "writing.previous": "Previous",
  "writing.next": "Next",
  "writing.related": "Related notes",
  "writing.adjacent": "Adjacent articles",
  "writing.inEnglish": "",

  // Contact page + form
  "contactPage.title": "Contact",
  "contactPage.description":
    "Contact {name} about a senior backend or fullstack role, investing in Ownira, or building, automating and shipping together.",
  "contactPage.formLabel": "Contact form",
  "contactPage.intro":
    "Email is the fastest way to reach me. Pick a route above and the subject line is filled in for you.",
  "contactPage.privacy": "Privacy",
  "contactPage.privacyOff":
    "While the form is not connected, nothing is sent from this page — your text only goes wherever your own email app sends it.",
  "contactPage.privacyOn":
    "The form sends your name, email, topic and message to Formspree (formspree.io), which processes them on my behalf and forwards them to my inbox. I use them only to reply to you.",
  "contactPage.cookies":
    "This site sets no cookies and runs no analytics. Your light / dark theme and language choices are kept in your browser's local storage and never leave it.",
  "form.title": "Send a message",
  "form.notConnected": "Form not connected yet",
  "form.notConnectedText": "email me at",
  "form.notConnectedHint": ". You can still fill it in: I'll hand the text to your email app.",
  "form.name": "Name",
  "form.email": "Email",
  "form.topic": "Topic",
  "form.message": "Message",
  "form.errName": "Tell me who you are — a name is enough.",
  "form.errEmail": "I need an email address I can reply to, like name@company.com.",
  "form.errMessage": "Write a sentence or two so I know what it's about.",
  "form.honeypot": "Leave this empty",
  "form.note": "No newsletter, no tracking — just a message to my inbox.",
  "form.send": "Send message",
  "form.asEmail": "Write it as an email",
  "form.sending": "Sending…",
  "form.success": "MESSAGE RECEIVED",
  "form.successText": "Thanks — your message is in my inbox. I'll reply by email.",
  "form.failure": "MESSAGE NOT SENT",
  "form.failureText": "Something went wrong on the way. Email me directly at",
  "form.textKept": "— your text is still in the form.",
  "form.offline": "FORM NOT CONNECTED YET",
  "form.offlineText": "Nothing was sent. Email me at",
  "form.openApp": "Open it in your email app",
  "form.defaultSubject": "Hello",

  // 404
  "404.title": "Not found",
  "404.description": "That page doesn't exist.",
  "404.heading": "404 — this route isn't deployed.",
  "404.back": "Back to home",
  "404.alt":
    "A blueprint drawing of a deploy target: a dashed CI/CD arrow leads to a dashed footprint where three service blocks stand and the fourth is missing, drawn only as a dashed outline.",

  // Plurals (one|few|other — English uses one|other)
  countries: "{n} countries",
  "countries.one": "{n} country",
  articles: "{n} articles",
  "articles.one": "{n} article",
} as const;

export type UiKey = keyof typeof en;

const cs: Record<UiKey, string> = {
  // Layout
  skip: "Přejít na obsah",
  "nav.main": "Hlavní navigace",
  "nav.products": "Produkty",
  "nav.capabilities": "Dovednosti",
  "nav.cases": "Projekty",
  "nav.experience": "Zkušenosti",
  "nav.about": "O mně",
  "nav.home": "Úvod",
  "nav.projects": "Projekty",
  "nav.writing": "Články",
  "nav.hobbies": "Koníčky",
  "nav.adventures": "Cesty",
  "nav.now": "Právě teď",
  "nav.contact": "Kontakt",
  "nav.rss": "RSS",
  "nav.sitemap": "Mapa webu",
  "menu.open": "Otevřít menu",
  "menu.close": "Zavřít menu",
  "menu.label": "Menu webu",
  "menu.pages": "Všechny stránky",
  "menu.getInTouch": "Ozvěte se",
  "lang.label": "Jazyk",
  "lang.switchTo": "Přepnout do češtiny",
  "theme.label": "Tmavý režim",
  "theme.title": "Světlý / tmavý režim",
  "status.prefix": "Dostupnost: ",
  "status.open": "BERU NOVÉ PROJEKTY",
  "status.limited": "OMEZENÁ KAPACITA",
  "status.closed": "NEJSEM K DISPOZICI",
  "status.openLabel": "Beru nové projekty",
  "footer.label": "Patička",
  "footer.city": "PRAHA",
  "footer.healthy": "VŠECHNY SLUŽBY BĚŽÍ",
  "footer.operator":
    "Ivan Sapronov · IČO 23157852 · Argentinská 1624/32, 170 00 Praha 7 · Fyzická osoba zapsaná v živnostenském rejstříku",
  "breadcrumb.label": "Drobečková navigace",
  "copy.button": "Kopírovat",
  "copy.done": "Zkopírováno",
  "copy.fallback": "Označte a zkopírujte",
  "copy.label": "Zkopírovat e-mailovou adresu",
  more: "Více",
  "glyph.to": "na",
  "glyph.from": "z",
  "glyph.approx": "přibližně",

  // Contact panel
  "contact.eyebrow": "OZVĚTE SE",
  "contact.title1": "Připraven dodat",
  "contact.title2": "váš projekt.",

  // Home
  "hero.email": "Napište mi",
  "hero.build": "Co stavím",
  "hero.legend.drawn": "NAKRESLENO",
  "hero.legend.idea": "NÁPAD",
  "hero.legend.built": "POSTAVENO · VYDÁNO",
  "hero.legend.tested": "OTESTOVÁNO · BĚŽÍ",
  "hero.legend.review": "REVIEW · AGENTNÍ SMYČKA",
  "hero.legend.line": "NÁČRT → STAVBA → VYDÁNÍ → UČENÍ",
  "hero.legend.spoken": "náčrt, stavba, vydání, učení",
  "hero3d.idea": "NÁPAD",
  "hero3d.validate": "VALIDACE",
  "hero3d.frontend": "FRONTEND",
  "hero3d.backend": "BACKEND",
  "hero3d.services": "SLUŽBY",
  "hero3d.arch": "ARCHITEKTURA",
  "hero3d.tests": "TESTY",
  "hero3d.review": "REVIEW · 1 ZMĚNA",
  "hero3d.cicd": "CI/CD",
  "hero3d.deploy": "NASAZENÍ",
  "hero3d.observe": "MONITORING",
  "hero3d.agent": "AGENTNÍ SMYČKA",
  "hero.description":
    "Izometrický technický výkres se kreslí sám: tři náčrty nápadů, dva přeškrtnuté u validační brány; architektura (frontend, backend, služby) se kreslí tah po tahu a vyplňuje barvou; testy razítkují fajfky; růžová značka z review smaže jedno propojení a nakreslí ho znovu přes frontu; čárkované šipky CI/CD nesou balíček k cíli nasazení, kde vyrůstají bloky služeb; na kartě monitoringu se kreslí křivka; růžová kulička-pero se vrací po agentní smyčce a načrtne další nápad, zatímco se list vymaže.",
  "proof.label": "Důkazy v číslech",
  "proof.list": "Čísla",
  "proof.workedWith":
    "PRACOVAL JSEM PRO NCR VOYIX · CREATIVEDOCK · CCA GROUP · ABLENEO · VODA HORY",
  "who.label": "Kdo jsem",
  "who.heading": "Inženýr a zakladatel.",
  "who.now": "Teď: {focus}.",
  "who.basedIn": "Lokalita",
  "who.role": "Role",
  "who.roleValue": "Inženýr · zakladatel",
  "who.languages": "Jazyky",
  "who.experience": "Praxe",
  "who.status": "Status",
  "who.portrait": "Portrét",
  "contents.label": "Na této stránce",
  "contents.title": "Než mě najmete, investujete nebo navážeme spolupráci",
  "build.title": "Co stavím",
  "build.tag": "VLASTNÍ PRODUKT · PRO PARTNERY A INVESTORY",
  "build.tagMany": "VLASTNÍ PRODUKTY · PRO PARTNERY A INVESTORY",
  "can.title": "Co umím",
  "can.tag": "STAVBA · SMĚŘOVÁNÍ · AUTOMATIZACE · NASAZENÍ A PROVOZ",
  "work.title": "Důkazy z produkce",
  "work.all": "Všechny projekty",
  "record.title": "Praxe",
  "record.cvRequest": "Životopis na vyžádání",
  "record.cvDownload": "Stáhnout životopis",
  "record.years": "Roky",
  "record.company": "Firma",
  "record.role": "Role",
  "record.shipped": "Výsledek",
  "record.full": "Celá praxe",
  "offduty.title": "Po práci",
  "offduty.line": "pilot ULL v přípravě · mototuristika · {countries} na mapě · sport",
  "offduty.link": "Koníčky a mapa",
  "writing.title": "Články",
  "writing.all": "Všechny články",

  // Projects
  "project.readCase": "Přečíst studii",
  "project.status": "Stav",
  "project.web": "Web",
  "project.product": "Produkt",
  "project.caseStudy": "Případová studie",
  "project.role": "Role",
  "project.proof": "Čísla",
  "project.stack": "Technologie",
  "project.liveSite": "Web",
  "project.letsTalk": "Pojďme to probrat",
  "project.discuss": "Probrat podobný projekt",
  "project.allProjects": "Všechny projekty",
  "project.more": "Další projekty",
  "projects.title": "Projekty",
  "projects.description":
    "Vlastní produkty a klientské systémy – Ownira, samoobslužná platforma pro správu menu, dynamický formulářový engine a nové služby v Kotlinu – každý jako případová studie, plus kód na GitHubu.",
  "projects.eyebrow": "Produkty · klientská práce · případové studie",
  "projects.intro":
    "Vlastní produkty a klientské systémy, které jsem postavil – každý jako případová studie a jen se skutečnými čísly.",
  "projects.featured": "Produkty a vybraná práce",
  "projects.archive": "Archiv",
  "projects.code": "Kód na GitHubu",
  "projects.codeTag": "VEŘEJNÉ REPOZITÁŘE",
  "filters.label": "Filtrovat projekty podle kategorie",
  "filters.all": "Vše",
  "filters.shown": "Zobrazeno: {n}",

  // Experience
  "experience.title": "Zkušenosti",
  "experience.description":
    "Praxe Ivana Sapronova: každá pozice od roku 2021, co jsem postavil a co se díky tomu změnilo – služby na JVM, produkty v Angularu, identita, Kafka, Kubernetes a cloud.",
  "experience.eyebrow": "Zkušenosti · od roku 2021",
  "experience.intro":
    "Kde jsem pracoval, za co jsem odpovídal a co se díky tomu změnilo – od CRM na volné noze v roce 2021 po mikroslužby v Kotlinu a platformu pro zhruba dva miliony uživatelů.",
  "experience.summary": "Přehled praxe",
  "experience.positions": "Pozice",
  "experience.milestones": "Vzdělání, certifikace a komunita",
  "experience.present": "dosud",
  "experience.technologies": "Technologie",

  // About
  "about.title": "O mně",
  "about.description":
    "Kdo je Ivan Sapronov: backend & fullstack engineer a zakladatel v Praze – můj příběh, jak pracuji, na čem mi záleží a jakými jazyky mluvím.",
  "about.story": "Můj příběh",
  "about.how": "Jak pracuji",
  "about.value": "Na čem mi záleží",
  "about.languages": "Jazyky",
  "about.enjoy": "Na čem rád pracuji",
  "about.stack": "S čím pracuji",
  "about.facts": "Fakta",
  "about.valuesLabel": "Hodnoty, jazyky a zaměření",

  // Hobbies / adventures
  "hobbies.title": "Koníčky",
  "hobbies.description":
    "Po práci: ultralehké létání, motorky, cestování a sbírání zemí a sport – část webu, která není životopis.",
  "hobbies.eyebrow": "Po práci",
  "hobbies.h1": "Křídla, kola a touha cestovat",
  "hobbies.intro":
    "Co dělám, když je notebook zavřený. Létání odměňuje přípravu, jízda pozornost, cestování zvědavost – stejné návyky si beru i do kódu.",
  "hobbies.jump": "Přejít na koníček",
  "hobbies.module": "PO PRÁCI {n} · {category}",
  "hobbies.teaser": "Cesty · glóbus",
  "hobbies.teaserText": "Kde jsem byl, domov v Praze a místa, která mám ještě na seznamu.",
  "hobbies.mapLine": "{countries} na mapě",
  "hobbies.openGlobe": "Otevřít glóbus",
  "adventures.title": "Cesty",
  "adventures.description":
    "Papírový glóbus zemí, které jsem navštívil, domova v Praze a míst, která mám ještě na seznamu – otočíte ho tažením.",
  "adventures.eyebrow": "Po práci · cesty",
  "adventures.intro": "Kde jsem byl, domov v Praze a místa, která mám ještě na seznamu.",
  "adventures.copyGlobe":
    "Glóbus otočíte tažením; vyberte zemi nebo místo v seznamu a glóbus se k němu natočí.",
  "adventures.copyMap": "Vyberte zemi nebo místo v seznamu a uvidíte ho na mapě.",
  "adventures.places": "Země a místa",
  "adventures.home": "Domov · {place}",
  "adventures.visited": "Navštíveno · {countries}",
  "adventures.wishlist": "Chci navštívit · {n}",
  "adventures.statusVisited": "Navštíveno",
  "adventures.statusWishlist": "Chci navštívit",
  "adventures.bucketList": "Musím vidět",
  "adventures.someday": "Jednou",
  "adventures.close": "Zavřít detail",
  "adventures.country": "Země",
  "adventures.why": "Proč: ",
  "adventures.shown": "{name}. Detail zobrazen.",
  "adventures.closed": "Detail zavřen.",
  "adventures.legend": "Legenda mapy",
  "adventures.legendHome": "Domov",
  "adventures.legendVisited": "Navštíveno",
  "adventures.legendWishlist": "Chci navštívit",
  "adventures.legendRoute": "Trasa z Prahy",
  "adventures.globeAlt":
    "Glóbus se středem v Evropě: navštívené země ({n}) černě, domov v Česku zvýrazněný modře, trasy z Prahy do všech navštívených míst, země ze seznamu přání obtažené.",
  "adventures.mapCaption":
    "Mapa světa: navštívené země ({n}) černě, domov v Česku zvýrazněný, země ze seznamu přání obtažené. Místo vyberete v seznamu zemí.",

  // Now
  "now.title": "Právě teď",
  "now.description": "Na čem právě pracuji, co se učím a co čtu.",
  "now.updated": "Aktualizováno {date}",
  "now.h1": "Co právě dělám",
  "now.working": "Pracuji na",
  "now.learning": "Učím se",
  "now.reading": "Čtu",
  "now.projects": "Projekty",
  "now.interests": "Zájmy",

  // Writing
  "writing.description": "Technické poznámky o JVM, identitě, dodávání softwaru a automatizaci.",
  "writing.eyebrow": "Poznámky · články",
  "writing.intro":
    "Věci, které jsem se naučil na vlastní kůži, sepsané, abych se je nemusel učit dvakrát.",
  "writing.empty": "Zatím žádné články",
  "writing.emptyText": "Nové poznámky se objeví tady.",
  "writing.rss": "RSS kanál",
  "writing.tagTitle": "Články se štítkem „{tag}“",
  "writing.tagDescription": "{articles} se štítkem {tag}.",
  "writing.tagEyebrow": "Štítek · {articles}",
  "writing.tagsLabel": "Štítky",
  "writing.article": "Článek",
  "writing.minRead": "{n} min čtení",
  "writing.min": "{n} min",
  "writing.updated": "Aktualizováno",
  "writing.previous": "Předchozí",
  "writing.next": "Další",
  "writing.related": "Související poznámky",
  "writing.adjacent": "Sousední články",
  "writing.inEnglish": "Článek je v angličtině.",

  // Contact page + form
  "contactPage.title": "Kontakt",
  "contactPage.description":
    "Napište mi kvůli pozici senior backend nebo fullstack, investici do produktu Ownira nebo společné stavbě, automatizaci a nasazení.",
  "contactPage.formLabel": "Kontaktní formulář",
  "contactPage.intro":
    "Nejrychleji mě zastihnete e-mailem. Vyberte si výše jednu z možností a předmět se vyplní sám.",
  "contactPage.privacy": "Soukromí",
  "contactPage.privacyOff":
    "Dokud formulář není připojený, z této stránky se nic neodesílá – text jde jen tam, kam ho pošle váš vlastní e-mailový program.",
  "contactPage.privacyOn":
    "Formulář posílá vaše jméno, e-mail, téma a zprávu službě Formspree (formspree.io), která je zpracuje mým jménem a přepošle do mé schránky. Používám je jen k tomu, abych vám odpověděl.",
  "contactPage.cookies":
    "Tento web nepoužívá cookies ani analytiku. Volba světlého / tmavého režimu a jazyka se ukládá jen v místním úložišti vašeho prohlížeče a nikam se neodesílá.",
  "form.title": "Napište zprávu",
  "form.notConnected": "Formulář zatím není připojený",
  "form.notConnectedText": "napište mi na",
  "form.notConnectedHint": ". Vyplnit ho můžete i tak: text předám vašemu e-mailovému programu.",
  "form.name": "Jméno",
  "form.email": "E-mail",
  "form.topic": "Téma",
  "form.message": "Zpráva",
  "form.errName": "Napište, kdo jste – stačí jméno.",
  "form.errEmail": "Potřebuji e-mail, na který můžu odpovědět, třeba jmeno@firma.cz.",
  "form.errMessage": "Napište větu nebo dvě, ať vím, o co jde.",
  "form.honeypot": "Toto pole nechte prázdné",
  "form.note": "Žádný newsletter, žádné sledování – jen zpráva do mé schránky.",
  "form.send": "Odeslat zprávu",
  "form.asEmail": "Napsat jako e-mail",
  "form.sending": "Odesílám…",
  "form.success": "ZPRÁVA DORUČENA",
  "form.successText": "Díky – zpráva je v mé schránce. Odpovím e-mailem.",
  "form.failure": "ZPRÁVA NEODEŠLA",
  "form.failureText": "Cestou se něco pokazilo. Napište mi přímo na",
  "form.textKept": "– text zůstal ve formuláři.",
  "form.offline": "FORMULÁŘ ZATÍM NENÍ PŘIPOJENÝ",
  "form.offlineText": "Nic se neodeslalo. Napište mi na",
  "form.openApp": "Otevřít v e-mailovém programu",
  "form.defaultSubject": "Dobrý den",

  // 404
  "404.title": "Stránka nenalezena",
  "404.description": "Tahle stránka neexistuje.",
  "404.heading": "404 – tahle cesta není nasazená.",
  "404.back": "Zpět na úvod",
  "404.alt":
    "Výkres cíle nasazení: čárkovaná šipka CI/CD vede k čárkovanému půdorysu, kde stojí tři bloky služeb a čtvrtý chybí – je naznačený jen čárkovaným obrysem.",

  // Plurals (one|few|other)
  countries: "{n} zemí",
  "countries.one": "{n} země",
  articles: "{n} článků",
  "articles.one": "{n} článek",
};

/** Both dictionaries (raw, without Czech typography) — for tooling such as the copy review. */
export const dictionaries: Record<Locale, Record<UiKey, string>> = { en, cs };

/** Extra plural forms Czech needs ("few": 2–4). */
const csFew: Partial<Record<UiKey, string>> = {
  countries: "{n} země",
  articles: "{n} články",
};

export type Vars = Record<string, string | number>;

const fill = (text: string, vars?: Vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`)) : text;

/** A translator for one locale: t("nav.about"), t("countries", { n: 3 }) (plural keys). */
export function useT(locale: Locale) {
  const dict = dictionaries[locale];
  const rules = new Intl.PluralRules(locale === "cs" ? "cs" : "en");
  return function t(key: UiKey, vars?: Vars): string {
    let text = dict[key];
    if (typeof vars?.n === "number" && `${key}.one` in dict) {
      const rule = rules.select(vars.n);
      if (rule === "one") text = dict[`${key}.one` as UiKey];
      else if (rule === "few" && locale === "cs" && csFew[key]) text = csFew[key]!;
    }
    const out = fill(text, vars);
    return locale === "cs" ? czTypo(out) : out;
  };
}

export type T = ReturnType<typeof useT>;
