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
  tour: Record<string, string>;
  name: string;
  scene: string;
  heroPosition: string;
  mobilePosition: string;
  tokens: Record<string, string>;
}

export const THEMES: Record<LandingThemeId, LandingTheme> = {
  akshara: {
    tour: {
      shell: "#fbf5ec",
      paper: "#fffaf0",
      context: "#f2e4d3",
      ink: "#372219",
      muted: "#79604d",
      rail: "#4c2923",
      selected: "#8d5947",
      accent: "#873d2c",
      "on-accent": "#fff7e8",
      border: "#decbb6",
      soft: "#f2dfca",
      removed: "#f8e5df",
      "removed-ink": "#9a4438",
      added: "#e6ecda",
      "added-ink": "#34553b",
    },
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
    tour: {
      shell: "#f0f7f4",
      paper: "#fbfffb",
      context: "#e2efea",
      ink: "#17363a",
      muted: "#4c6c6b",
      rail: "#14393d",
      selected: "#3e7877",
      accent: "#215b60",
      "on-accent": "#f0fffa",
      border: "#c5dbd4",
      soft: "#d8ede5",
      removed: "#f6e4df",
      "removed-ink": "#943f34",
      added: "#dcefe4",
      "added-ink": "#235b40",
    },
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
    tour: {
      shell: "#f3f6fb",
      paper: "#fcfdfa",
      context: "#e7ecf5",
      ink: "#172d4b",
      muted: "#576b83",
      rail: "#203c5b",
      selected: "#527299",
      accent: "#234b88",
      "on-accent": "#f6faff",
      border: "#ced8e4",
      soft: "#e2eaf6",
      removed: "#f9e6e9",
      "removed-ink": "#913747",
      added: "#e4efdf",
      "added-ink": "#325b3d",
    },
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
    tour: {
      shell: "#f8f5f9",
      paper: "#fffdfa",
      context: "#eee8f1",
      ink: "#16142f",
      muted: "#666080",
      rail: "#3f2b3e",
      selected: "#926487",
      accent: "#87216e",
      "on-accent": "#fff8ff",
      border: "#ded5e7",
      soft: "#f2e9f6",
      removed: "#fae7eb",
      "removed-ink": "#a14359",
      added: "#edf2e5",
      "added-ink": "#356344",
    },
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
    tour: {
      shell: "#f3f7ed",
      paper: "#fdfff5",
      context: "#e5eddf",
      ink: "#1d392b",
      muted: "#576e58",
      rail: "#234333",
      selected: "#567d5e",
      accent: "#276049",
      "on-accent": "#f6fff1",
      border: "#cddac3",
      soft: "#e5efda",
      removed: "#f8e5de",
      "removed-ink": "#944b3a",
      added: "#e2efd8",
      "added-ink": "#2c6138",
    },
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
  const tokens = Object.entries({
    ...theme.tokens,
    ...Object.fromEntries(
      Object.entries(theme.tour).map(([key, value]) => [`tour-${key}`, value]),
    ),
  })
    .map(([key, value]) => `--${key}:${value}`)
    .join(";");
  const asset = (kind: string, width: number) =>
    `url('/landing/${id}/${kind}-${width}.webp')`;
  return `html[data-landing-theme="${id}"] .docbuilder-landing{${tokens};--hero-position:${theme.heroPosition};--mobile-position:${theme.mobilePosition};--hero-art:${asset("hero", 1672)};--capabilities-art:${asset("capabilities", 1280)};--archive-art:${asset("archive", 640)};--outputs-art:${asset("outputs", 1280)}}
  @media(max-width:1280px){html[data-landing-theme="${id}"] .docbuilder-landing{--hero-art:${asset("hero", 1280)}}}
  @media(max-width:600px){html[data-landing-theme="${id}"] .docbuilder-landing{--hero-art:${asset("hero", 768)};--capabilities-art:${asset("capabilities", 640)};--outputs-art:${asset("outputs", 640)}}}`;
}).join("\n");
