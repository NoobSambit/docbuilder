import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Pencil,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import sample from "./sample.json";
import { DemoState } from "./useDemo";
import {
  MenuAction,
  SortableList,
  SortableRow,
  TourMenu,
  TourSelect,
} from "./TourPrimitives";
import {
  CitationConnector,
  DraftEditor,
  OutlineNavigation,
  SourcesInspector,
} from "./TourDraft";
import { InlineSuggestion, RefineInspector } from "./TourRefine";
import TourPresent from "./TourPresent";
import styles from "./Tour.module.css";

export const TOUR_CHAPTERS = [
  "Brief",
  "Research",
  "Refine",
  "Present",
] as const;
const HEADLINES = [
  "Start with a clear brief.",
  "Know what your draft is built on.",
  "Improve the draft. Keep the final say.",
  "Review the result. Take it with you.",
];
const SUPPORT = [
  "Choose the audience and shape an outline you can change.",
  "Choose your sources. Follow each citation back to the evidence.",
  "Review the suggestion before it replaces your text.",
  "Preview your document or presentation, then choose its export format.",
];

function DocumentKind({ onChapter }: { onChapter: (index: number) => void }) {
  return (
    <TourMenu
      label="Document workflow"
      trigger={
        <>
          <FileText size={25} />
          Document
        </>
      }
    >
      <MenuAction onSelect={() => onChapter(0)}>
        <FileText size={20} />
        Edit brief
      </MenuAction>
      <MenuAction onSelect={() => onChapter(3)}>
        <ArrowRight size={20} />
        Review output examples
      </MenuAction>
    </TourMenu>
  );
}
function BriefComposer({
  demo,
  onChapter,
}: {
  demo: DemoState;
  onChapter: (index: number) => void;
}) {
  const id = useId();
  return (
    <aside className={styles.rail} aria-label="Project brief">
      <header className={styles.paneHeading}>
        <h3>Project brief</h3>
        <DocumentKind onChapter={onChapter} />
      </header>
      <label className={styles.field} htmlFor={`${id}-goal`}>
        Topic / goal
        <textarea
          id={`${id}-goal`}
          rows={2}
          value={demo.purpose}
          onChange={(e) => demo.setPurpose(e.target.value)}
        />
      </label>
      <div className={styles.fieldPair}>
        <div className={styles.field}>
          <span>Audience</span>
          <TourSelect
            label="Audience"
            value={demo.audience}
            options={["Leadership", "General readers", "Research team"]}
            onChange={demo.setAudience}
          />
        </div>
        <div className={styles.field}>
          <span>Tone</span>
          <TourSelect
            label="Tone"
            value={demo.tone}
            options={["Analytical", "Concise", "Formal"]}
            onChange={demo.setTone}
          />
        </div>
      </div>
      <div className={styles.field}>
        <span>Length</span>
        <TourSelect
          label="Length"
          value={demo.length}
          options={["Executive brief", "Detailed report", "One-page summary"]}
          onChange={demo.setLength}
        />
      </div>
      <div className={styles.starters}>
        <p>Starter structure</p>
        {["Executive brief", "Research report"].map((title, index) => (
          <button
            key={title}
            aria-pressed={demo.starter === title}
            onClick={() => {
              demo.setStarter(title);
              demo.setLength(index ? "Detailed report" : "Executive brief");
              demo.setMessage(
                `${title} selected. Generate outline to confirm this local brief.`,
              );
            }}
          >
            <span className={styles.selectionDot} />
            <FileText size={29} />
            <span>
              <strong>{title}</strong>
              <small>
                {index
                  ? "A more detailed, in-depth outline."
                  : "A concise, decision-focused outline."}
              </small>
            </span>
          </button>
        ))}
      </div>
      <button className={styles.primary} onClick={demo.generateOutline}>
        <Sparkles size={25} />
        Generate outline
        <ArrowRight size={24} />
      </button>
      <div className={styles.briefChecklist}>
        <p>Your brief guides every section.</p>
        {[
          "Explain the transition",
          "Keep sources attached",
          "End with useful next steps",
        ].map((text) => (
          <span key={text}>
            <Check size={19} />
            {text}
          </span>
        ))}
      </div>
    </aside>
  );
}
function BriefOutline({
  demo,
  expandedItems,
  toggleItem,
}: {
  demo: DemoState;
  expandedItems: string[];
  toggleItem: (id: string) => void;
}) {
  return (
    <section className={styles.outlineEditor} aria-label="Editable outline">
      <header className={styles.paneHeading}>
        <h3>Your outline</h3>
        <span className={styles.ready}>
          <i />
          {demo.sections.length} sections · Ready
        </span>
        <button
          className={styles.secondary}
          onClick={demo.addSection}
          disabled={demo.sections.length >= 8}
        >
          <Plus size={21} />
          Add section
        </button>
      </header>
      <SortableList
        ids={demo.sections.map((s) => s.id)}
        onMove={demo.reorderSections}
      >
        {demo.sections.map((section, index) => (
          <SortableRow
            key={section.id}
            id={section.id}
            label={section.title}
            className={`${styles.outlineItem} ${demo.selected === index ? styles.outlineSelected : ""}`}
          >
            <button
              className={styles.outlineNumber}
              aria-label={`Select section ${index + 1}: ${section.title}`}
              aria-pressed={demo.selected === index}
              onClick={() => demo.setSelected(index)}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
            <div className={styles.outlineText}>
              <button
                className={styles.outlineTitle}
                onClick={() => demo.setSelected(index)}
                aria-pressed={demo.selected === index}
              >
                <strong>{section.title}</strong>
                <span>{section.description}</span>
              </button>
              {expandedItems.includes(section.id) && (
                <ul>
                  {section.subsections.map((sub, i) => (
                    <li key={i}>{sub}</li>
                  ))}
                </ul>
              )}
            </div>
            <button
              className={styles.iconButton}
              aria-expanded={expandedItems.includes(section.id)}
              aria-label={`${expandedItems.includes(section.id) ? "Collapse" : "Expand"} ${section.title}`}
              onClick={() => toggleItem(section.id)}
            >
              {expandedItems.includes(section.id) ? (
                <ChevronDown size={21} />
              ) : (
                <ChevronRight size={21} />
              )}
            </button>
            <button
              className={styles.iconButton}
              aria-label={`Edit ${section.title}`}
              onClick={() => {
                demo.setSelected(index);
                demo.setMobilePane("tools");
                requestAnimationFrame(() =>
                  document
                    .querySelector<HTMLInputElement>("[data-section-heading]")
                    ?.focus(),
                );
              }}
            >
              <Pencil size={23} />
            </button>
          </SortableRow>
        ))}
      </SortableList>
      <p className={styles.outlineHint}>
        Edit or reorder any section before drafting.
      </p>
    </section>
  );
}
function SectionInspector({
  demo,
  onChapter,
}: {
  demo: DemoState;
  onChapter: (index: number) => void;
}) {
  const section = demo.sections[demo.selected];
  const [heading, setHeading] = useState(section.title);
  const [guidance, setGuidance] = useState(section.guidance);
  const [subsections, setSubsections] = useState(section.subsections);
  const id = useId();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    setHeading(section.title);
    setGuidance(section.guidance);
    setSubsections([...section.subsections]);
  }, [section.title, section.guidance, section.subsections]);
  return (
    <aside className={styles.inspector} aria-label="Selected section inspector">
      <header className={styles.paneHeading}>
        <h3>Selected section</h3>
        <span>
          {String(demo.selected + 1).padStart(2, "0")} of{" "}
          {String(demo.sections.length).padStart(2, "0")}
        </span>
      </header>
      <h4 className={styles.selectedHeading}>{section.title}</h4>
      <label className={styles.field}>
        Section heading
        <input
          data-section-heading
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          maxLength={80}
        />
      </label>
      <label className={styles.field}>
        Section guidance
        <textarea
          rows={2}
          value={guidance}
          onChange={(e) => setGuidance(e.target.value)}
        />
      </label>
      <div className={styles.field}>
        <span>Subsections</span>
        <SortableList
          ids={subsections.map((_, i) => `${id}-${i}`)}
          onMove={(from, to) => {
            const next = [...subsections];
            const [item] = next.splice(from, 1);
            next.splice(to, 0, item);
            setSubsections(next);
          }}
        >
          {subsections.map((sub, index) => (
            <SortableRow
              key={`${id}-${index}`}
              id={`${id}-${index}`}
              label={sub || `subsection ${index + 1}`}
              className={styles.subsection}
            >
              <input
                aria-label={`Subsection ${index + 1}`}
                value={sub}
                ref={(element) => {
                  inputs.current[index] = element;
                }}
                onChange={(e) =>
                  setSubsections((previous) =>
                    previous.map((value, i) =>
                      i === index ? e.target.value : value,
                    ),
                  )
                }
                maxLength={80}
              />
              <button
                className={styles.iconButton}
                aria-label={`Edit subsection ${index + 1}`}
                onClick={() => inputs.current[index]?.focus()}
              >
                <Pencil size={20} />
              </button>
            </SortableRow>
          ))}
        </SortableList>
        <button
          className={styles.addSubsection}
          disabled={subsections.length >= 6}
          onClick={() =>
            setSubsections((previous) => [...previous, "New subsection"])
          }
        >
          <Plus size={21} />
          Add subsection
        </button>
      </div>
      <button
        className={styles.primary}
        disabled={!heading.trim()}
        onClick={() => {
          if (!heading.trim()) return;
          demo.updateSection(section.id, {
            title: heading.trim(),
            guidance,
            subsections,
          });
          demo.setMessage(`${heading.trim()} updated in the local outline.`);
        }}
      >
        Update section
      </button>
      <button className={styles.nextAction} onClick={() => onChapter(1)}>
        <span>
          <ChevronRight size={23} />
        </span>
        Next: connect your sources
      </button>
    </aside>
  );
}
export default function Tour({
  demo,
  chapter,
  onChapter,
  createHref,
}: {
  demo: DemoState;
  chapter: number;
  onChapter: (index: number) => void;
  createHref: string;
}) {
  const panes = useRef<HTMLDivElement>(null);
  const [expandedItems, setExpandedItems] = useState(["executive", "market"]);
  useEffect(() => {
    demo.setMobilePane("document");
    if (chapter === 2)
      demo.setSelected(
        Math.max(
          0,
          demo.sections.findIndex((section) => section.id === "executive"),
        ),
      );
  }, [chapter]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div
      className={styles.tour}
      data-tour-chapter={TOUR_CHAPTERS[chapter].toLowerCase()}
    >
      <header className={styles.projectbar}>
        <span className={styles.brand}>
          <BookOpen size={37} />
          DocBuilder AI
        </span>
        <span className={styles.projectTitle}>
          {sample.title}
          <small>Sample project</small>
        </span>
        <button
          className={styles.restart}
          onClick={() => {
            demo.restart();
            setExpandedItems(["executive", "market"]);
            onChapter(0);
          }}
        >
          <RotateCcw size={21} />
          Restart demo
        </button>
      </header>
      <nav
        className={styles.chapterTrack}
        aria-label="Sample workflow chapters"
      >
        {TOUR_CHAPTERS.map((name, index) => (
          <button
            key={name}
            aria-current={chapter === index ? "step" : undefined}
            onClick={() => onChapter(index)}
          >
            <span>0{index + 1}</span>
            {name}
            {index < chapter && (
              <i>
                <Check size={19} />
              </i>
            )}
          </button>
        ))}
        <button
          className={styles.continue}
          onClick={() =>
            chapter < 3
              ? onChapter(chapter + 1)
              : document
                  .getElementById("capabilities")
                  ?.scrollIntoView({ behavior: "auto" })
          }
        >
          <ArrowDown size={26} />
          Scroll to continue
        </button>
      </nav>
      <div className={styles.narration}>
        <h2>{HEADLINES[chapter]}</h2>
        <p>{SUPPORT[chapter]}</p>
      </div>
      {chapter !== 3 && (
        <nav className={styles.mobilePanels} aria-label="Tour panels">
          {["outline", "document", "tools"].map((pane) => (
            <button
              key={pane}
              aria-pressed={demo.mobilePane === pane}
              onClick={() => demo.setMobilePane(pane)}
            >
              {pane === "outline"
                ? chapter === 0
                  ? "Project brief"
                  : "Outline"
                : pane === "document"
                  ? chapter === 0
                    ? "Your outline"
                    : "Draft"
                  : chapter === 0
                    ? "Section details"
                    : chapter === 2
                      ? "Refine"
                      : "Sources"}
            </button>
          ))}
        </nav>
      )}
      {chapter === 3 ? (
        <TourPresent
          demo={demo}
          createHref={createHref}
          onChapter={onChapter}
        />
      ) : (
        <div className={styles.panes} data-pane={demo.mobilePane} ref={panes}>
          {chapter === 0 ? (
            <>
              <BriefComposer demo={demo} onChapter={onChapter} />
              <BriefOutline
                demo={demo}
                expandedItems={expandedItems}
                toggleItem={(id) =>
                  setExpandedItems((previous) =>
                    previous.includes(id)
                      ? previous.filter((item) => item !== id)
                      : [...previous, id],
                  )
                }
              />
              <SectionInspector
                key={demo.sections[demo.selected].id}
                demo={demo}
                onChapter={onChapter}
              />
            </>
          ) : (
            <>
              <OutlineNavigation demo={demo} onChapter={onChapter} />
              <DraftEditor demo={demo} refine={chapter === 2}>
                {chapter === 2 && <InlineSuggestion demo={demo} />}
              </DraftEditor>
              {chapter === 2 ? (
                <RefineInspector demo={demo} />
              ) : (
                <SourcesInspector demo={demo} />
              )}
              {chapter === 1 && (
                <CitationConnector
                  host={panes}
                  sourceId={demo.inspectedSource}
                  selected={demo.selected}
                />
              )}
            </>
          )}
        </div>
      )}
      <span className={styles.liveStatus} role="status" aria-live="polite">
        {demo.message}
      </span>
    </div>
  );
}
