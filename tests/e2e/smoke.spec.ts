import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/projects",
  "/projects/ownira",
  "/projects/self-service-menu-platform",
  "/projects/dynamic-form-engine",
  "/projects/creativedock-greenfield-services",
  "/experience",
  "/writing",
  "/hobbies",
  "/adventures",
  "/now",
  "/contact",
  "/404",
];

/** Requests for the three.js / scene chunks made by the page so far. */
const threeRequests = (page: Page) =>
  page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((e) => e.name)
      .filter((n) => /\/(three\.module|hero3d|globe3d)\.[^/]*\.js/.test(n)),
  );

for (const route of routes) {
  test(`${route} renders: h1, no horizontal scroll, no placeholders, no errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    // Placeholders like "[N km]" must never reach the public site.
    expect(await page.locator("body").innerText()).not.toMatch(/\[[^\]\n]{2,}\]/);
    expect(errors).toEqual([]);
  });
}

test("no aviation vocabulary outside the hobby pages", async ({ page }) => {
  const banned =
    /callsign|LKPR|pre-?flight|annunciator|kneeboard|logbook|crew card|cleared for|off course|systems online|instrument/i;
  for (const route of ["/", "/about", "/projects", "/experience", "/contact", "/no-such-page"]) {
    await page.goto(route);
    expect(await page.locator("body").innerText(), route).not.toMatch(banned);
  }
});

test("unknown route shows the 404 page", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "404 — this route isn't deployed.",
  );
  await expect(page.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
  expect(await threeRequests(page)).toEqual([]);
});

test("every page ends with the contact panel and its routes", async ({ page }) => {
  await page.goto("/about");
  const panel = page.locator("#contact");
  await expect(
    panel.getByRole("heading", { name: /Ready to ship\s*your project\./ }),
  ).toBeVisible();
  await expect(panel.locator('a[href="/contact?topic=hiring"]')).toBeVisible();
  await expect(panel.locator('a[href="/contact?topic=investing"]')).toContainText(
    "Stage, progress and plans — let's talk.",
  );
  await expect(panel.locator('a[href="/contact?topic=partnering"]')).toBeVisible();
  await expect(panel.locator('a[href^="mailto:"]').first()).toBeVisible();
});

test("contact form: topic from ?topic=, field errors, honest not-connected state", async ({
  page,
}) => {
  await page.goto("/contact?topic=investing");
  await expect(page.locator("#cf-topic")).toHaveValue("investing");
  await expect(page.getByText("Form not connected yet", { exact: true })).toBeVisible();
  // On /contact the routes are emails with the subject filled in.
  await expect(page.locator('#contact a[href*="subject=Investing"]')).toBeVisible();

  const submit = page.locator("[data-contact-form] button[type=submit]");
  await submit.click();
  await expect(page.locator("#cf-name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#cf-name-error")).toBeVisible();
  await expect(page.locator("#cf-email-error")).toBeVisible();
  await expect(page.locator("#cf-message-error")).toBeVisible();

  await page.fill("#cf-name", "Test Person");
  await page.fill("#cf-email", "test@example.com");
  await page.fill("#cf-message", "Hello — this is a smoke test message.");
  await submit.click();
  const offline = page.locator('[data-state="offline"]');
  await expect(offline).toBeVisible();
  await expect(offline.locator("[data-mailto]")).toHaveAttribute(
    "href",
    /^mailto:.+subject=Investing/,
  );
  await expect(page.locator('[data-state="success"]')).toBeHidden();
  // The text stays in the form.
  await expect(page.locator("#cf-message")).toHaveValue(/smoke test/);
});

test("hero eyebrow never starts a line with a separator", async ({ page }) => {
  await page.goto("/");
  const text = await page.locator("#top p").first().textContent();
  expect(text).toContain("FOUNDER\u00a0·\u00a0PRAGUE");
  expect(text).not.toMatch(/ ·/);
});

test("without a stored choice the theme follows OS changes live", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/about");
  await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  await expect(page.locator("[data-theme-toggle]")).toHaveAttribute("aria-pressed", "true");
});

test("theme toggle switches to dark and remembers it", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator("[data-theme-toggle]");
  const wasDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(wasDark ? /^(?!.*\bdark\b)/ : /\bdark\b/);
  await expect(toggle).toHaveAttribute("aria-pressed", String(!wasDark));
  await page.reload();
  const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  expect(isDark).toBe(!wasDark);
});

test.describe("dark theme", () => {
  test.use({ colorScheme: "dark" });

  test("follows the OS preference: dark tokens, pressed toggle, dark poster", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.locator("[data-theme-toggle]")).toHaveAttribute("aria-pressed", "true");
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe("rgb(14, 17, 22)");
    const poster = page.locator("[data-hero-stage] img");
    await expect(poster).toHaveJSProperty("complete", true);
    expect(await poster.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(
      isMobile ? /blueprint-small-dark/ : /blueprint-dark/,
    );
  });

  test("a stored light choice wins over the OS preference", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto("/about");
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe("rgb(238, 241, 244)");
  });
});

test("three.js is never requested outside / and /adventures", async ({ page }) => {
  await page.goto("/about");
  await page.mouse.move(200, 200);
  await page.waitForTimeout(1500);
  expect(await threeRequests(page)).toEqual([]);
});

test("adventures: picking a country in the list opens its card", async ({ page }) => {
  await page.goto("/adventures");
  await page.locator('[data-adv-country-select="SE"]').click();
  const card = page.locator('[data-adv-country="SE"]');
  await expect(card).toBeVisible();
  await expect(card.getByRole("heading")).toHaveText("Sweden");
  await card.locator("[data-adv-close]").click();
  await expect(card).toBeHidden();
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("home keeps the poster and never downloads three.js", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-hero-stage] img").first()).toBeVisible();
    await page.mouse.move(400, 300);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(1500);
    expect(await threeRequests(page)).toEqual([]);
    // Sections are simply there (no reveal state).
    await expect(page.locator("#capabilities")).toHaveCSS("opacity", "1");
  });

  test("adventures shows the flat map instead of the globe", async ({ page }) => {
    await page.goto("/adventures");
    await expect(page.locator("[data-adv-map] svg")).toBeVisible();
    await expect(
      page.getByText("Pick a country or a place in the list to see it on the map."),
    ).toBeVisible();
    await expect(page.locator("[data-globe-stage]")).toBeHidden();
    await page.waitForTimeout(1000);
    expect(await threeRequests(page)).toEqual([]);
  });
});

test.describe("while no post is published", () => {
  test("Writing stays out of the header, menu and footer; RSS is hidden", async ({ page }) => {
    await page.goto("/");
    const posts = await page.evaluate(
      () => document.querySelectorAll('a[href^="/writing/"]').length,
    );
    test.skip(posts > 0, "a post is published");
    await expect(page.locator("header a[href='/writing']")).toHaveCount(0);
    await expect(page.locator("footer a[href='/rss.xml']")).toHaveCount(0);
    await expect(page.locator("footer a[href='/writing']")).toHaveCount(0);
    await expect(page.locator('link[type="application/rss+xml"]')).toHaveCount(0);
    await expect(page.locator("#off-duty")).toBeVisible();
    await expect(page.locator("#journal")).toHaveCount(0);
  });

  test("/writing is noindex without canonical and out of the sitemap", async ({
    page,
    request,
  }) => {
    await page.goto("/writing");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    const sitemap = await (await request.get("/sitemap-0.xml")).text();
    expect(sitemap).not.toContain("/writing");
  });
});

test("header: availability pill, nav and the menu on phones", async ({ page, isMobile }) => {
  await page.goto("/about");
  const header = page.locator("header").first();
  if (isMobile) {
    await expect(header.getByText("OPEN TO PROJECTS")).toBeHidden();
    await header.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Site menu" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Hobbies" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Now" })).toBeVisible();
    await menu.getByRole("button", { name: "Close menu" }).click();
    await expect(menu).toBeHidden();
  } else {
    await expect(header.getByText("OPEN TO PROJECTS")).toBeVisible();
    const nav = header.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link")).toHaveText([
      "Products",
      "Capabilities",
      "Cases",
      "Experience",
      "About",
    ]);
    await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
    await expect(header.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  }
});

test("hero: V6 blueprint poster, legend and the four sourced proof numbers", async ({ page }) => {
  await page.goto("/");
  const legend = page.locator(".hero-media figcaption");
  await expect(legend).toContainText("DRAWN");
  await expect(legend).toContainText("REVIEW · AGENT LOOP");
  // → is an inline SVG glyph; screen readers read "to".
  await expect(legend).toContainText("SKETCH to BUILD to SHIP to LEARN");
  await expect(legend.locator("svg.glyph-arrow")).toHaveCount(3);
  await expect(page.locator("[data-hero-stage]")).toHaveAttribute(
    "aria-label",
    /isometric technical drawing builds itself/,
  );
  const numbers = page.getByRole("list", { name: "Proof numbers" }).locator("li");
  await expect(numbers).toHaveCount(4);
  await expect(numbers.nth(1)).toContainText("p95 latency, roughly halved · CCA Group");
  // "≈ ½": ≈ is an inline SVG glyph; screen readers get "approximately half".
  await expect(numbers.nth(1)).toContainText("½");
  await expect(numbers.nth(1).locator("svg.glyph-approx")).toHaveCount(1);
  await expect(numbers.nth(1)).toContainText("approximately half");
  for (let i = 0; i < 4; i++) await expect(numbers.nth(i)).toBeVisible();
  await expect(page.getByText(/^WORKED WITH NCR VOYIX/)).toBeVisible();
});

test("homepage sections in the approved order", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main h2")).toHaveText([
    "Engineer and founder.",
    "What I'm building",
    "What I can do",
    "Proof in production",
    "Track record",
    "Off duty",
  ]);
  await expect(page.locator("#build").getByText("From datová schránka to done.")).toBeVisible();
  await expect(page.locator("#capabilities li")).toHaveCount(4);
  await expect(page.locator("#work li")).toHaveCount(3);
});

test("about: heading, portrait switch, ProfilePage structured data", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Engineer and founder.");
  await page.getByText("Black", { exact: true }).click();
  await expect(page.locator('[data-portrait="black"] img')).toBeVisible();
  await expect(page.locator('[data-portrait="turtleneck"] img')).toBeHidden();
  const ld = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? "{}")));
  const profile = ld.find((d) => d["@type"] === "ProfilePage");
  expect(profile?.mainEntity?.["@id"]).toMatch(/#person$/);
  expect(profile?.mainEntity?.image).toMatch(/\/images\/ivan-sapronov\.jpg$/);
});

test("home: Person and WebSite structured data", async ({ page }) => {
  await page.goto("/");
  const types = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? "{}")["@type"]));
  expect(types).toEqual(expect.arrayContaining(["Person", "WebSite"]));
});

test("removed Apexline pages forward to /projects", async ({ page }) => {
  for (const old of ["/projects/apexline", "/projects/apex-line-market-research"]) {
    await page.goto(old);
    await page.waitForURL(/\/projects$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("404 has no canonical", async ({ page }) => {
  await page.goto("/no-such-page");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("projects lists the GitHub repositories without case-study links", async ({ page }) => {
  await page.goto("/projects");
  const code = page.locator("section", { has: page.locator("#code-heading") });
  await expect(code.locator("article")).toHaveCount(4);
  await expect(code.locator('a[href^="/projects/"]')).toHaveCount(0);
  await expect(code.locator('a[href^="https://github.com/"]').first()).toBeVisible();
});

test.describe("security headers (applied from _headers, as on Cloudflare Pages)", () => {
  test("CSP + HSTS: no violations across ClientRouter navigation, 3D and the form", async ({
    page,
    isMobile,
  }) => {
    test.setTimeout(90_000);
    await page.addInitScript(() => {
      const w = window as unknown as { __csp?: string[] };
      w.__csp = [];
      document.addEventListener("securitypolicyviolation", (e) =>
        w.__csp!.push(`${e.violatedDirective} ${e.blockedURI}`),
      );
    });
    const consoleCsp: string[] = [];
    page.on("console", (m) => {
      if (/Content.Security.Policy|Refused to/i.test(m.text())) consoleCsp.push(m.text());
    });

    const res = await page.goto("/");
    expect(res?.headers()["content-security-policy"]).toContain("default-src 'self'");
    expect(res?.headers()["strict-transport-security"]).toBe("max-age=31536000");
    expect(res?.headers()["permissions-policy"]).not.toContain("interest-cohort");
    // The hero scene starts by itself on desktop (on phones it waits for a scroll).
    if (!isMobile) await page.waitForSelector("[data-hero-stage][data-live]", { timeout: 30_000 });

    // ClientRouter swaps (a full reload would drop this marker).
    await page.evaluate(() => ((window as unknown as { __noReload?: boolean }).__noReload = true));
    const go = async (selector: string, url: RegExp, heading: string | RegExp) => {
      await page.locator(selector).first().click();
      await page.waitForURL(url);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    };
    await go('#work a[href="/projects"]', /\/projects$/, "Projects");
    await go('footer a[href="/about"]', /\/about$/, "Engineer and founder.");
    // Styles of the swapped page apply (inline <style> under the policy).
    expect(await page.evaluate(() => getComputedStyle(document.body).fontFamily)).toMatch(
      /Schibsted/,
    );
    await go('footer a[href="/hobbies"]', /\/hobbies$/, /.+/);
    await go('main a[href="/adventures"]', /\/adventures$/, /countries on the map/);
    if (!isMobile) await page.waitForSelector("[data-globe-stage][data-live]", { timeout: 30_000 });
    await go(
      '#contact a[href="/contact?topic=hiring"]',
      /\/contact\?topic=hiring$/,
      /Ready to ship/,
    );
    expect(
      await page.evaluate(() => (window as unknown as { __noReload?: boolean }).__noReload),
    ).toBe(true);

    // The form still works (topic preselect, honest not-connected state).
    await expect(page.locator("#cf-topic")).toHaveValue("hiring");
    await page.fill("#cf-name", "Test Person");
    await page.fill("#cf-email", "test@example.com");
    await page.fill("#cf-message", "Hello — CSP smoke test.");
    await page.locator("[data-contact-form] button[type=submit]").click();
    await expect(page.locator('[data-state="offline"]')).toBeVisible();

    expect(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp)).toEqual([]);
    expect(consoleCsp).toEqual([]);
  });
});
