/* Capture the real page and run axe against every palette. See docs/LANDING_REBUILD_VALIDATION.md. */
const path = require("path");
const fs = require("fs");
const moduleRoot = process.env.LANDING_QA_MODULES;
const load = (name) => require(moduleRoot ? path.join(moduleRoot, name) : name);
const { chromium } = load("playwright");
const AxeBuilder = load("@axe-core/playwright").default;
const base = process.env.LANDING_QA_URL || "http://127.0.0.1:3100";
const output =
  process.env.LANDING_QA_OUTPUT || "/tmp/docbuilder-qa/screens-final";
const themes = ["akshara", "astra", "neel", "sabha", "vanam"];
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.LANDING_QA_CHROME || undefined,
    args: ["--no-sandbox"],
    headless: true,
  });
  const results = [];
  try {
    for (const theme of themes) {
      for (const viewport of [
        { width: 1366, height: 768 },
        { width: 1440, height: 900 },
        { width: 375, height: 812 },
      ]) {
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        const requests = [];
        const errors = [];
        page.on("request", (r) => requests.push(r.url()));
        page.on("pageerror", (e) => errors.push(e.message));
        await page.addInitScript(() => {
          window.__landingCLS = 0;
          window.__landingLCP = 0;
          new PerformanceObserver((list) => {
            for (const e of list.getEntries())
              if (!e.hadRecentInput) window.__landingCLS += e.value;
          }).observe({ type: "layout-shift", buffered: true });
          new PerformanceObserver((list) => {
            window.__landingLCP = list.getEntries().at(-1).startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
        });
        await page.goto(`${base}/?landingTheme=${theme}`);
        await page.waitForTimeout(250);
        const suffix = `${viewport.width}x${viewport.height}`;
        await page.screenshot({
          path: path.join(output, `${theme}-hero-${suffix}.png`),
        });
        const initial = requests.filter(
          (url) => url.includes("/landing/") && url.endsWith(".webp"),
        );
        const row = {
          theme,
          viewport,
          initialArt: initial,
          errors,
          initialCLS: await page.evaluate(() => window.__landingCLS),
          localLCPms: await page.evaluate(() => window.__landingLCP),
          overflow: await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
        };
        if (initial.some((url) => !url.includes(`/${theme}/hero-`)))
          throw new Error(
            "Unrelated or premature artwork: " + JSON.stringify(initial),
          );
        if (row.errors.length || row.overflow || row.initialCLS > 0.1)
          throw new Error("Render failure: " + JSON.stringify(row));
        if (viewport.width === 1366 || viewport.width === 375) {
          const axe = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze();
          row.axeViolations = axe.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.html),
          }));
          if (row.axeViolations.length)
            throw new Error("Accessibility failure: " + JSON.stringify(row));
        }
        if (viewport.width === 1366) {
          for (const [section, filename] of [
            ["#capabilities", "capabilities"],
            ["#outputs", "outputs"],
            ["#faq", "faq"],
          ]) {
            await page
              .locator(section)
              .evaluate((e) =>
                scrollTo({
                  top: e.getBoundingClientRect().top + scrollY,
                  behavior: "instant",
                }),
              );
            await page.waitForTimeout(150);
            await page.screenshot({
              path: path.join(output, `${theme}-${filename}.png`),
            });
          }
          if (theme === "akshara")
            for (let chapter = 0; chapter < 4; chapter++) {
              await page.evaluate(
                (f) => scrollTo({ top: innerHeight * f, behavior: "instant" }),
                0.85 + chapter * 0.825,
              );
              await page.waitForTimeout(100);
              await page.screenshot({
                path: path.join(output, `chapter-${chapter + 1}.png`),
              });
            }
        } else if (viewport.width === 375) {
          await page
            .locator("[data-workspace]")
            .evaluate((e) =>
              scrollTo({
                top: e.getBoundingClientRect().top + scrollY,
                behavior: "instant",
              }),
            );
          await page.screenshot({
            path: path.join(output, `${theme}-mobile-workspace.png`),
          });
          await page
            .locator("#outputs")
            .getByRole("button", { name: "Presentation", exact: true })
            .click();
          for (let slide = 0; slide < 5; slide++) {
            await page
              .locator("#outputs")
              .getByRole("button", {
                name: new RegExp(`^Show slide ${slide + 1}:`),
              })
              .click();
            await page.screenshot({
              path: path.join(output, `${theme}-mobile-slide-${slide + 1}.png`),
            });
            const fits = await page
              .locator('#outputs [aria-label^="Slide "]>div')
              .evaluate(
                (e) =>
                  e.scrollWidth <= e.clientWidth &&
                  e.scrollHeight <= e.clientHeight,
              );
            if (!fits) throw new Error(`${theme} slide ${slide + 1} overflows`);
          }
        }
        results.push(row);
        await context.close();
      }
    }
    for (const viewport of [
      { width: 834, height: 1112 },
      { width: 768, height: 1024 },
      { width: 320, height: 700 },
      { width: 1366, height: 540 },
    ]) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      await page.goto(`${base}/?landingTheme=neel`);
      await page.waitForTimeout(100);
      await page.screenshot({
        path: path.join(
          output,
          `responsive-${viewport.width}x${viewport.height}.png`,
        ),
      });
      if (
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )
      )
        throw new Error("Responsive overflow");
      results.push({ viewport, overflow: false });
      await context.close();
    }
    const reduced = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      reducedMotion: "reduce",
    });
    const rp = await reduced.newPage();
    await rp.goto(`${base}/?landingTheme=vanam`);
    await rp.screenshot({ path: path.join(output, "reduced-motion.png") });
    await reduced.close();
    const ssr = await browser.newContext({
      viewport: { width: 1366, height: 768 },
    });
    await ssr.route("**/_next/static/chunks/**", (route) => route.abort());
    const sp = await ssr.newPage();
    for (const theme of themes) {
      await sp.goto(`${base}/?landingTheme=${theme}`);
      const choice = await sp.getAttribute("html", "data-landing-theme");
      const image = await sp
        .locator(".docbuilder-landing")
        .evaluate((e) => getComputedStyle(e).getPropertyValue("--hero-art"));
      if (choice !== theme || !image.includes(`/landing/${theme}/`))
        throw new Error("Before-hydration theme mismatch");
    }
    results.push({
      beforeHydration:
        "All five overrides select correct artwork with application JS blocked",
    });
    await ssr.close();
    fs.writeFileSync(
      path.join(output, "review-results.json"),
      JSON.stringify(results, null, 2),
    );
    console.log(
      JSON.stringify(
        {
          renderCases: results.length,
          axeCases: 10,
          screenshotDirectory: output,
          results,
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
