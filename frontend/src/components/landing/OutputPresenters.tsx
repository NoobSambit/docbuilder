import { ChevronDown, ChevronLeft, ChevronRight, Download, FileText, Monitor, Search } from "lucide-react";
import sample from "./sample.json";
import { DemoState } from "./useDemo";
import styles from "./OutputPresenters.module.css";

export function OutputExport({ presentation = false }: { presentation?: boolean }) {
  return (
    <details className={styles.export}>
      <summary>
        Export {presentation ? "PPTX" : "DOCX"}
        <Download size={13} aria-hidden="true" />
        <ChevronDown size={12} aria-hidden="true" />
      </summary>
      <div className={styles.exportMenu}>
        {presentation ? (
          <a href="/landing/samples/clean-energy-briefing.pptx" download>Export as PPTX</a>
        ) : (
          <>
            <a href="/landing/samples/clean-energy-outlook.docx" download>Export as DOCX</a>
            <a href="/landing/samples/clean-energy-outlook.md" download>Export as Markdown</a>
            <a href="/landing/samples/clean-energy-outlook.html" download>Export as HTML</a>
            <a href="/landing/samples/clean-energy-outlook.html?print=1" target="_blank" rel="noreferrer">Browser print</a>
          </>
        )}
        <p>Static samples; local edits stay here.</p>
      </div>
    </details>
  );
}

function CitedText({ text }: { text: string }) {
  return <>{text.split(/(\[1\]|\[2\])/).map((part, i) => /^\[\d\]$/.test(part) ? (
    <a key={i} href={sample.sources[Number(part[1]) - 1].url} target="_blank" rel="noreferrer">{part}</a>
  ) : part)}</>;
}

export function ReportPreview({ demo }: { demo: DemoState }) {
  const executive = demo.sections.find(section => section.id === "executive") || sample.sections[0];
  const text = demo.accepted ? executive.text.replace(sample.refinement.original, sample.refinement.suggestion) : executive.text;
  return (
    <div className={styles.reportFrame}>
      <div className={styles.secondPage} aria-hidden="true">
        <div className={styles.secondArt} />
        <i /><i /><i /><i />
      </div>
      <article className={styles.reportPage} aria-label="First page of the sample report">
        <h3>{sample.title}</h3>
        <p className={styles.subtitle}>{sample.brief.length}</p>
        <div className={styles.accentRule} />
        <div className={styles.contents}>
          <h4>Contents</h4>
          {demo.sections.map((section, i) => (
            <div key={section.id}>
              <span>{i + 1}.</span><span>{section.title}</span><span>{i + 1}</span>
            </div>
          ))}
        </div>
        <section className={styles.excerpt}>
          <h4>{executive.title}</h4>
          <p><CitedText text={text} /></p>
        </section>
      </article>
    </div>
  );
}

export function ReportToolbar() {
  return <>
    <FileText size={16} aria-hidden="true" />
    <strong>Document</strong>
    <a className={styles.previewLink} href="/landing/samples/clean-energy-outlook.html" target="_blank" rel="noreferrer" aria-label="Open the full static sample report" title="Open the full sample report">
      <Search size={16} aria-hidden="true" />
    </a>
    <OutputExport />
  </>;
}

// Same canonical slide data and artwork as TourPresent; sizing stays local to Outputs.
function FinishedSlide({ index, miniature = false, treatment = "Editorial" }: { index: number; miniature?: boolean; treatment?: string }) {
  const slide = sample.slides[index];
  const artwork = ["wind", "market", "storage", "risks", "market", "wind"][index];
  return (
    <div className={`${styles.slide} ${index === 0 ? styles.cover : styles.content} ${miniature ? styles.miniature : ""}`} data-treatment={treatment} aria-hidden={miniature || undefined}>
      <div className={styles.slideText}>
        <h4>{index === 0 ? slide.title.split(" ").map((word, i) => <span key={i}>{word}</span>) : slide.title}</h4>
        {miniature ? (index !== 0 && <div className={styles.miniatureLines}><i /><i /><i /></div>) : <>
          <div className={styles.slideRule} />
          <p>{slide.body}</p>
          {index !== 0 && <small>{slide.sourceIds.map(id => {
            const source = sample.sources.find(item => item.id === id);
            return source ? `${source.title} — ${source.publisher}` : "";
          }).join(" · ")}</small>}
        </>}
      </div>
      <div className={styles.slideArt} style={{ backgroundImage: `url('/landing/tour/${artwork}-landscape.webp')` }} role={miniature ? undefined : "img"} aria-label={miniature ? undefined : index === 2 ? "Painted renewable energy landscape" : "Painted landscape with wind turbines and green hills"} />
    </div>
  );
}

export function DeckToolbar({ treatment, onTreatment }: { treatment: string; onTreatment: (value: string) => void }) {
  return <>
    <Monitor size={17} aria-hidden="true" />
    <strong>Presentation</strong>
    <label className={styles.treatment}>
      <span className={styles.srOnly}>Presentation treatment</span>
      <select value={treatment} onChange={event => onTreatment(event.target.value)}>
        <option>Editorial</option>
        <option>Minimal</option>
      </select>
      <ChevronDown size={12} aria-hidden="true" />
    </label>
    <OutputExport presentation />
  </>;
}

export function DeckPreview({ demo, treatment }: { demo: DemoState; treatment: string }) {
  const start = Math.min(Math.max(0, demo.slide - 2), sample.slides.length - 4);
  return <div className={styles.deckFrame}>
    <div className={styles.slideViewport} role="group" aria-roledescription="slide" aria-label={`Slide ${demo.slide + 1} of ${sample.slides.length}: ${sample.slides[demo.slide].title}`}>
      <FinishedSlide index={demo.slide} treatment={treatment} />
    </div>
    <div className={styles.filmstrip}>
      <div className={styles.thumbnails}>
        {sample.slides.slice(start, start + 4).map((slide, offset) => {
          const index = start + offset;
          return <button key={slide.title} onClick={() => demo.setSlide(index)} aria-pressed={demo.slide === index} aria-label={`Show slide ${index + 1}: ${slide.title}`}>
            <div className={styles.miniatureViewport}><FinishedSlide index={index} miniature treatment={treatment} /></div>
            <span>{index + 1}</span>
          </button>;
        })}
      </div>
      <div className={styles.paging}>
        <div>
          <button disabled={demo.slide === 0} onClick={() => demo.setSlide(demo.slide - 1)} aria-label="Previous output slide"><ChevronLeft size={17} aria-hidden="true" /></button>
          <button disabled={demo.slide === sample.slides.length - 1} onClick={() => demo.setSlide(demo.slide + 1)} aria-label="Next output slide"><ChevronRight size={17} aria-hidden="true" /></button>
        </div>
        <span aria-live="polite">{demo.slide + 1} of {sample.slides.length}</span>
      </div>
    </div>
  </div>;
}
