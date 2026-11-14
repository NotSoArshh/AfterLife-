import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MISSIONS, MISSION_TYPES, countByStatus } from "../data/missions";
import { DESTINATIONS, STATUS } from "../data/types";
import type { Mission, StatusKind } from "../data/types";
import MissionRow from "../components/MissionRow";
import Reveal from "../components/Reveal";
import { imageSrc } from "../data/images";

const SORTS = [
  { key: "chronological", label: "Chronological" },
  { key: "destination", label: "By destination" },
  { key: "status", label: "By status" },
] as const;

const Archive = () => {
  const [params, setParams] = useSearchParams();
  const [preview, setPreview] = useState<{ mission: Mission; x: number; y: number } | null>(null);

  const q = params.get("q") ?? "";
  const dest = params.get("dest") ?? "all";
  const status = params.get("status") ?? "all";
  const type = params.get("type") ?? "all";
  const sort = params.get("sort") ?? "chronological";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const statusCounts = useMemo(() => countByStatus(), []);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = MISSIONS.filter((m) => {
      if (dest !== "all" && m.destination !== dest) return false;
      if (status !== "all" && m.status !== status) return false;
      if (type !== "all" && !m.type.includes(type)) return false;
      if (!needle) return true;
      const haystack = [
        m.title,
        m.subtitle,
        m.summary,
        m.destinationLabel,
        m.location,
        m.type.join(" "),
        m.hardware.map((h) => h.name).join(" "),
        STATUS[m.status].label,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });

    return [...filtered].sort((a, b) => {
      if (sort === "destination") return a.destination.localeCompare(b.destination) || a.number.localeCompare(b.number);
      if (sort === "status") return a.status.localeCompare(b.status) || a.number.localeCompare(b.number);
      return a.number.localeCompare(b.number);
    });
  }, [q, dest, status, type, sort]);

  const activeFilters = [dest, status, type].filter((v) => v !== "all").length + (q ? 1 : 0);

  return (
    <div className="archive">
      <header className="archive__head">
        <div className="wrap">
          <p className="eyebrow">The collection · {MISSIONS.length} records</p>
          <h1 className="archive__title">
            Archive<span className="archive__titleDot">.</span>
          </h1>
          <p className="archive__lede">
            Every entry is a mission whose hardware is still out there. Search by name, filter by
            where it ended up, and read what actually became of it.
          </p>

          <div className="search">
            <label className="search__label" htmlFor="archive-search">
              Search the collection
            </label>
            <input
              id="archive-search"
              type="search"
              className="search__input"
              placeholder="Try “rover”, “Ceres”, “cameras”, “1976”…"
              value={q}
              onChange={(e) => setParam("q", e.target.value)}
            />
            {q && (
              <button type="button" className="search__clear" onClick={() => setParam("q", "")}>
                Clear
              </button>
            )}
          </div>

          <div className="filters" role="group" aria-label="Filter by destination">
            <span className="filters__label">Destination</span>
            <button
              type="button"
              className={`chip${dest === "all" ? " is-on" : ""}`}
              onClick={() => setParam("dest", "all")}
            >
              All
            </button>
            {DESTINATIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                className={`chip${dest === d.key ? " is-on" : ""}`}
                onClick={() => setParam("dest", d.key)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="filters" role="group" aria-label="Filter by status">
            <span className="filters__label">Status</span>
            <button
              type="button"
              className={`chip${status === "all" ? " is-on" : ""}`}
              onClick={() => setParam("status", "all")}
            >
              All
            </button>
            {(Object.keys(STATUS) as StatusKind[])
              .filter((key) => statusCounts[key])
              .map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`chip chip--${key}${status === key ? " is-on" : ""}`}
                  onClick={() => setParam("status", key)}
                >
                  {STATUS[key].label}
                  <span className="chip__count">{statusCounts[key]}</span>
                </button>
              ))}
          </div>

          <div className="archive__toolbar">
            <div className="filters filters--inline" role="group" aria-label="Filter by hardware type">
              <span className="filters__label">Type</span>
              <select
                className="select"
                value={type}
                onChange={(e) => setParam("type", e.target.value)}
                aria-label="Hardware type"
              >
                <option value="all">All hardware</option>
                {MISSION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="filters filters--inline" role="group" aria-label="Sort results">
              <span className="filters__label">Sort</span>
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={`chip chip--ghost${sort === s.key ? " is-on" : ""}`}
                  onClick={() => setParam("sort", s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="archive__count">
            <span>
              {results.length} {results.length === 1 ? "record" : "records"}
            </span>
            {activeFilters > 0 && (
              <button type="button" className="linkish" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                Reset {activeFilters} filter{activeFilters === 1 ? "" : "s"}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="rows">
          <div className="rows__head" aria-hidden="true">
            <span>No.</span>
            <span>Mission</span>
            <span>Where</span>
            <span>Flew</span>
            <span>Status</span>
            <span />
          </div>
          <AnimatePresence initial={false}>
            {results.map((mission) => (
              <motion.div
                key={mission.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <MissionRow
                  mission={mission}
                  onPreview={(m, x, y) => setPreview(m ? { mission: m, x, y } : null)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {results.length === 0 && (
            <Reveal className="empty">
              <p className="empty__title">Nothing in the collection matches that.</p>
              <p className="empty__body">
                The archive holds every mission in the museum, so try a broader term — “Moon”,
                “lander”, “telescope” — or clear the filters.
              </p>
              <button type="button" className="btn btn--line" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                Reset the archive
              </button>
            </Reveal>
          )}
        </div>
      </div>

      {preview && (
        <div
          className="row-preview"
          style={{ left: preview.x + 28, top: preview.y - 130 }}
          aria-hidden="true"
        >
          <img src={imageSrc(preview.mission.heroImage)} alt="" />
          <span>{preview.mission.destinationLabel}</span>
        </div>
      )}
    </div>
  );
};

export default Archive;
