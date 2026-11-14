import { useState } from "react";
import { Link } from "react-router-dom";
import Globe from "../components/Globe";
import type { GlobeMarker } from "../components/Globe";
import Reveal from "../components/Reveal";
import ImageFrame from "../components/ImageFrame";
import StatusBadge from "../components/StatusBadge";
import { missionsByDestination } from "../data/missions";
import { imageSrc } from "../data/images";

type Site = GlobeMarker & { missionId: string; year: string; note: string; status: string };

const SITES: Site[] = [
  {
    id: "viking1",
    label: "Viking 1 — Chryse Planitia",
    lat: 22.48,
    lon: -48.0,
    missionId: "viking",
    year: "1976",
    note: "First image from the surface of Mars; silent since 1982.",
    status: "Silent",
  },
  {
    id: "viking2",
    label: "Viking 2 — Utopia Planitia",
    lat: 47.97,
    lon: -134.26,
    missionId: "viking",
    year: "1976",
    note: "Second lander; stopped in 1980.",
    status: "Silent",
  },
  {
    id: "pathfinder",
    label: "Mars Pathfinder — Ares Vallis",
    lat: 19.13,
    lon: -33.22,
    missionId: "sojourner",
    year: "1997",
    note: "Sojourner's landing site, at the Carl Sagan Memorial Station.",
    status: "Silent",
  },
  {
    id: "spirit",
    label: "Spirit — Gusev Crater",
    lat: -14.57,
    lon: 175.47,
    missionId: "spirit-opportunity",
    year: "2004",
    note: "Stuck in soft soil in 2009; last contact 2010.",
    status: "Silent",
  },
  {
    id: "opportunity",
    label: "Opportunity — Meridiani Planum",
    lat: -1.95,
    lon: -5.53,
    missionId: "spirit-opportunity",
    year: "2004",
    note: "45.16 km driven; stopped by a dust storm in 2018.",
    status: "Silent",
  },
  {
    id: "phoenix",
    label: "Phoenix — Vastitas Borealis",
    lat: 68.22,
    lon: -125.75,
    missionId: "phoenix-insight",
    year: "2008",
    note: "Confirmed water ice, then froze into the Arctic winter.",
    status: "Retired",
  },
  {
    id: "insight",
    label: "InSight — Elysium Planitia",
    lat: 4.5,
    lon: 135.9,
    missionId: "phoenix-insight",
    year: "2018",
    note: "Recorded 1,319 marsquakes before its power ran out.",
    status: "Retired",
  },
  {
    id: "ingenuity",
    label: "Ingenuity — Jezero Crater",
    lat: 18.44,
    lon: 77.45,
    missionId: "ingenuity",
    year: "2021",
    note: "72 flights; grounded by rotor damage in Neretva Vallis.",
    status: "Retired",
  },
];

const MISSION_IDS = ["sojourner", "spirit-opportunity", "viking", "phoenix-insight", "ingenuity"];

const MarsPage = () => {
  const [active, setActive] = useState<string>("ingenuity");
  const missions = MISSION_IDS.map((id) => missionsByDestination("mars").find((m) => m.id === id)!).filter(Boolean);
  const selected = SITES.find((s) => s.id === active) ?? SITES[0];

  return (
    <div className="marsPage">
      <header className="pageHead pageHead--mars">
        <div className="wrap">
          <p className="eyebrow eyebrow--rust">Destination 02 · 225 million km</p>
          <h1 className="pageHead__title">Mars</h1>
          <p className="pageHead__lede">
            Eight landing sites across two hemispheres, and a museum of endings. Mars is where
            hardware goes to be outlived — by dust, by cold, by a battery that could not survive one
            more winter.
          </p>
        </div>
      </header>

      <section className="globeStage globeStage--mars">
        <div className="wrap globeStage__inner globeStage__inner--flip">
          <div className="globeStage__panel">
            <p className="eyebrow eyebrow--rust">Interactive surface map</p>
            <h2 className="globeStage__heading">Every site we have left behind</h2>
            <p className="globeStage__note">
              Marker positions use published landing coordinates and are approximate at this scale.
              The globe is a digital relief model, rendered procedurally rather than photographed.
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
          <div className="globeStage__globe">
            <Globe body="mars" markers={SITES} activeId={active} onSelect={setActive} />
          </div>
        </div>
      </section>

      <section className="wrap section">
        <Reveal className="sectionHead sectionHead--split">
          <div>
            <p className="eyebrow eyebrow--rust">Site ledger</p>
            <h2 className="sectionHead__title">What is at each site</h2>
          </div>
          <p className="sectionHead__side">
            Nine surface missions, eight sites in this collection, five records. None of this hardware
            has been recovered.
          </p>
        </Reveal>

        <div className="ledger">
          <div className="ledger__head" aria-hidden="true">
            <span>Year</span>
            <span>Mission</span>
            <span>Site</span>
            <span>Hardware left</span>
            <span>Condition</span>
          </div>
          {SITES.map((site) => {
            const mission = missions.find((m) => m.id === site.missionId);
            return (
              <Link to={`/missions/${site.missionId}`} className="ledger__row" key={site.id}>
                <span className="ledger__year">{site.year}</span>
                <span className="ledger__mission">{mission?.title ?? "—"}</span>
                <span className="ledger__site">{site.label.split(" — ")[1] ?? site.label}</span>
                <span className="ledger__hardware">{site.note}</span>
                <span className="ledger__status">{site.status}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="marsFeature">
        <div className="wrap marsFeature__inner">
          <div className="marsFeature__text">
            <Reveal>
              <p className="eyebrow eyebrow--rust">The recurring cause</p>
              <h2>Dust is the weather that ends missions.</h2>
              <p>
                Phoenix, Opportunity and InSight all died the same way: fine dust settled on their
                solar arrays until the panels could no longer make enough power to keep the heaters
                running through the Martian night. Spirit was lost to winter cold after getting stuck.
              </p>
              <p>
                This is not a design flaw so much as a budget: solar power is light, cheap and
                proven, and every mission since has carried a lesson learned from the ones that
                stopped. Later rovers use radioisotope power or dust-shedding surfaces.
              </p>
              <Link to="/legacy" className="linkish">
                What these endings changed →
              </Link>
            </Reveal>
          </div>
          <div className="marsFeature__media">
            <ImageFrame
              imageKey="insight"
              alt="NASA's InSight lander on the Martian surface"
              caption="InSight in its surface configuration: solar panels, seismometer, and eventually a great deal of dust."
            />
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="marsGrid">
          {missions.map((mission, i) => (
            <Reveal key={mission.id} delay={i * 0.04} className="marsCard">
              <div className="marsCard__top">
                <span className="marsCard__num">{mission.number}</span>
                <StatusBadge status={mission.status} short />
              </div>
              <img src={imageSrc(mission.heroImage)} alt={mission.heroAlt} loading="lazy" decoding="async" />
              <h3>{mission.title}</h3>
              <p className="marsCard__sub">{mission.subtitle}</p>
              <p className="marsCard__fact">{mission.fate}</p>
              <Link to={`/missions/${mission.id}`} className="linkish">
                Open record →
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="twoUp">
          <ImageFrame
            imageKey="viking"
            alt="First colour image from the Viking 1 lander"
            caption="Viking 1, 1976: the first colour photograph taken on Mars."
          />
          <ImageFrame
            imageKey="mars-surface"
            alt="Detailed panorama of the Jezero Crater delta on Mars"
            caption="Jezero Crater today — where Ingenuity made its last flight."
          />
        </div>
      </section>
    </div>
  );
};

export default MarsPage;
