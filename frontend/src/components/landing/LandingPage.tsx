import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Workspace, { Brand, CHAPTERS } from "./Workspace";
import { useDemo } from "./useDemo";
import { useLandingTheme } from "./visit";
import { LandingThemeId, THEME_IDS, THEMES, themeStyles } from "./themes";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const { user } = useAuth();
  const createHref = user ? "/projects/new" : "/register";
  const demo = useDemo();
  const { theme, selectTheme, ready } = useLandingTheme();
  const story = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [normalFlow, setNormalFlow] = useState(false);
  const chapterRef = useRef(0);
  const expandedRef = useRef(false);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const small = matchMedia("(max-width: 760px), (max-height: 600px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const normal = reduced.matches || small.matches;
      setNormalFlow(normal);
      if (!story.current || !stage.current || normal) return;
      const viewport = window.innerHeight;
      const local = Math.max(0, -story.current.getBoundingClientRect().top);
      const expansion = Math.min(1, local / (viewport * 0.8));
      stage.current.style.setProperty("--expansion", expansion.toFixed(4));
      stage.current.style.setProperty("--art-shift", `${-local * 0.4}px`);
      const isExpanded = expansion >= 0.98;
      if (isExpanded !== expandedRef.current) {
        expandedRef.current = isExpanded;
        setExpanded(isExpanded);
      }
      const index = Math.min(
        3,
        Math.max(0, Math.floor((local / viewport - 0.8) / 0.825)),
      );
      if (index !== chapterRef.current) {
        chapterRef.current = index;
        setChapter(index);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    small.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      small.removeEventListener("change", schedule);
    };
  }, []);

  const goChapter = useCallback((index: number) => {
    const section = story.current;
    if (!section) return;
    const normal = matchMedia(
      "(prefers-reduced-motion: reduce), (max-width: 760px), (max-height: 600px)",
    ).matches;
    if (normal) {
      chapterRef.current = index;
      setChapter(index);
      setExpanded(true);
      section
        .querySelector('[data-workspace="stable-shell"]')
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      const top = section.getBoundingClientRect().top + window.scrollY;
      // Land well inside a chapter, avoiding rounding errors at the boundary.
      window.scrollTo({
        top: top + window.innerHeight * (0.8 + index * 0.825 + 0.04),
        behavior: "auto",
      });
    }
    setMenuOpen(false);
  }, []);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`docbuilder-landing ${styles.root}`}>
      <Head>
        <title>DocBuilder AI — Research, write. Present with purpose.</title>
        <meta
          name="description"
          content="Shape a clear brief, inspect sources, review every refinement and finish with a document or presentation. Explore the DocBuilder AI sample workspace."
        />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      </Head>
      <a className={styles.skip} href="#workflow">
        Skip to the sample workspace
      </a>
      <main>
        <section
          className={styles.story}
          ref={story}
          id="workflow"
          aria-label="Interactive sample workflow"
        >
          <div className={styles.stage} ref={stage}>
            <div className={styles.heroArtwork} aria-hidden="true" />
            <div
              className={styles.arrival}
              style={{
                visibility: expanded && !normalFlow ? "hidden" : "visible",
              }}
            >
              <header className={styles.heroNav}>
                <Link href="/" aria-label="DocBuilder AI home">
                  <Brand />
                </Link>
                <nav className={styles.desktopNav} aria-label="Main navigation">
                  <button onClick={() => goChapter(0)}>Workflow</button>
                  <a href="#capabilities">Capabilities</a>
                  <a href="#faq">FAQ</a>
                </nav>
                <div className={styles.navActions}>
                  <Link href="/login">Log in</Link>
                  <Link className={styles.primary} href={createHref}>
                    Start creating <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
                <button
                  className={styles.menuToggle}
                  aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                  aria-expanded={menuOpen}
                  aria-controls="landing-mobile-menu"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                {menuOpen && (
                  <nav
                    className={styles.mobileMenu}
                    id="landing-mobile-menu"
                    aria-label="Mobile navigation"
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setMenuOpen(false);
                        document
                          .querySelector<HTMLButtonElement>(
                            `[aria-controls="landing-mobile-menu"]`,
                          )
                          ?.focus();
                      }
                    }}
                  >
                    <button onClick={() => goChapter(0)}>Workflow</button>
                    <a href="#capabilities" onClick={closeMenu}>
                      Capabilities
                    </a>
                    <a href="#faq" onClick={closeMenu}>
                      FAQ
                    </a>
                    <Link href="/login" onClick={closeMenu}>
                      Log in
                    </Link>
                    <Link href={createHref} onClick={closeMenu}>
                      Start creating
                    </Link>
                  </nav>
                )}
              </header>
              <div className={styles.heroCopy}>
                <h1>
                  Research, write.
                  <br />
                  Present with purpose.
                </h1>
                <p>
                  From a clear brief to a source-backed document
                  <br className={styles.desktopBreak} /> or a presentation ready
                  to share.
                </p>
                <div className={styles.heroActions}>
                  <Link className={styles.primary} href={createHref}>
                    Start creating <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                  <button onClick={() => goChapter(0)}>
                    Explore the workflow{" "}
                    <ArrowDown size={13} aria-hidden="true" />
                  </button>
                </div>
                <div className={styles.heroSteps}>
                  {CHAPTERS.map((name, index) => (
                    <button key={name} onClick={() => goChapter(index)}>
                      {name}
                      {index < 3 && <span>→</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.workspaceFrame}>
              <Workspace
                demo={demo}
                chapter={chapter}
                expanded={expanded || normalFlow}
                onChapter={goChapter}
              />
            </div>
          </div>
        </section>
        <section className={styles.temporaryLower} id="capabilities">
          <h2>Built for the work between idea and final draft.</h2>
          <p>
            Set the direction. Inspect the sources. Keep control of the changes.
          </p>
          <div id="faq">
            <h2>Your next idea starts here.</h2>
            <Link className={styles.primary} href={createHref}>
              Start creating <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <Brand />
        <span>Thoughtful tools for useful work.</span>
        <label>
          Artwork
          <select
            aria-label="Landing artwork theme"
            value={theme}
            disabled={!ready}
            onChange={(event) =>
              selectTheme(event.target.value as LandingThemeId)
            }
          >
            {THEME_IDS.map((id) => (
              <option key={id} value={id}>
                {THEMES[id].name}
              </option>
            ))}
          </select>
        </label>
      </footer>
    </div>
  );
}
