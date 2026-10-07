import {
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Link2,
  List,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { DemoState } from "./useDemo";
import sample from "./sample.json";
import { CitationProse } from "./TourDraft";
import styles from "./Tour.module.css";

export function InlineSuggestion({ demo }: { demo: DemoState }) {
  return demo.suggestion ? (
    <div className={styles.inlineDiff} aria-label="Pending suggested change">
      <div className={styles.diffLabel}>
        <Sparkles size={23} />
        Suggested change
      </div>
      <p className={styles.removed}>
        <del>{sample.refinement.original}</del>{" "}
        <CitationProse text="[2]" demo={demo} />
      </p>
      <p className={styles.added}>
        <ins>{sample.refinement.suggestion}</ins>{" "}
        <CitationProse text="[2]" demo={demo} />
      </p>
      <small>Source [2] kept</small>
    </div>
  ) : (
    <div className={styles.resolvedEdit}>
      <p>
        <CitationProse
          text={`${demo.accepted ? sample.refinement.suggestion : sample.refinement.original} [2]`}
          demo={demo}
        />
      </p>
      <small>
        <Check size={15} />
        {demo.accepted
          ? "Change accepted · original preserved"
          : "Original wording retained"}
      </small>
      <button onClick={demo.undo}>
        <RotateCcw size={17} />
        {demo.accepted ? "Undo change" : "Review suggestion again"}
      </button>
    </div>
  );
}
export function RefineInspector({ demo }: { demo: DemoState }) {
  const source = sample.sources[1];
  return (
    <aside
      className={`${styles.inspector} ${styles.refineInspector}`}
      aria-label="Refinement inspector"
    >
      <h3>Refine this sentence</h3>
      <p className={styles.excerptLabel}>
        Executive summary / Selected excerpt
      </p>
      <label className={styles.instructionField}>
        <span className={styles.liveStatus}>Refinement instruction</span>
        <input
          aria-label="Refinement instruction"
          value={demo.instruction}
          onChange={(event) => demo.setInstruction(event.target.value)}
        />
      </label>
      <button
        className={styles.primary}
        onClick={() => {
          demo.setSelected(
            Math.max(
              0,
              demo.sections.findIndex((section) => section.id === "executive"),
            ),
          );
          demo.suggest();
        }}
      >
        <Sparkles size={24} />
        Suggest edit
      </button>
      <div className={styles.suggestionResult}>
        <span className={styles.ready}>
          <i />
          {demo.suggestion
            ? "Suggestion ready"
            : demo.accepted
              ? "Change accepted"
              : "Suggestion discarded"}
        </span>
        <label>
          Suggested text
          <div className={styles.suggestedText}>
            {sample.refinement.suggestion} [2]
          </div>
        </label>
        <div className={styles.diffActions}>
          <button
            className={styles.primary}
            disabled={!demo.suggestion}
            onClick={demo.accept}
          >
            Accept change
          </button>
          <button
            className={styles.secondary}
            disabled={!demo.suggestion}
            onClick={demo.discard}
          >
            Discard
          </button>
        </div>
        <p className={styles.originalNote}>
          Your original stays until you accept.
        </p>
      </div>
      <div className={styles.refineDetails}>
        <details>
          <summary>
            <List size={19} />
            Shorter wording
            <ChevronRight size={18} />
          </summary>
          <p>
            A prepared concise edit for this sample. Your instruction stays
            local; the demo makes no AI requests.
          </p>
        </details>
        <details>
          <summary>
            <Link2 size={19} />
            Citation retained ([2])
            <ChevronRight size={18} />
          </summary>
          <p>The source marker remains attached to both alternatives.</p>
        </details>
        <details>
          <summary>
            <FileText size={19} />
            Original preserved
            <ChevronRight size={18} />
          </summary>
          <p>{sample.refinement.original} [2]</p>
        </details>
      </div>
      <div className={styles.linkedSource}>
        <span>Linked source</span>
        <a href={source.url} target="_blank" rel="noreferrer">
          <FileText size={30} />
          <span>
            <strong>{source.title}</strong>
            <small>{source.publisher}</small>
          </span>
          <span>[2]</span>
          <ExternalLink size={18} />
        </a>
      </div>
      <details className={styles.beforeRefinement}>
        <summary>
          <ChevronDown size={20} />
          Before refinement
        </summary>
        <p>{sample.refinement.original} [2]</p>
        <button className={styles.secondary} onClick={demo.undo}>
          <RotateCcw size={17} />
          Restore original wording
        </button>
      </details>
      <details className={styles.beforeRefinement}>
        <summary>
          <RotateCcw size={19} />
          Local checkpoints ({demo.versions.length})
        </summary>
        <div className={styles.tourHistory}>
          {[...demo.versions].reverse().map((version) => (
            <button
              key={version.id}
              onClick={() => demo.restore(version)}
              aria-label={`Restore ${version.label} version ${version.id}`}
            >
              <span>{version.label}</span>
              <RotateCcw size={16} />
            </button>
          ))}
        </div>
      </details>
    </aside>
  );
}
