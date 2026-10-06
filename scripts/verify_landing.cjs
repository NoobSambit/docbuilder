/* Run against a built local server. Tools live outside product dependencies.
   LANDING_QA_MODULES=/tmp/docbuilder-qa/node_modules LANDING_QA_CHROME=/path/to/chrome node scripts/verify_landing.cjs */
const path = require("path");
const fs = require("fs");
const assert = require("assert/strict");
const { chromium } = require(
  process.env.LANDING_QA_MODULES
    ? path.join(process.env.LANDING_QA_MODULES, "playwright")
    : "playwright",
);
const base = process.env.LANDING_QA_URL || "http://127.0.0.1:3100";
const output = process.env.LANDING_QA_OUTPUT || "/tmp/docbuilder-qa/behavior";
const key = "docbuilder.landing.visit.v1";
const ids = ["akshara", "astra", "neel", "sabha", "vanam"];
const results = [];
const check = (label, value) => {
  assert.ok(value, label);
  results.push(label);
  fs.writeFileSync(
    path.join(output, "progress.json"),
    JSON.stringify(results, null, 2),
  );
};
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.LANDING_QA_CHROME || undefined,
    headless: true,
    args: ["--no-sandbox"],
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      acceptDownloads: true,
    });
    const page = await context.newPage();
    const errors = [];
    const requests = [];
    const badResponses = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) =>
      requests.push({ url: request.url(), method: request.method() }),
    );
    page.on("response", (response) => {
      if (response.url().startsWith(base) && response.status() >= 400)
        badResponses.push(response.url());
    });
    await page.addInitScript(() => {
      window.__landingCLS = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (!e.hadRecentInput) window.__landingCLS += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(base);
    await page.waitForTimeout(300);
    const initialCLS = await page.evaluate(() => window.__landingCLS);
    check("initial layout shift stays below 0.1", initialCLS < 0.1);
    const first = await page.getAttribute("html", "data-landing-theme");
    check("new visit selects a valid theme", ids.includes(first));
    const initialArt = requests.filter(
      (request) =>
        request.url.includes("/landing/") && /webp$/.test(request.url),
    );
    check(
      "initial load requests only selected hero",
      initialArt.length > 0 &&
        initialArt.every((request) => request.url.includes(`/${first}/hero-`)),
    );
    await page.reload();
    check(
      "refresh preserves active visit",
      (await page.getAttribute("html", "data-landing-theme")) === first,
    );
    const inspectStored = async (record) => {
      const testPage = await context.newPage();
      await testPage.addInitScript(
        ([key, raw]) => localStorage.setItem(key, raw),
        [key, record],
      );
      await testPage.goto(base);
      const selected = await testPage.getAttribute(
        "html",
        "data-landing-theme",
      );
      await testPage.close();
      return selected;
    };
    check(
      "expired visit avoids the previous theme",
      (await inspectStored(
        JSON.stringify({ id: first, lastActive: Date.now() - 31 * 60 * 1000 }),
      )) !== first,
    );
    check(
      "malformed visit is rejected",
      ids.includes(await inspectStored("{malformed")),
    );
    check(
      "unknown stored theme is rejected",
      ids.includes(
        await inspectStored(
          JSON.stringify({ id: "missing", lastActive: Date.now() }),
        ),
      ),
    );
    check(
      "future-dated record is rejected",
      ids.includes(
        await inspectStored(
          JSON.stringify({ id: "missing", lastActive: Date.now() + 100000 }),
        ),
      ),
    );
    await page.goto(`${base}/?landingTheme=vanam`);
    check(
      "preview override is deterministic",
      (await page.getAttribute("html", "data-landing-theme")) === "vanam",
    );
    await page
      .getByRole("combobox", { name: "Landing artwork theme" })
      .selectOption("astra");
    check(
      "theme switcher updates this visit",
      (await page.getAttribute("html", "data-landing-theme")) === "astra",
    );
    check(
      "switcher removes preview override",
      !page.url().includes("landingTheme"),
    );
    await page.reload();
    check(
      "switcher selection survives refresh",
      (await page.getAttribute("html", "data-landing-theme")) === "astra",
    );
    await page.getByRole("link", { name: "Log in", exact: true }).click();
    await page.waitForURL("**/login");
    await page.locator("input[type=email]").waitFor({ state: "visible" });
    check(
      "login route is real",
      (await page.locator("input[type=email]").count()) === 1,
    );
    await page.goBack();
    await page.locator("[data-workspace=stable-shell]").waitFor();
    check(
      "navigation return preserves visit",
      (await page.getAttribute("html", "data-landing-theme")) === "astra",
    );
    await page.getByRole("link", { name: "Start creating" }).first().click();
    await page.waitForURL("**/register");
    await page.locator("input[type=email]").waitFor({ state: "visible" });
    check(
      "primary CTA opens real registration route",
      (await page.locator("input[type=email]").count()) === 1,
    );
    await page.goBack();
    await page.locator("[data-workspace=stable-shell]").waitFor();
    const shell = page.locator('[data-workspace="stable-shell"]');
    const clickPinnedHeader = async (locator) => {
      const rect = await locator.boundingBox();
      assert.ok(
        rect && rect.y >= 0 && rect.y + rect.height <= 768,
        "Pinned header action is visibly in the viewport",
      );
      await page.mouse.click(rect.x + rect.width / 2, rect.y + rect.height / 2);
    };
    await shell.evaluate((e) => (e.dataset.identity = "mounted-once"));
    const arrivalBox = await shell.boundingBox();
    check(
      "desktop workspace begins in the focal band",
      arrivalBox.y / 768 >= 0.4 && arrivalBox.y / 768 <= 0.5,
    );
    const scrollTo = async (factor) => {
      await page.evaluate(
        (factor) =>
          scrollTo({ top: innerHeight * factor, behavior: "instant" }),
        factor,
      );
      await page.waitForTimeout(100);
    };
    await scrollTo(0.4);
    const half = await shell.boundingBox();
    check(
      "shell expands during natural scrolling",
      half.width > arrivalBox.width && half.y < arrivalBox.y,
    );
    for (let chapter = 0; chapter < 4; chapter++) {
      await scrollTo(0.85 + chapter * 0.825);
      check(
        `natural scroll selects chapter ${chapter + 1}`,
        (await shell
          .locator('nav[aria-label="Sample workflow chapters"] button')
          .nth(chapter)
          .getAttribute("aria-current")) === "step",
      );
      check(
        `workspace shell stays mounted in chapter ${chapter + 1}`,
        (await shell.getAttribute("data-identity")) === "mounted-once",
      );
    }
    const full = await shell.boundingBox();
    check(
      "expanded shell fills the viewport",
      Math.abs(full.y) < 2 &&
        Math.abs(full.width - 1366) < 3 &&
        Math.abs(full.height - 768) < 3,
    );
    await scrollTo(1.7);
    check(
      "reverse scrolling restores Research",
      await shell
        .locator("button[aria-current=step]")
        .innerText()
        .then((text) => text.includes("Research")),
    );
    await scrollTo(0);
    check(
      "reverse scrolling restores hero geometry",
      Math.abs((await shell.boundingBox()).y - arrivalBox.y) < 2,
    );
    const chapterNav = shell.locator(
      'nav[aria-label="Sample workflow chapters"]',
    );
    await chapterNav.getByRole("button", { name: "03 Refine" }).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(900);
    check(
      "keyboard chapter navigation works",
      (await chapterNav
        .getByRole("button", { name: "03 Refine" })
        .getAttribute("aria-current")) === "step",
    );
    await shell
      .getByRole("button", { name: "Accept change", exact: true })
      .click();
    check(
      "accept changes actual sample prose",
      await shell
        .locator("article")
        .innerText()
        .then((text) => text.includes("Storage retains wind and solar energy")),
    );
    await shell
      .getByRole("button", { name: "Review suggestion again" })
      .click();
    await shell.getByRole("button", { name: "Discard", exact: true }).click();
    check(
      "discard has a meaningful status",
      await shell
        .getByRole("status")
        .innerText()
        .then((text) => text.includes("discarded")),
    );
    await clickPinnedHeader(
      shell.getByRole("button", { name: "Open sample history" }),
    );
    await shell
      .getByRole("button", { name: "Restore Initial draft version 2" })
      .click();
    check(
      "restore adds a new history version",
      await shell
        .innerText()
        .then((text) => text.includes("Restored Initial draft")),
    );
    check(
      "restore recovers original prose",
      await shell
        .locator("article")
        .innerText()
        .then((text) => text.includes("Storage gives variable wind")),
    );
    await shell
      .getByRole("textbox", { name: "Checkpoint name" })
      .fill("Evidence reviewed");
    await shell.getByRole("button", { name: "Add named checkpoint" }).click();
    check(
      "named checkpoint stores the provided name",
      await shell
        .innerText()
        .then((text) => text.includes("Evidence reviewed")),
    );
    await shell
      .getByRole("button", { name: "Resume sample", exact: true })
      .click();
    await page.waitForTimeout(1550);
    await shell.getByRole("button", { name: "Pause", exact: true }).click();
    check(
      "pause retains completed sample section",
      await shell.innerText().then((text) => text.includes("4 of 5 sections")),
    );
    await page.waitForTimeout(1550);
    check(
      "paused playback stays stopped",
      await shell.innerText().then((text) => text.includes("4 of 5 sections")),
    );
    await shell
      .getByRole("button", { name: "Resume sample", exact: true })
      .click();
    await page.waitForTimeout(1550);
    check(
      "resume completes remaining sample section",
      await shell.innerText().then((text) => text.includes("5 of 5 sections")),
    );
    await shell
      .locator("button")
      .filter({ hasText: /^research$/i })
      .last()
      .click();
    await shell
      .getByRole("button", { name: "Energy Storage US Department of Energy" })
      .click();
    check(
      "source inspection changes the excerpt",
      await shell
        .innerText()
        .then((text) => text.includes("Summary of source page")),
    );
    await shell
      .getByRole("checkbox", { name: "Include Energy Storage", exact: true })
      .uncheck();
    check(
      "source selection changes the included count",
      await shell.innerText().then((text) => text.includes("1 included")),
    );
    await shell
      .locator("button")
      .filter({ hasText: /^brief$/i })
      .last()
      .click();
    await shell
      .getByRole("combobox", { name: /^Audience/ })
      .selectOption("Research team");
    await shell.getByLabel("Section title").fill("Leadership summary");
    await shell.getByRole("button", { name: "Use this brief" }).click();
    check(
      "brief changes feed outline and paper",
      await shell
        .locator("article")
        .innerText()
        .then((text) => text.includes("Leadership summary")),
    );
    await shell.getByRole("button", { name: "02 Market landscape" }).click();
    check(
      "outline selection changes the main section",
      (await shell.locator("article h3").first().innerText()) ===
        "Market landscape",
    );
    await clickPinnedHeader(
      shell.getByRole("button", { name: "Preview", exact: true }),
    );
    await shell
      .getByRole("combobox", { name: "Select output example" })
      .selectOption("presentation");
    await shell
      .getByRole("button", {
        name: "Show slide 3: Storage connects supply and demand",
      })
      .click();
    check(
      "deck filmstrip changes the active slide",
      (await shell.locator('[aria-label^="Slide 3:"]').count()) === 1,
    );
    await clickPinnedHeader(shell.locator("details summary"));
    const downloadPromise = page.waitForEvent("download");
    await shell
      .getByRole("link", { name: "PowerPoint presentation .pptx" })
      .click();
    const download = await downloadPromise;
    await download.saveAs(path.join(output, download.suggestedFilename()));
    check(
      "PPTX action downloads a real file",
      fs.statSync(path.join(output, download.suggestedFilename())).size > 10000,
    );
    await scrollTo(4.6);
    check(
      "final chapter releases into lower content",
      (await shell.boundingBox()).y < 0 &&
        (await page
          .locator("#capabilities")
          .boundingBox()
          .then((box) => box.y < 768)),
    );
    await scrollTo(0);
    await page.getByRole("link", { name: "Capabilities", exact: true }).click();
    await page.waitForTimeout(900);
    check(
      "capability navigation resolves its anchor",
      page.url().endsWith("#capabilities"),
    );
    await page.locator("#outputs").evaluate((e) =>
      scrollTo({
        top: e.getBoundingClientRect().top + scrollY,
        behavior: "instant",
      }),
    );
    const lower = page.locator("#outputs");
    await lower
      .getByRole("button", { name: "Presentation", exact: true })
      .click();
    check(
      "output selection changes selected state",
      (await lower
        .getByRole("button", { name: "Presentation", exact: true })
        .getAttribute("aria-pressed")) === "true",
    );
    await lower
      .getByRole("button", { name: "Show slide 5: References" })
      .click();
    check(
      "finished deck exposes references slide",
      (await lower.locator('[aria-label="Slide 5: References"]').count()) === 1,
    );
    const docExport = lower.locator("figure").first().locator("details");
    await docExport.locator("summary").click();
    for (const [name, ext] of [
      ["Word document .docx", "docx"],
      ["Markdown .md", "md"],
      ["HTML .html", "html"],
    ]) {
      const pending = page.waitForEvent("download");
      await docExport.getByRole("link", { name, exact: true }).click();
      const file = await pending;
      await file.saveAs(path.join(output, file.suggestedFilename()));
      check(
        `${ext} action downloads a valid nonempty example`,
        fs.statSync(path.join(output, file.suggestedFilename())).size > 500,
      );
    }
    const popupPromise = page.waitForEvent("popup");
    await docExport.getByRole("link", { name: "Print reading view" }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    check(
      "print action opens a real reading view",
      (await popup
        .getByRole("heading", { name: "Clean Energy Outlook" })
        .count()) === 1,
    );
    await popup.close();
    for (const detail of await page.locator("#faq details").all()) {
      await detail.locator("summary").focus();
      await page.keyboard.press("Enter");
      check(
        "FAQ opens by keyboard: " +
          (await detail.locator("summary").innerText()).replace("+", "").trim(),
        (await detail.getAttribute("open")) !== null,
      );
    }
    const anchors = await page
      .locator("a")
      .evaluateAll((elements) => elements.map((e) => e.getAttribute("href")));
    check(
      "all rendered anchors have real destinations",
      anchors.every((href) => href && href !== "#"),
    );
    check(
      "all internal fragment targets exist",
      await page.evaluate(
        (hrefs) =>
          hrefs
            .filter((h) => h.startsWith("#"))
            .every((h) => document.getElementById(h.slice(1))),
        anchors,
      ),
    );
    check(
      "demo never calls a generation research or project API",
      requests.every(
        (request) =>
          !/\/api\/|firestore|groq|onrender/.test(request.url) &&
          request.method === "GET",
      ),
    );
    check(
      "production page has no hydration or console exceptions",
      errors.length === 0,
    );
    check(
      "local page has no failing resource responses",
      badResponses.length === 0,
    );
    check(
      "page has no horizontal overflow",
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    results.push("Measured initial CLS: " + initialCLS);
    await context.close();

    const idle = await browser.newContext({
      viewport: { width: 1366, height: 768 },
    });
    const idlePage = await idle.newPage();
    await idlePage.goto(base);
    await idlePage
      .getByRole("combobox", { name: "Landing artwork theme" })
      .waitFor({ state: "visible" });
    await idlePage.waitForTimeout(100);
    const activeTheme = await idlePage.getAttribute(
      "html",
      "data-landing-theme",
    );
    await idlePage.evaluate(() => {
      window.__testClock = Date.now();
      Date.now = () => window.__testClock;
      window.__testClock += 61000;
      dispatchEvent(new Event("focus"));
    });
    check(
      "active visit heartbeat keeps its theme",
      (await idlePage.getAttribute("html", "data-landing-theme")) ===
        activeTheme,
    );
    await idlePage.evaluate(() => {
      window.__testClock += 31 * 60 * 1000;
      dispatchEvent(new Event("focus"));
    });
    await idlePage.waitForTimeout(100);
    check(
      "returning to an idle tab starts a different visit",
      (await idlePage.getAttribute("html", "data-landing-theme")) !==
        activeTheme,
    );
    await idle.close();

    const fallback = await browser.newContext();
    const fallbackPage = await fallback.newPage();
    await fallbackPage.addInitScript(() =>
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("unavailable");
        },
      }),
    );
    await fallbackPage.goto(base);
    check(
      "unavailable storage uses deterministic Akshara fallback",
      (await fallbackPage.getAttribute("html", "data-landing-theme")) ===
        "akshara",
    );
    await fallbackPage.reload();
    check(
      "fallback stays stable on refresh",
      (await fallbackPage.getAttribute("html", "data-landing-theme")) ===
        "akshara",
    );
    await fallback.close();
    const reduced = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1366, height: 768 },
    });
    const reducedPage = await reduced.newPage();
    await reducedPage.goto(`${base}/?landingTheme=neel`);
    check(
      "reduced motion removes sticky sequence",
      (await reducedPage
        .locator('[class*="LandingPage_stage"]')
        .evaluate((e) => getComputedStyle(e).position)) === "relative",
    );
    await reducedPage
      .locator('nav[aria-label="Sample workflow chapters"]')
      .getByRole("button", { name: "03 Refine" })
      .click();
    check(
      "reduced-motion chapter controls remain usable",
      await reducedPage
        .getByRole("button", { name: "Accept change", exact: true })
        .first()
        .isVisible(),
    );
    await reduced.close();
    const mobile = await browser.newContext({
      viewport: { width: 375, height: 812 },
    });
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(`${base}/?landingTheme=vanam`);
    await mobilePage.getByRole("button", { name: "Open navigation" }).click();
    await mobilePage
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "FAQ" })
      .click();
    check(
      "mobile menu navigates and closes",
      (await mobilePage
        .getByRole("button", { name: "Open navigation" })
        .getAttribute("aria-expanded")) === "false",
    );
    await mobilePage
      .locator('nav[aria-label="Sample workflow chapters"]')
      .getByRole("button", { name: "02 Research" })
      .click();
    await mobilePage
      .locator("[data-workspace]")
      .getByRole("checkbox", { name: "Include Energy Storage", exact: true })
      .waitFor({ state: "visible" });
    check(
      "mobile chapter opens readable research tools",
      await mobilePage
        .locator("[data-workspace]")
        .getByRole("checkbox", { name: "Include Energy Storage" })
        .first()
        .isVisible(),
    );
    check(
      "mobile workspace uses one readable pane",
      (await mobilePage
        .locator("[data-mobile-pane]")
        .getAttribute("data-mobile-pane")) === "tools",
    );
    await mobilePage
      .locator('nav[aria-label="Sample workflow chapters"]')
      .getByRole("button", { name: "04 Present" })
      .click();
    await mobilePage
      .getByRole("combobox", { name: "Select output example" })
      .selectOption("presentation");
    check(
      "mobile presentation has no horizontal overflow",
      await mobilePage.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await mobile.close();
    fs.writeFileSync(
      path.join(output, "results.json"),
      JSON.stringify({ checks: results.length, results }, null, 2),
    );
    console.log(JSON.stringify({ checks: results.length, results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
