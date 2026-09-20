import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const locale of ["th", "en"]) {
  for (const theme of ["light", "dark"] as const) {
    for (const width of [320, 390, 768, 1440]) {
      test(`${locale} / ${theme} / ${width}px: content, layout and accessibility`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 1000 });
        await page.emulateMedia({
          colorScheme: theme,
          reducedMotion: "reduce",
        });
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.context().addCookies([
          {
            name: "NEXT_LOCALE",
            value: locale,
            url: "http://localhost:3100",
          },
        ]);
        await page.goto("/");
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator("html")).toHaveClass(new RegExp(theme));
        await expect(page.locator("h1")).toBeVisible();
        await expect(page.locator(".project-card")).toHaveCount(0);
        await page.locator("#contact").scrollIntoViewIfNeeded();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
        ).toEqual([]);
        expect(errors).toEqual([]);
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: "instant" }),
        );
        await page.screenshot({
          path: `artifacts/${locale}-${theme}-${width}.png`,
          fullPage: true,
        });
      });
    }
  }
}

test("Thai default, locale switch preserves path/query/hash and saved preference", async ({
  page,
}) => {
  await page.context().clearCookies();
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
  await page.goto("/projects?from=portfolio#main");
  await page.getByRole("link", { name: /Switch to English/ }).click();
  await expect(page).toHaveURL(/\/projects\?from=portfolio#main$/);
  await expect(page.locator("h1")).toContainText("A few things");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("legacy locale prefixes redirect to clean paths", async ({ page }) => {
  await page.goto("/en");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/th/projects");
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
});

test("theme selection persists and supports system preference", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page
    .context()
    .addCookies([
      { name: "NEXT_LOCALE", value: "en", url: "http://localhost:3100" },
    ]);
  await page.goto("/");
  await page.getByRole("button", { name: "Appearance" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("radio", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Appearance" }).click();
  await page.getByRole("radio", { name: "System", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("theme settings switch and persist five palettes without changing the URL", async ({
  page,
}) => {
  await page.context().clearCookies();
  await page
    .context()
    .addCookies([
      { name: "NEXT_LOCALE", value: "en", url: "http://localhost:3100" },
    ]);
  await page.goto("/projects?view=palette#top");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  const initialUrl = page.url();

  await page.getByRole("button", { name: "Appearance" }).click();
  const paletteNames = [
    "Cyan Orbit",
    "Violet Signal",
    "Amber Studio",
    "Emerald Field",
    "Rose Infrared",
  ];
  for (const [index, name] of paletteNames.entries()) {
    await page.getByRole("radio", { name }).click();
    await expect(page.locator("html")).toHaveAttribute(
      "data-palette",
      [
        "cyan-orbit",
        "violet-signal",
        "amber-studio",
        "emerald-field",
        "rose-infrared",
      ][index],
    );
    await expect(page).toHaveURL(initialUrl);
  }

  await page.getByRole("radio", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-palette",
    "rose-infrared",
  );
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("all palettes render in light and dark modes without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .context()
    .addCookies([
      { name: "NEXT_LOCALE", value: "en", url: "http://localhost:3100" },
    ]);
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());

  for (const palette of [
    "cyan-orbit",
    "violet-signal",
    "amber-studio",
    "emerald-field",
    "rose-infrared",
  ]) {
    for (const mode of ["light", "dark"] as const) {
      await page.evaluate(
        ({ nextPalette, nextMode }) => {
          window.localStorage.setItem("golfsilly-palette", nextPalette);
          window.localStorage.setItem("theme", nextMode);
        },
        { nextPalette: palette, nextMode: mode },
      );
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute(
        "data-palette",
        palette,
      );
      await expect(page.locator("html")).toHaveClass(new RegExp(mode));
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
  }
});

test("mobile menu supports keyboard, Escape, focus return and navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .context()
    .addCookies([
      { name: "NEXT_LOCALE", value: "en", url: "http://localhost:3100" },
    ]);
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await expect(trigger).toBeVisible();
  await trigger.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("dialog").getByRole("link", { name: /Work/ }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator(".projects-grid .project-card")).toHaveCount(0);
});

test("empty project repository and unknown routes return 404", async ({
  page,
}) => {
  for (const locale of ["th", "en"] as const) {
    await page.context().clearCookies();
    await page.context().addCookies([
      {
        name: "NEXT_LOCALE",
        value: locale,
        url: "http://localhost:3100",
      },
    ]);
    await page.goto("/projects");
    await expect(page.locator(".project-card")).toHaveCount(0);
    await expect(page.locator(".collection-label")).toContainText("00");
    for (const path of ["/projects/missing", "/missing/nested"]) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.locator(".not-found")).toBeVisible();
    }
  }
  const response = await page.goto("/fr");
  expect(response?.status()).toBe(404);
});

test("server-rendered content and navigation work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("#about")).toBeVisible();
  await page.locator('.hero-actions a[href="/projects"]').click();
  await expect(page.locator(".project-card")).toHaveCount(0);
  await context.close();
});

test("motion cleans up after navigation and responds to resize/reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page
    .context()
    .addCookies([
      { name: "NEXT_LOCALE", value: "en", url: "http://localhost:3100" },
    ]);
  await page.goto("/");
  for (let i = 0; i < 3; i++) {
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.locator("#work").getByRole("link").first().click();
    await page.locator("header .wordmark").click();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".orbital-art")).toHaveCSS("transform", "none");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".orbital-art")).toHaveCSS("transform", "none");
  expect(await page.locator(".pin-spacer").count()).toBe(0);
  expect(errors).toEqual([]);
});

test("admin is protected and reports missing backend setup safely", async ({
  page,
  request,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/sign-in$/);
  await expect(page.locator("h1")).toBeVisible();
  const projects = await request.get("/api/admin/projects");
  expect(projects.status()).toBe(401);
  const auth = await request.get("/api/auth/get-session");
  expect(auth.status()).toBe(503);
});

test("social preview and crawler assets are served successfully", async ({
  request,
}) => {
  const image = await request.get("/opengraph-image");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  const bytes = await image.body();
  expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
});

test("cookie consent is localized, persistent, keyboard accessible, and offline", async ({
  page,
}) => {
  const consentRequests: string[] = [];
  page.on("request", (request) => {
    if (/c15t|inth|consent/i.test(request.url()))
      consentRequests.push(request.url());
  });

  await page.context().clearCookies();
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "ข้อความเล็ก ๆ เรื่องคุกกี้" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "รับทราบ", exact: true }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "ตั้งค่าคุกกี้", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "การตั้งค่าคุกกี้" }),
  ).toBeVisible();
  await expect(page.getByRole("switch")).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await page
    .getByRole("button", { name: "บันทึกการตั้งค่า", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "การตั้งค่าคุกกี้" }),
  ).not.toBeVisible();

  await expect(
    page.getByRole("heading", { name: "ข้อความเล็ก ๆ เรื่องคุกกี้" }),
  ).not.toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "ข้อความเล็ก ๆ เรื่องคุกกี้" }),
  ).not.toBeVisible();
  expect(consentRequests).toEqual([]);

  await page
    .getByRole("button", { name: "ตั้งค่าคุกกี้", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "การตั้งค่าคุกกี้" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");

  await page.context().clearCookies();
  await page.evaluate(() => window.localStorage.clear());
  await page.goto("/en");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", { name: "A small note about cookies" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Privacy policy" }),
  ).toHaveAttribute("href", "/privacy");
});

test("privacy and cookie policy templates are available in both languages", async ({
  page,
}) => {
  for (const locale of ["th", "en"] as const) {
    await page.context().clearCookies();
    await page
      .context()
      .addCookies([
        { name: "NEXT_LOCALE", value: locale, url: "http://localhost:3100" },
      ]);
    for (const path of ["/privacy", "/cookies"]) {
      await page.goto(path);
      await expect(page.locator(".policy-document")).toBeVisible();
      await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
        "href",
        new RegExp(`${path}$`),
      );
    }
  }
});
