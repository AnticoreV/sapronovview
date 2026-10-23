import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/projects",
  "/projects/ownira",
  "/experience",
  "/writing",
  "/hobbies",
  "/adventures",
  "/now",
  "/contact",
];

/** Requests for the three.js / scene chunks made by the page so far. */
const threeRequests = (page: Page) =>
  page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((e) => e.name)
      .filter((n) => /\/(three\.module|panel3d|globe3d)\.[^/]*\.js/.test(n)),
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

test("unknown route shows the 404 page", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Off course.");
  await expect(page.getByRole("link", { name: "Return to base" })).toHaveAttribute("href", "/");
});

test("every page ends with the contact routes", async ({ page }) => {
  await page.goto("/about");
  const block = page.locator("#contact");
  await expect(block.getByText("Cleared for")).toBeVisible();
  await expect(block.locator('a[href="/contact?topic=hiring"]')).toBeVisible();
  await expect(block.locator('a[href="/contact?topic=investing"]')).toContainText(
    "Stage, progress and plans — let's talk.",
  );
  await expect(block.locator('a[href="/contact?topic=partnering"]')).toBeVisible();
});

test("contact form: topic from ?topic=, field errors, honest not-connected state", async ({
  page,
}) => {
  await page.goto("/contact?topic=investing");
  await expect(page.locator("#cf-topic")).toHaveValue("investing");
  await expect(page.getByText("Form not connected yet", { exact: true })).toBeVisible();

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

test("theme knob switches to the night panel and remembers it", async ({ page }) => {
  await page.goto("/");
  const knob = page.locator("[data-theme-knob]");
  const wasNight = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await knob.click();
  await expect(page.locator("html")).toHaveClass(wasNight ? /^(?!.*\bdark\b)/ : /\bdark\b/);
  await expect(knob).toHaveAttribute("aria-pressed", String(!wasNight));
  await page.reload();
  const isNight = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  expect(isNight).toBe(!wasNight);
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
    await expect(page.locator("[data-panel-stage] img").first()).toBeVisible();
    await page.mouse.move(400, 300);
    await page.waitForTimeout(1500);
    expect(await threeRequests(page)).toEqual([]);
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
  test("Writing leaves the nav, CONTACT takes its slot, RSS is hidden", async ({ page }) => {
    await page.goto("/");
    const posts = await page.evaluate(
      () => document.querySelectorAll('a[href^="/writing/"]').length,
    );
    test.skip(posts > 0, "a post is published");
    const header = page.locator("header").first();
    await expect(header.locator('a[href="/writing"]')).toHaveCount(0);
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

test("annunciator links to contact with a matching accessible name", async ({ page }) => {
  await page.goto("/about");
  const link = page.getByRole("link", { name: /open to projects — contact/i });
  await expect(link).toHaveAttribute("href", "/contact");
});

test("hero shows the four sourced readouts", async ({ page }) => {
  await page.goto("/");
  const readouts = page.getByRole("list", { name: "Proof readouts" }).locator("li");
  await expect(readouts).toHaveCount(4);
  await expect(readouts.nth(1)).toContainText("p95 latency · CCA Group");
  await expect(readouts.nth(1)).toContainText("≈ halved");
  for (let i = 0; i < 4; i++) await expect(readouts.nth(i)).toBeVisible();
});

test("about: heading, ProfilePage structured data", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Engineer and founder.");
  const ld = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? "{}")));
  const profile = ld.find((d) => d["@type"] === "ProfilePage");
  expect(profile?.mainEntity?.["@id"]).toMatch(/#person$/);
  expect(profile?.mainEntity?.image).toMatch(/\/images\/ivan-sapronov\.jpg$/);
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
