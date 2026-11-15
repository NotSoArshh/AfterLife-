import { useEffect, useRef } from "react";

const CARD_SELECTOR = ".taxonomy__card, .rail__item, .destinations__card, .frame";
const HUD_LABEL_MAX = 40;

const labelFor = (section: Element) => {
  const raw =
    section.querySelector(".eyebrow")?.textContent ||
    section.getAttribute("aria-label") ||
    "";
  const clean = raw.replace(/\s+/g, " ").trim();
  return clean.length > HUD_LABEL_MAX ? `${clean.slice(0, HUD_LABEL_MAX - 1)}…` : clean;
};

/**
 * Pointer and scroll instrumentation for the modern layer:
 *  - writes the pointer position to :root so the hero light can follow it
 *  - feeds a per-card spotlight position (--cx/--cy) on cards under the cursor
 *  - pulls .btn labels a few pixels toward the cursor
 *  - drives a small scroll readout (percentage plus the section in view)
 * All of it is skipped for reduced motion or coarse pointers, and every write
 * happens inside a single rAF so scrolling never thrashes layout.
 */
const ScrollFX = () => {
  const hudRef = useRef<HTMLDivElement>(null);
  const hudLabel = useRef<HTMLSpanElement>(null);
  const hudPct = useRef<HTMLSpanElement>(null);
  const hudFill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    const root = document.documentElement;
    let lastCard: HTMLElement | null = null;
    let lastBtn: HTMLElement | null = null;

    const onMove = (event: PointerEvent) => {
      root.style.setProperty("--mx", `${event.clientX}px`);
      root.style.setProperty("--my", `${event.clientY}px`);

      const target = event.target as HTMLElement | null;

      // Card spotlight. Clearing the previous card keeps stale highlights off.
      const card = target?.closest?.(CARD_SELECTOR) as HTMLElement | null;
      if (card !== lastCard) {
        lastCard?.style.removeProperty("--cx");
        lastCard?.style.removeProperty("--cy");
        lastCard = card;
      }
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--cx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--cy", `${event.clientY - rect.top}px`);
      }

      // Magnetic buttons: a small, bounded pull toward the cursor.
      const btn = target?.closest?.(".btn") as HTMLElement | null;
      if (btn !== lastBtn) {
        if (lastBtn) lastBtn.style.transform = "";
        lastBtn = btn;
      }
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) * 0.08;
        const dy = (event.clientY - (rect.top + rect.height / 2)) * 0.12;
        const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));
        btn.style.transform = `translate(${clamp(dx, 4).toFixed(2)}px, ${clamp(dy, 4).toFixed(2)}px)`;
      }
    };

    const onLeave = () => {
      if (lastBtn) lastBtn.style.transform = "";
      lastBtn = null;
      if (lastCard) {
        lastCard.style.removeProperty("--cx");
        lastCard.style.removeProperty("--cy");
        lastCard = null;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, []);

  useEffect(() => {
    const hud = hudRef.current;
    if (!hud) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const percent = Math.round(progress * 100);

      if (hudPct.current) hudPct.current.textContent = `${percent}%`;
      if (hudFill.current) hudFill.current.style.width = `${percent}%`;
      hud.classList.toggle("is-on", window.scrollY > 220);

      // The section whose top has passed the upper third owns the label.
      const sections = document.querySelectorAll("main section");
      let current: Element | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.38) current = section;
      }
      if (current && hudLabel.current) {
        const label = labelFor(current);
        if (label) hudLabel.current.textContent = label;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="hud" ref={hudRef} aria-hidden="true">
      <span className="hud__label" ref={hudLabel}>
        Cover
      </span>
      <span className="hud__bar">
        <span className="hud__fill" ref={hudFill} />
      </span>
      <span className="hud__pct" ref={hudPct}>
        0%
      </span>
    </div>
  );
};

export default ScrollFX;
