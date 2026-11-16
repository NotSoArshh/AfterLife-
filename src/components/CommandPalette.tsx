import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HARDWARE_MODELS } from "../data/hardwareModels";
import { MISSIONS } from "../data/missions";

type Kind = "Page" | "Mission" | "Object" | "Model";

interface Entry {
  id: string;
  kind: Kind;
  title: string;
  sub: string;
  to: string;
  words: string;
}

const PAGES: Entry[] = [
  { id: "page-archive", kind: "Page", title: "Archive", sub: "Every mission in the collection", to: "/archive", words: "archive all missions collection" },
  { id: "page-timeline", kind: "Page", title: "Timeline", sub: "1969 to the present", to: "/timeline", words: "timeline years chronology" },
  { id: "page-moon", kind: "Page", title: "The Moon", sub: "Sites across the nearside", to: "/moon", words: "moon lunar apollo" },
  { id: "page-mars", kind: "Page", title: "Mars", sub: "Landers and rovers", to: "/mars", words: "mars red planet" },
  { id: "page-hardware", kind: "Page", title: "Hardware", sub: "The written catalogue", to: "/hardware", words: "hardware catalogue parts" },
  { id: "page-hangar", kind: "Page", title: "Hangar", sub: "Nine objects in three dimensions", to: "/hangar", words: "hangar 3d models explore" },
  { id: "page-legacy", kind: "Page", title: "Legacy", sub: "What the objects leave behind", to: "/legacy", words: "legacy meaning future" },
  { id: "page-sources", kind: "Page", title: "Sources", sub: "Where every record comes from", to: "/sources", words: "sources references citations" },
];

const INDEX: Entry[] = [
  ...PAGES,
  ...MISSIONS.map((m) => ({
    id: `mission-${m.id}`,
    kind: "Mission" as Kind,
    title: m.title,
    sub: `${m.destinationLabel} · ${m.status.replace(/-/g, " ")}`,
    to: `/missions/${m.id}`,
    words: [
      m.title,
      m.subtitle,
      m.destinationLabel,
      m.launched,
      m.ended,
      m.location,
      m.agency,
      m.type.join(" "),
      m.tagline,
    ].join(" "),
  })),
  ...MISSIONS.flatMap((m) =>
    m.hardware.map((h) => ({
      id: `object-${m.id}-${h.name}`,
      kind: "Object" as Kind,
      title: h.name,
      sub: m.title,
      to: `/missions/${m.id}`,
      words: `${h.name} ${h.role} ${h.now} ${m.title} ${m.destinationLabel} ${m.location}`,
    })),
  ),
  ...HARDWARE_MODELS.map((m) => ({
    id: `model-${m.id}`,
    kind: "Model" as Kind,
    title: m.title,
    sub: `3D model · ${m.parts.length} parts`,
    to: `/hangar?object=${m.id}`,
    words: `${m.title} ${m.parts.map((p) => `${p.label} ${p.note}`).join(" ")} 3d model hangar`,
  })),
];

const rank = (entry: Entry, needle: string) => {
  const title = entry.title.toLowerCase();
  if (title === needle) return 0;
  if (title.startsWith(needle)) return 1;
  if (title.includes(needle)) return 2;
  return 3;
};

const SEARCH_EVENT = "afterlife:search";

/** Opens the finder from anywhere without wiring state through Layout. */
export const openSearch = () => window.dispatchEvent(new Event(SEARCH_EVENT));

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return INDEX.filter((entry) => entry.kind === "Page" || entry.kind === "Model");
    const terms = needle.split(/\s+/);
    return INDEX.filter((entry) => terms.every((t) => entry.words.toLowerCase().includes(t)))
      .sort((a, b) => rank(a, needle) - rank(b, needle))
      .slice(0, 40);
  }, [q]);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setCursor(0);
    restoreRef.current?.focus?.({ preventScroll: true });
  }, []);

  const jump = useCallback(
    (to: string) => {
      setOpen(false);
      setQ("");
      setCursor(0);
      navigate(to);
    },
    [navigate],
  );

  // Global shortcuts: ⌘K / Ctrl-K anywhere, "/" when not already typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName) || e.target.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => {
          if (!v) {
            setQ("");
            setCursor(0);
          }
          return !v;
        });
        return;
      }
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => {
      setQ("");
      setCursor(0);
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(SEARCH_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(SEARCH_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="finder"
      role="dialog"
      aria-modal="true"
      aria-label="Search the museum"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="finder__panel">
        <div className="finder__field">
          <span className="finder__glass" aria-hidden="true">
            ⌕
          </span>
          <input
            ref={inputRef}
            className="finder__input"
            value={q}
            placeholder="Search missions, objects, models…"
            role="combobox"
            aria-controls="finder-list"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-activedescendant={results[cursor] ? `finder-${results[cursor].id}` : undefined}
            onChange={(e) => {
              setQ(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                if (!results.length) return;
                const dir = e.key === "ArrowDown" ? 1 : -1;
                setCursor((c) => (c + dir + results.length) % results.length);
              } else if (e.key === "Enter") {
                e.preventDefault();
                const hit = results[cursor] ?? results[0];
                if (hit) jump(hit.to);
              } else if (e.key === "Escape") {
                e.preventDefault();
                close();
              }
            }}
          />
          <kbd className="finder__kbd">esc</kbd>
        </div>

        {results.length === 0 ? (
          <p className="finder__empty">
            Nothing matches “{q}”. Try an object — <em>Viking</em>, <em>wheels</em>, <em>Kepler</em>.
          </p>
        ) : (
          <ul className="finder__list" id="finder-list" role="listbox" aria-label="Results">
            {results.map((entry, i) => (
              <li key={entry.id} role="presentation">
                <button
                  type="button"
                  id={`finder-${entry.id}`}
                  role="option"
                  aria-selected={i === cursor}
                  className={`finder__row${i === cursor ? " is-on" : ""}`}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => jump(entry.to)}
                >
                  <span className="finder__kind">{entry.kind}</span>
                  <span className="finder__title">{entry.title}</span>
                  <span className="finder__sub">{entry.sub}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="finder__foot">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>
            {MISSIONS.length} missions · {MISSIONS.reduce((n, m) => n + m.hardware.length, 0)} objects ·{" "}
            {HARDWARE_MODELS.length} models
          </span>
        </p>
      </div>
    </div>
  );
};

export default CommandPalette;
