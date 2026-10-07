import { useEffect, useState } from "react";
import sample from "./sample.json";

export type UtilityTab = "brief" | "research" | "refine" | "history";
export interface ParagraphFormat {
  bold: boolean;
  italic: boolean;
  list: "none" | "bullet" | "number";
  style: string;
}
const defaultFormat: ParagraphFormat = {
  bold: false,
  italic: false,
  list: "none",
  style: "Paragraph",
};
export type OutlineSection = (typeof sample.sections)[number];
interface Snapshot {
  id: number;
  label: string;
  accepted: boolean;
  audience: string;
  purpose: string;
  tone: string;
  length: string;
  starter: string;
  sections: OutlineSection[];
  included: string[];
}
const freshSections = () =>
  sample.sections.map((section) => ({
    ...section,
    subsections: [...section.subsections],
  }));
const initialVersions = (): Snapshot[] =>
  ["Outline approved", "Initial draft"].map((label, index) => ({
    id: index + 1,
    label,
    accepted: false,
    audience: sample.brief.audience,
    purpose: sample.brief.goal,
    tone: sample.brief.tone,
    length: sample.brief.length,
    starter: "Executive brief",
    sections: freshSections(),
    included: ["iea", "doe"],
  }));

// One local model powers the arrival preview, all tour chapters and capability examples.
export function useDemo() {
  const [selected, setSelected] = useState(0);
  const [utility, setUtility] = useState<UtilityTab>("research");
  const [mobilePane, setMobilePane] = useState("document");
  const [inspectedSource, setInspectedSource] = useState("doe");
  const [included, setIncluded] = useState(["iea", "doe"]);
  const [audience, setAudience] = useState(sample.brief.audience);
  const [purpose, setPurpose] = useState(sample.brief.goal);
  const [tone, setTone] = useState(sample.brief.tone);
  const [length, setLength] = useState(sample.brief.length);
  const [starter, setStarter] = useState("Executive brief");
  const [sections, setSections] = useState<OutlineSection[]>(freshSections);
  const [formats, setFormats] = useState<Record<string, ParagraphFormat>>({});
  const [editorPast, setEditorPast] = useState<
    {
      sections: OutlineSection[];
      formats: Record<string, ParagraphFormat>;
      accepted: boolean;
    }[]
  >([]);
  const [editorFuture, setEditorFuture] = useState<typeof editorPast>([]);
  const rememberEdit = () => {
    setEditorPast((previous) => [...previous, { sections, formats, accepted }]);
    setEditorFuture([]);
  };
  const format = formats[sections[selected].id] || defaultFormat;
  const formatParagraph = (change: Partial<ParagraphFormat>) => {
    rememberEdit();
    setFormats((previous) => ({
      ...previous,
      [sections[selected].id]: { ...format, ...change },
    }));
  };
  const undoEdit = () => {
    const last = editorPast[editorPast.length - 1];
    if (!last) return;
    setEditorFuture((previous) => [
      ...previous,
      { sections, formats, accepted },
    ]);
    setSections(last.sections);
    setFormats(last.formats);
    setAccepted(last.accepted);
    setEditorPast((previous) => previous.slice(0, -1));
    setSelected(Math.min(selected, last.sections.length - 1));
    setMessage("Last editor change undone.");
  };
  const redoEdit = () => {
    const last = editorFuture[editorFuture.length - 1];
    if (!last) return;
    setEditorPast((previous) => [...previous, { sections, formats, accepted }]);
    setSections(last.sections);
    setFormats(last.formats);
    setAccepted(last.accepted);
    setEditorFuture((previous) => previous.slice(0, -1));
    setSelected(Math.min(selected, last.sections.length - 1));
    setMessage("Editor change reapplied.");
  };
  const titles = sections.map((section) => section.title);
  const setTitles = (next: string[]) =>
    setSections((previous) =>
      previous.map((section, index) => ({
        ...section,
        title: next[index] ?? section.title,
      })),
    );
  const [accepted, setAccepted] = useState(false);
  const [suggestion, setSuggestion] = useState(true);
  const [instruction, setInstruction] = useState(sample.refinement.instruction);
  const [preview, setPreview] = useState(false);
  const [output, setOutput] = useState<"document" | "presentation">("document");
  const [slide, setSlide] = useState(0);
  const [generation, setGeneration] = useState<
    "paused" | "running" | "complete"
  >("paused");
  const [generated, setGenerated] = useState(3);
  const [message, setMessage] = useState(
    "Sample loaded. Changes stay in this preview.",
  );
  const [versions, setVersions] = useState<Snapshot[]>(initialVersions);
  useEffect(() => {
    if (generation !== "running") return;
    const timeout = setTimeout(() => {
      const next = generated + 1;
      setGenerated(next);
      if (next >= sections.length) {
        setGeneration("complete");
        setMessage(
          "Sample sequence complete. No content was generated through an API.",
        );
      } else
        setMessage(`Sample section ${next} of ${sections.length} revealed.`);
    }, 1400);
    return () => clearTimeout(timeout);
  }, [generation, generated, sections.length]);
  const checkpoint = (
    label = "Named checkpoint",
    change?: Partial<Snapshot>,
  ) => {
    setVersions((previous) => [
      ...previous,
      {
        id: previous.length + 1,
        label,
        accepted,
        audience,
        purpose,
        tone,
        length,
        starter,
        sections: sections.map((section) => ({
          ...section,
          subsections: [...section.subsections],
        })),
        included: [...included],
        ...change,
      },
    ]);
    setMessage(`${label} added to sample history in this preview.`);
  };
  const accept = () => {
    rememberEdit();
    setSelected(
      Math.max(
        0,
        sections.findIndex((section) => section.id === "executive"),
      ),
    );
    setPreview(false);
    setAccepted(true);
    setSuggestion(false);
    checkpoint("Refinement accepted", { accepted: true });
  };
  const discard = () => {
    setAccepted(false);
    setSuggestion(false);
    setMessage("Suggestion discarded. The original text is preserved.");
  };
  const undo = () => {
    setAccepted(false);
    setSuggestion(true);
    setMessage("Original wording restored. The suggestion is pending again.");
  };
  const suggest = () => {
    setSuggestion(true);
    setMessage(
      "Prepared concise suggestion ready. Source [2] retained; no AI request was made.",
    );
  };
  const restore = (version: Snapshot) => {
    setAccepted(version.accepted);
    setSuggestion(false);
    setAudience(version.audience);
    setPurpose(version.purpose);
    setTone(version.tone);
    setLength(version.length);
    setStarter(version.starter);
    setSections(
      version.sections.map((section) => ({
        ...section,
        subsections: [...section.subsections],
      })),
    );
    setIncluded([...version.included]);
    setSelected(0);
    checkpoint(`Restored ${version.label}`, {
      ...version,
      id: versions.length + 1,
      label: `Restored ${version.label}`,
    });
  };
  const updateSection = (id: string, changes: Partial<OutlineSection>) => {
    rememberEdit();
    setSections((previous) =>
      previous.map((section) =>
        section.id === id ? { ...section, ...changes } : section,
      ),
    );
  };
  const addSection = () => {
    if (sections.length >= 8) return;
    const section: OutlineSection = {
      id: `custom-${sections.length + 1}`,
      title: "Additional considerations",
      description: "Add context for your readers",
      guidance: "Describe the questions this section should answer.",
      subsections: ["Questions to consider"],
      text: "Add your own context to this local preview.",
      bullets: ["Review the linked evidence."],
      sourceIds: [],
    };
    setSections((previous) => [...previous, section]);
    setSelected(sections.length);
    setMessage(
      "Section added. Edit its heading and guidance in the inspector.",
    );
  };
  const reorderSections = (from: number, to: number) => {
    if (to < 0 || to >= sections.length || from === to) return;
    const next = [...sections];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    const selectedId = sections[selected].id;
    setSections(next);
    setSelected(next.findIndex((section) => section.id === selectedId));
    setMessage("Outline order updated in this preview.");
  };
  const generateOutline = () => {
    // The prepared structure is deterministic; custom edits are kept.
    checkpoint("Brief approved");
    setMessage(
      `${sections.length}-section ${starter.toLowerCase()} ready for ${audience.toLowerCase()}. Edit or reorder before drafting.`,
    );
  };
  const toggleSource = (id: string) => {
    setIncluded((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
    setMessage(
      "Source selection updated for the next sample draft. Existing citations are retained.",
    );
  };
  const toggleGeneration = () => {
    if (generation === "complete") {
      setGenerated(3);
      setGeneration("paused");
      setMessage("Sample sequence reset to its paused checkpoint.");
    } else {
      setGeneration(generation === "running" ? "paused" : "running");
      setMessage(
        generation === "running"
          ? "Paused after the current sample section."
          : "Resuming the local sample sequence.",
      );
    }
  };
  const restart = () => {
    setSelected(0);
    setUtility("brief");
    setMobilePane("document");
    setInspectedSource("doe");
    setIncluded(["iea", "doe"]);
    setAudience(sample.brief.audience);
    setPurpose(sample.brief.goal);
    setTone(sample.brief.tone);
    setLength(sample.brief.length);
    setStarter("Executive brief");
    setSections(freshSections());
    setAccepted(false);
    setSuggestion(true);
    setInstruction(sample.refinement.instruction);
    setPreview(false);
    setOutput("document");
    setSlide(0);
    setGeneration("paused");
    setGenerated(3);
    setFormats({});
    setEditorPast([]);
    setEditorFuture([]);
    setVersions(initialVersions());
    setMessage("Sample restarted. Your selected artwork theme is preserved.");
  };
  return {
    formats,
    format,
    formatParagraph,
    undoEdit,
    redoEdit,
    canUndo: editorPast.length > 0,
    canRedo: editorFuture.length > 0,
    selected,
    setSelected,
    utility,
    setUtility,
    mobilePane,
    setMobilePane,
    inspectedSource,
    setInspectedSource,
    included,
    toggleSource,
    audience,
    setAudience,
    purpose,
    setPurpose,
    tone,
    setTone,
    length,
    setLength,
    starter,
    setStarter,
    titles,
    setTitles,
    sections,
    updateSection,
    addSection,
    reorderSections,
    generateOutline,
    accepted,
    suggestion,
    setSuggestion,
    instruction,
    setInstruction,
    accept,
    discard,
    undo,
    suggest,
    preview,
    setPreview,
    output,
    setOutput,
    slide,
    setSlide,
    generation,
    generated,
    toggleGeneration,
    message,
    setMessage,
    versions,
    checkpoint,
    restore,
    restart,
  };
}
export type DemoState = ReturnType<typeof useDemo>;
