import { useState } from "react";
import {
  ArrowUpRight,
  Bold,
  Italic,
  Underline,
  Plus,
  Check,
  FileText,
  History,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useDemo } from "./useDemo";
import sample from "./sample.json";
import styles from "./CapabilityPreviews.module.css";

// These presenters intentionally own a five-section sample, separate from the full tour.
export default function CapabilityPreviews({
  artReady,
}: {
  artReady: boolean;
}) {
  const demo = useDemo();
  const [briefTab, setBriefTab] = useState<"brief" | "document">("brief");
  const [sourcePicker, setSourcePicker] = useState(false);
  const [draftFormat, setDraftFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [outlineSaved, setOutlineSaved] = useState(false);
  const source =
    sample.sources.find((item) => item.id === demo.inspectedSource) ||
    sample.sources[1];
  const recent = demo.versions.slice(-3).reverse();
  return (
    <div className={styles.previews}>
      <header className={styles.heading}>
        <h2 id="capabilities-heading">
          Built for the work between idea and final draft.
        </h2>
        <p>
          Set the direction. Inspect the sources. Keep control of the changes.
        </p>
      </header>
      <div className={styles.grid}>
        <figure className={styles.wide}>
          <div className={`${styles.stage} ${styles.briefStage}`}>
            <div className={styles.brief}>
              <div className={styles.toolbar}>
                <FileText size={15} aria-hidden="true" />
                <strong>New document</strong>
                <button onClick={() => demo.checkpoint("Brief approved")}>
                  Save brief
                </button>
              </div>
              <div className={styles.briefColumns}>
                <div className={styles.briefFields}>
                  <div
                    className={styles.tabs}
                    role="tablist"
                    aria-label="Brief preview"
                    onKeyDown={(event) => {
                      if (
                        !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                          event.key,
                        )
                      )
                        return;
                      event.preventDefault();
                      const next =
                        event.key === "Home"
                          ? "brief"
                          : event.key === "End"
                            ? "document"
                            : briefTab === "brief"
                              ? "document"
                              : "brief";
                      setBriefTab(next);
                      document
                        .getElementById(`capability-${next}-tab`)
                        ?.focus();
                    }}
                  >
                    <button
                      role="tab"
                      id="capability-brief-tab"
                      tabIndex={briefTab === "brief" ? 0 : -1}
                      aria-selected={briefTab === "brief"}
                      aria-controls="capability-brief-content"
                      onClick={() => setBriefTab("brief")}
                    >
                      Project brief
                    </button>
                    <button
                      role="tab"
                      id="capability-document-tab"
                      tabIndex={briefTab === "document" ? 0 : -1}
                      aria-selected={briefTab === "document"}
                      aria-controls="capability-brief-content"
                      onClick={() => setBriefTab("document")}
                    >
                      Document
                    </button>
                  </div>
                  <div
                    id="capability-brief-content"
                    role="tabpanel"
                    aria-labelledby={
                      briefTab === "brief"
                        ? "capability-brief-tab"
                        : "capability-document-tab"
                    }
                  >
                    <span className={styles.label}>
                      {briefTab === "brief" ? "Goal" : "Executive summary"}
                    </span>
                    <p className={styles.goal}>
                      {briefTab === "brief"
                        ? sample.brief.goal
                        : "A leadership briefing on renewable deployment, storage and the questions behind an energy transition."}
                    </p>
                  </div>
                  <div className={styles.choices}>
                    <label>
                      Audience
                      <select
                        value={demo.audience}
                        onChange={(event) =>
                          demo.setAudience(event.target.value)
                        }
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
                    <label>
                      Length
                      <select
                        value={demo.length}
                        onChange={(event) => demo.setLength(event.target.value)}
                      >
                        <option>Executive brief</option>
                        <option>Short report</option>
                        <option>Detailed report</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className={styles.outline}>
                  <div className={styles.outlineHeading}>
                    <strong>
                      Draft outline <span>· 5 sections</span>
                    </strong>
                    <button
                      className={styles.primary}
                      onClick={() => {
                        demo.generateOutline();
                        setOutlineSaved(true);
                      }}
                    >
                      Generate outline
                    </button>
                  </div>
                  {outlineSaved && (
                    <small className={styles.outlineStatus} role="status">
                      Sample outline saved
                    </small>
                  )}
                  {demo.sections.map((section, index) => (
                    <div className={styles.outlineRow} key={section.id}>
                      <span>{index + 1}</span>
                      <div
                        role="textbox"
                        aria-label={`Outline section ${index + 1}`}
                        contentEditable
                        suppressContentEditableWarning
                        onPaste={(event) => {
                          event.preventDefault();
                          document.execCommand(
                            "insertText",
                            false,
                            event.clipboardData.getData("text/plain"),
                          );
                        }}
                        onBlur={(event) =>
                          demo.updateSection(section.id, {
                            title:
                              event.currentTarget.textContent?.trim() ||
                              section.title,
                          })
                        }
                      >
                        {section.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <figcaption>
            <h3>Start with a clear direction.</h3>
            <p>Shape the brief and outline before the draft begins.</p>
          </figcaption>
        </figure>
        <figure className={styles.wide}>
          <div className={`${styles.stage} ${styles.researchStage}`}>
            <div className={styles.research}>
              <div className={styles.draft}>
                <div className={styles.toolbar}>
                  <strong>Clean energy transition</strong>
                  <span>Draft</span>
                </div>
                <div
                  className={styles.formatting}
                  role="toolbar"
                  aria-label="Format draft excerpt"
                >
                  <span>Paragraph</span>
                  {(
                    [
                      ["bold", Bold],
                      ["italic", Italic],
                      ["underline", Underline],
                    ] as const
                  ).map(([format, Icon]) => (
                    <button
                      key={format}
                      aria-label={format}
                      aria-pressed={draftFormat[format]}
                      onClick={() =>
                        setDraftFormat((previous) => ({
                          ...previous,
                          [format]: !previous[format],
                        }))
                      }
                    >
                      <Icon size={13} aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <h4>Storage and flexibility</h4>
                <div
                  className={styles.draftText}
                  style={{
                    fontWeight: draftFormat.bold ? 600 : 400,
                    fontStyle: draftFormat.italic ? "italic" : "normal",
                    textDecoration: draftFormat.underline
                      ? "underline"
                      : "none",
                  }}
                >
                  <p>
                    Renewable deployment is shaped by policy and market
                    conditions.{" "}
                    <a
                      href={sample.sources[0].url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      [1]
                    </a>
                  </p>
                  <p>
                    Storage saves wind and solar electricity for periods when
                    those resources are unavailable.{" "}
                    <a
                      href={sample.sources[1].url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      [2]
                    </a>
                  </p>
                </div>
              </div>
              <aside className={styles.inspector} aria-label="Source inspector">
                <div className={styles.toolbar}>
                  <strong>Sources</strong>
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
                      <strong>{item.title}</strong>
                      <small>{item.publisher}</small>
                    </button>
                  </div>
                ))}
                <div className={styles.sourceSummary}>
                  <strong>{source.title}</strong>
                  <small>{source.publisher}</small>
                  <p>
                    {source.id === "doe"
                      ? "Storage retains wind and solar energy for later use, through batteries and pumped hydropower."
                      : "An outlook for renewables through 2030 across electricity, transport and heat."}
                  </p>
                  <div className={styles.sourceActions}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      View source <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                    <button
                      aria-expanded={sourcePicker}
                      aria-controls="capability-source-picker"
                      onClick={() => setSourcePicker((value) => !value)}
                    >
                      Add source <Plus size={13} aria-hidden="true" />
                    </button>
                  </div>
                  {sourcePicker && (
                    <div
                      id="capability-source-picker"
                      className={styles.sourcePicker}
                    >
                      <small>Available sample sources</small>
                      {sample.sources.map((item) => (
                        <button
                          key={item.id}
                          disabled={demo.included.includes(item.id)}
                          onClick={() => {
                            demo.toggleSource(item.id);
                            demo.setInspectedSource(item.id);
                            setSourcePicker(false);
                          }}
                        >
                          {item.title}
                          <span>
                            {demo.included.includes(item.id)
                              ? "Included"
                              : "Add"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
          <figcaption>
            <h3>Know what the draft is built on.</h3>
            <p>Inspect the evidence and choose the sources you keep.</p>
          </figcaption>
        </figure>
        <figure>
          <div className={styles.stage}>
            <div className={`${styles.surface} ${styles.refinement}`}>
              <div className={styles.comparison}>
                {demo.suggestion ? (
                  <>
                    <del>Energy storage helps save</del>{" "}
                    <ins>Storage saves</ins> renewable electricity{" "}
                    <del>for times when wind and solar output is lower.</del>{" "}
                    <ins>for later use.</ins>{" "}
                  </>
                ) : (
                  <p>
                    {demo.accepted
                      ? sample.refinement.suggestion
                      : sample.refinement.original}
                  </p>
                )}
                <a
                  href={sample.sources[1].url}
                  target="_blank"
                  rel="noreferrer"
                >
                  [2] retained
                </a>
              </div>
              <div className={styles.actions}>
                <span>
                  <Sparkles size={12} aria-hidden="true" /> Review suggestion
                </span>
                {demo.suggestion ? (
                  <>
                    <button onClick={demo.discard}>Discard</button>
                    <button className={styles.primary} onClick={demo.accept}>
                      <Check size={13} aria-hidden="true" />
                      Accept
                    </button>
                  </>
                ) : (
                  <button onClick={() => demo.setSuggestion(true)}>
                    <RotateCcw size={13} aria-hidden="true" />
                    Review again
                  </button>
                )}
              </div>
            </div>
          </div>
          <figcaption>
            <h3>Review before you replace.</h3>
            <p>See the change before applying it.</p>
          </figcaption>
        </figure>
        <figure>
          <div
            className={`${styles.stage} ${styles.archive}`}
            data-art-ready={artReady}
          >
            <div className={`${styles.surface} ${styles.history}`}>
              <div className={styles.toolbar}>
                <strong>Version history</strong>
                <History size={14} aria-hidden="true" />
              </div>
              <div className={styles.historyMeta}>
                <span>
                  Latest {recent.length} of {demo.versions.length}
                </span>
                <button onClick={() => demo.checkpoint("Review checkpoint")}>
                  + Checkpoint
                </button>
              </div>
              <div className={styles.versionList}>
                {recent.map((version) => (
                  <div
                    className={styles.version}
                    key={version.id}
                    data-selected={
                      version.id === demo.versions[demo.versions.length - 1].id
                    }
                  >
                    <span className={styles.dot} />
                    <div>
                      <strong>
                        {version.label.replace(/^(Restored )+/, "Restored ")}
                      </strong>
                      <small>Version {version.id}</small>
                    </div>
                    <button
                      aria-label={`Restore version ${version.id}`}
                      onClick={() => demo.restore(version)}
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <figcaption>
            <h3>A version to come back to.</h3>
            <p>Keep checkpoints and restore earlier work.</p>
          </figcaption>
        </figure>
        <figure>
          <div className={styles.stage}>
            <div className={`${styles.surface} ${styles.sequence}`}>
              <div className={styles.toolbar}>
                <strong>Section sequence</strong>
                <span>
                  {demo.generation} · {demo.generated} of 5
                </span>
              </div>
              {demo.sections.map((section, index) => (
                <div
                  className={styles.sequenceRow}
                  key={section.id}
                  data-current={
                    index === demo.generated && demo.generation !== "complete"
                  }
                >
                  <span
                    className={
                      index < demo.generated
                        ? styles.ready
                        : index === demo.generated
                          ? styles.current
                          : styles.pending
                    }
                  >
                    {index < demo.generated ? (
                      <Check size={11} aria-hidden="true" />
                    ) : index === demo.generated ? (
                      demo.generation === "paused" ? (
                        <Pause size={10} aria-hidden="true" />
                      ) : (
                        <Play size={10} aria-hidden="true" />
                      )
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span>{section.title}</span>
                  <small>
                    {index < demo.generated
                      ? "Ready"
                      : index === demo.generated
                        ? demo.generation === "paused"
                          ? "Paused"
                          : "Writing"
                        : "Pending"}
                  </small>
                </div>
              ))}
              <div className={styles.sequenceActions}>
                <progress
                  aria-label="Ready sample sections"
                  value={demo.generated}
                  max={5}
                />
                <button
                  className={styles.primary}
                  onClick={demo.toggleGeneration}
                >
                  {demo.generation === "running" ? (
                    <Pause size={13} aria-hidden="true" />
                  ) : (
                    <Play size={13} aria-hidden="true" />
                  )}
                  {demo.generation === "complete"
                    ? "Reset"
                    : demo.generation === "running"
                      ? "Pause"
                      : "Resume"}
                </button>
              </div>
            </div>
          </div>
          <figcaption>
            <h3>Continue where you left off.</h3>
            <p>Pause between sections. Resume from the checkpoint.</p>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
