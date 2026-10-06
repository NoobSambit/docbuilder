# Shared landing page

Landing artwork preferences are independent of `next-themes` and all authenticated product settings. The page is statically rendered. A small synchronous head script validates the visit and applies scoped CSS tokens before first paint; React reads that same choice rather than choosing again.

A visit expires after 30 minutes of inactivity. Local activity refreshes its timestamp at most once per minute; leaving the page also records activity. The next visit selects among the other four themes. Storage failures use Akshara deterministically. Malformed or future-dated records are rejected.

Preview any theme with `/?landingTheme=akshara`, `astra`, `neel`, `sabha` or `vanam`. Preview overrides do not overwrite visit preferences. The footer selector changes the current visit; it removes a preview query if present. No Firestore, Render, Groq or RAG calls are involved.
