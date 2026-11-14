import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getMission, neighbours } from "../data/missions";
import { STATUS } from "../data/types";
import StatusBadge from "../components/StatusBadge";
import Reveal from "../components/Reveal";
import ImageFrame from "../components/ImageFrame";
import Lightbox from "../components/Lightbox";
import { creditLine, creditUrl, imageSrc } from "../data/images";

const formatCoord = (lat: number, lon: number) => {
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}° ${latDir}, ${Math.abs(lon).toFixed(2)}° ${lonDir}`;
};

const MissionDetail = () => {
  const { missionId } = useParams();
  const mission = getMission(missionId);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!mission) return <Navigate to="/404" replace />;

  const status = STATUS[mission.status];
  const { prev, next } = neighbours(mission.id);
  const gallery = mission.gallery.map((key) => ({ key, alt: mission.title }));
  const globeLink = mission.destination === "moon" ? "/moon" : mission.destination === "mars" ? "/mars" : null;

  return (
    <article className={`record record--${mission.destination}`}>
      <header className="record__hero">
        <img
          className="record__heroImg"
          src={imageSrc(mission.heroImage)}
          alt={mission.heroAlt}
          fetchPriority="high"
        />
        <div className="record__heroShade" aria-hidden="true" />
        <div className="wrap record__heroInner">
          <Link to="/archive" className="back">
            ← The collection
          </Link>
          <p className="eyebrow">
            Record {mission.number} · {mission.destinationLabel} · {mission.type.join(" / ")}
          </p>
          <h1 className="record__title">{mission.title}</h1>
          <p className="record__subtitle">{mission.subtitle}</p>
          <div className="record__heroMeta">
            <StatusBadge status={mission.status} />
            <span className="record__heroFate">{mission.fate}</span>
          </div>
          <p className="record__credit">
            <a href={creditUrl(mission.heroImage)} target="_blank" rel="noreferrer">
              {creditLine(mission.heroImage)}
            </a>
          </p>
        </div>
      </header>

      <div className="wrap record__layout">
        <div className="record__main">
          <Reveal className="record__block">
            <p className="record__tagline">{mission.tagline}</p>
            <p className="record__summary">{mission.summary}</p>
            {mission.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="record__para">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal className="record__block">
            <h2 className="record__h2">Mission timeline</h2>
            <ol className="miles">
              {mission.milestones.map((m) => (
                <li key={`${m.date}-${m.label}`} className="mile">
                  <span className="mile__date">{m.date}</span>
                  <span className="mile__body">
                    <span className="mile__label">{m.label}</span>
                    {m.detail && <span className="mile__detail">{m.detail}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="record__block">
            <h2 className="record__h2">Hardware</h2>
            <p className="record__note">
              What the mission was made of, and where each part is now.
            </p>
            <div className="hardwareList">
              {mission.hardware.map((item) => (
                <div className="hardwareItem" key={item.name}>
                  <div className="hardwareItem__head">
                    <h3>{item.name}</h3>
                    {item.active && <span className="hardwareItem__active">Still in service</span>}
                  </div>
                  <p className="hardwareItem__role">{item.role}</p>
                  <p className="hardwareItem__now">
                    <span>Now · </span>
                    {item.now}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="record__block">
            <h2 className="record__h2">What it achieved</h2>
            <ul className="achievements">
              {mission.achievements.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="record__block">
            <h2 className="record__h2">Final known condition</h2>
            <p className="record__para record__para--lead">{mission.finalCondition}</p>
          </Reveal>

          <Reveal className="record__block">
            <h2 className="record__h2">Gallery</h2>
            <div className="gallery">
              {gallery.map((img, i) => (
                <button
                  type="button"
                  className="gallery__item"
                  key={`${img.key}-${i}`}
                  onClick={() => setLightbox(i)}
                  aria-label={`Open image ${i + 1}: ${mission.title}`}
                >
                  <img src={imageSrc(img.key)} alt={`${mission.title} — NASA photograph ${i + 1}`} loading="lazy" decoding="async" />
                  <span className="gallery__credit">{creditLine(img.key)}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal className="record__block">
            <h2 className="record__h2">Official sources</h2>
            <ul className="sources">
              {mission.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.label}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <aside className="record__side" aria-label="Mission facts">
          <div className="sideCard">
            <div className="sideCard__status">
              <StatusBadge status={mission.status} />
              <p>{status.blurb}</p>
            </div>
            <dl className="sideCard__facts">
              {mission.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="sideCard sideCard--place">
            <p className="eyebrow">Where it is now</p>
            <p className="sideCard__place">{mission.location}</p>
            {mission.coordinates && (
              <>
                <p className="sideCard__coords">
                  {formatCoord(mission.coordinates.lat, mission.coordinates.lon)}
                  {mission.coordinates.approximate && <span>approximate</span>}
                </p>
                <p className="sideCard__coordLabel">{mission.coordinates.label}</p>
              </>
            )}
            {globeLink && (
              <Link to={globeLink} className="linkish">
                Open the interactive globe →
              </Link>
            )}
            <p className="sideCard__fate">{mission.fate}</p>
          </div>
        </aside>
      </div>

      <nav className="record__pager" aria-label="Other records">
        <Link to={`/missions/${prev.id}`} className="record__pagerLink">
          <span>Previous</span>
          <strong>← {prev.title}</strong>
        </Link>
        <Link to={`/missions/${next.id}`} className="record__pagerLink record__pagerLink--next">
          <span>Next</span>
          <strong>{next.title} →</strong>
        </Link>
      </nav>

      <Lightbox images={gallery} index={lightbox} onClose={() => setLightbox(null)} onIndexChange={setLightbox} />

      <div className="wrap record__related">
        <ImageFrame
          imageKey={mission.gallery[0] ?? mission.heroImage}
          alt={mission.heroAlt}
          caption={`${mission.title} — ${mission.destinationLabel}`}
          className="frame--wide"
        />
      </div>
    </article>
  );
};

export default MissionDetail;
