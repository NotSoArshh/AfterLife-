import { useState } from "react";
import { Link } from "react-router-dom";
import Globe from "../components/Globe";
import type { GlobeMarker } from "../components/Globe";
import Reveal from "../components/Reveal";
import ImageFrame from "../components/ImageFrame";
import StatusBadge from "../components/StatusBadge";
import { missionsByDestination } from "../data/missions";
import { imageSrc } from "../data/images";

type Site = GlobeMarker & { missionId: string; year: string; note: string };

const SITES: Site[] = [
  {
    id: "apollo11",
    label: "Apollo 11 — Tranquility Base",
    lat: 0.67,
    lon: 23.47,
    missionId: "apollo-lunar-modules",
    year: "1969",
    note: "Eagle's descent stage, the EASEP instruments and the first footprints.",
  },
  {
    id: "apollo12",
    label: "Apollo 12 — Oceanus Procellarum",
    lat: -3.01,
    lon: -23.42,
    missionId: "alsep",
    year: "1969",
    note: "First full ALSEP station, set down 180 m from Surveyor 3.",
  },
  {
    id: "surveyor3",
    label: "Surveyor 3",
    lat: -3.0,
    lon: -23.4,
    missionId: "surveyor",
    year: "1967",
    note: "Visited by Apollo 12; camera and scoop returned to Earth.",
  },
  {
    id: "apollo14",
    label: "Apollo 14 — Fra Mauro",
    lat: -3.64,
    lon: -17.48,
    missionId: "alsep",
    year: "1971",
    note: "ALSEP station and a retroreflector still used for laser ranging.",
  },
  {
    id: "apollo15",
    label: "Apollo 15 — Hadley–Apennine",
    lat: 26.13,
    lon: 3.63,
    missionId: "lunar-roving-vehicles",
    year: "1971",
    note: "First rover, 27.8 km driven across the Apennine front.",
  },
  {
    id: "apollo16",
    label: "Apollo 16 — Descartes",
    lat: -8.97,
    lon: 15.5,
    missionId: "lunar-roving-vehicles",
    year: "1972",
    note: "Highland traverses; 26.7 km on the second rover.",
  },
  {
    id: "apollo17",
    label: "Apollo 17 — Taurus–Littrow",
    lat: 20.19,
    lon: 30.77,
    missionId: "lunar-roving-vehicles",
    year: "1972",
    note: "The last landing, the third rover, and the last ALSEP station.",
  },
];

const MISSION_IDS = ["apollo-lunar-modules", "lunar-roving-vehicles", "alsep", "surveyor"];

const MoonPage = () => {
  const [active, setActive] = useState<string>("apollo11");
  const missions = MISSION_IDS.map((id) => missionsByDestination("moon").find((m) => m.id === id)!).filter(Boolean);
  const selected = SITES.find((s) => s.id === active) ?? SITES[0];

  return (
    <div className="moonPage">
      <header className="pageHead pageHead--moon">
        <div className="wrap">
          <p className="eyebrow eyebrow--ice">Destination 01 · 384,400 km</p>
          <h1 className="pageHead__title">The Moon</h1>
          <p className="pageHead__lede">
            The only other world where humans have stood, and the only place where the hardware of
            exploration is still arranged exactly as it was left. Six descent stages. Three rovers.
            Five instrument stations. Nothing has moved since 1972.
          </p>
        </div>
      </header>

      <section className="globeStage">
        <div className="wrap globeStage__inner">
          <div className="globeStage__globe">
            <Globe body="moon" markers={SITES} activeId={active} onSelect={setActive} />
          </div>
          <div className="globeStage__panel">
            <p className="eyebrow">Interactive surface map</p>
            <h2 className="globeStage__heading">Pick a landing site</h2>
            <p className="globeStage__note">
              Markers are placed at published landing coordinates. The globe itself is a digital relief
              model — surface albedo is rendered procedurally, not photographed.
            </p>
            <ul className="siteList">
              {SITES.map((site) => (
                <li key={site.id}>
                  <button
                    type="button"
                    className={`siteList__item${active === site.id ? " is-active" : ""}`}
                    onClick={() => setActive(site.id)}
                    aria-pressed={active === site.id}
                  >
                    <span className="siteList__year">{site.year}</span>
                    <span className="siteList__label">{site.label}</span>
                    <span className="siteList__coord">
                      {Math.abs(site.lat).toFixed(1)}°{site.lat >= 0 ? "N" : "S"} ·{" "}
                      {Math.abs(site.lon).toFixed(1)}°{site.lon >= 0 ? "E" : "W"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="siteDetail">
              <p className="siteDetail__label">{selected.label}</p>
              <p className="siteDetail__note">{selected.note}</p>
              <Link to={`/missions/${selected.missionId}`} className="linkish">
                Read the full record →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <Reveal className="sectionHead sectionHead--split">
          <div>
            <p className="eyebrow">The inventory</p>
            <h2 className="sectionHead__title">Four kinds of thing are up there</h2>
          </div>
          <p className="sectionHead__side">
            All four are represented in the archive with their own records, hardware lists and sources.
          </p>
        </Reveal>

        <div className="moonGrid">
          {missions.map((mission, i) => (
            <Reveal key={mission.id} delay={i * 0.05} className="moonCard">
              <Link to={`/missions/${mission.id}`} className="moonCard__media">
                <img src={imageSrc(mission.heroImage)} alt={mission.heroAlt} loading="lazy" decoding="async" />
                <span className="moonCard__num">{mission.number}</span>
              </Link>
              <div className="moonCard__body">
                <StatusBadge status={mission.status} short />
                <h3>{mission.title}</h3>
                <p>{mission.subtitle}</p>
                <p className="moonCard__fate">{mission.fate}</p>
                <Link to={`/missions/${mission.id}`} className="linkish">
                  Open record →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="moonQuote">
        <div className="wrap">
          <Reveal>
            <blockquote>
              “Everything here is where the crew left it. There is no wind, no water, no weather — only
              dust, radiation and time.”
            </blockquote>
            <p className="moonQuote__note">
              On the lunar surface, footprints from 1969 remain sharp. The same cannot be said for
              anything on Earth.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="wrap section">
        <div className="twoUp">
          <ImageFrame
            imageKey="tranquility"
            alt="Apollo 11 lunar surface panorama from Tranquility Base"
            caption="Tranquility Base, from the Apollo 11 panoramic frames."
          />
          <ImageFrame
            imageKey="moon-footprint"
            alt="Close-up of an Apollo astronaut's footprint in lunar soil"
            caption="A bootprint in regolith: still there, decades later."
          />
        </div>
        <Reveal className="heritageNote">
          <h3>Why the sites are treated as heritage</h3>
          <p>
            Lunar landing sites are the physical record of the first human presence on another world.
            Later orbiters image them to track their condition, and they are treated as protected
            heritage rather than salvage. Calling the hardware “abandoned” would misdescribe it: it was
            left deliberately, and the missions that left it succeeded.
          </p>
          <Link to="/legacy" className="linkish">
            What the hardware left behind →
          </Link>
        </Reveal>
      </section>
    </div>
  );
};

export default MoonPage;
