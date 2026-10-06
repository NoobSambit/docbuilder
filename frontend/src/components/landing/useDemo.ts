import { useEffect, useState } from "react";
import sample from "./sample.json";

export type UtilityTab = "brief" | "research" | "refine" | "history";
interface Snapshot {
  id: number;
  label: string;
  accepted: boolean;
  audience: string;
  purpose: string;
  tone: string;
  titles: string[];
}

export function useDemo() {
  const [selected, setSelected] = useState(0);
  const [utility, setUtility] = useState<UtilityTab>("research");
  const [mobilePane, setMobilePane] = useState("document");
  const [inspectedSource, setInspectedSource] = useState("iea");
  const [included, setIncluded] = useState(["iea", "doe"]);
  const [audience, setAudience] = useState("Leadership");
  const [purpose, setPurpose] = useState("Explain the energy transition");
  const [tone, setTone] = useState("Analytical");
  const [titles, setTitles] = useState(
    sample.sections.map((section) => section.title),
  );
  const [accepted, setAccepted] = useState(false);
  const [suggestion, setSuggestion] = useState(true);
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
  const [versions, setVersions] = useState<Snapshot[]>([
    {
      id: 1,
      label: "Outline approved",
      accepted: false,
      audience: "Leadership",
      purpose: "Explain the energy transition",
      tone: "Analytical",
      titles: sample.sections.map((section) => section.title),
    },
    {
      id: 2,
      label: "Initial draft",
      accepted: false,
      audience: "Leadership",
      purpose: "Explain the energy transition",
      tone: "Analytical",
      titles: sample.sections.map((section) => section.title),
    },
  ]);
  useEffect(() => {
    if (generation !== "running") return;
    const timeout = setTimeout(() => {
      const next = generated + 1;
      setGenerated(next);
      if (next >= sample.sections.length) {
        setGeneration("complete");
        setMessage(
          "Sample sequence complete. No content was generated through an API.",
        );
      } else
        setMessage(
          `Sample section ${next} of ${sample.sections.length} revealed.`,
        );
    }, 1400);
    return () => clearTimeout(timeout);
  }, [generation, generated]);
  const checkpoint = (
    label = "Named checkpoint",
    change?: Partial<Snapshot>,
  ) => {
    const snapshot = {
      id: versions.length + 1,
      label,
      accepted,
      audience,
      purpose,
      tone,
      titles: [...titles],
      ...change,
    };
    setVersions((previous) => [...previous, snapshot]);
    setMessage(`${label} added to sample history in this preview.`);
  };
  const accept = () => {
    setSelected(0);
    setPreview(false);
    setAccepted(true);
    setSuggestion(false);
    checkpoint("Refinement accepted", { accepted: true });
  };
  const discard = () => {
    setSuggestion(false);
    setMessage("Suggestion discarded. The original text is preserved.");
  };
  const restore = (version: Snapshot) => {
    setAccepted(version.accepted);
    setAudience(version.audience);
    setPurpose(version.purpose);
    setTone(version.tone);
    setTitles([...version.titles]);
    checkpoint(`Restored ${version.label}`, {
      accepted: version.accepted,
      audience: version.audience,
      purpose: version.purpose,
      tone: version.tone,
      titles: [...version.titles],
    });
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
  return {
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
    titles,
    setTitles,
    accepted,
    suggestion,
    setSuggestion,
    accept,
    discard,
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
  };
}
export type DemoState = ReturnType<typeof useDemo>;
