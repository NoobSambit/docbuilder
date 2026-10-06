import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, FileText, Presentation } from "lucide-react";
import {
  BriefPreview,
  DocumentPaper,
  ExportControl,
  GenerationPreview,
  HistoryPreview,
  RefinePreview,
  SlidePreview,
  SourcePreview,
} from "./Workspace";
import { DemoState } from "./useDemo";
import sample from "./sample.json";
import styles from "./LowerSections.module.css";

function useNearViewport() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

const faqs = [
  [
    "Can I edit the outline and draft?",
    "Yes. Start with a brief, adjust the outline and keep editing the text. In this sample, try selecting an outline section, changing its title under Brief or reviewing the storage refinement.",
  ],
  [
    "Can I add my own sources?",
    "The planned workspace supports supplied reference text and a few public URLs alongside web research. This preview uses two verified public sources. Open Research to inspect them and choose which sources to include in the next draft.",
  ],
  [
    "What can I export?",
    "Documents have Word, Markdown and HTML examples, plus a printable reading view. Presentations have a separate PowerPoint example. The downloads on this page are finished static sample files; local preview edits do not change them.",
  ],
  [
    "Does this preview use my account or AI allowance?",
    "No. This is a deterministic sample project with local interactions. It creates no real project and makes no generation or research requests. Sample history resets when the page reloads. Start creating opens registration, or the creation route if you are signed in.",
  ],
  [
    "How does a report become a presentation?",
    "The report and presentation here are separately authored examples. The planned report-to-deck workflow creates a new project, with a reviewed slide outline and its own generation allowance. It is not an instant export-format conversion.",
  ],
];

export default function LowerSections({
  demo,
  createHref,
}: {
  demo: DemoState;
  createHref: string;
}) {
  const capabilities = useNearViewport();
  const outputs = useNearViewport();
  const [outputFocus, setOutputFocus] = useState<"document" | "presentation">(
    "document",
  );
  return (
    <>
      <section
        id="capabilities"
        ref={capabilities.ref}
        className={`${styles.capabilities} ${capabilities.visible ? styles.loaded : ""}`}
        aria-labelledby="capabilities-heading"
      >
        <div className={styles.container}>
          <header className={styles.sectionHeading}>
            <span>THE DETAILS MAKE THE DIFFERENCE</span>
            <h2 id="capabilities-heading">
              Built for the work between idea and final draft.
            </h2>
            <p>
              Set the direction. Inspect the sources. Keep control of the
              changes.
            </p>
          </header>
          <div className={styles.capabilityGrid}>
            <figure className={styles.wideFeature}>
              <div
                className={`${styles.featureSurface} ${styles.briefSurface}`}
              >
                <div>
                  <div className={styles.surfaceToolbar}>
                    <FileText size={13} aria-hidden="true" />
                    <strong>New document</strong>
                    <span>Sample brief</span>
                  </div>
                  <BriefPreview demo={demo} compact />
                </div>
                <div className={styles.outlinePreview}>
                  <span>Starter structure</span>
                  <strong>Research brief</strong>
                  {demo.titles.map((title, index) => (
                    <button
                      key={index}
                      aria-pressed={demo.selected === index}
                      onClick={() => demo.setSelected(index)}
                    >
                      <Check size={12} aria-hidden="true" />
                      <span>{title}</span>
                    </button>
                  ))}
                </div>
              </div>
              <figcaption>
                <h3>Start with a clear direction.</h3>
                <p>Shape the brief and outline before the draft begins.</p>
              </figcaption>
            </figure>
            <figure className={styles.wideFeature}>
              <div
                className={`${styles.featureSurface} ${styles.researchSurface}`}
              >
                <div className={styles.sourceDraft}>
                  <div className={styles.surfaceToolbar}>
                    <strong>Clean energy transition</strong>
                    <span>Draft</span>
                  </div>
                  <h4>Storage and flexibility</h4>
                  <p>{sample.sections[2].text}</p>
                  <span className={styles.inlineSource}>
                    [2] Energy Storage · US Department of Energy
                  </span>
                </div>
                <SourcePreview demo={demo} compact />
              </div>
              <figcaption>
                <h3>Know what the draft is built on.</h3>
                <p>Inspect the evidence and choose the sources you keep.</p>
              </figcaption>
            </figure>
            <figure className={styles.smallFeature}>
              <div
                className={`${styles.featureSurface} ${styles.smallSurface}`}
              >
                <RefinePreview demo={demo} compact />
              </div>
              <figcaption>
                <h3>Review before you replace.</h3>
                <p>See the change before applying it.</p>
              </figcaption>
            </figure>
            <figure
              className={`${styles.smallFeature} ${styles.archiveFeature}`}
            >
              <div className={styles.archiveBackdrop}>
                <div
                  className={`${styles.featureSurface} ${styles.smallSurface}`}
                >
                  <HistoryPreview demo={demo} />
                </div>
              </div>
              <figcaption>
                <h3>A version to come back to.</h3>
                <p>Name checkpoints and restore earlier work.</p>
              </figcaption>
            </figure>
            <figure className={styles.smallFeature}>
              <div
                className={`${styles.featureSurface} ${styles.smallSurface}`}
              >
                <GenerationPreview demo={demo} />
              </div>
              <figcaption>
                <h3>Continue where you left off.</h3>
                <p>Pause between sections. Resume from the checkpoint.</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section
        id="outputs"
        ref={outputs.ref}
        className={`${styles.outputs} ${outputs.visible ? styles.loaded : ""}`}
        aria-labelledby="outputs-heading"
      >
        <div className={styles.container}>
          <header className={styles.sectionHeading}>
            <span>FINISHED WORK, READY TO SHARE</span>
            <h2 id="outputs-heading">Ready to leave the workspace.</h2>
            <p>Review the result. Choose the format. Make it yours.</p>
          </header>
          <div
            className={styles.outputSelector}
            aria-label="Choose a finished example"
          >
            <button
              aria-pressed={outputFocus === "document"}
              onClick={() => setOutputFocus("document")}
            >
              <FileText size={14} aria-hidden="true" /> Document
            </button>
            <button
              aria-pressed={outputFocus === "presentation"}
              onClick={() => setOutputFocus("presentation")}
            >
              <Presentation size={14} aria-hidden="true" /> Presentation
            </button>
            <span>Two separately authored sample projects</span>
          </div>
          <div className={styles.outputGrid} data-output-focus={outputFocus}>
            <figure className={styles.documentOutput}>
              <div className={styles.outputSurface}>
                <div className={styles.surfaceToolbar}>
                  <FileText size={14} aria-hidden="true" />
                  <strong>Document</strong>
                  <span>Reading view</span>
                  <ExportControl />
                </div>
                <div className={styles.documentReading}>
                  <DocumentPaper demo={demo} full />
                </div>
              </div>
              <figcaption>
                <h3>A document with its structure intact.</h3>
                <p>Word · Markdown · HTML · Print</p>
              </figcaption>
            </figure>
            <figure className={styles.presentationOutput}>
              <div className={styles.outputSurface}>
                <div className={styles.surfaceToolbar}>
                  <Presentation size={14} aria-hidden="true" />
                  <strong>Presentation</strong>
                  <span>16:9</span>
                  <ExportControl output="presentation" />
                </div>
                <div className={styles.deckReading}>
                  <SlidePreview demo={demo} />
                  <div className={styles.deckSources}>
                    {sample.sources.map((source) => (
                      <a
                        key={source.id}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {source.title}{" "}
                        <ArrowRight size={11} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <figcaption>
                <h3>A presentation you can make your own.</h3>
                <p>Reviewed slide outline · Editable PowerPoint</p>
              </figcaption>
            </figure>
          </div>
          <section
            className={styles.faq}
            id="faq"
            aria-labelledby="faq-heading"
          >
            <h2 id="faq-heading">A few things to know.</h2>
            <div>
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section className={styles.closing} aria-labelledby="closing-heading">
            <div>
              <h2 id="closing-heading">Your next idea starts here.</h2>
              <p>
                Give your work a considered structure and a purposeful finish.
              </p>
            </div>
            <Link href={createHref}>
              Start creating <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </section>
    </>
  );
}
