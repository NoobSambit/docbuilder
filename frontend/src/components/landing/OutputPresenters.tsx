import { ChevronDown, Download, FileText, Search } from "lucide-react";
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
