import { expect, test, type Browser, type Page } from "@playwright/test";

/** Every page in Czech (English URLs with the /cs prefix). */
const csRoutes = [
  "/cs",
  "/cs/about",
  "/cs/projects",
  "/cs/projects/ownira",
  "/cs/projects/self-service-menu-platform",
  "/cs/projects/dynamic-form-engine",
  "/cs/projects/creativedock-greenfield-services",
  "/cs/experience",
  "/cs/writing",
  "/cs/hobbies",
  "/cs/adventures",
  "/cs/now",
  "/cs/contact",
  "/cs/404",
];

const OPERATOR_EN =
  "Ivan Sapronov · IČO 23157852 · Argentinská 1624/32, 170 00 Prague 7, Czech Republic · Sole trader registered in the Czech Trade Register";
const OPERATOR_CS =
  "Ivan Sapronov · IČO 23157852 · Argentinská 1624/32, 170 00 Praha 7 · Fyzická osoba zapsaná v živnostenském rejstříku";

/** Text with non-breaking spaces read as plain spaces. */
const plain = (s: string | null) => (s ?? "").replace(/ /g, " ").trim();

for (const route of csRoutes) {
  test(`${route} renders in Czech: lang, h1, no horizontal scroll, no placeholders, no errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "cs");
    await expect(page.locator("h1").first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    expect(await page.locator("body").innerText()).not.toMatch(/\[[^\]\n]{2,}\]/);
    expect(plain(await page.locator("[data-operator]").textContent())).toBe(OPERATOR_CS);
    expect(errors).toEqual([]);
  });
}

test("English pages carry the English operator line", async ({ page }) => {
  for (const route of ["/", "/projects/ownira", "/no-such-page"]) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(plain(await page.locator("[data-operator]").textContent()), route).toBe(OPERATOR_EN);
  }
});

test("Czech pages link within /cs and translate the chrome", async ({ page, isMobile }) => {
  await page.goto("/cs/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Inženýr a zakladatel.");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "Projekty" })).toHaveAttribute(
    "href",
    "/cs/projects",
  );
  if (!isMobile) {
    const nav = page.getByRole("navigation", { name: "Hlavní navigace" });
    await expect(nav.getByRole("link")).toHaveText(["Zaměření", "Zkušenosti", "Projekty", "O mně"]);
    await expect(nav.getByRole("link", { name: "O mně" })).toHaveAttribute("aria-current", "page");
  }
  // Internal links never leave the Czech site (files like /rss.xml aside).
  const hrefs = await page
    .locator("a[href^='/']:not([data-lang-choice])")
    .evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""));
  const leaks = hrefs.filter((h) => !/^\/cs(\/|$|\?|#)/.test(h) && !/\.[a-z]+$/i.test(h));
  expect(leaks).toEqual([]);
});

test("hreflang alternates, canonical and og:locale per language", async ({ page }) => {
  const origin = "https://ivansapronov.com";
  for (const [route, canonical, ogLocale] of [
    ["/projects/ownira", `${origin}/projects/ownira`, "en_US"],
    ["/cs/projects/ownira", `${origin}/cs/projects/ownira`, "cs_CZ"],
  ] as const) {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      `${origin}/projects/ownira`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="cs"]')).toHaveAttribute(
      "href",
      `${origin}/cs/projects/ownira`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      `${origin}/projects/ownira`,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", ogLocale);
  }
});

test("Czech home: Czech hero poster, facts, chips and WebSite language", async ({ page }) => {
  await page.goto("/cs");
  const srcset = await page
    .locator(".hero-poster picture")
    .evaluate((p) => p.innerHTML.match(/blueprint[^"\s,]*/g)?.join(" ") ?? "");
  expect(srcset).toContain("-cs");
  expect(srcset).not.toMatch(/blueprint-light\.[^-]/);
  await expect(page.locator("[data-hero-stage]")).toHaveAttribute("data-labels", /NÁPAD/);
  const facts = page.locator('#top dl[aria-label="Ve zkratce"]');
  await expect(facts).toContainText("Backend a mikroslužby");
  await expect(facts).toContainText("Na IČO, i na dálku");
  await expect(page.locator("main h2").first()).toHaveText("Co dělám");
  await expect(page.locator("#projects")).toContainText("~2 mil. uživatelů");
  const ld = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((s) => s.map((x) => JSON.parse(x.textContent ?? "{}")));
  expect(ld.find((d) => d["@type"] === "WebSite")?.inLanguage).toBe("cs-CZ");
});

/** The EN | CS switch: in the header (≥ 521px) or the menu sheet on phones. */
async function switchTo(page: Page, code: "EN" | "CS", isMobile: boolean) {
  let scope = page.locator("header").first();
  if (isMobile) {
    const open = await page.locator("html").getAttribute("lang");
    await page.getByRole("button", { name: open === "cs" ? "Otevřít menu" : "Open menu" }).click();
    scope = page.getByRole("dialog");
    await expect(scope).toBeVisible();
  }
  await scope.locator(`a[data-lang-choice="${code.toLowerCase()}"]:visible`).first().click();
}

test("language switch: same page in the other language, choice is stored", async ({
  page,
  isMobile,
}) => {
  await page.goto("/projects/ownira");
  const cs = page.locator('a[data-lang-choice="cs"]').first();
  await expect(cs).toHaveAttribute("href", "/cs/projects/ownira");
  await expect(cs).toHaveAttribute("hreflang", "cs");
  await expect(page.locator('a[data-lang-choice="en"]').first()).toHaveAttribute(
    "aria-current",
    "true",
  );
  await switchTo(page, "CS", isMobile);
  await expect(page).toHaveURL(/\/cs\/projects\/ownira$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "cs");
  expect(await page.evaluate(() => localStorage.getItem("lang"))).toBe("cs");

  await switchTo(page, "EN", isMobile);
  await expect(page).toHaveURL(/\/projects\/ownira$/);
  await expect(page).not.toHaveURL(/\/cs\//);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(await page.evaluate(() => localStorage.getItem("lang"))).toBe("en");
});

test("404 in Czech: Czech page under /cs, back link to the Czech home", async ({ page }) => {
  const response = await page.goto("/cs/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "cs");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "404: tahle cesta není nasazená.",
  );
  await expect(page.getByRole("link", { name: "Zpět na úvod" })).toHaveAttribute("href", "/cs");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("Czech contact form: topic from ?topic=, Czech errors and mailto subject", async ({
  page,
}) => {
  await page.goto("/cs/contact?topic=investing");
  await expect(page.getByLabel("Téma")).toHaveValue("investing");
  await expect(page.getByLabel("Téma").locator("option:checked")).toHaveText("Investice");
  await page.getByRole("button", { name: "Napsat jako e-mail" }).click();
  await expect(page.getByText("Napište, kdo jste. Stačí jméno.")).toBeVisible();
  await page.getByLabel("Jméno").fill("Jana");
  await page.getByLabel("E-mail", { exact: true }).fill("jana@firma.cz");
  await page.getByLabel("Zpráva").fill("Dobrý den, rádi bychom se potkali.");
  await page.getByRole("button", { name: "Napsat jako e-mail" }).click();
  const offline = page.locator('[data-state="offline"]');
  await expect(offline).toBeVisible();
  await expect(offline).toContainText(/formulář zatím není připojený/i);
  await expect(page.locator("[data-mailto]")).toHaveAttribute("href", /subject=Investice/);
  // Route cards on /cs/contact are emails with Czech subjects.
  await expect(page.getByRole("link", { name: /Nábor/ }).first()).toHaveAttribute(
    "href",
    /subject=N%C3%A1bor/,
  );
});

/* Browser-language redirect --------------------------------------------------- */

/**
 * A browser context that looks like a person's browser: Playwright sets
 * navigator.webdriver, which the redirect script (rightly) treats as automation.
 */
async function humanContext(browser: Browser, locale: string, storedLang?: string) {
  const context = await browser.newContext({ locale });
  await context.addInitScript((stored) => {
    Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false });
    if (stored) {
      try {
        localStorage.setItem("lang", stored);
      } catch {
        /* ignore */
      }
    }
  }, storedLang);
  return context;
}

test.describe("browser language", () => {
  test("a Czech browser with no stored choice lands on /cs (query and hash kept)", async ({
    browser,
    baseURL,
  }) => {
    const context = await humanContext(browser, "cs-CZ");
    const page = await context.newPage();
    await page.goto(`${baseURL}/projects?x=1#code-heading`);
    await expect(page).toHaveURL(/\/cs\/projects\?x=1#code-heading$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "cs");
    await page.goto(`${baseURL}/`);
    await expect(page).toHaveURL(/\/cs$/);
    await context.close();
  });

  for (const locale of ["en-US", "de-DE"]) {
    test(`${locale} browser stays on English`, async ({ browser, baseURL }) => {
      const context = await humanContext(browser, locale);
      const page = await context.newPage();
      await page.goto(`${baseURL}/about`);
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/about$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await context.close();
    });
  }

  test("never redirects away from /cs", async ({ browser, baseURL }) => {
    const context = await humanContext(browser, "en-US");
    const page = await context.newPage();
    await page.goto(`${baseURL}/cs/about`);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/cs\/about$/);
    await context.close();
  });

  test("a stored choice beats the browser language", async ({ browser, baseURL }) => {
    const english = await humanContext(browser, "cs-CZ", "en");
    const p1 = await english.newPage();
    await p1.goto(`${baseURL}/about`);
    await p1.waitForLoadState("networkidle");
    await expect(p1).toHaveURL(/\/about$/);
    await expect(p1).not.toHaveURL(/\/cs\//);
    await english.close();

    const czech = await humanContext(browser, "en-US", "cs");
    const p2 = await czech.newPage();
    await p2.goto(`${baseURL}/about`);
    await expect(p2).toHaveURL(/\/cs\/about$/);
    await czech.close();
  });

  test("automated browsers and bots are never redirected", async ({ browser, baseURL }) => {
    const robot = await browser.newContext({ locale: "cs-CZ" }); // navigator.webdriver = true
    const p1 = await robot.newPage();
    await p1.goto(`${baseURL}/about`);
    await p1.waitForLoadState("networkidle");
    await expect(p1).toHaveURL(/\/about$/);
    await robot.close();

    const bot = await browser.newContext({
      locale: "cs-CZ",
      userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    });
    await bot.addInitScript(() =>
      Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false }),
    );
    const p2 = await bot.newPage();
    await p2.goto(`${baseURL}/about`);
    await p2.waitForLoadState("networkidle");
    await expect(p2).toHaveURL(/\/about$/);
    await bot.close();
  });
});

test("adventures in Czech: Czech country names and globe hover names", async ({ page }) => {
  await page.goto("/cs/adventures");
  const places = page.locator(".places");
  await expect(places).toContainText("Německo");
  await expect(places).toContainText("Mnichov");
  await expect(page.locator("[data-globe-stage]")).toHaveAttribute("data-names", /Spojené státy/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/\d+ zem(í|ě) na mapě/);
});

test("Czech copy uses non-breaking spaces after one-letter prepositions", async ({ page }) => {
  await page.goto("/cs");
  const text = await page.locator("main").innerText();
  // "a nasazuji", "v Praze" … never end a line: the space after them is U+00A0.
  expect(text).not.toMatch(/(^|[\s(„])[ksvzouai] (?=\S)/i);
});
