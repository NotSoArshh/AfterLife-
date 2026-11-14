import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MISSIONS } from "../data/missions";
import type { Mission } from "../data/types";
import Reveal from "../components/Reveal";
import { imageSrc } from "../data/images";

interface InventoryRow {
  mission: Mission;
  name: string;
  role: string;
  now: string;
  active: boolean;
}

const FILTERS = [
  { key: "all", label: "Everything" },
  { key: "surface", label: "On a surface" },
  { key: "space", label: "In space" },
  { key: "active", label: "Still in service" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

const HardwarePage = () => {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const rows = useMemo<InventoryRow[]>(
    () =>
      MISSIONS.flatMap((mission) =>
        mission.hardware.map((item) => ({
          mission,
          name: item.name,
          role: item.role,
          now: item.now,
          active: !!item.active,
        }))
      ),
    []
  );

  const filtered = rows.filter((row) => {
    if (filter === "active") return row.active;
    if (filter === "surface") return row.mission.destination !== "beyond";
    if (filter === "space") return row.mission.destination === "beyond";
    return true;
  });

  const activeCount = rows.filter((r) => r.active).length;

  return (
    <div className="hardwarePage">
      <header className="pageHead">
        <div className="wrap">
          <p className="eyebrow">The objects · {rows.length} catalogued parts</p>
          <h1 className="pageHead__title">Hardware</h1>
          <p className="pageHead__lede">
            Spacecraft, landers, rovers, instruments, helicopters, telescopes and probes — what each
            one was for, and what became of it. One of these parts is still in service today.
          </p>
          <div className="hwSummary">
            <div>
              <span className="hwSummary__value">{rows.length}</span>
              <span className="hwSummary__label">parts catalogued</span>
            </div>
            <div>
              <span className="hwSummary__value">{MISSIONS.length}</span>
              <span className="hwSummary__label">missions</span>
            </div>
            <div>
              <span className="hwSummary__value">{activeCount}</span>
              <span className="hwSummary__label">still in service</span>
            </div>
          </div>
        </div>
      </header>

      <section className="wrap section">
        <Reveal className="sectionHead sectionHead--split">
          <div>
            <p className="eyebrow">Schematic</p>
            <h2 className="sectionHead__title">Where all of this actually is</h2>
          </div>
          <p className="sectionHead__side">
            A diagram, not a map: distances are compressed and not to scale. Positions show the body
            each object is on, orbiting, or leaving.
          </p>
        </Reveal>

        <Reveal className="schematic">
          <svg viewBox="0 0 1000 380" role="img" aria-labelledby="schematic-title schematic-desc">
            <title id="schematic-title">Schematic of where the museum's hardware is</title>
            <desc id="schematic-desc">
              A not-to-scale diagram placing objects at the Moon, Mars, asteroid 433 Eros, the dwarf
              planet Ceres, an Earth-trailing solar orbit, and interstellar space.
            </desc>
            <defs>
              <radialGradient id="sunGlow">
                <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="axis" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f2efea" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f2efea" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <circle cx="70" cy="190" r="70" fill="url(#sunGlow)" />
            <circle cx="70" cy="190" r="13" fill="#ffd9a0" />
            <text x="70" y="228" className="sch__label" textAnchor="middle">
              Sun
            </text>

            <line x1="90" y1="190" x2="960" y2="190" stroke="url(#axis)" strokeWidth="1" strokeDasharray="2 6" />

            {[
              { x: 210, y: 190, label: "Moon", sub: "6 sites", tone: "ice" },
              { x: 400, y: 190, label: "Mars", sub: "8 sites", tone: "rust" },
              { x: 570, y: 190, label: "433 Eros", sub: "NEAR", tone: "gold" },
              { x: 700, y: 190, label: "Ceres", sub: "Dawn", tone: "gold" },
              { x: 830, y: 190, label: "Solar orbit", sub: "Kepler", tone: "ice" },
            ].map((p) => (
              <g key={p.label}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="7"
                  className={`sch__dot sch__dot--${p.tone}`}
                />
                <line x1={p.x} y1={p.y - 12} x2={p.x} y2={p.y - 34} stroke="#f2efea" strokeOpacity="0.25" />
                <text x={p.x} y={p.y - 44} className="sch__label" textAnchor="middle">
                  {p.label}
                </text>
                <text x={p.x} y={p.y + 26} className="sch__sub" textAnchor="middle">
                  {p.sub}
                </text>
              </g>
            ))}

            <path d="M860 190 C 900 190, 930 160, 975 120" stroke="#ffd9a0" strokeOpacity="0.5" fill="none" strokeDasharray="3 5" />
            <path d="M860 190 C 900 190, 930 220, 975 260" stroke="#ffd9a0" strokeOpacity="0.5" fill="none" strokeDasharray="3 5" />
            <text x="852" y="108" className="sch__label" textAnchor="end">
              Pioneer 10 →
            </text>
            <text x="852" y="284" className="sch__label" textAnchor="end">
              Pioneer 11 →
            </text>
            <text x="955" y="190" className="sch__sub" textAnchor="end">
              interstellar
            </text>
          </svg>
          <p className="schematic__note">
            Schematic, not to scale. Lunar and Martian markers are landing sites with approximate
            published coordinates.
          </p>
        </Reveal>
      </section>

      <section className="wrap section">
        <div className="sectionHead sectionHead--split">
          <div>
            <p className="eyebrow">Inventory</p>
            <h2 className="sectionHead__title">The catalogue</h2>
          </div>
        </div>

        <div className="filters" role="group" aria-label="Filter hardware">
          <span className="filters__label">Show</span>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`chip${filter === f.key ? " is-on" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="chip__count">
                {f.key === "all"
                  ? rows.length
                  : f.key === "active"
                    ? activeCount
                    : f.key === "surface"
                      ? rows.filter((r) => r.mission.destination !== "beyond").length
                      : rows.filter((r) => r.mission.destination === "beyond").length}
              </span>
            </button>
          ))}
        </div>

        <div className="hwList">
          {filtered.map((row, i) => {
            const id = `${row.mission.id}-${row.name}-${i}`;
            const open = selected === id;
            return (
              <div className={`hwRow${open ? " is-open" : ""}`} key={id}>
                <button
                  type="button"
                  className="hwRow__button"
                  onClick={() => setSelected(open ? null : id)}
                  aria-expanded={open}
                >
                  <span className="hwRow__name">
                    {row.name}
                    {row.active && <span className="hwRow__badge">In service</span>}
                  </span>
                  <span className="hwRow__mission">{row.mission.title}</span>
                  <span className="hwRow__arrow" aria-hidden="true">
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open && (
                  <div className="hwRow__detail">
                    <div>
                      <p className="hwRow__label">Purpose</p>
                      <p>{row.role}</p>
                    </div>
                    <div>
                      <p className="hwRow__label">Now</p>
                      <p>{row.now}</p>
                    </div>
                    <Link to={`/missions/${row.mission.id}`} className="linkish">
                      Full mission record →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="wrap section">
        <div className="twoUp">
          <figure className="frame">
            <div className="frame__media">
              <img src={imageSrc("lrv")} alt="Lunar Roving Vehicle at the Apollo 17 landing site" loading="lazy" />
            </div>
            <figcaption className="frame__cap">NASA/JSC — Apollo 17 Lunar Roving Vehicle</figcaption>
          </figure>
          <figure className="frame">
            <div className="frame__media">
              <img src={imageSrc("kepler-spacecraft")} alt="Artist's concept of the Kepler space telescope" loading="lazy" />
            </div>
            <figcaption className="frame__cap">NASA/JPL — Kepler in space, artist's concept</figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
};

export default HardwarePage;
