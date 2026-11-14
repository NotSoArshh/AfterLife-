import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const KEY = "afterlife-intro-seen";

const Intro = () => {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.sessionStorage.getItem(KEY)) return false;
    return true;
  });

  useEffect(() => {
    if (!open) return;
    const close = () => {
      setOpen(false);
      window.sessionStorage.setItem(KEY, "1");
    };
    const timer = window.setTimeout(close, reduce ? 400 : 2100);
    window.addEventListener("keydown", close, { once: true });
    window.addEventListener("pointerdown", close, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", close);
      window.removeEventListener("pointerdown", close);
    };
  }, [open, reduce]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.9, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="intro__inner">
            <span className="intro__eyebrow">NASA Space Apps Challenge · 2026</span>
            <span className="intro__word">AFTERLIFE</span>
            <span className="intro__sub">The Forgotten Space Museum</span>
            <span className="intro__bar">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reduce ? 0.3 : 1.9, ease: "easeInOut" }}
              />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Intro;
