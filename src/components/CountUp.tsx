import { useEffect, useRef, useState } from "react";

const DURATION = 1400;

/**
 * Counts a numeric figure up when it scrolls into view. Non-numeric values are
 * rendered untouched, reduced-motion users see the final figure immediately,
 * and a timer guarantees the exact figure even if animation frames are
 * throttled (background tabs, low-power modes).
 *
 * Observation is a plain scroll check rather than an IntersectionObserver: IO
 * only reports threshold crossings, so a jump that skips the viewport entirely
 * can leave a figure at zero forever. A rect read per scroll event cannot.
 */
const CountUp = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const numeric = /^[\d,]+$/.test(value);
  const target = numeric ? Number(value.replace(/,/g, "")) : 0;
  const [shown, setShown] = useState(numeric ? 0 : target);

  useEffect(() => {
    const el = ref.current;
    if (!el || !numeric) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }

    let frame = 0;
    let settle = 0;
    let done = false;

    const start = () => {
      if (done) return;
      done = true;
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);

      // Jumped clean past it: show the figure rather than animating offscreen.
      if (el.getBoundingClientRect().bottom < 0) {
        setShown(target);
        return;
      }

      const began = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - began) / DURATION);
        setShown(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      settle = window.setTimeout(() => setShown(target), DURATION + 250);
    };

    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.88) start();
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      if (frame) cancelAnimationFrame(frame);
      if (settle) window.clearTimeout(settle);
    };
  }, [numeric, target]);

  if (!numeric) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{shown.toLocaleString("en-US")}</span>;
};

export default CountUp;
