import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxProps {
  children: ReactNode;
  /** travel in px across the full pass (positive rises as you scroll down) */
  speed?: number;
  className?: string;
}

/**
 * Scroll-linked parallax built on ScrollTrigger, matching the hero scrubs.
 * The outer element keeps the layout box; callers give it overscan so the
 * moving layer never exposes an edge.
 */
const Parallax = ({ children, speed = 40, className }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const inner = el.firstElementChild as HTMLElement | null;
    if (!inner) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { y: speed },
        {
          y: -speed,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      <div className="parallax__inner">{children}</div>
    </div>
  );
};

export default Parallax;
