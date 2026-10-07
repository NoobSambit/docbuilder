import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  MonitorUp,
  Printer,
} from "lucide-react";
import sample from "./sample.json";
import { DemoState } from "./useDemo";
import { MenuLink, TourMenu } from "./TourPrimitives";
import styles from "./Tour.module.css";

function OutputExport({ presentation = false }: { presentation?: boolean }) {
  return (
    <TourMenu
      label={
        presentation
          ? "Presentation sample export menu"
          : "Document sample export menu"
      }
      trigger={
        <>
          <FileText size={23} />
          Export {presentation ? "PPTX" : "DOCX"}
        </>
      }
    >
      {presentation ? (
        <MenuLink href="/landing/samples/clean-energy-briefing.pptx" download>
          <MonitorUp size={23} />
          PPTX
        </MenuLink>
      ) : (
        <>
          <MenuLink href="/landing/samples/clean-energy-outlook.docx" download>
            <FileText size={23} />
            DOCX
          </MenuLink>
          <MenuLink href="/landing/samples/clean-energy-outlook.md" download>
            <span className={styles.markdownIcon}>M↓</span>Markdown
          </MenuLink>
          <MenuLink href="/landing/samples/clean-energy-outlook.html" download>
            <Code2 size={23} />
            HTML
          </MenuLink>
          <MenuLink href="/landing/samples/clean-energy-outlook.html?print=1">
            <Printer size={23} />
            Browser print
          </MenuLink>
        </>
      )}
    </TourMenu>
  );
}
function ReportText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[1\]|\[2\])/).map((part, index) =>
        /^\[\d\]$/.test(part) ? (
          <a
            key={index}
            href={sample.sources[Number(part[1]) - 1].url}
            target="_blank"
            rel="noreferrer"
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
function Report({ demo }: { demo: DemoState }) {
  return (
    <div
      className={styles.reportWindow}
      data-report-window
      tabIndex={0}
      aria-label="Scrollable portrait document preview"
    >
      <div className={styles.reportStack} aria-hidden="true">
        <div />
        <div />
      </div>
      <article
        className={styles.reportPage}
        aria-label="Finished document example"
      >
        <p className={styles.reportProject}>{sample.title}</p>
        <h3>{demo.length}</h3>
        <div className={styles.reportContents}>
          <h4>Contents</h4>
          {demo.sections.map((section, index) => (
            <a
              key={section.id}
              href={`#tour-report-${section.id}`}
              onClick={(event) => {
                const target = document.getElementById(
                  `tour-report-${section.id}`,
                );
                const reportWindow = event.currentTarget.closest<HTMLElement>(
                  "[data-report-window]",
                );
                if (target && reportWindow) {
                  event.preventDefault();
                  reportWindow.scrollTo({
                    top: target.offsetTop,
                    behavior: "auto",
                  });
                }
              }}
            >
              {String(index + 1).padStart(2, "0")}
              <span>{section.title}</span>
            </a>
          ))}
        </div>
        {demo.sections.map((section, index) => (
          <section key={section.id} id={`tour-report-${section.id}`}>
            <h4>{section.title}</h4>
            <p>
              <ReportText
                text={
                  section.id === "executive" && demo.accepted
                    ? section.text.replace(
                        sample.refinement.original,
                        sample.refinement.suggestion,
                      )
                    : section.text
                }
              />
            </p>
            {index === 0 ? (
              <div className={styles.reportReferences}>
                {sample.sources.map((source, i) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    [{i + 1}] {source.title} — {source.publisher}
                  </a>
                ))}
              </div>
            ) : (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <footer>Clean Energy Outlook · Local sample preview</footer>
      </article>
    </div>
  );
}
export function OutputSlide({
  index,
  thumbnail = false,
}: {
  index: number;
  thumbnail?: boolean;
}) {
  const slide = sample.slides[index];
  return (
    <div
      className={`${styles.outputSlide} ${index === 0 ? styles.coverSlide : styles.contentSlide} ${thumbnail ? styles.thumbnailSlide : ""}`}
      data-slide-kind={index}
      aria-hidden={thumbnail || undefined}
    >
      <div>
        <h4>{slide.title}</h4>
        {thumbnail ? (
          index !== 0 && (
            <span className={styles.thumbnailLines}>
              <i />
              <i />
              <i />
            </span>
          )
        ) : (
          <>
            <p>{slide.body}</p>
            {index !== 0 && (
              <small>
                {slide.sourceIds
                  .map((id) => {
                    const source = sample.sources.find((s) => s.id === id);
                    return source
                      ? `${source.title} — ${source.publisher}`
                      : "";
                  })
                  .join(" · ")}
              </small>
            )}
          </>
        )}
      </div>
      <div
        className={styles.energyImage}
        role={thumbnail ? undefined : "img"}
        aria-label={
          thumbnail
            ? undefined
            : "Illustrative wind turbines in a sunset landscape"
        }
      />
    </div>
  );
}
function Deck({ demo }: { demo: DemoState }) {
  const start = Math.min(Math.max(0, demo.slide - 2), sample.slides.length - 4);
  return (
    <div className={styles.deckViewer}>
      <div
        className={styles.slideViewport}
        role="group"
        aria-roledescription="slide"
        aria-label={`Slide ${demo.slide + 1} of ${sample.slides.length}: ${sample.slides[demo.slide].title}`}
      >
        <OutputSlide index={demo.slide} />
      </div>
      <div className={styles.slideTranscript}>
        <p>{sample.slides[demo.slide].body}</p>
      </div>
      <div className={styles.outputFilmstrip}>
        <div className={styles.thumbnails}>
          {sample.slides.slice(start, start + 4).map((slide, offset) => {
            const index = start + offset;
            return (
              <button
                key={slide.title}
                aria-label={`Show slide ${index + 1}: ${slide.title}`}
                aria-pressed={index === demo.slide}
                onClick={() => demo.setSlide(index)}
              >
                <OutputSlide index={index} thumbnail />
              </button>
            );
          })}
        </div>
        <div className={styles.paging}>
          <button
            disabled={demo.slide === 0}
            aria-label="Previous slide"
            onClick={() => demo.setSlide(demo.slide - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <span aria-live="polite">
            {demo.slide + 1} of {sample.slides.length}
          </span>
          <button
            disabled={demo.slide === sample.slides.length - 1}
            aria-label="Next slide"
            onClick={() => demo.setSlide(demo.slide + 1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
export default function TourPresent({
  demo,
  createHref,
  onChapter,
}: {
  demo: DemoState;
  createHref: string;
  onChapter: (index: number) => void;
}) {
  return (
    <>
      <div className={styles.presentOutputs}>
        <figure className={styles.outputFigure}>
          <div className={styles.outputRegion}>
            <header className={styles.outputHeading}>
              <h3>
                <FileText size={27} />
                Document example
              </h3>
              <OutputExport />
            </header>
            <Report demo={demo} />
          </div>
          <figcaption>
            <span>A structured document with its sources attached.</span>
            <small title="Prepared files; preview edits and artwork theme stay here.">
              Prepared sample downloads
            </small>
          </figcaption>
        </figure>
        <figure className={styles.outputFigure}>
          <div className={styles.outputRegion}>
            <header className={styles.outputHeading}>
              <h3>
                <MonitorUp size={27} />
                Presentation example
              </h3>
              <OutputExport presentation />
            </header>
            <Deck demo={demo} />
          </div>
          <figcaption>
            <span>A separate presentation with editable layouts.</span>
            <small title="Prepared files; preview edits and artwork theme stay here.">
              Prepared sample downloads
            </small>
          </figcaption>
        </figure>
      </div>
      <div className={styles.completion}>
        <span>
          <i>
            <Check size={20} />
          </i>
          {demo.accepted ? "Sample reviewed" : "Original wording retained"}
        </span>
        {!demo.accepted && (
          <button className={styles.reviewEdit} onClick={() => onChapter(2)}>
            Review the prepared edit
          </button>
        )}
        <Link href={createHref}>
          Create your own
          <ArrowRight size={23} />
        </Link>
      </div>
    </>
  );
}
