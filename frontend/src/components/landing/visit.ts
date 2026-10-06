import { useEffect, useState } from "react";
import {
  isThemeId,
  LandingThemeId,
  VISIT_EXPIRY_MS,
  VISIT_KEY,
} from "./themes";

export interface VisitRecord {
  id: LandingThemeId;
  lastActive: number;
}
declare global {
  interface Window {
    __docbuilderLanding?: { id: LandingThemeId; preview: boolean };
  }
}

// Kept self-contained so the same validated resolver can run before first paint and in React.
export function resolveVisit(
  raw: string | null,
  now: number,
  entropy: number,
): VisitRecord {
  const ids = ["akshara", "astra", "neel", "sabha", "vanam"] as const;
  let previous: VisitRecord | undefined;
  try {
    const record = JSON.parse(raw || "null");
    if (
      record &&
      ids.includes(record.id) &&
      Number.isFinite(record.lastActive) &&
      record.lastActive >= 0 &&
      record.lastActive <= now
    )
      previous = record;
  } catch {
    /* An invalid record begins a new visit. */
  }
  if (previous && now - previous.lastActive < 1800000)
    return { id: previous.id, lastActive: now };
  const choices = ids.filter((id) => id !== previous?.id);
  const index = Math.min(
    choices.length - 1,
    Math.max(0, Math.floor(entropy * choices.length)),
  );
  return { id: choices[index], lastActive: now };
}

export const THEME_BOOTSTRAP = `(()=>{
  if(location.pathname!=='/')return;
  const resolveVisit=${resolveVisit.toString()};
  const ids=['akshara','astra','neel','sabha','vanam'];
  const override=new URLSearchParams(location.search).get('landingTheme');
  let id='akshara';const preview=ids.includes(override);
  if(preview){id=override;}else{try{
    const value=new Uint32Array(1);crypto.getRandomValues(value);
    const record=resolveVisit(localStorage.getItem('${VISIT_KEY}'),Date.now(),value[0]/4294967296);
    localStorage.setItem('${VISIT_KEY}',JSON.stringify(record));id=record.id;
  }catch{}}
  window.__docbuilderLanding={id,preview};document.documentElement.dataset.landingTheme=id;
  const width=innerWidth<=600?768:innerWidth<=1280?1280:1672;
  const preload=document.createElement('link');preload.rel='preload';preload.as='image';
  preload.href='/landing/'+id+'/hero-'+width+'.webp';preload.setAttribute('fetchpriority','high');document.head.appendChild(preload);
})()`;

export function useLandingTheme() {
  const [theme, setTheme] = useState<LandingThemeId>("akshara");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const boot = window.__docbuilderLanding;
    if (boot && isThemeId(boot.id)) setTheme(boot.id);
    setReady(true);
    let lastWrite = Date.now();
    const activity = () => {
      if (
        document.visibilityState === "hidden" ||
        window.__docbuilderLanding?.preview
      )
        return;
      const now = Date.now();
      if (now - lastWrite < 60000) return;
      try {
        const raw = localStorage.getItem(VISIT_KEY);
        const record = resolveVisit(raw, now, Math.random());
        // Re-entering after inactivity starts a new visit. Active scrolling never rotates the theme.
        if (now - lastWrite >= VISIT_EXPIRY_MS) {
          setTheme(record.id);
          document.documentElement.dataset.landingTheme = record.id;
          window.__docbuilderLanding = { id: record.id, preview: false };
        } else record.id = window.__docbuilderLanding?.id || "akshara";
        localStorage.setItem(VISIT_KEY, JSON.stringify(record));
        lastWrite = now;
      } catch {
        /* The already rendered deterministic fallback stays stable. */
      }
    };
    const leave = () => {
      if (
        window.__docbuilderLanding?.preview ||
        Date.now() - lastWrite >= VISIT_EXPIRY_MS
      )
        return;
      try {
        localStorage.setItem(
          VISIT_KEY,
          JSON.stringify({
            id: window.__docbuilderLanding?.id || "akshara",
            lastActive: Date.now(),
          }),
        );
      } catch {}
    };
    ["pointerdown", "keydown", "scroll", "focus"].forEach((event) =>
      window.addEventListener(event, activity, { passive: true }),
    );
    document.addEventListener("visibilitychange", activity);
    window.addEventListener("pagehide", leave);
    return () => {
      ["pointerdown", "keydown", "scroll", "focus"].forEach((event) =>
        window.removeEventListener(event, activity),
      );
      document.removeEventListener("visibilitychange", activity);
      window.removeEventListener("pagehide", leave);
    };
  }, []);
  const selectTheme = (id: LandingThemeId) => {
    if (!isThemeId(id)) return;
    setTheme(id);
    document.documentElement.dataset.landingTheme = id;
    window.__docbuilderLanding = { id, preview: false };
    const url = new URL(location.href);
    url.searchParams.delete("landingTheme");
    history.replaceState(history.state, "", url);
    try {
      localStorage.setItem(
        VISIT_KEY,
        JSON.stringify({ id, lastActive: Date.now() }),
      );
    } catch {}
  };
  return { theme, selectTheme, ready };
}
