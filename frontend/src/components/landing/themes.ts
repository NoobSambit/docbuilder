export const THEME_IDS = [
  "akshara",
  "astra",
  "neel",
  "sabha",
  "vanam",
] as const;
export type LandingThemeId = (typeof THEME_IDS)[number];
export const VISIT_EXPIRY_MS = 30 * 60 * 1000;
export const VISIT_KEY = "docbuilder.landing.visit.v1";

interface LandingTheme {
  name: string;
  scene: string;
  heroPosition: string;
  mobilePosition: string;
  tokens: Record<string, string>;
}

export const THEMES: Record<LandingThemeId, LandingTheme> = {
  akshara: {
    name: "Akshara",
    scene: "Ganesha and Vyasa writing beside the river",
    heroPosition: "50% 0%",
    mobilePosition: "61% 0%",
    tokens: {
      ink: "#35251e",
      muted: "#6c5749",
      accent: "#873d2c",
      rail: "#4c2923",
      tint: "#f3e6d3",
      canvas: "#e8dcc7",
      heroInk: "#30221b",
      wash: "#f8ecd5",
    },
  },
  astra: {
    name: "Astra",
    scene: "Krishna guiding Arjuna through a draft",
    heroPosition: "50% -8px",
    mobilePosition: "64% 0%",
    tokens: {
      ink: "#1b3538",
      muted: "#546a6c",
      accent: "#215b60",
      rail: "#14393d",
      tint: "#e3efeb",
      canvas: "#d9e4df",
      heroInk: "#ffffff",
      wash: "#10232c",
    },
  },
  neel: {
    name: "Neel",
    scene: "Krishna reviewing sources in a garden with cows and peacocks",
    heroPosition: "50% -20px",
    mobilePosition: "62% 0%",
    tokens: {
      ink: "#1d3555",
      muted: "#53677c",
      accent: "#234b88",
      rail: "#203c5b",
      tint: "#e6efeb",
      canvas: "#e0e9e3",
      heroInk: "#172e4d",
      wash: "#f8f2de",
    },
  },
  sabha: {
    name: "Sabha",
    scene: "Krishna and the Pandava scholars working together",
    heroPosition: "50% -22px",
    mobilePosition: "62% 0%",
    tokens: {
      ink: "#3e2b3e",
      muted: "#6b576a",
      accent: "#734264",
      rail: "#402d40",
      tint: "#eee6ed",
      canvas: "#e7dfdf",
      heroInk: "#382538",
      wash: "#f6ecde",
    },
  },
  vanam: {
    name: "Vanam",
    scene: "Vyasa and Krishna writing beneath a banyan tree",
    heroPosition: "50% -12px",
    mobilePosition: "63% 0%",
    tokens: {
      ink: "#223e30",
      muted: "#526a59",
      accent: "#276049",
      rail: "#234333",
      tint: "#e5edde",
      canvas: "#dce6d6",
      heroInk: "#193f30",
      wash: "#edf1d9",
    },
  },
};

export function isThemeId(value: unknown): value is LandingThemeId {
  return (
    typeof value === "string" && THEME_IDS.includes(value as LandingThemeId)
  );
}

// Only this landing selector is affected by the document attribute. Application theme stays untouched.
export const themeStyles = THEME_IDS.map((id) => {
  const theme = THEMES[id];
  const tokens = Object.entries(theme.tokens)
    .map(([key, value]) => `--${key}:${value}`)
    .join(";");
  const asset = (kind: string, width: number) =>
    `url('/landing/${id}/${kind}-${width}.webp')`;
  return `html[data-landing-theme="${id}"] .docbuilder-landing{${tokens};--hero-position:${theme.heroPosition};--mobile-position:${theme.mobilePosition};--hero-art:${asset("hero", 1672)};--capabilities-art:${asset("capabilities", 1280)};--archive-art:${asset("archive", 640)};--outputs-art:${asset("outputs", 1280)}}
  @media(max-width:1280px){html[data-landing-theme="${id}"] .docbuilder-landing{--hero-art:${asset("hero", 1280)}}}
  @media(max-width:600px){html[data-landing-theme="${id}"] .docbuilder-landing{--hero-art:${asset("hero", 768)};--capabilities-art:${asset("capabilities", 640)};--outputs-art:${asset("outputs", 640)}}}`;
}).join("\n");
