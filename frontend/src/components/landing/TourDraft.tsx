import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Bold,
  Check,
  ChevronRight,
  ExternalLink,
  FileText,
  Italic,
  Link2,
  List,
  ListOrdered,
  Plus,
  Redo2,
  Undo2,
  UserRound,
} from "lucide-react";
import sample from "./sample.json";
import { DemoState } from "./useDemo";
import { MenuAction, TourMenu, TourSelect } from "./TourPrimitives";
import styles from "./Tour.module.css";

export function OutlineNavigation({
  demo,
  onChapter,
}: {
  demo: DemoState;
  onChapter: (index: number) => void;
}) {
  return (
    <aside
      className={`${styles.rail} ${styles.navigationRail}`}
      aria-label="Project outline"
    >
      <header className={styles.paneHeading}>
        <h3>Project outline</h3>
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
            Edit project brief
          </MenuAction>
          <MenuAction onSelect={() => onChapter(3)}>
            Review output examples
          </MenuAction>
        </TourMenu>
      </header>
      <nav className={styles.outlineNav} aria-label="Draft sections">
        {demo.sections.map((section, index) => (
          <button
            key={section.id}
            aria-pressed={demo.selected === index}
            onClick={() => {
              demo.setSelected(index);
              demo.setMobilePane("document");
            }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span>
              <strong>{section.title}</strong>
              <small>{section.description}</small>
            </span>
          </button>
        ))}
      </nav>
      <div className={styles.carriedBrief}>
        <h4>
          Your brief <small>(from previous step)</small>
        </h4>
        <p>
          <UserRound size={25} />
          {demo.audience}
        </p>
        <p>
          <BarChart3 size={25} />
          {demo.tone}
        </p>
        <p>
          <FileText size={25} />
          {demo.length}
        </p>
        <div>{demo.purpose}</div>
      </div>
    </aside>
  );
}
export function FormattingToolbar({ demo }: { demo: DemoState }) {
  return (
    <div
      className={styles.formatting}
      role="toolbar"
      aria-label="Format current section paragraph"
    >
      <TourSelect
        label="Paragraph style"
        value={demo.format.style}
        options={["Paragraph", "Heading", "Quotation"]}
        onChange={(style) => demo.formatParagraph({ style })}
      />
      <span className={styles.toolDivider} />
      <button
        aria-label="Bold paragraph"
        aria-pressed={demo.format.bold}
        onClick={() => demo.formatParagraph({ bold: !demo.format.bold })}
      >
        <Bold size={23} />
      </button>
      <button
        aria-label="Italic paragraph"
        aria-pressed={demo.format.italic}
        onClick={() => demo.formatParagraph({ italic: !demo.format.italic })}
      >
        <Italic size={23} />
      </button>
      <button
        aria-label="Bullet paragraph"
        aria-pressed={demo.format.list === "bullet"}
        onClick={() =>
          demo.formatParagraph({
            list: demo.format.list === "bullet" ? "none" : "bullet",
          })
        }
      >
        <List size={23} />
      </button>
      <button
        aria-label="Number paragraph"
        aria-pressed={demo.format.list === "number"}
        onClick={() =>
          demo.formatParagraph({
            list: demo.format.list === "number" ? "none" : "number",
          })
        }
      >
        <ListOrdered size={23} />
      </button>
      <TourMenu
        label="Attach source citation to paragraph"
        trigger={<Link2 size={23} />}
      >
        {sample.sources.map((source, index) => (
          <MenuAction
            key={source.id}
            onSelect={() => {
              const section = demo.sections[demo.selected];
              if (!section.text.includes(`[${index + 1}]`))
                demo.updateSection(section.id, {
                  text: `${section.text} [${index + 1}]`,
                });
              demo.setInspectedSource(source.id);
              demo.setMessage(
                `Citation [${index + 1}] attached to ${section.title}.`,
              );
            }}
          >
            {source.title} [{index + 1}]
          </MenuAction>
        ))}
      </TourMenu>
      <span className={styles.toolbarSpace} />
      <button
        aria-label="Undo editor change"
        onClick={demo.undoEdit}
        disabled={!demo.canUndo}
      >
        <Undo2 size={22} />
      </button>
      <button
        aria-label="Redo editor change"
        onClick={demo.redoEdit}
        disabled={!demo.canRedo}
      >
        <Redo2 size={22} />
      </button>
    </div>
  );
}
export function CitationProse({
  text,
  demo,
  activeCitation,
}: {
  text: string;
  demo: DemoState;
  activeCitation?: number;
}) {
  return (
    <>
      {text.split(/(\[1\]|\[2\])/).map((part, index) =>
        /^\[\d\]$/.test(part) ? (
          <button
            key={index}
            contentEditable={false}
            className={styles.citation}
            data-citation-source={
              part === `[${activeCitation}]`
                ? sample.sources[activeCitation - 1].id
                : undefined
            }
            aria-label={`Inspect citation ${part}: ${sample.sources[Number(part[1]) - 1].title}`}
            aria-pressed={
              demo.inspectedSource === sample.sources[Number(part[1]) - 1].id
            }
            onClick={() => {
              demo.setInspectedSource(sample.sources[Number(part[1]) - 1].id);
              demo.setMobilePane("tools");
            }}
          >
            {part}
          </button>
        ) : (
          part
        ),
      )}
    </>
  );
}
export function DraftEditor({
  demo,
  refine = false,
  children,
}: {
  demo: DemoState;
  refine?: boolean;
  children?: React.ReactNode;
}) {
  const section = demo.sections[demo.selected];
  const isExecutive = section.id === "executive";
  const executive = demo.sections.find((s) => s.id === "executive");
  const storageSentence = demo.accepted
    ? sample.refinement.suggestion
    : sample.refinement.original;
  const executiveParts = (executive?.text || sample.sections[0].text).split(
    `${sample.refinement.original} [2]`,
  );
  const intro = isExecutive ? executiveParts[0].trim() : section.text;
  const next = demo.sections[(demo.selected + 1) % demo.sections.length];
  const format = demo.format;
  return (
    <section className={styles.draftEditor} aria-label="Sample draft editor">
      {refine && <h3>{section.title}</h3>}
      <FormattingToolbar demo={demo} />
      {!refine && <h3>{section.title}</h3>}
      <div className={styles.draftContent}>
        <p
          className={styles.editableParagraph}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label={`Edit ${section.title} paragraph`}
          aria-multiline="true"
          data-style={format.style}
          data-list={format.list}
          style={{
            fontWeight: format.bold ? 650 : undefined,
            fontStyle: format.italic ? "italic" : undefined,
          }}
          onBlur={(event) => {
            const text = event.currentTarget.textContent?.trim();
            if (text && text !== intro) {
              demo.updateSection(section.id, {
                text: isExecutive
                  ? `${text} ${sample.refinement.original} [2]${executiveParts[1] || ""}`
                  : text,
              });
              demo.setMessage("Draft paragraph updated in this preview.");
            }
          }}
        >
          <CitationProse
            text={intro}
            demo={demo}
            activeCitation={demo.inspectedSource === "iea" ? 1 : undefined}
          />
        </p>
        {isExecutive &&
          (refine && children ? (
            children
          ) : (
            <p className={styles.selectedSentence}>
              <CitationProse
                text={`${storageSentence} [2]`}
                demo={demo}
                activeCitation={2}
              />
            </p>
          ))}
        {isExecutive && (
          <p>
            {executiveParts[1]?.trim() ||
              "This brief considers the transition, the role of storage and questions for leadership."}
          </p>
        )}
        <h4>{isExecutive ? "Key takeaways" : "In this section"}</h4>
        <ul className={styles.takeaways}>
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <div className={styles.draftContinuation}>
          <h3>{next.title}</h3>
          <p>
            <CitationProse text={next.text} demo={demo} />
          </p>
          {!refine && (
            <table>
              <thead>
                <tr>
                  <th>Focus</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Renewables</td>
                  <td>
                    <button
                      onClick={() => {
                        demo.setInspectedSource("iea");
                        demo.setMobilePane("tools");
                      }}
                    >
                      Renewables 2025 [1]
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Storage</td>
                  <td>
                    <button
                      onClick={() => {
                        demo.setInspectedSource("doe");
                        demo.setMobilePane("tools");
                      }}
                    >
                      Energy Storage [2]
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
export function SourcesInspector({ demo }: { demo: DemoState }) {
  const source =
    sample.sources.find((s) => s.id === demo.inspectedSource) ||
    sample.sources[1];
  const index = sample.sources.indexOf(source);
  return (
    <aside
      className={`${styles.inspector} ${styles.sourcesInspector}`}
      aria-label="Sources for this draft"
    >
      <header className={styles.paneHeading}>
        <h3>Sources for this draft</h3>
        <TourMenu
          label="Add source from sample library"
          trigger={
            <>
              <Plus size={19} />
              Add source
            </>
          }
        >
          {sample.sources.map((item) => (
            <MenuAction
              key={item.id}
              onSelect={() => {
                if (!demo.included.includes(item.id))
                  demo.toggleSource(item.id);
                demo.setInspectedSource(item.id);
                demo.setMessage(
                  `${item.title} included from the two-source sample library.`,
                );
              }}
            >
              <FileText size={19} />
              {item.title}
            </MenuAction>
          ))}
        </TourMenu>
      </header>
      <div className={styles.sourceRecords}>
        {sample.sources.map((item, i) => (
          <div
            key={item.id}
            data-source-row={item.id}
            className={`${styles.sourceRecord} ${source.id === item.id ? styles.sourceSelected : ""}`}
          >
            <label className={styles.includeSource}>
              <input
                type="checkbox"
                aria-label={`Include ${item.title}`}
                checked={demo.included.includes(item.id)}
                onChange={() => demo.toggleSource(item.id)}
              />
              <span>
                <Check size={21} />
              </span>
            </label>
            <button
              aria-pressed={source.id === item.id}
              onClick={() => demo.setInspectedSource(item.id)}
            >
              <span>
                <strong>{item.title}</strong>
                <small>{item.publisher}</small>
              </span>
              <span>[{i + 1}]</span>
              {source.id === item.id && <ChevronRight size={21} />}
            </button>
          </div>
        ))}
      </div>
      <div className={styles.sourceSummary}>
        <h4>Source summary</h4>
        <h3>{source.title}</h3>
        <p>{source.publisher}</p>
        <a
          className={styles.sourceDomain}
          href={source.url}
          target="_blank"
          rel="noreferrer"
        >
          <Link2 size={21} />
          {new URL(source.url).hostname.replace("www.", "")}
        </a>
        <p>{source.excerpt}</p>
        <a
          className={styles.viewSource}
          href={source.url}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size={22} />
          View source
        </a>
      </div>
      <div className={styles.usedSource}>
        <h4>Used in this section</h4>
        <p>{demo.sections[demo.selected].title}</p>
        <blockquote>
          {index === 1
            ? `${demo.accepted ? sample.refinement.suggestion : sample.refinement.original} [2]`
            : sample.sections[1].text}
        </blockquote>
        <small>
          {demo.included.length} included · existing citations are retained
        </small>
      </div>
    </aside>
  );
}
// Layout coordinates come from the actual citation button and selected source row.
// ResizeObserver + capturing scroll also cover pane scrolling, font loading and resizing.
export function CitationConnector({
  host,
  sourceId,
  selected,
}: {
  host: React.RefObject<HTMLDivElement>;
  sourceId: string;
  selected: number;
}) {
  const [path, setPath] = useState<{
    d: string;
    x: number;
    y: number;
    endX: number;
    endY: number;
  } | null>(null);
  useEffect(() => {
    const root = host.current;
    if (!root) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (matchMedia("(max-width: 1000px)").matches) {
        setPath(null);
        return;
      }
      const citation = root.querySelector<HTMLElement>(
        `[data-citation-source="${sourceId}"]`,
      );
      const source = root.querySelector<HTMLElement>(
        `[data-source-row="${sourceId}"]`,
      );
      if (!citation || !source) {
        setPath(null);
        return;
      }
      const bounds = root.getBoundingClientRect(),
        a = citation.getBoundingClientRect(),
        b = source.getBoundingClientRect();
      if (
        a.top < bounds.top ||
        a.bottom > bounds.bottom ||
        b.top < bounds.top ||
        b.bottom > bounds.bottom
      ) {
        setPath(null);
        return;
      }
      const x1 = a.right - bounds.left + 7,
        y1 = a.top + a.height / 2 - bounds.top;
      const x2 = b.left - bounds.left - 4,
        y2 = b.top + b.height / 2 - bounds.top;
      const labelX = x2 - 112,
        labelY = y1 + 13;
      setPath({
        d: `M${x1},${y1} H${Math.max(x1 + 12, labelX - 46)} C${labelX - 20},${y1} ${labelX - 25},${labelY} ${labelX},${labelY} H${x2 - 46} C${x2 - 20},${labelY} ${x2 - 35},${y2} ${x2},${y2}`,
        x: labelX - 60,
        y: labelY - 13,
        endX: x2,
        endY: y2,
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    root
      .querySelectorAll(
        "section, aside, [data-citation-source], [data-source-row]",
      )
      .forEach((element) => observer.observe(element));
    root.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule);
    schedule();
    return () => {
      observer.disconnect();
      root.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [host, sourceId, selected]);
  return path ? (
    <svg className={styles.connector} aria-hidden="true">
      <path d={path.d} />
      <circle cx={path.endX} cy={path.endY} r="3" />
      <rect x={path.x} y={path.y} width="126" height="29" rx="5" />
      <text x={path.x + 8} y={path.y + 19}>
        Citation → source
      </text>
    </svg>
  ) : null;
}
