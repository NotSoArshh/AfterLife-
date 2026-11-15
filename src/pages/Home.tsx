import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Globe from "../components/Globe";
import Reveal from "../components/Reveal";
import Parallax from "../components/Parallax";
import Ticker from "../components/Ticker";
import CountUp from "../components/CountUp";
import ImageFrame from "../components/ImageFrame";
import StatusBadge from "../components/StatusBadge";
import { MISSIONS, countByStatus, getMission } from "../data/missions";
import { DESTINATIONS, STATUS } from "../data/types";
import type { StatusKind } from "../data/types";
import { HEADLINE_STATS } from "../data/site";
import { imageSrc } from "../data/images";

gsap.registerPlugin(ScrollTrigger);

const MOON_SITES = [
  { id: "apollo11", label: "Apollo 11", lat: 0.67, lon: 23.47 },
  { id: "apollo12", label: "Apollo 12", lat: -3.01, lon: -23.42 },
  { id: "apollo14", label: "Apollo 14", lat: -3.64, lon: -17.48 },
  { id: "apollo15", label: "Apollo 15", lat: 26.13, lon: 3.63 },
  { id: "apollo16", label: "Apollo 16", lat: -8.97, lon: 15.5 },
  { id: "apollo17", label: "Apollo 17", lat: 20.19, lon: 30.77 },
];

const FEATURED = [
  "apollo-lunar-modules",
  "lunar-roving-vehicles",
  "ingenuity",
  "near-shoemaker",
  "kepler",
  "viking",
];

const CHAPTERS = [
  {
    key: "moon" as const,
    index: "Chapter I",
    title: "The Moon",
    kicker: "384,400 km",
    image: "tranquility",
    alt: "Apollo 11 lunar surface panorama from Tranquility Base",
    text: "The only other world where humans have left equipment standing in place. Six descent stages, three rovers, five instrument stations — and footprints that no wind will ever erase.",
    link: "/moon",
    cta: "Explore the Moon",
    note: "Atmosphere: none. Weather: none. Erosion: essentially none.",
  },
  {
    key: "mars" as const,
    index: "Chapter II",
    title: "Mars",
    kicker: "225 million km",
    image: "opportunity",
    alt: "Panorama of Mars taken by the Opportunity rover at Meridiani Planum",
    text: "Eight landing sites, nine missions, one planet. Mars is where hardware goes to be outlived: rovers that ran for years past their warranty, and landers that died under dust.",
    link: "/mars",
    cta: "Explore Mars",
    note: "Seasonal dust storms. Extreme cold. Everything ends eventually.",
  },
  {
    key: "beyond" as const,
    index: "Chapter III",
    title: "Deep space",
    kicker: "Beyond the belt",
    image: "ceres",
    alt: "High resolution view of the dwarf planet Ceres",
    text: "Dawn still circles Ceres with no fuel left. NEAR rests on an asteroid it was never meant to land on. Pioneer 10 and 11 are outbound, silent, carrying a plaque in case anyone finds them.",
    link: "/archive?dest=beyond",
    cta: "See the deep-space records",
    note: "No recovery mission exists. None is planned.",
  },
];

const Home = () => {
  const heroGlobe = useRef<HTMLDivElement>(null);
  const heroInner = useRef<HTMLDivElement>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) return;

    const ctx = gsap.context(() => {
      if (heroGlobe.current) {
        gsap.to(heroGlobe.current, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: heroGlobe.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      }
      if (heroInner.current) {
        gsap.to(heroInner.current, {
          opacity: 0.15,
          y: -60,
          ease: "none",
          scrollTrigger: { trigger: heroInner.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const statusCounts = countByStatus();

  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__globe" ref={heroGlobe} aria-hidden="true">
          <Globe body="moon" markers={MOON_SITES} />
        </div>

        <div className="wrap hero__inner" ref={heroInner}>
          <p className="eyebrow eyebrow--gold">
            NASA Space Apps Challenge 2026 · “Abandoned but not Forgotten”
          </p>
          <h1 className="hero__title" id="hero-title">
            After<em>life</em>
          </h1>
          <p className="hero__sub">The Forgotten Space Museum</p>
          <p className="hero__lede">
            <span className="hero__ledeLead">
              Half a century of human hardware is still on the Moon, on Mars, and drifting between
              the planets.
            </span>{" "}
            <span className="hero__ledeTail">
              A museum of the objects we left behind — and of what they are still telling us.
            </span>
          </p>
          <div className="hero__cta">
            <Link to="/archive" className="btn btn--gold">
              Enter the museum
            </Link>
            <Link to="/timeline" className="btn btn--line">
              Trace the timeline
            </Link>
          </div>
          <div className="hero__meta">
            <span>13 missions</span>
            <span>6 destinations</span>
            <span>1966 — present</span>
          </div>
        </div>

        <div className="hero__scroll" aria-hidden="true">
          <span>Scroll</span>
          <span className="hero__scrollLine" />
        </div>
      </section>

      <section className="statement">
        <div className="wrap">
          <Reveal variant="mask">
            <p className="eyebrow">The idea</p>
            <blockquote className="statement__quote">
              We call them <em>abandoned</em>. Most of them were simply{" "}
              <em>left</em> — by design, on purpose, at the end of a job well done.
            </blockquote>
          </Reveal>
          <div className="statement__cols">
            <Reveal delay={0.05}>
              <p>
                A lander that ran out of power is not a failure. It is a completed experiment whose
                instruments are now part of the landscape. A rover stuck in sand is not lost — its
                position is known to the metre. A telescope out of fuel is not derelict; it is in a
                safe orbit that will outlast everyone who built it.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p>
                That distinction is the reason this museum exists. For each object we ask four
                questions: what was it for, where is it now, why did it stop, and what is still being
                learned from it. The answers are often more interesting than the missions themselves.
              </p>
            </Reveal>
            <Reveal delay={0.19}>
              <p>
                Everything here is built on NASA and NSSDCA records. Where a fact is approximate, it
                is marked as approximate. Where a source disagrees with another source, both are
                cited. Nothing is dramatised into a disaster that did not happen.
              </p>
            </Reveal>
          </div>
          <Reveal className="stats">
            {HEADLINE_STATS.map((stat) => (
              <div className="stat" key={stat.label}>
                <span className="stat__value">
                  <CountUp value={stat.value} />
                </span>
                <span className="stat__label">{stat.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Ticker
        items={[
          "13 mission records",
          "6 destinations",
          "58 years of hardware",
          "1,319 marsquakes recorded",
          "1966 — present",
          "Built on NASA & NSSDCA records",
        ]}
      />

      <section className="chapters" aria-label="Destinations">
        {CHAPTERS.map((chapter) => (
          <article className={`chapter chapter--${chapter.key}`} key={chapter.key}>
            <div className="chapter__figure">
              <Parallax className="chapter__media" speed={40}>
                <img src={imageSrc(chapter.image)} alt={chapter.alt} loading="lazy" decoding="async" />
              </Parallax>
              <span className="chapter__kicker">{chapter.kicker}</span>
            </div>
            <div className="chapter__body">
              <Reveal>
                <span className="chapter__index">{chapter.index}</span>
                <h2 className="chapter__title">{chapter.title}</h2>
                <p className="chapter__text">{chapter.text}</p>
                <p className="chapter__note">{chapter.note}</p>
                <Link to={chapter.link} className="chapter__link">
                  {chapter.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </Reveal>
            </div>
          </article>
        ))}
      </section>

      <section className="taxonomy">
        <div className="wrap">
          <Reveal className="sectionHead" variant="mask">
            <p className="eyebrow">How to read this museum</p>
            <h2 className="sectionHead__title">
              Seven ways for a mission to end.
              <br />
              <span className="muted">Only one of them is “lost”.</span>
            </h2>
          </Reveal>
          <div className="taxonomy__grid">
            {(Object.keys(STATUS) as StatusKind[]).map((key, i) => (
              <Reveal key={key} delay={i * 0.04} className={`taxonomy__card taxonomy__card--${key}`}>
                <div className="taxonomy__top">
                  <StatusBadge status={key} />
                  <span className="taxonomy__count">{statusCounts[key] ?? 0}</span>
                </div>
                <p className="taxonomy__blurb">{STATUS[key].blurb}</p>
              </Reveal>
            ))}
            <Reveal delay={0.28} className="taxonomy__card taxonomy__card--ledger">
              <p className="eyebrow">The full ledger</p>
              <p className="taxonomy__blurb">
                Thirteen records, seven endings, six destinations. Every object is filed by how it
                stopped — and by what is still running.
              </p>
              <Link to="/archive" className="linkish taxonomy__link">
                Open the archive →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="railSection">
        <div className="wrap">
          <Reveal className="sectionHead sectionHead--split" variant="mask">
            <div>
              <p className="eyebrow">Selected objects</p>
              <h2 className="sectionHead__title">Six things still out there</h2>
            </div>
            <Link to="/archive" className="linkish">
              All {MISSIONS.length} records →
            </Link>
          </Reveal>
        </div>
        <div className="rail">
          <div className="rail__track">
            {FEATURED.map((id) => {
              const mission = getMission(id);
              if (!mission) return null;
              return (
                <Link to={`/missions/${mission.id}`} className="rail__item" key={id}>
                  <div className="rail__img">
                    <img src={imageSrc(mission.heroImage)} alt={mission.heroAlt} loading="lazy" decoding="async" />
                  </div>
                  <div className="rail__meta">
                    <span className="rail__num">{mission.number}</span>
                    <StatusBadge status={mission.status} short />
                  </div>
                  <h3 className="rail__title">{mission.title}</h3>
                  <p className="rail__sub">{mission.subtitle}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="closing__bg" aria-hidden="true">
          <Parallax className="closing__parallax" speed={36}>
            <img src={imageSrc("orion-earthset")} alt="" loading="lazy" decoding="async" />
          </Parallax>
        </div>
        <div className="wrap closing__inner">
          <Reveal variant="mask">
            <p className="eyebrow eyebrow--gold">Epilogue</p>
            <h2 className="closing__title">
              They are not lost.
              <br />
              They are exactly where we left them.
            </h2>
            <p className="closing__text">
              Six descent stages on the Moon. Nine missions on Mars. Aeons on Eros; a circling
              spacecraft at Ceres; two plaques heading out of the Solar System. The museum is open.
            </p>
            <div className="closing__cta">
              <Link to="/archive" className="btn btn--gold">
                Browse the collection
              </Link>
              <Link to="/legacy" className="btn btn--line">
                What they left behind
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="destinations">
        <div className="wrap">
          <div className="destinations__grid">
            {DESTINATIONS.map((d) => (
              <Reveal key={d.key} className="destinations__card">
                <p className="eyebrow">{d.kicker}</p>
                <h3>{d.label}</h3>
                <p>{d.blurb}</p>
                <Link to={d.key === "beyond" ? "/archive?dest=beyond" : `/${d.key}`} className="linkish">
                  Open →
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="plate">
        <div className="wrap">
          <ImageFrame
            imageKey="pioneer-plaque"
            alt="The Pioneer plaque, carried by Pioneer 10 and Pioneer 11"
            caption="The plaque carried by Pioneer 10 and 11: a diagram of where we are, and who we were when we sent it."
            className="frame--wide"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
