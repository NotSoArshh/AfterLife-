import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import HardwareViewer from "../components/HardwareViewer";
import Reveal from "../components/Reveal";
import StatusBadge from "../components/StatusBadge";
import { HARDWARE_MODELS, resolveModel } from "../data/hardwareModels";

const HangarPage = () => {
  const [modelId, setModelId] = useState(HARDWARE_MODELS[0].id);
  const [part, setPart] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [xray, setXray] = useState(false);
  const [exploded, setExploded] = useState(false);

  const active = useMemo(
    () => HARDWARE_MODELS.find((m) => m.id === modelId) ?? HARDWARE_MODELS[0],
    [modelId],
  );
  const { mission, hardware } = useMemo(() => resolveModel(active), [active]);
  const partInfo = active.parts.find((p) => p.id === part);

  const choose = (id: string) => {
    setModelId(id);
    setPart(null);
  };

  return (
    <div className="hangarPage">
      <header className="pageHead">
        <div className="wrap">
          <p className="eyebrow">The hangar · {HARDWARE_MODELS.length} objects in three dimensions</p>
          <h1 className="pageHead__title">Hardware you can turn over</h1>
          <p className="pageHead__lede">
            Orbit a lunar module, zoom into a rover's wheels, strip a lander to wireframe, or pull a
            telescope apart. Each model is a stylised reconstruction of an object in the collection,
            and every label links back to its record.
          </p>
        </div>
      </header>

      <section className="wrap section">
        <div className="hangar">
          <nav className="hangar__rail" aria-label="Choose an object">
            <p className="hangar__railHead">Objects</p>
            {HARDWARE_MODELS.map((m) => {
              const missionTitle = resolveModel(m).mission?.title ?? "";
              return (
                <button
                  key={m.id}
                  type="button"
                  className={`hangar__railBtn${m.id === active.id ? " is-on" : ""}`}
                  onClick={() => choose(m.id)}
                  aria-pressed={m.id === active.id}
                >
                  <span className="hangar__railTitle">{m.title}</span>
                  <span className="hangar__railSub">{missionTitle}</span>
                </button>
              );
            })}
          </nav>

          <div className="hangar__main">
            <div className="viewer">
              <div className="hangar__toolbar">
                <button
                  type="button"
                  className={`toggle${autoRotate ? " is-on" : ""}`}
                  onClick={() => setAutoRotate((v) => !v)}
                  aria-pressed={autoRotate}
                >
                  Auto-orbit
                </button>
                <button
                  type="button"
                  className={`toggle${xray ? " is-on" : ""}`}
                  onClick={() => setXray((v) => !v)}
                  aria-pressed={xray}
                >
                  X-ray
                </button>
                <button
                  type="button"
                  className={`toggle${exploded ? " is-on" : ""}`}
                  onClick={() => setExploded((v) => !v)}
                  aria-pressed={exploded}
                >
                  Exploded
                </button>
                <span className="hangar__toolbarNote">{active.title}</span>
                <span className="hangar__toolbarHint">drag · scroll · arrows</span>
              </div>

              <HardwareViewer
                model={active}
                selected={part}
                onSelect={setPart}
                autoRotate={autoRotate}
                xray={xray}
                exploded={exploded}
              />
            </div>

            <Reveal className="hangar__panel">
              <div className="hangar__panelHead">
                <div>
                  <p className="eyebrow">{mission?.destinationLabel ?? "Collection"}</p>
                  <h2 className="hangar__title">{active.title}</h2>
                </div>
                {mission && <StatusBadge status={mission.status} />}
              </div>

              {mission && (
                <dl className="hangar__spec">
                  <div>
                    <dt>Launched</dt>
                    <dd>{mission.launched}</dd>
                  </div>
                  <div>
                    <dt>Ended</dt>
                    <dd>{mission.ended}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{mission.location}</dd>
                  </div>
                </dl>
              )}

              <div className="hangar__facts">
                <div>
                  <p className="hangar__label">What it was for</p>
                  <p className="hangar__body">
                    {hardware?.role ?? mission?.tagline ?? "Record unavailable."}
                  </p>
                </div>
                <div>
                  <p className="hangar__label">Now</p>
                  <p className="hangar__body">{hardware?.now ?? mission?.fate ?? "—"}</p>
                </div>
              </div>

              <div className="hangar__parts">
                <p className="hangar__label">Parts in this model · {active.parts.length}</p>
                <div className="hangar__chips">
                  {active.parts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`partChip${part === p.id ? " is-on" : ""}`}
                      onClick={() => setPart(part === p.id ? null : p.id)}
                      aria-pressed={part === p.id}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`hangar__part${partInfo ? " is-on" : ""}`}>
                <p className="hangar__label">{partInfo ? partInfo.label : "Select a part"}</p>
                <p className="hangar__body">
                  {partInfo
                    ? partInfo.note
                    : "Click any labelled point on the model, or pick a part from the list above. Arrow keys rotate, + and − zoom, Esc clears the selection."}
                </p>
              </div>

              <div className="hangar__panelFoot">
                {mission && (
                  <>
                    <Link to={`/missions/${mission.id}`} className="linkish">
                      Full mission record →
                    </Link>
                    <Link to="/hardware" className="linkish">
                      The written catalogue →
                    </Link>
                  </>
                )}
              </div>

              <p className="hangar__disclaimer">
                Stylised reconstructions drawn from the mission records. Proportions, surface detail
                and small fittings are simplified — these are not engineering drawings.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HangarPage;
