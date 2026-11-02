/**
 * Content for the About page that is easier to edit as data than as markup, in English
 * and Czech. Anything in [brackets] is a placeholder (hidden in production).
 */
import type { Locale } from "@/i18n/locales";
import { typoDeep } from "@/i18n/typo";

type AboutCopy = {
  /** Career story. `{ownira}` becomes the link to the Ownira case study. */
  story: string[];
  philosophy: Array<{ title: string; text: string }>;
  enjoys: string[];
  values: Array<{ label: string; text: string }>;
  facts: Array<{ icon: string; text: string }>;
};

const copy: Record<Locale, AboutCopy> = {
  en: {
    story: [
      "I'm Ivan Sapronov, a backend and fullstack engineer based in Prague with about five years of building and scaling enterprise web applications and services. Most of my time is on the JVM — Java and Kotlin, Spring — and on the Angular frontends, cloud infrastructure and identity systems that real products are made of.",
      "I started freelancing in Java in 2021, building a CRM with an admin panel and the analytics services behind its React dashboards. At Ableneo the problems got more distributed: Redis caching and reactive services with Spring WebFlux, Keycloak for SSO and CIAM, Kafka with custom connectors, Dockerised services on Kubernetes, and Grafana, Prometheus and InfluxDB to watch it all in production.",
      "At CCA Group I owned both sides of the stack — a dynamic form engine in Angular that cut the time to create new form types from days to hours, and the Java services behind it, some of which I moved to Kotlin coroutines to roughly halve p95 latency under peak load. At NCR Voyix I designed backend-for-frontend and aggregator services for a system serving around two million users, built a self-service Angular platform for US clients, ran services on GCP with full observability, and started using LLM and agentic tooling to take the routine out of engineering work.",
      "Most recently I spent three months at CreativeDock building Kotlin/Spring Boot microservices from scratch and fixing the GitLab CI and Argo CD plumbing around them. Right now I'm building {ownira}, now in pilot.",
      "The rest of my time goes to things with engines and horizons: I am a pilot in training on ultralight aircraft, I ride motorcycles, and I keep a growing list of countries. Flying rewards preparation and checklists, riding rewards attention, travel rewards curiosity — the same traits I try to bring to a codebase.",
    ],
    philosophy: [
      {
        title: "Boring infrastructure, interesting products",
        text: "Pick the well-trodden path for databases, queues and identity, and spend the novelty budget on the thing users actually touch.",
      },
      {
        title: "Correct first, then fast",
        text: "A wallet that is off by one cent is not a wallet. Measure before optimising, and never trust a benchmark you didn't run yourself.",
      },
      {
        title: "Checklists over heroics",
        // v2 (2026-10-23): the flying metaphor was removed (no aviation outside the hobby pages).
        text: "Good people make bad mistakes when routine is skipped. Runbooks, reviews and tests are how I keep the routine.",
      },
      {
        title: "Ship, then write it down",
        text: "A decision that isn't written down gets re-made every six months. Short ADRs, honest READMEs and case studies like the ones on this site.",
      },
    ],
    enjoys: [
      "Microservices and event-driven systems on the JVM",
      "Backend-for-frontend and aggregation layers",
      "Identity & access (OAuth2, OIDC, Keycloak, CIAM)",
      "Kotlin coroutines and reactive Spring",
      "Angular products that replace manual processes",
      "Cloud-native delivery on GCP, AWS and Kubernetes",
      "CI/CD pipelines that stay fast under load",
      "LLM and agentic tooling for routine engineering work",
      "Market research for things I might build next",
    ],
    values: [
      { label: "Honesty", text: "Say what the numbers say. Placeholders beat invented metrics." },
      { label: "Ownership", text: "Own the outcome, not the ticket." },
      { label: "Curiosity", text: "New countries, new protocols, new engines — same itch." },
      {
        label: "Respect for time",
        text: "Yours, mine and the reader's. Short meetings, clear docs.",
      },
    ],
    facts: [
      { icon: "Plane", text: "I fly ultralight aircraft — [hours / licence status]." },
      { icon: "Bike", text: "Current bike: [MAKE & MODEL]. Longest ride so far: [N km]." },
      { icon: "Globe", text: "Countries visited: [N]. Next up: [COUNTRY]." },
      { icon: "Dumbbell", text: "[Sport you practise] — [N] sessions a week." },
      { icon: "Cpu", text: "First program: [what it was and in which language]." },
      { icon: "Heart", text: "[An interesting fact nobody would guess]." },
    ],
  },
  cs: {
    story: [
      "Jsem Ivan Sapronov, backend a fullstack engineer z Prahy. Zhruba pět let stavím a škáluji podnikové webové aplikace a služby. Většinu času trávím na JVM – Java a Kotlin, Spring – a u frontendů v Angularu, cloudové infrastruktury a systémů pro správu identit, ze kterých se skutečné produkty skládají.",
      "Na volné noze jsem v Javě začal v roce 2021: CRM s administrací a analytické služby pro jeho dashboardy v Reactu. V Ableneo byly problémy distribuovanější: cache v Redisu a reaktivní služby se Spring WebFlux, Keycloak pro SSO a CIAM, Kafka s vlastními konektory, služby v Dockeru na Kubernetes a Grafana, Prometheus a InfluxDB, abych to všechno v produkci uhlídal.",
      "V CCA Group jsem měl na starosti obě strany stacku – dynamický formulářový engine v Angularu, který zkrátil vytvoření nového typu formuláře ze dnů na hodiny, a služby v Javě za ním. Část z nich jsem převedl na korutiny v Kotlinu, čímž se latence p95 při špičkové zátěži zhruba snížila na polovinu. V NCR Voyix jsem navrhoval služby backend-for-frontend a agregátory pro systém se zhruba dvěma miliony uživatelů, postavil samoobslužnou platformu v Angularu pro klienty v USA, provozoval služby na GCP s plnou observabilitou a začal používat LLM a agentní nástroje, abych z inženýrské práce odstranil rutinu.",
      "Naposledy jsem tři měsíce v CreativeDock stavěl mikroslužby v Kotlinu/Spring Bootu od nuly a opravoval kolem nich infrastrukturu GitLab CI a Argo CD. Teď stavím produkt {ownira}, který je v pilotním provozu.",
      "Zbytek času patří věcem s motory a obzory: jsem pilot ultralehkých letadel ve výcviku, jezdím na motorce a můj seznam navštívených zemí stále roste. Létání odměňuje přípravu a checklisty, jízda pozornost, cestování zvědavost – stejné vlastnosti se snažím přinášet i do kódu.",
    ],
    philosophy: [
      {
        title: "Nudná infrastruktura, zajímavé produkty",
        text: "Pro databáze, fronty a identitu volím osvědčené cesty a rozpočet na novinky utrácím za to, na co uživatelé skutečně sahají.",
      },
      {
        title: "Nejdřív správně, pak rychle",
        text: "Peněženka, která se splete o jeden cent, není peněženka. Nejdřív měřit, pak optimalizovat – a nevěřit benchmarku, který jsem sám nespustil.",
      },
      {
        title: "Checklisty místo hrdinství",
        text: "I dobří lidé dělají hloupé chyby, když se vynechá rutina. Runbooky, review a testy jsou způsob, jak rutinu dodržuji.",
      },
      {
        title: "Vydat, pak sepsat",
        text: "Rozhodnutí, které není zapsané, se každého půl roku dělá znovu. Krátká ADR, poctivá README a případové studie, jako jsou ty na tomto webu.",
      },
    ],
    enjoys: [
      "Mikroslužby a event-driven systémy na JVM",
      "Vrstvy backend-for-frontend a agregace",
      "Identita a přístup (OAuth2, OIDC, Keycloak, CIAM)",
      "Korutiny v Kotlinu a reaktivní Spring",
      "Produkty v Angularu, které nahrazují ruční procesy",
      "Cloud-native delivery na GCP, AWS a Kubernetes",
      "CI/CD pipeline, které zůstávají rychlé i pod zátěží",
      "LLM a agentní nástroje pro rutinní inženýrskou práci",
      "Průzkum trhu pro věci, které bych mohl postavit příště",
    ],
    values: [
      {
        label: "Poctivost",
        text: "Říkat, co říkají čísla. Prázdné místo je lepší než vymyšlená metrika.",
      },
      { label: "Odpovědnost", text: "Odpovídám za výsledek, ne za tiket." },
      {
        label: "Zvědavost",
        text: "Nové země, nové protokoly, nové motory – pořád stejné nutkání.",
      },
      {
        label: "Respekt k času",
        text: "K vašemu, mému i čtenářovu. Krátké schůzky, jasná dokumentace.",
      },
    ],
    facts: [
      { icon: "Plane", text: "Létám na ultralehkých letadlech – [hodiny / stav licence]." },
      { icon: "Bike", text: "Aktuální motorka: [ZNAČKA A MODEL]. Nejdelší jízda: [N km]." },
      { icon: "Globe", text: "Navštívené země: [N]. Další na řadě: [ZEMĚ]." },
      { icon: "Dumbbell", text: "[Sport, který dělám] – [N] tréninků týdně." },
      { icon: "Cpu", text: "První program: [co to bylo a v jakém jazyce]." },
      { icon: "Heart", text: "[Zajímavost, kterou by nikdo nehádal]." },
    ],
  },
};

const czech = typoDeep(copy.cs);
export const aboutCopy = (locale: Locale): AboutCopy => (locale === "cs" ? czech : copy.en);
