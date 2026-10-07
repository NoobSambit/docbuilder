import { useId, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronRight,
  Download,
  Eye,
  FileText,
  History,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import sample from "./sample.json";
import Tour from "./Tour";
import { DemoState } from "./useDemo";
import styles from "./Workspace.module.css";

export const CHAPTERS = ["Brief", "Research", "Refine", "Present"] as const;
export const CHAPTER_COPY = [
  "Give the draft a clear direction.",
  "Know what the draft is built on.",
  "Review every change before it replaces yours.",
  "Finish in the format the work deserves.",
];

export function Brand() {
  return (
    <span className={styles.brand}>
      <BookOpen size={20} aria-hidden="true" /> DocBuilder <span>AI</span>
    </span>
  );
}

export function ExportControl({
  output = "document",
}: {
  output?: "document" | "presentation";
}) {
  return (
    <details className={styles.export}>
      <summary>
        <Download size={14} aria-hidden="true" /> <span>Sample export</span>
      </summary>
      <div className={styles.exportMenu}>
        <strong>Download a finished example</strong>
        <p>Static files; preview edits stay here.</p>
        {output === "document" ? (
          <>
            <a href="/landing/samples/clean-energy-outlook.docx" download>
              Word document <span>.docx</span>
            </a>
            <a href="/landing/samples/clean-energy-outlook.md" download>
              Markdown <span>.md</span>
            </a>
            <a href="/landing/samples/clean-energy-outlook.html" download>
              HTML <span>.html</span>
            </a>
            <a
              href="/landing/samples/clean-energy-outlook.html?print=1"
              target="_blank"
              rel="noreferrer"
            >
              Print reading view{" "}
              <span>
                <Eye size={13} />
              </span>
            </a>
          </>
        ) : (
          <a href="/landing/samples/clean-energy-briefing.pptx" download>
            PowerPoint presentation <span>.pptx</span>
          </a>
        )}
      </div>
    </details>
  );
}

export function BriefPreview({
  demo,
  compact = false,
}: {
  demo: DemoState;
  compact?: boolean;
}) {
  const id = useId();
  return (
    <div className={styles.brief}>
      {!compact && (
        <div className={styles.panelHeading}>
          <strong>Project brief</strong>
          <span>Document</span>
        </div>
      )}
      <label htmlFor={`${id}-purpose`}>Purpose</label>
      <textarea
        id={`${id}-purpose`}
        value={demo.purpose}
        onChange={(event) => demo.setPurpose(event.target.value)}
        rows={compact ? 2 : 3}
      />
      <div className={styles.briefRow}>
        <label>
          Audience
          <select
            value={demo.audience}
            onChange={(event) => demo.setAudience(event.target.value)}
          >
            <option>Leadership</option>
            <option>General readers</option>
            <option>Research team</option>
          </select>
        </label>
        <label>
          Tone
          <select
            value={demo.tone}
            onChange={(event) => demo.setTone(event.target.value)}
          >
            <option>Analytical</option>
            <option>Concise</option>
            <option>Formal</option>
          </select>
        </label>
      </div>
      {!compact && (
        <>
          <p className={styles.helper}>
            Start with a research brief. Edit the section titles before
            drafting.
          </p>
          <label>
            Section title
            <input
              value={demo.titles[demo.selected]}
              onChange={(event) =>
                demo.setTitles(
                  demo.titles.map((title, index) =>
                    index === demo.selected ? event.target.value : title,
                  ),
                )
              }
            />
          </label>
        </>
      )}
      <button
        className={styles.primary}
        onClick={() => demo.checkpoint("Brief approved")}
      >
        <Check size={14} aria-hidden="true" /> Use this brief
      </button>
    </div>
  );
}

export function SourcePreview({
  demo,
  compact = false,
}: {
  demo: DemoState;
  compact?: boolean;
}) {
  const source =
    sample.sources.find((item) => item.id === demo.inspectedSource) ||
    sample.sources[0];
  return (
    <div className={styles.sourcePanel}>
      <div className={styles.panelHeading}>
        <strong>Project sources</strong>
        <span>{demo.included.length} included</span>
      </div>
      {sample.sources.map((item) => (
        <div className={styles.sourceRow} key={item.id}>
          <label className={styles.sourceCheck}>
            <input
              type="checkbox"
              aria-label={`Include ${item.title}`}
              checked={demo.included.includes(item.id)}
              onChange={() => demo.toggleSource(item.id)}
            />
          </label>
          <button
            aria-pressed={source.id === item.id}
            onClick={() => demo.setInspectedSource(item.id)}
          >
            <FileText size={14} aria-hidden="true" />
            <span>
              <strong>{item.title}</strong>
              <small>{item.publisher}</small>
            </span>
            <ChevronRight size={13} aria-hidden="true" />
          </button>
        </div>
      ))}
      <div className={styles.sourceDetail}>
        <span className={styles.eyebrow}>Source inspection</span>
        <h4>{source.title}</h4>
        <small>{source.kind}</small>
        <p>{source.excerpt}</p>
        <a href={source.url} target="_blank" rel="noreferrer">
          Read original source <ChevronRight size={12} aria-hidden="true" />
        </a>
      </div>
      {!compact && (
        <p className={styles.helper}>
          Selection applies to the next draft. Existing citations stay with
          their text.
        </p>
      )}
    </div>
  );
}

export function RefinePreview({
  demo,
  compact = false,
}: {
  demo: DemoState;
  compact?: boolean;
}) {
  return (
    <div className={styles.refine}>
      <div className={styles.panelHeading}>
        <strong>Refine selection</strong>
        <Sparkles size={14} aria-hidden="true" />
      </div>
      <p className={styles.helper}>Executive summary · selected excerpt</p>
      {!compact && (
        <p className={styles.instruction}>{sample.refinement.instruction}</p>
      )}
      {demo.suggestion ? (
        <>
          <span className={styles.eyebrow}>Suggested edit</span>
          <p className={styles.diff}>
            <del>{sample.refinement.original}</del>
            <ins>{sample.refinement.suggestion}</ins>
          </p>
          <small>Source [2] retained</small>
          <div className={styles.actions}>
            <button className={styles.primary} onClick={demo.accept}>
              <Check size={13} aria-hidden="true" /> Accept change
            </button>
            <button onClick={demo.discard}>
              <X size={13} aria-hidden="true" /> Discard
            </button>
          </div>
        </>
      ) : (
        <>
          <p>
            {demo.accepted
              ? "Refinement accepted in this preview."
              : "Original text preserved."}
          </p>
          <button onClick={() => demo.setSuggestion(true)}>
            <RotateCcw size={14} aria-hidden="true" /> Review suggestion again
          </button>
        </>
      )}
    </div>
  );
}

export function HistoryPreview({ demo }: { demo: DemoState }) {
  const [name, setName] = useState("Review checkpoint");
  return (
    <div className={styles.history}>
      <div className={styles.panelHeading}>
        <strong>Sample history</strong>
        <span>{demo.versions.length} versions</span>
      </div>
      <p className={styles.helper}>
        Snapshots stay in this preview. Restoring adds a new version.
      </p>
      <div className={styles.versionList}>
        {[...demo.versions].reverse().map((version) => (
          <div key={version.id}>
            <History size={14} aria-hidden="true" />
            <span>
              <strong>{version.label}</strong>
              <small>Version {version.id}</small>
            </span>
            <button
              aria-label={`Restore ${version.label} version ${version.id}`}
              onClick={() => demo.restore(version)}
            >
              Restore
            </button>
          </div>
        ))}
      </div>
      <form
        className={styles.checkpointForm}
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim()) demo.checkpoint(name.trim());
        }}
      >
        <input
          aria-label="Checkpoint name"
          value={name}
          maxLength={60}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <button type="submit" aria-label="Add named checkpoint">
          <Check size={14} aria-hidden="true" /> Add
        </button>
      </form>
    </div>
  );
}

export function GenerationPreview({ demo }: { demo: DemoState }) {
  return (
    <div className={styles.generation}>
      <div className={styles.panelHeading}>
        <strong>Section sequence</strong>
        <span>{demo.generation}</span>
      </div>
      <p className={styles.helper}>
        Local sample playback · {demo.generated} of {sample.sections.length}{" "}
        sections
      </p>
      {sample.sections.map((section, index) => (
        <div key={section.title}>
          <span className={index < demo.generated ? styles.completed : ""}>
            {index < demo.generated ? <Check size={12} /> : index + 1}
          </span>
          <span>{section.title}</span>
          <small>{index < demo.generated ? "Ready" : "Pending"}</small>
        </div>
      ))}
      <button className={styles.primary} onClick={demo.toggleGeneration}>
        {demo.generation === "running" ? (
          <Pause size={14} aria-hidden="true" />
        ) : (
          <Play size={14} aria-hidden="true" />
        )}
        {demo.generation === "complete"
          ? "Reset sample"
          : demo.generation === "running"
            ? "Pause"
            : "Resume sample"}
      </button>
    </div>
  );
}

function CitationText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[1\]|\[2\])/).map((part, index) =>
        /^\[\d\]$/.test(part) ? (
          <a
            key={index}
            className={styles.citation}
            href={sample.sources[Number(part[1]) - 1].url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Source ${part[1]}: ${sample.sources[Number(part[1]) - 1].title}`}
          >
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function DocumentPaper({
  demo,
  full = false,
}: {
  demo: DemoState;
  full?: boolean;
}) {
  const sections = full ? demo.sections : [demo.sections[demo.selected]];
  return (
    <article
      className={styles.paper}
      aria-label={full ? "Finished sample document" : "Sample document section"}
    >
      <div className={styles.paperMeta}>
        RESEARCH BRIEF <span>DOCBUILDER SAMPLE</span>
      </div>
      {full && (
        <>
          <h3 className={styles.documentTitle}>{sample.title}</h3>
          <p className={styles.documentSubtitle}>{sample.subtitle}</p>
          <div className={styles.contents}>
            <strong>Contents</strong>
            {demo.titles.map((title, index) => (
              <span key={index}>
                {String(index + 1).padStart(2, "0")} &nbsp; {title}
              </span>
            ))}
          </div>
        </>
      )}
      {sections.map((section) => {
        const index = demo.sections.indexOf(section);
        const text =
          section.id === "executive" && demo.accepted
            ? section.text.replace(
                sample.refinement.original,
                sample.refinement.suggestion,
              )
            : section.text;
        return (
          <section key={section.title}>
            <h3>{demo.titles[index]}</h3>
            <p>
              <CitationText text={text} />
            </p>
            <h4>{index === 0 ? "Key takeaways" : "In this section"}</h4>
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>
        );
      })}
      {!full && (
        <div className={styles.documentContinuation}>
          <h3>
            {demo.sections[(demo.selected + 1) % demo.sections.length].title}
          </h3>
          <p>
            <CitationText
              text={
                demo.sections[(demo.selected + 1) % demo.sections.length].text
              }
            />
          </p>
        </div>
      )}
      {full && (
        <section className={styles.references}>
          <h3>References</h3>
          {sample.sources.map((source, index) => (
            <p key={source.id}>
              [{index + 1}]{" "}
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title}
              </a>{" "}
              · {source.publisher}
            </p>
          ))}
        </section>
      )}
      <footer>
        Clean Energy Outlook <span>Illustrative sample</span>
      </footer>
    </article>
  );
}

export function EnergyIllustration() {
  return (
    <svg
      viewBox="0 0 500 320"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Schematic landscape with wind turbines and solar panels"
    >
      <rect width="500" height="320" fill="#dbe5d6" />
      <circle cx="395" cy="65" r="28" fill="#eed8a7" />
      <path d="M0 180Q100 100 210 170T500 155V320H0Z" fill="#afc3a6" />
      <path d="M0 240Q170 170 290 225T500 208V320H0Z" fill="#7b9b7c" />
      {[
        { x: 330, y: 98, h: 143 },
        { x: 205, y: 145, h: 97 },
        { x: 432, y: 138, h: 112 },
      ].map(({ x, y, h }) => (
        <g
          key={x}
          stroke="#faf8ed"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        >
          <path
            d={`M${x} ${y}v${h}M${x} ${y}v-43M${x} ${y}l-36 25M${x} ${y}l36 25`}
          />
          <circle cx={x} cy={y} r="4" fill="#faf8ed" />
        </g>
      ))}
      <g fill="#345558" stroke="#b2cac2" strokeWidth="2">
        <path d="M35 250h130l-15 30H20Z" />
        <path d="M53 250l-12 30m43-30-10 30m44-30-8 30m43-30-7 30M28 265h130" />
      </g>
    </svg>
  );
}

export function SlidePreview({ demo }: { demo: DemoState }) {
  const slide = sample.slides[demo.slide];
  return (
    <div className={styles.deck}>
      <div
        className={styles.slide}
        aria-label={`Slide ${demo.slide + 1}: ${slide.title}`}
      >
        <div>
          <span>{slide.eyebrow}</span>
          <h3>{slide.title}</h3>
          <p>{slide.body}</p>
          <small>DocBuilder sample presentation</small>
        </div>
        <EnergyIllustration />
      </div>
      <div className={styles.filmstrip} aria-label="Presentation slides">
        {sample.slides.map((item, index) => (
          <button
            key={item.title}
            aria-label={`Show slide ${index + 1}: ${item.title}`}
            aria-pressed={demo.slide === index}
            onClick={() => demo.setSlide(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>
      <div className={styles.deckFooter}>
        <span>
          Slide {demo.slide + 1} / {sample.slides.length}
        </span>
        <span>Separately authored deck example</span>
      </div>
    </div>
  );
}

interface WorkspaceProps {
  demo: DemoState;
  chapter: number;
  expanded: boolean;
  onChapter: (index: number) => void;
  createHref: string;
}
export default function Workspace({
  demo,
  chapter,
  expanded,
  onChapter,
  createHref,
}: WorkspaceProps) {
  return (
    <div
      className={`${styles.workspace} ${styles.tourWorkspace}`}
      data-workspace="stable-shell"
    >
      <Tour
        demo={demo}
        chapter={chapter}
        expanded={expanded}
        onChapter={onChapter}
        createHref={createHref}
      />
    </div>
  );
}
