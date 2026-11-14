import { Link } from "react-router-dom";
import { LEGACY_THEMES, RESEARCH_NOTE } from "../data/site";
import Reveal from "../components/Reveal";
import ImageFrame from "../components/ImageFrame";

const NUMBERS = [
  { value: "382 kg", label: "of lunar samples returned by Apollo", source: "NASA" },
  { value: "1,319", label: "marsquakes recorded by one seismometer", source: "NASA/JPL" },
  { value: "2,600+", label: "exoplanets confirmed with Kepler data", source: "NASA" },
  { value: "1 trillion", label: "bits returned by the ALSEP network", source: "NASA history" },
];

const LegacyPage = () => (
  <div className="legacyPage">
    <header className="pageHead pageHead--legacy">
      <div className="wrap">
        <p className="eyebrow eyebrow--gold">What remains</p>
        <h1 className="pageHead__title">Legacy</h1>
        <p className="pageHead__lede">
          A mission ends; its data does not. These objects left behind instruments, archives,
          engineering knowledge and a set of hard lessons about dust, cold, fuel and time. This is the
          part of the museum that is still working.
        </p>
      </div>
    </header>

    <section className="wrap section">
      <Reveal className="numbers">
        {NUMBERS.map((n) => (
          <div className="numbers__item" key={n.label}>
            <span className="numbers__value">{n.value}</span>
            <span className="numbers__label">{n.label}</span>
            <span className="numbers__source">{n.source}</span>
          </div>
        ))}
      </Reveal>
    </section>

    <section className="wrap">
      {LEGACY_THEMES.map((theme, i) => (
        <Reveal key={theme.title} className={`legacyBlock${i % 2 ? " legacyBlock--flip" : ""}`}>
          <div className="legacyBlock__text">
            <p className="eyebrow">{theme.kicker}</p>
            <h2>{theme.title}</h2>
            <p className="legacyBlock__body">{theme.body}</p>
            <ul className="legacyBlock__points">
              {theme.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="legacyBlock__aside">
            <span className="legacyBlock__numeral">{String(i + 1).padStart(2, "0")}</span>
          </div>
        </Reveal>
      ))}
    </section>

    <section className="wrap section">
      <div className="twoUp">
        <ImageFrame
          imageKey="alsep"
          alt="Apollo 16 commander John Young working at the lunar roving vehicle before ALSEP deployment"
          caption="ALSEP deployment, Apollo 16. The instruments outlived the mission by eight years."
        />
        <ImageFrame
          imageKey="exoplanet"
          alt="Illustration of possible interiors of TRAPPIST-1 exoplanets"
          caption="Kepler's archive is still producing new planet candidates years after the telescope stopped."
        />
      </div>
    </section>

    <section className="legacyClose">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow eyebrow--gold">A note on accuracy</p>
          <blockquote className="legacyClose__quote">{RESEARCH_NOTE}</blockquote>
          <div className="legacyClose__cta">
            <Link to="/sources" className="btn btn--gold">
              Read the sources
            </Link>
            <Link to="/archive" className="btn btn--line">
              Back to the collection
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
);

export default LegacyPage;
