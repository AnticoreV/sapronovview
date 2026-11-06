/**
 * Content for the About page that is easier to edit as data than as markup, in English
 * and Czech. Anything in [brackets] is a placeholder (hidden in production).
 */
import type { Locale } from "@/i18n/locales";
import { typoDeep } from "@/i18n/typo";
import { visitedCountryCount } from "@data/adventures";

type AboutCopy = {
  /** Career story, one string per paragraph. */
  story: string[];
  philosophy: Array<{ title: string; text: string }>;
  enjoys: string[];
  values: Array<{ label: string; text: string }>;
  facts: Array<{ icon: string; text: string }>;
};

const copy: Record<Locale, AboutCopy> = {
  en: {
    story: [
      "I'm Ivan Sapronov, a backend and fullstack engineer in Prague. I've spent about five years building and scaling enterprise web applications and services, mostly on the JVM (Java, Kotlin, Spring), plus the Angular frontends, cloud infrastructure and identity systems around them.",
      "My first freelance Java project, in 2021, was a CRM with an admin panel and the analytics services behind its React dashboards. Ableneo came next, and the problems got more distributed: Redis caching and reactive services with Spring WebFlux, Keycloak for SSO and CIAM, Kafka with custom connectors, Dockerised services on Kubernetes, and Grafana, Prometheus and InfluxDB to watch it all in production.",
      "At CCA Group I owned both sides of the stack: a dynamic form engine in Angular that cut the time to create a new form type from days to hours, and the Java services behind it. I moved some of those services to Kotlin coroutines, which roughly halved p95 latency under peak load. Then, at NCR Voyix, I designed backend-for-frontend and aggregator services for a system serving around two million users, built a self-service Angular platform for US clients, ran services on GCP with full observability, and started using LLM and agentic tooling to take the routine out of engineering work.",
      "Most recently I spent three months at CreativeDock building Kotlin/Spring Boot microservices from scratch and fixing the GitLab CI and Argo CD plumbing around them. Right now I take contract work: backend and fullstack development, and AI automation built into a team's everyday processes.",
      "The rest of my time goes to things with engines and horizons: I am a pilot in training on ultralight aircraft, I ride motorcycles, and I keep a growing list of countries. Flying rewards preparation and checklists, riding rewards attention, travel rewards curiosity; I try to bring the same traits to a codebase.",
    ],
    philosophy: [
      {
        title: "Boring infrastructure, interesting products",
        text: "Pick the well-trodden path for databases, queues and identity, and spend the novelty budget on what users touch.",
      },
      {
        title: "Correct first, then fast",
        text: "A wallet that is off by one cent is not a wallet. Measure before optimising, and never trust a benchmark you didn't run yourself.",
      },
      {
        title: "Checklists over heroics",
        // v2 (2026-10-23): the flying metaphor was removed (no aviation outside the hobby pages).
        text: "Good people make bad mistakes when they skip the routine; runbooks, reviews and tests keep me on it.",
      },
      {
        title: "Write decisions down",
        text: "A decision nobody wrote down gets re-made every six months, so I keep short ADRs and READMEs next to the code.",
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
      {
        label: "Honesty",
        text: "I report numbers as measured, and I'd rather leave a gap than invent a metric.",
      },
      {
        label: "Ownership",
        text: "I follow a change into production and check that it works for the people using it.",
      },
      { label: "Curiosity", text: "New protocols and new countries scratch the same itch." },
      {
        label: "Respect for time",
        text: "Short meetings, and docs you can read in five minutes.",
      },
    ],
    facts: [
      { icon: "Plane", text: "I fly ultralight aircraft: 15 hours so far, as a student pilot." },
      { icon: "Bike", text: "Current bike: BMW S 1000 R (2025). About 15,000 km ridden so far." },
      { icon: "Globe", text: `Countries visited: ${visitedCountryCount}.` },
      { icon: "Dumbbell", text: "Gym three or four times a week, snowboarding in winter." },
      {
        icon: "Cpu",
        text: "First program: a small Notion-like app in Java, on a servlet with a little HTML, CSS and JavaScript front end, for notes and handy system tools.",
      },
      { icon: "Heart", text: "I've made a parachute jump and completed a D-grade via ferrata." },
    ],
  },
  cs: {
    story: [
      "Jsem Ivan Sapronov, backend a fullstack engineer z Prahy. Zhruba pět let stavím a škáluji podnikové webové aplikace a služby, hlavně na JVM (Java, Kotlin, Spring), a k nim frontendy v Angularu, cloudovou infrastrukturu a systémy pro správu identit.",
      "Na volné noze jsem v Javě začal v roce 2021: CRM s administrací a analytické služby pro jeho dashboardy v Reactu. Pak přišlo Ableneo a s ním distribuovanější problémy: cache v Redisu a reaktivní služby se Spring WebFlux, Keycloak pro SSO a CIAM, Kafka s vlastními konektory, služby v Dockeru na Kubernetes a Grafana, Prometheus a InfluxDB, abych to všechno v produkci uhlídal.",
      "V CCA Group jsem měl na starosti obě strany stacku: dynamický formulářový engine v Angularu, který zkrátil vytvoření nového typu formuláře ze dnů na hodiny, a služby v Javě za ním. Část z nich jsem převedl na korutiny v Kotlinu, čímž se latence p95 při špičkové zátěži zhruba snížila na polovinu. Potom jsem v NCR Voyix navrhoval služby backend-for-frontend a agregátory pro systém se zhruba dvěma miliony uživatelů, postavil samoobslužnou platformu v Angularu pro klienty v USA, provozoval služby na GCP s plnou observabilitou a začal používat LLM a agentní nástroje, abych z inženýrské práce odstranil rutinu.",
      "Naposledy jsem tři měsíce v CreativeDock stavěl mikroslužby v Kotlinu/Spring Bootu od nuly a opravoval kolem nich infrastrukturu GitLab CI a Argo CD. Teď beru zakázky: vývoj backendu i fullstacku a AI automatizaci zapojenou do každodenních procesů týmu.",
      "Zbytek času patří věcem s motory a obzory: jsem pilot ultralehkých letadel ve výcviku, jezdím na motorce a můj seznam navštívených zemí stále roste. Létání odměňuje přípravu a checklisty, jízda pozornost a cestování zvědavost; stejné vlastnosti se snažím přinášet i do kódu.",
    ],
    philosophy: [
      {
        title: "Nudná infrastruktura, zajímavé produkty",
        text: "Pro databáze, fronty a identitu volím osvědčené cesty a rozpočet na novinky utrácím za to, na co uživatelé sahají.",
      },
      {
        title: "Nejdřív správně, pak rychle",
        text: "Peněženka, která se splete o jeden cent, není peněženka. Nejdřív měřit, pak optimalizovat, a nevěřit benchmarku, který jsem sám nespustil.",
      },
      {
        title: "Checklisty místo hrdinství",
        text: "I dobří lidé dělají hloupé chyby, když vynechají rutinu; runbooky, review a testy mě u ní drží.",
      },
      {
        title: "Zapisovat rozhodnutí",
        text: "Rozhodnutí, které nikdo nezapsal, se každého půl roku dělá znovu, a tak vedle kódu držím krátká ADR a README.",
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
        text: "Čísla uvádím tak, jak jsem je naměřil, a raději nechám mezeru, než abych metriku vymyslel.",
      },
      {
        label: "Odpovědnost",
        text: "Změnu sleduji až do produkce a ověřím, že funguje lidem, kteří ji používají.",
      },
      {
        label: "Zvědavost",
        text: "Nové protokoly i nové země mě lákají ze stejného důvodu.",
      },
      {
        label: "Respekt k času",
        text: "Krátké schůzky a dokumentace, kterou přečtete za pět minut.",
      },
    ],
    facts: [
      { icon: "Plane", text: "Létám na ultralehkých letadlech: zatím 15 hodin jako žák pilot." },
      { icon: "Bike", text: "Aktuální motorka: BMW S 1000 R (2025). Najeto mám zhruba 15 000 km." },
      { icon: "Globe", text: `Navštívené země: ${visitedCountryCount}.` },
      { icon: "Dumbbell", text: "Posilovna třikrát až čtyřikrát týdně, v zimě snowboard." },
      {
        icon: "Cpu",
        text: "První program: malá aplikace ve stylu Notionu v Javě na servletu s jednoduchým frontendem v HTML, CSS a JavaScriptu, na poznámky a užitečné systémové nástroje.",
      },
      { icon: "Heart", text: "Mám za sebou seskok padákem a ferratu obtížnosti D." },
    ],
  },
};

const czech = typoDeep(copy.cs);
export const aboutCopy = (locale: Locale): AboutCopy => (locale === "cs" ? czech : copy.en);
