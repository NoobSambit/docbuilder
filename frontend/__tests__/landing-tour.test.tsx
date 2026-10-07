import { act, renderHook } from "@testing-library/react";
import { useDemo } from "../src/components/landing/useDemo";
import sample from "../src/components/landing/sample.json";
import {
  THEMES,
  THEME_IDS,
  themeStyles,
  VISIT_KEY,
} from "../src/components/landing/themes";

// Focused local-model checks in the existing Jest/jsdom harness. No browser/viewport sessions.
describe("landing tour local sample", () => {
  it("starts with the approved five sections, brief and exactly two sources", () => {
    const { result } = renderHook(useDemo);
    expect(result.current.titles).toEqual(sample.sections.map((s) => s.title));
    expect([
      result.current.audience,
      result.current.tone,
      result.current.length,
    ]).toEqual(["Leadership", "Analytical", "Executive brief"]);
    expect(result.current.purpose).toBe(sample.brief.goal);
    expect(
      sample.sources.map((source) => `${source.title} — ${source.publisher}`),
    ).toEqual([
      "Renewables 2025 — IEA",
      "Energy Storage — US Department of Energy",
    ]);
    expect(result.current.inspectedSource).toBe("doe");
    expect(result.current.included).toEqual(["iea", "doe"]);
  });
  it("edits titles, guidance and subsections without changing unrelated sections", () => {
    const { result } = renderHook(useDemo);
    act(() =>
      result.current.updateSection("executive", {
        title: "Leadership summary",
        guidance: "Review storage assumptions.",
        subsections: ["Storage questions"],
      }),
    );
    expect(result.current.titles[0]).toBe("Leadership summary");
    expect(result.current.sections[0].guidance).toBe(
      "Review storage assumptions.",
    );
    expect(result.current.sections[0].subsections).toEqual([
      "Storage questions",
    ]);
    expect(result.current.sections[1]).toEqual(sample.sections[1]);
  });
  it("carries edited section identity and selection through reordering", () => {
    const { result } = renderHook(useDemo);
    act(() => result.current.setSelected(2));
    act(() => result.current.reorderSections(2, 0));
    expect(result.current.sections[0].id).toBe("storage");
    expect(result.current.selected).toBe(0);
    act(() => result.current.reorderSections(0, 4));
    expect(result.current.selected).toBe(4);
    expect(result.current.sections[4].text).toBe(sample.sections[2].text);
  });
  it("adds editable sections with stable content and limits the local outline to eight", () => {
    const { result } = renderHook(useDemo);
    for (let i = 0; i < 4; i++) act(() => result.current.addSection());
    expect(result.current.sections).toHaveLength(8);
    expect(result.current.selected).toBe(7);
    expect(
      new Set(result.current.sections.map((section) => section.id)).size,
    ).toBe(8);
    expect(result.current.sections[7].text).toBeTruthy();
  });
  it("confirms the selected brief while preserving custom edits", () => {
    const { result } = renderHook(useDemo);
    act(() => {
      result.current.setAudience("Research team");
      result.current.setTone("Formal");
      result.current.setStarter("Research report");
      result.current.setLength("Detailed report");
      result.current.setPurpose("Explain storage.");
    });
    act(() => result.current.generateOutline());
    const version = result.current.versions[result.current.versions.length - 1];
    expect(version.audience).toBe("Research team");
    expect(version.length).toBe("Detailed report");
    expect(version.purpose).toBe("Explain storage.");
    expect(result.current.message).toContain("5-section research report");
  });
  it("includes/excludes and inspects only sample evidence while retaining citations", () => {
    const { result } = renderHook(useDemo);
    act(() => {
      result.current.toggleSource("doe");
      result.current.setInspectedSource("iea");
    });
    expect(result.current.included).toEqual(["iea"]);
    expect(result.current.inspectedSource).toBe("iea");
    expect(result.current.sections[0].text).toContain("[2]");
    act(() => result.current.toggleSource("doe"));
    expect(result.current.included).toEqual(["iea", "doe"]);
  });
  it("keeps the storyboard sentence and citation pending until accepted", () => {
    const { result } = renderHook(useDemo);
    expect(result.current.accepted).toBe(false);
    expect(result.current.suggestion).toBe(true);
    expect(result.current.sections[0].text).toContain(
      `${sample.refinement.original} [2]`,
    );
    expect(sample.refinement.suggestion).toBe(
      "Storage saves renewable electricity for later use.",
    );
  });
  it("accepts the concise edit after reordering and keeps original text in history", () => {
    const { result } = renderHook(useDemo);
    act(() => result.current.reorderSections(0, 3));
    act(() => result.current.accept());
    expect(result.current.accepted).toBe(true);
    expect(result.current.suggestion).toBe(false);
    expect(result.current.selected).toBe(3);
    const executive = result.current.sections.find(
      (section) => section.id === "executive",
    )!;
    expect(
      executive.text.replace(
        sample.refinement.original,
        sample.refinement.suggestion,
      ),
    ).toContain(`${sample.refinement.suggestion} [2]`);
    expect(result.current.versions[0].sections[0].text).toContain(
      sample.refinement.original,
    );
    expect(
      result.current.versions[result.current.versions.length - 1].accepted,
    ).toBe(true);
  });
  it("discards to original wording and permits deterministic review again", () => {
    const { result } = renderHook(useDemo);
    act(() => result.current.discard());
    expect(result.current.accepted).toBe(false);
    expect(result.current.suggestion).toBe(false);
    expect(result.current.sections[0].text).toContain(
      sample.refinement.original,
    );
    act(() => result.current.suggest());
    expect(result.current.suggestion).toBe(true);
  });
  it("undoes acceptance while preserving the edited outline", () => {
    const { result } = renderHook(useDemo);
    act(() =>
      result.current.updateSection("executive", {
        guidance: "Custom guidance",
      }),
    );
    act(() => result.current.accept());
    act(() => result.current.undo());
    expect(result.current.accepted).toBe(false);
    expect(result.current.suggestion).toBe(true);
    expect(result.current.sections[0].guidance).toBe("Custom guidance");
  });
  it("undoes and redoes paragraph edits and formatting", () => {
    const { result } = renderHook(useDemo);
    act(() =>
      result.current.updateSection("market", {
        text: "A local paragraph. [1]",
      }),
    );
    act(() => result.current.undoEdit());
    expect(result.current.sections[1].text).toBe(sample.sections[1].text);
    act(() => result.current.redoEdit());
    expect(result.current.sections[1].text).toBe("A local paragraph. [1]");
    act(() => result.current.formatParagraph({ bold: true, list: "bullet" }));
    expect(result.current.format.bold).toBe(true);
    act(() => result.current.undoEdit());
    expect(result.current.format.bold).toBe(false);
    act(() => result.current.redoEdit());
    expect(result.current.format.list).toBe("bullet");
  });
  it("restores a checkpoint as a new version with its full outline and brief", () => {
    const { result } = renderHook(useDemo);
    const original = result.current.versions[1];
    act(() => result.current.addSection());
    act(() => {
      result.current.setAudience("General readers");
      result.current.toggleSource("doe");
    });
    act(() => result.current.accept());
    const count = result.current.versions.length;
    act(() => result.current.restore(original));
    expect(result.current.sections).toEqual(sample.sections);
    expect(result.current.audience).toBe("Leadership");
    expect(result.current.included).toEqual(["iea", "doe"]);
    expect(result.current.accepted).toBe(false);
    expect(result.current.versions).toHaveLength(count + 1);
  });
  it("pages the six separately authored slides in local state", () => {
    const { result } = renderHook(useDemo);
    expect(sample.slides).toHaveLength(6);
    act(() => result.current.setSlide(5));
    expect(sample.slides[result.current.slide].title).toBe("References");
    act(() => result.current.setSlide(0));
    expect(result.current.slide).toBe(0);
    expect(sample.slides[0].body).not.toBe(sample.sections[0].text);
  });
  it("restart resets all sample state and preserves the separate visitor theme", () => {
    localStorage.setItem(
      VISIT_KEY,
      JSON.stringify({ id: "vanam", lastActive: 1 }),
    );
    const theme = localStorage.getItem(VISIT_KEY);
    const { result } = renderHook(useDemo);
    act(() => {
      result.current.addSection();
      result.current.setAudience("Research team");
      result.current.setInstruction("Custom instruction");
      result.current.setSlide(4);
      result.current.toggleSource("iea");
    });
    act(() => result.current.accept());
    act(() => result.current.restart());
    expect(result.current.sections).toEqual(sample.sections);
    expect(result.current.included).toEqual(["iea", "doe"]);
    expect(result.current.accepted).toBe(false);
    expect(result.current.suggestion).toBe(true);
    expect(result.current.audience).toBe("Leadership");
    expect(result.current.slide).toBe(0);
    expect(result.current.instruction).toBe(sample.refinement.instruction);
    expect(result.current.versions).toHaveLength(2);
    expect(result.current.canUndo).toBe(false);
    expect(localStorage.getItem(VISIT_KEY)).toBe(theme);
    localStorage.removeItem(VISIT_KEY);
  });
  it("retains the existing local pause/resume sequence", () => {
    jest.useFakeTimers();
    const { result, unmount } = renderHook(useDemo);
    act(() => result.current.toggleGeneration());
    act(() => jest.advanceTimersByTime(1400));
    expect(result.current.generated).toBe(4);
    act(() => result.current.toggleGeneration());
    act(() => jest.advanceTimersByTime(3000));
    expect(result.current.generated).toBe(4);
    act(() => result.current.toggleGeneration());
    act(() => jest.advanceTimersByTime(1400));
    expect(result.current.generation).toBe("complete");
    unmount();
    jest.useRealTimers();
  });
  it("supplies complete scoped tour tokens for all five original themes", () => {
    const colors = new Set<string>();
    for (const id of THEME_IDS) {
      expect(Object.keys(THEMES[id].tour)).toHaveLength(15);
      expect(themeStyles).toContain(
        `html[data-landing-theme="${id}"] .docbuilder-landing`,
      );
      expect(themeStyles).toContain(`--tour-rail:${THEMES[id].tour.rail}`);
      colors.add(THEMES[id].tour.rail);
    }
    expect(colors.size).toBe(5);
  });
});

// These React state checks use jsdom only; no browser, layout emulation or viewport assertions.
import { fireEvent, render, screen } from "@testing-library/react";
import TourPresent from "../src/components/landing/TourPresent";
import {
  InlineSuggestion,
  RefineInspector,
} from "../src/components/landing/TourRefine";
import { SourcesInspector } from "../src/components/landing/TourDraft";

function ReviewStateHarness() {
  const demo = useDemo();
  return (
    <>
      <InlineSuggestion demo={demo} />
      <RefineInspector demo={demo} />
      <TourPresent demo={demo} createHref="/register" onChapter={jest.fn()} />
    </>
  );
}
function SourceStateHarness() {
  const demo = useDemo();
  return <SourcesInspector demo={demo} />;
}
it("actual Accept and Discard controls update the finished report while preserving [2]", () => {
  render(<ReviewStateHarness />);
  const report = screen.getByRole("article", {
    name: "Finished document example",
  });
  expect(report).toHaveTextContent(`${sample.refinement.original} [2]`);
  fireEvent.click(screen.getByRole("button", { name: "Accept change" }));
  expect(report).toHaveTextContent(`${sample.refinement.suggestion} [2]`);
  expect(report).not.toHaveTextContent(sample.refinement.original);
  fireEvent.click(screen.getByRole("button", { name: "Suggest edit" }));
  fireEvent.click(screen.getByRole("button", { name: "Discard" }));
  expect(report).toHaveTextContent(`${sample.refinement.original} [2]`);
});
it("actual source inclusion and inspection controls update their local context", () => {
  render(<SourceStateHarness />);
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Include Energy Storage" }),
  );
  expect(
    screen.getByText("1 included · existing citations are retained"),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Renewables 2025 IEA/ }));
  expect(
    screen.getByRole("heading", { name: "Renewables 2025" }),
  ).toBeInTheDocument();
  expect(screen.getByText(sample.sources[0].excerpt)).toBeInTheDocument();
});
it("actual deck paging changes the logical slide and selected thumbnail", () => {
  render(<ReviewStateHarness />);
  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(
    screen.getByRole("group", { name: "Slide 2 of 6: Market landscape" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Show slide 2: Market landscape" }),
  ).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
  expect(
    screen.getByRole("group", { name: "Slide 1 of 6: Clean Energy Outlook" }),
  ).toBeInTheDocument();
});

import Workspace from "../src/components/landing/Workspace";
function ArrivalStateHarness({ expanded }: { expanded: boolean }) {
  const demo = useDemo();
  return (
    <Workspace
      demo={demo}
      chapter={0}
      expanded={expanded}
      onChapter={jest.fn()}
      createHref="/register"
    />
  );
}
it("shows the new Brief from arrival and preserves its mounted inputs through expansion", () => {
  const { container, rerender } = render(
    <ArrivalStateHarness expanded={false} />,
  );
  const shell = container.querySelector('[data-workspace="stable-shell"]');
  const tour = container.querySelector('[data-tour-chapter="brief"]');
  expect(tour).toHaveAttribute("data-tour-expanded", "false");
  expect(shell.querySelectorAll("[data-window-controls] i")).toHaveLength(3);
  expect(shell).not.toHaveTextContent("DocBuilder");
  expect(
    screen.getByRole("heading", { name: "Project brief" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Your outline" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Selected section" }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("article")).not.toBeInTheDocument();
  const heading = screen.getByRole("textbox", { name: "Section heading" });
  fireEvent.change(heading, { target: { value: "Unsaved local heading" } });
  rerender(<ArrivalStateHarness expanded />);
  expect(container.querySelector('[data-workspace="stable-shell"]')).toBe(
    shell,
  );
  expect(container.querySelector('[data-tour-chapter="brief"]')).toBe(tour);
  expect(tour).toHaveAttribute("data-tour-expanded", "true");
  expect(screen.getByRole("textbox", { name: "Section heading" })).toBe(
    heading,
  );
  expect(heading).toHaveValue("Unsaved local heading");
  expect(screen.queryByText("Shape your brief")).not.toBeInTheDocument();
});
