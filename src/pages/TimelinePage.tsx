import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TIMELINE } from "../data/site";
import type { EventKind } from "../data/site";
import { DESTINATIONS } from "../data/types";
import Reveal from "../components/Reveal";

gsap.registerPlugin(ScrollTrigger);

const KINDS: { key: EventKind | "all"; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "landing", label: "Landings" },
  { key: "operation", label: "Operations" },
  { key: "ending", label: "Endings" },
];

const KIND_LABEL: Record<EventKind, string> = {
  launch: "Launch",
  landing: "Landing",
  operation: "Operation",
  ending: "Ending",
};

const TimelinePage = () => {
  const [dest, setDest] = useState<string>("all");
  const [kind, setKind] = useState<EventKind | "all">("all");
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const events = useMemo(
    () =>
      TIMELINE.filter((e) => (dest === "all" || e.destination === dest) && (kind === "all" || e.kind === kind)),
    [dest, kind]
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (lineRef.current) lineRef.current.style.transform = "scaleY(1)";
      return;
    }
    const ctx = gsap.context(() => {
      if (!lineRef.current || !trackRef.current) return;
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top 70%",
            end: "bottom 85%",
            scrub: 0.5,
          },
        }
      );
    });
    return () => ctx.revert();
  }, [events.length]);

  let lastDecade: number | null = null;

  return (
    <div className="timelinePage">
      <header className="pageHead">
        <div className="wrap">
          <p className="eyebrow">Chronology · {TIMELINE.length} dated events</p>
          <h1 className="pageHead__title">Timeline</h1>
          <p className="pageHead__lede">
            From the first soft landing on the Moon to the last flight of a helicopter on Mars. Every
            point is a date NASA recorded — launch, landing, operation or ending.
          </p>

          <div className="filters" role="group" aria-label="Filter timeline by destination">
            <span className="filters__label">Destination</span>
            <button type="button" className={`chip${dest === "all" ? " is-on" : ""}`} onClick={() => setDest("all")}>
              All
            </button>
            {DESTINATIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                className={`chip${dest === d.key ? " is-on" : ""}`}
                onClick={() => setDest(d.key)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="filters" role="group" aria-label="Filter timeline by event type">
            <span className="filters__label">Event</span>
            {KINDS.map((k) => (
              <button
                key={k.key}
                type="button"
                className={`chip chip--ghost${kind === k.key ? " is-on" : ""}`}
                onClick={() => setKind(k.key)}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="tl" ref={trackRef}>
          <div className="tl__lineWrap" aria-hidden="true">
            <div className="tl__line" ref={lineRef} />
          </div>

          {events.map((event) => {
            const decade = Math.floor(event.year / 10) * 10;
            const showDecade = decade !== lastDecade;
            lastDecade = decade;
            return (
              <div className="tl__group" key={`${event.at}-${event.title}`}>
                {showDecade && (
                  <div className="tl__decade">
                    <span>{decade}s</span>
                  </div>
                )}
                <Reveal className="tl__item">
                  <div className="tl__dotCell" aria-hidden="true">
                    <span className={`tl__dot tl__dot--${event.kind}`} />
                  </div>
                  <div className="tl__content">
                    <div className="tl__meta">
                      <span className={`tl__kind tl__kind--${event.kind}`}>{KIND_LABEL[event.kind]}</span>
                      <time dateTime={event.at}>{event.date}</time>
                      <span className="tl__year">{event.year}</span>
                    </div>
                    <h2 className="tl__title">{event.title}</h2>
                    <p className="tl__detail">{event.detail}</p>
                    {event.missionId && (
                      <Link to={`/missions/${event.missionId}`} className="linkish">
                        Open the record →
                      </Link>
                    )}
                  </div>
                </Reveal>
              </div>
            );
          })}

          {events.length === 0 && (
            <div className="empty">
              <p className="empty__title">No events match those filters.</p>
              <button
                type="button"
                className="btn btn--line"
                onClick={() => {
                  setDest("all");
                  setKind("all");
                }}
              >
                Show everything
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
