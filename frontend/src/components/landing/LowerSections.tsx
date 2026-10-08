import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Presentation } from "lucide-react";
import { ExportControl, SlidePreview } from "./Workspace";
import { ReportPreview, ReportToolbar } from "./OutputPresenters";
import CapabilityPreviews from "./CapabilityPreviews";
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
  return (
    <>
      <section
        id="capabilities"
        ref={capabilities.ref}
        className={`${styles.capabilities} ${capabilities.visible ? styles.loaded : ""}`}
        aria-labelledby="capabilities-heading"
      >
        <div className={styles.container}>
          <CapabilityPreviews artReady={capabilities.visible} />
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
          <div className={styles.outputGrid}>
            <figure className={styles.documentOutput}>
              <div className={styles.outputSurface}>
                <div className={styles.surfaceToolbar}>
                  <ReportToolbar />
                </div>
                <ReportPreview demo={demo} />
              </div>
              <figcaption>
                <h3>A document with its structure intact.</h3>
                <p>DOCX / Markdown / HTML / Print</p>
              </figcaption>
            </figure>
            <figure className={styles.presentationOutput}>
              <div className={styles.outputSurface}>
                <div className={styles.surfaceToolbar}>
                  <Presentation size={14} aria-hidden="true" />
                  <strong>Presentation</strong>
                  
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
                <p>Theme / Layout / PPTX</p>
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
