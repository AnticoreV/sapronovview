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
  "nav.expertise": "Expertise",
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
  "status.open": "Open to projects",
  "status.limited": "Limited availability",
  "status.closed": "Not available",
  "status.openLabel": "Open to projects",
  "footer.label": "Footer",
  "footer.city": "Prague",
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
  "contact.eyebrow": "Get in touch",
  "contact.title1": "Ready to ship",
  "contact.title2": "your project.",
  "contact.intro":
    "I take backend and fullstack contracts and I'm open to engineering roles on product teams. Email reaches me fastest.",

  // Home
  "hero.work": "Let's work together",
  "hero.experience": "View experience",
  "hero.facts": "At a glance",
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
  "proof.workedWith": "Worked with NCR Voyix, CreativeDock, CCA Group, Ableneo and Voda Hory",
  "who.label": "Who I am",
  "who.heading": "Engineer and founder.",
  "who.now": "Now: {focus}.",
  "who.basedIn": "Based in",
  "who.role": "Role",
  "who.roleValue": "Backend & fullstack engineer",
  "who.languages": "Languages",
  "who.experience": "Experience",
  "who.status": "Status",
  "who.portrait": "Portrait",
  "expertise.title": "What I do",
  "stack.title": "Tech stack",
  "stack.core": "Core",
  "stack.coreNote": "everyday stack",
  "stack.also": "Worked with",
  "stack.alsoNote": "used on projects",
  "stack.hint": "Point at a technology to see where I used it.",
  "work.title": "Shipped work",
  "work.all": "All projects",
  "work.contribution": "My contribution",
  "work.viewCase": "View case study",
  "venture.title": "My own product",
  "aboutHome.title": "About me",
  "aboutHome.more": "More about me",
  "record.title": "Track record",
  "record.cvRequest": "CV on request",
  "record.cvDownload": "Download CV",
  "record.years": "Years",
  "record.company": "Company",
  "record.role": "Role",
  "record.shipped": "Shipped",
  "record.full": "Full experience",
  "offduty.title": "Off duty",
  "offduty.line": "ULL pilot in training, motorcycle touring, {countries} on the map, sport",
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
    "A self-service menu platform, a dynamic form engine and greenfield Kotlin services, each written up as a case study, plus code on GitHub.",
  "projects.intro":
    "My own product and the client systems I built, each written up as a case study.",
  "projects.featured": "Products and featured work",
  "projects.archive": "Archive",
  "projects.code": "Code on GitHub",
  "filters.label": "Filter projects by category",
  "filters.all": "All",
  "filters.shown": "Projects shown: {n}",

  // Experience
  "experience.title": "Experience",
  "experience.description":
    "Track record of {name} since 2021: JVM services, Angular products, identity, Kafka, Kubernetes and cloud, with what changed in each position.",
  "experience.intro":
    "I started with a freelance CRM in 2021; since then I've built Kotlin microservices and worked on a platform serving around two million users. Each position lists what I owned and what changed.",
  "experience.summary": "Track record summary",
  "experience.positions": "Positions",
  "experience.milestones": "Education, credentials & community",
  "experience.present": "Present",
  "experience.technologies": "Technologies",
  // Homepage timeline variants (exp/* branches)
  "timeline.select": "Pick a position",
  "timeline.play": "Play through the years",
  "timeline.pause": "Pause",
  "timeline.scrub": "Drag along the years, or use the arrow keys.",
  "timeline.explode": "Exploded view",
  "timeline.layers":
    "Each layer is one position, its thickness how long it lasted. Oldest at the bottom.",
  "timeline.lines": "Technology lines",
  "timeline.linesHint": "Pick a line to see where I used it, or a stop for the details.",
  "timeline.allLines": "All lines",
  "timeline.usedAt": "Used at",

  // About
  "about.title": "About",
  "about.description":
    "{name}, a backend and fullstack engineer and founder in Prague: career story, how I work, what I value and the languages I speak.",
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
    "Ultralight aviation, motorcycles, travel and sport: what I do when I'm not working.",
  "hobbies.h1": "What I do off duty",
  "hobbies.intro":
    "Ultralight flying, motorcycle touring, travel and sport fill the time when the laptop is closed.",
  "hobbies.jump": "Jump to hobby",
  "hobbies.module": "{category}",
  "hobbies.teaser": "Adventures on the globe",
  "hobbies.teaserText": "Where I've been, home in Prague, and the places still on the list.",
  "hobbies.mapLine": "{countries} on the map",
  "hobbies.openGlobe": "Open the globe",
  "adventures.title": "Adventures",
  "adventures.description":
    "A paper globe of the countries I've visited, home in Prague and the places still on the list. Drag to turn it.",
  "adventures.intro": "Where I've been, home in Prague, and the places still on the list.",
  "adventures.copyGlobe":
    "Drag the globe to turn it; pick a country or a place in the list to fly there.",
  "adventures.copyMap": "Pick a country or a place in the list to see it on the map.",
  "adventures.places": "Countries & places",
  "adventures.home": "Home base: {place}",
  "adventures.visited": "Visited: {countries}",
  "adventures.wishlist": "Want to visit: {n}",
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
  "adventures.legendPoint": "A place: click it for details",
  "adventures.globeAlt":
    "Globe centred on Europe: {n} visited countries in ink with a point for every place, home in the Czech Republic highlighted, wishlist countries outlined with a ring for each place.",
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
  "writing.intro":
    "Things I learned the hard way, written down so I don't have to learn them twice.",
  "writing.empty": "No posts published yet",
  "writing.emptyText": "New notes will appear here.",
  "writing.rss": "RSS feed",
  "writing.tagTitle": 'Posts tagged "{tag}"',
  "writing.tagDescription": "{articles} tagged {tag}.",
  "writing.tagEyebrow": "Tag: {articles}",
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
    "Contact {name} about a senior backend or fullstack role, AI automation or contract work.",
  "contactPage.formLabel": "Contact form",
  "contactPage.intro":
    "Email is the fastest way to reach me. Pick a route above and I'll fill in the subject line for you.",
  "contactPage.privacy": "Privacy",
  "contactPage.privacyOff":
    "While the form isn't connected, this page sends nothing; your text goes only where your own email app sends it.",
  "contactPage.privacyOn":
    "The form sends your name, email, topic and message to Formspree (formspree.io), which processes them on my behalf and forwards them to my inbox. I use them only to reply to you.",
  "contactPage.cookies":
    "This site sets no cookies and runs no analytics. Your theme and language choices stay in your browser's local storage and never leave it.",
  "form.title": "Send a message",
  "form.notConnected": "Form not connected yet",
  "form.notConnectedText": "email me at",
  "form.notConnectedHint": ". You can still fill it in: I'll hand the text to your email app.",
  "form.name": "Name",
  "form.email": "Email",
  "form.topic": "Topic",
  "form.message": "Message",
  "form.errName": "Tell me who you are; a name is enough.",
  "form.errEmail": "I need an email address I can reply to, like name@company.com.",
  "form.errMessage": "Write a sentence or two so I know what it's about.",
  "form.honeypot": "Leave this empty",
  "form.note": "Your message goes to my inbox and nowhere else.",
  "form.send": "Send message",
  "form.asEmail": "Write it as an email",
  "form.sending": "Sending…",
  "form.success": "Message received",
  "form.successText": "Thanks, your message is in my inbox and I'll reply by email.",
  "form.failure": "Message not sent",
  "form.failureText": "Something went wrong on the way. Email me directly at",
  "form.textKept": "(your text is still in the form).",
  "form.offline": "Form not connected yet",
  "form.offlineText": "Nothing was sent. Email me at",
  "form.openApp": "Open it in your email app",
  "form.defaultSubject": "Hello",

  // 404
  "404.title": "Not found",
  "404.description": "That page doesn't exist.",
  "404.heading": "404: this route isn't deployed.",
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
  "nav.expertise": "Zaměření",
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
  "status.open": "Beru nové projekty",
  "status.limited": "Omezená kapacita",
  "status.closed": "Nejsem k dispozici",
  "status.openLabel": "Beru nové projekty",
  "footer.label": "Patička",
  "footer.city": "Praha",
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
  "contact.eyebrow": "Ozvěte se",
  "contact.title1": "Připraven dodat",
  "contact.title2": "váš projekt.",
  "contact.intro":
    "Beru zakázky na backend a fullstack a jsem otevřený i pozici v produktovém týmu. Nejrychleji mě zastihnete e-mailem.",

  // Home
  "hero.work": "Spolupracujme",
  "hero.experience": "Moje zkušenosti",
  "hero.facts": "Ve zkratce",
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
  "proof.workedWith": "Pracoval jsem pro NCR Voyix, CreativeDock, CCA Group, Ableneo a Voda Hory",
  "who.label": "Kdo jsem",
  "who.heading": "Inženýr a zakladatel.",
  "who.now": "Teď: {focus}.",
  "who.basedIn": "Lokalita",
  "who.role": "Role",
  "who.roleValue": "Backend a fullstack engineer",
  "who.languages": "Jazyky",
  "who.experience": "Praxe",
  "who.status": "Status",
  "who.portrait": "Portrét",
  "expertise.title": "Co dělám",
  "stack.title": "Technologie",
  "stack.core": "Hlavní",
  "stack.coreNote": "používám denně",
  "stack.also": "Další",
  "stack.alsoNote": "použité na projektech",
  "stack.hint": "Najeďte na technologii a uvidíte, kde jsem ji používal.",
  "work.title": "Dodané projekty",
  "work.all": "Všechny projekty",
  "work.contribution": "Můj podíl",
  "work.viewCase": "Zobrazit případovou studii",
  "venture.title": "Vlastní produkt",
  "aboutHome.title": "O mně",
  "aboutHome.more": "Víc o mně",
  "record.title": "Praxe",
  "record.cvRequest": "CV na vyžádání",
  "record.cvDownload": "Stáhnout CV",
  "record.years": "Roky",
  "record.company": "Firma",
  "record.role": "Role",
  "record.shipped": "Výsledek",
  "record.full": "Celá praxe",
  "offduty.title": "Po práci",
  "offduty.line": "Pilot ULL v přípravě, mototuristika, {countries} na mapě, sport",
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
    "Samoobslužná platforma pro správu menu, dynamický formulářový engine a nové služby v Kotlinu, každý jako případová studie, plus kód na GitHubu.",
  "projects.intro":
    "Můj vlastní produkt a klientské systémy, které jsem postavil, každý jako případová studie.",
  "projects.featured": "Produkty a vybraná práce",
  "projects.archive": "Archiv",
  "projects.code": "Kód na GitHubu",
  "filters.label": "Filtrovat projekty podle kategorie",
  "filters.all": "Vše",
  "filters.shown": "Zobrazeno: {n}",

  // Experience
  "experience.title": "Zkušenosti",
  "experience.description":
    "Praxe Ivana Sapronova od roku 2021: služby na JVM, produkty v Angularu, identita, Kafka, Kubernetes a cloud a co se na každé pozici změnilo.",
  "experience.intro":
    "Začínal jsem v roce 2021 s CRM na volné noze; od té doby jsem stavěl mikroslužby v Kotlinu a pracoval na platformě pro zhruba dva miliony uživatelů. U každé pozice je, za co jsem odpovídal a co se změnilo.",
  "experience.summary": "Přehled praxe",
  "experience.positions": "Pozice",
  "experience.milestones": "Vzdělání, certifikace a komunita",
  "experience.present": "dosud",
  "experience.technologies": "Technologie",
  "timeline.select": "Vyberte pozici",
  "timeline.play": "Přehrát roky",
  "timeline.pause": "Pozastavit",
  "timeline.scrub": "Táhněte po letech, nebo použijte šipky.",
  "timeline.explode": "Rozložený pohled",
  "timeline.layers":
    "Každá vrstva je jedna pozice, tloušťka ukazuje, jak dlouho trvala. Nejstarší je dole.",
  "timeline.lines": "Technologické linky",
  "timeline.linesHint":
    "Vyberte linku a uvidíte, kde jsem technologii používal, nebo zastávku pro detail.",
  "timeline.allLines": "Všechny linky",
  "timeline.usedAt": "Používal jsem v",

  // About
  "about.title": "O mně",
  "about.description":
    "Ivan Sapronov, backend a fullstack engineer a zakladatel v Praze: můj příběh, jak pracuji, na čem mi záleží a jakými jazyky mluvím.",
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
  "hobbies.description": "Ultralehké létání, motorky, cestování a sport: co dělám, když nepracuji.",
  "hobbies.h1": "Co dělám po práci",
  "hobbies.intro":
    "Ultralehké létání, mototuristika, cestování a sport vyplňují čas, kdy je notebook zavřený.",
  "hobbies.jump": "Přejít na koníček",
  "hobbies.module": "{category}",
  "hobbies.teaser": "Cesty na glóbu",
  "hobbies.teaserText": "Kde jsem byl, domov v Praze a místa, která mám ještě na seznamu.",
  "hobbies.mapLine": "{countries} na mapě",
  "hobbies.openGlobe": "Otevřít glóbus",
  "adventures.title": "Cesty",
  "adventures.description":
    "Papírový glóbus zemí, které jsem navštívil, domova v Praze a míst, která mám ještě na seznamu. Otočíte ho tažením.",
  "adventures.intro": "Kde jsem byl, domov v Praze a místa, která mám ještě na seznamu.",
  "adventures.copyGlobe":
    "Glóbus otočíte tažením; vyberte zemi nebo místo v seznamu a glóbus se k němu natočí.",
  "adventures.copyMap": "Vyberte zemi nebo místo v seznamu a uvidíte ho na mapě.",
  "adventures.places": "Země a místa",
  "adventures.home": "Domov: {place}",
  "adventures.visited": "Navštíveno: {countries}",
  "adventures.wishlist": "Chci navštívit: {n}",
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
  "adventures.legendPoint": "Místo: klikněte pro detail",
  "adventures.globeAlt":
    "Glóbus se středem v Evropě: navštívené země ({n}) černě s bodem pro každé místo, domov v Česku zvýrazněný, země ze seznamu přání obtažené a s kroužkem pro každé místo.",
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
  "writing.intro":
    "Věci, které jsem se naučil na vlastní kůži, sepsané, abych se je nemusel učit dvakrát.",
  "writing.empty": "Zatím žádné články",
  "writing.emptyText": "Nové poznámky se objeví tady.",
  "writing.rss": "RSS kanál",
  "writing.tagTitle": "Články se štítkem „{tag}“",
  "writing.tagDescription": "{articles} se štítkem {tag}.",
  "writing.tagEyebrow": "Štítek: {articles}",
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
    "Napište mi kvůli pozici senior backend nebo fullstack, AI automatizaci nebo zakázce.",
  "contactPage.formLabel": "Kontaktní formulář",
  "contactPage.intro":
    "Nejrychleji mě zastihnete e-mailem. Vyberte si výše jednu z možností a předmět se vyplní sám.",
  "contactPage.privacy": "Soukromí",
  "contactPage.privacyOff":
    "Dokud formulář není připojený, tato stránka nic neodesílá; text jde jen tam, kam ho pošle váš vlastní e-mailový program.",
  "contactPage.privacyOn":
    "Formulář posílá vaše jméno, e-mail, téma a zprávu službě Formspree (formspree.io), která je zpracuje mým jménem a přepošle do mé schránky. Používám je jen k tomu, abych vám odpověděl.",
  "contactPage.cookies":
    "Tento web nepoužívá cookies ani analytiku. Volba režimu a jazyka zůstává jen v místním úložišti vašeho prohlížeče a nikam se neodesílá.",
  "form.title": "Napište zprávu",
  "form.notConnected": "Formulář zatím není připojený",
  "form.notConnectedText": "napište mi na",
  "form.notConnectedHint": ". Vyplnit ho můžete i tak: text předám vašemu e-mailovému programu.",
  "form.name": "Jméno",
  "form.email": "E-mail",
  "form.topic": "Téma",
  "form.message": "Zpráva",
  "form.errName": "Napište, kdo jste. Stačí jméno.",
  "form.errEmail": "Potřebuji e-mail, na který můžu odpovědět, třeba jmeno@firma.cz.",
  "form.errMessage": "Napište větu nebo dvě, ať vím, o co jde.",
  "form.honeypot": "Toto pole nechte prázdné",
  "form.note": "Zpráva půjde do mé schránky a nikam jinam.",
  "form.send": "Odeslat zprávu",
  "form.asEmail": "Napsat jako e-mail",
  "form.sending": "Odesílám…",
  "form.success": "Zpráva doručena",
  "form.successText": "Díky, zpráva je v mé schránce a odpovím e-mailem.",
  "form.failure": "Zpráva neodešla",
  "form.failureText": "Cestou se něco pokazilo. Napište mi přímo na",
  "form.textKept": "(text zůstal ve formuláři).",
  "form.offline": "Formulář zatím není připojený",
  "form.offlineText": "Nic se neodeslalo. Napište mi na",
  "form.openApp": "Otevřít v e-mailovém programu",
  "form.defaultSubject": "Dobrý den",

  // 404
  "404.title": "Stránka nenalezena",
  "404.description": "Tahle stránka neexistuje.",
  "404.heading": "404: tahle cesta není nasazená.",
  "404.back": "Zpět na úvod",
  "404.alt":
    "Výkres cíle nasazení: čárkovaná šipka CI/CD vede k čárkovanému půdorysu, kde stojí tři bloky služeb a čtvrtý chybí, naznačený jen čárkovaným obrysem.",

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
