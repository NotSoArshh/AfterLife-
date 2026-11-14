import { NASA_IMAGES } from "../data/nasaImages";
import { RESEARCH_NOTE, SOURCE_GROUPS } from "../data/site";
import Reveal from "../components/Reveal";

const SourcesPage = () => {
  const images = Object.entries(NASA_IMAGES).sort((a, b) => a[1].nasaId.localeCompare(b[1].nasaId));

  return (
    <div className="sourcesPage">
      <header className="pageHead">
        <div className="wrap">
          <p className="eyebrow">Research integrity</p>
          <h1 className="pageHead__title">Sources</h1>
          <p className="pageHead__lede">
            This museum is built from primary NASA records. Every factual claim has a source; every
            photograph has a NASA identifier. Where NASA's own pages differ, the museum uses the
            NSSDCA figure and says so.
          </p>
        </div>
      </header>

      <section className="wrap section">
        <Reveal className="method">
          <h2>Method</h2>
          <p>{RESEARCH_NOTE}</p>
          <ul>
            <li>
              <strong>Status is a taxonomy, not a mood.</strong> “Left in place”, “silent”,
              “retired”, “in orbit”, “at rest”, “outbound” and “still working” mean different things
              and are never used interchangeably.
            </li>
            <li>
              <strong>Failure is described precisely.</strong> Loss of contact is not the same as
              confirmed destruction, and neither is the same as a mission deliberately ended.
            </li>
            <li>
              <strong>Coordinates are approximate.</strong> Landing-site markers use published values
              rounded for display, and are labelled approximate wherever they appear.
            </li>
            <li>
              <strong>Images are official.</strong> No image on this site is generated, and no credit
              is invented.
            </li>
          </ul>
        </Reveal>
      </section>

      <section className="wrap section">
        <div className="sourceGroups">
          {SOURCE_GROUPS.map((group) => (
            <Reveal key={group.title} className="sourceGroup">
              <h2>{group.title}</h2>
              <p className="sourceGroup__note">{group.note}</p>
              <ul>
                {group.links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <Reveal className="sectionHead">
          <p className="eyebrow">Attribution</p>
          <h2 className="sectionHead__title">Image credits</h2>
          <p className="sectionHead__side">
            {images.length} images, all retrieved from the NASA Image and Video Library. Follow an ID to
            the original record.
          </p>
        </Reveal>

        <div className="creditTable">
          <div className="creditTable__head" aria-hidden="true">
            <span>Used for</span>
            <span>NASA title</span>
            <span>Credit</span>
            <span>ID</span>
          </div>
          {images.map(([key, meta]) => (
            <div className="creditTable__row" key={key}>
              <span className="creditTable__key">{key.replace(/-/g, " ")}</span>
              <span className="creditTable__title">{meta.title}</span>
              <span className="creditTable__center">
                NASA{meta.center ? `/${meta.center}` : ""}
                {meta.date ? ` · ${meta.date.slice(0, 4)}` : ""}
              </span>
              <a href={meta.source} target="_blank" rel="noreferrer" className="creditTable__id">
                {meta.nasaId}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SourcesPage;
