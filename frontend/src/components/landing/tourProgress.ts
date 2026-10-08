export const TOUR_EXPANSION_SPAN = 0.8;
export const TOUR_CHAPTER_SPAN = 0.675;
const RELEASE_SPAN = 0.15;
const clamp = (value: number) => Math.min(1, Math.max(0, value));

// Scroll phases use viewport-relative distance. pinEnd comes from the actual
// sticky section bounds, so the backdrop is gone before lower content enters.
export function getTourPhase(progress: number, pinEnd: number) {
  const expansion = clamp(progress / TOUR_EXPANSION_SPAN);
  const release =
    progress >= pinEnd
      ? 1
      : clamp((progress - (pinEnd - RELEASE_SPAN)) / RELEASE_SPAN);
  const windowFocus = expansion * (1 - release);
  const expanded = expansion >= 0.999 && release <= 0.000001;
  const chapter = Math.min(
    3,
    Math.max(
      0,
      Math.floor((progress - TOUR_EXPANSION_SPAN) / TOUR_CHAPTER_SPAN),
    ),
  );
  return {
    expansion,
    release,
    expanded,
    windowFocus,
    released: release === 1,
    chapter,
    modalActive: expansion >= 0.999 && release < 1,
  };
}
