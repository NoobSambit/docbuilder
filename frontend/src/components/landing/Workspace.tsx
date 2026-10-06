import { useEffect, useId } from "react";
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
  Presentation,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import sample from "./sample.json";
import { DemoState, UtilityTab } from "./useDemo";
import styles from "./Workspace.module.css";

export const CHAPTERS = ["Shape", "Research", "Refine", "Present"] as const;
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
      <div className={styles.panelHeading}>
        <strong>Project brief</strong>
        <span>Document</span>
      </div>
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
        <strong>Sources for this section</strong>
        <span>{demo.included.length} included</span>
      </div>
      {sample.sources.map((item) => (
        <div className={styles.sourceRow} key={item.id}>
          <input
            type="checkbox"
            aria-label={`Include ${item.title}`}
            checked={demo.included.includes(item.id)}
            onChange={() => demo.toggleSource(item.id)}
          />
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
      <button onClick={() => demo.checkpoint()}>
        <Check size={14} aria-hidden="true" /> Add checkpoint
      </button>
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
  const sections = full ? sample.sections : [sample.sections[demo.selected]];
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
        const index = sample.sections.indexOf(section);
        const text =
          index === 0 && demo.accepted
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
            {
              sample.sections[(demo.selected + 1) % sample.sections.length]
                .title
            }
          </h3>
          <p>
            <CitationText
              text={
                sample.sections[(demo.selected + 1) % sample.sections.length]
                  .text
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
}
export default function Workspace({
  demo,
  chapter,
  expanded,
  onChapter,
}: WorkspaceProps) {
  useEffect(() => {
    if (!expanded) return;
    const utility: UtilityTab =
      chapter === 0
        ? "brief"
        : chapter === 1
          ? "research"
          : chapter === 2
            ? "refine"
            : "history";
    demo.setUtility(utility);
    demo.setPreview(chapter === 3);
    demo.setMobilePane("document");
    // Deliberately only tied to chapter transitions, so manual controls remain usable between them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, expanded]);
  const tabs: UtilityTab[] = ["brief", "research", "refine", "history"];
  return (
    <div className={styles.workspace} data-workspace="stable-shell">
      <div className={styles.topbar}>
        <Brand />
        <span className={styles.projectTitle}>
          {sample.title}{" "}
          <span className={styles.sampleBadge}>Sample project</span>
        </span>
        <div className={styles.topActions}>
          <button
            onClick={() => {
              demo.setUtility("history");
              demo.setMobilePane("tools");
            }}
            aria-label="Open sample history"
          >
            <History size={15} aria-hidden="true" />
            <span>History</span>
          </button>
          <button
            aria-pressed={demo.preview}
            onClick={() => {
              demo.setPreview(!demo.preview);
              demo.setMobilePane("document");
            }}
          >
            <Eye size={15} aria-hidden="true" />
            <span>{demo.preview ? "Editor" : "Preview"}</span>
          </button>
          <ExportControl output={demo.preview ? demo.output : "document"} />
        </div>
      </div>
      <nav className={styles.chapterNav} aria-label="Sample workflow chapters">
        {CHAPTERS.map((name, index) => (
          <button
            key={name}
            aria-current={chapter === index ? "step" : undefined}
            onClick={() => onChapter(index)}
          >
            <span>0{index + 1}</span>
            {name}
          </button>
        ))}
        <span className={styles.chapterHint}>{CHAPTER_COPY[chapter]}</span>
      </nav>
      <div className={styles.briefStrip}>
        <span>
          Audience <strong>{demo.audience}</strong>
        </span>
        <span>
          Purpose <strong>{demo.purpose}</strong>
        </span>
        <span>
          Tone <strong>{demo.tone}</strong>
        </span>
        <button
          onClick={() => {
            demo.setUtility("brief");
            demo.setMobilePane("tools");
          }}
        >
          Edit brief
        </button>
      </div>
      <nav className={styles.mobileTabs} aria-label="Workspace panels">
        {["outline", "document", "tools"].map((tab) => (
          <button
            key={tab}
            aria-pressed={demo.mobilePane === tab}
            onClick={() => demo.setMobilePane(tab)}
          >
            {tab === "tools" ? "Research & tools" : tab}
          </button>
        ))}
      </nav>
      <div className={styles.body} data-mobile-pane={demo.mobilePane}>
        <aside className={styles.outline} aria-label="Sample outline">
          <div className={styles.outlineHeading}>
            Outline <span>{demo.titles.length} sections</span>
          </div>
          {demo.titles.map((title, index) => (
            <button
              key={index}
              aria-pressed={demo.selected === index}
              onClick={() => {
                demo.setSelected(index);
                demo.setMobilePane("document");
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {title}
            </button>
          ))}
          <button
            className={styles.outlineAction}
            onClick={() => {
              demo.setUtility("brief");
              demo.setMobilePane("tools");
            }}
          >
            <Sparkles size={14} aria-hidden="true" /> Shape your brief
          </button>
          <div className={styles.outlineBrief}>
            <span>PROJECT BRIEF</span>
            <dl>
              <dt>Audience</dt>
              <dd>{demo.audience}</dd>
              <dt>Purpose</dt>
              <dd>{demo.purpose}</dd>
              <dt>Tone</dt>
              <dd>{demo.tone}</dd>
            </dl>
          </div>
          <div className={styles.outlineBottom}>
            <Check size={13} aria-hidden="true" /> Local sample · no quota used
          </div>
        </aside>
        <div className={styles.editor}>
          <div className={styles.editorToolbar}>
            <span>
              <FileText size={14} aria-hidden="true" />{" "}
              {demo.preview ? "Reading view" : "Document"}
            </span>
            <span>Source-backed example</span>
            {demo.preview && (
              <select
                aria-label="Select output example"
                value={demo.output}
                onChange={(event) =>
                  demo.setOutput(
                    event.target.value as "document" | "presentation",
                  )
                }
              >
                <option value="document">Document example</option>
                <option value="presentation">Separate deck example</option>
              </select>
            )}
          </div>
          <div className={styles.paperScroll}>
            {demo.preview && demo.output === "presentation" ? (
              <SlidePreview demo={demo} />
            ) : (
              <DocumentPaper demo={demo} full={demo.preview} />
            )}
          </div>
        </div>
        <aside className={styles.utility} aria-label="Sample writing tools">
          <div className={styles.utilityTabs}>
            {tabs.map((tab) => (
              <button
                key={tab}
                aria-pressed={demo.utility === tab}
                onClick={() => demo.setUtility(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className={styles.utilityContent}>
            {demo.utility === "brief" ? (
              <BriefPreview demo={demo} />
            ) : demo.utility === "research" ? (
              <SourcePreview demo={demo} />
            ) : demo.utility === "refine" ? (
              <RefinePreview demo={demo} />
            ) : (
              <>
                <HistoryPreview demo={demo} />
                <GenerationPreview demo={demo} />
              </>
            )}
          </div>
        </aside>
      </div>
      <div className={styles.status} role="status">
        <Check size={12} aria-hidden="true" />
        <span>{demo.message}</span>
        <span className={styles.localLabel}>Interactive sample</span>
      </div>
    </div>
  );
}
