import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type RevealVariant = "rise" | "mask" | "zoom" | "fade";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "figure";
  /** mask wipes the block up from its own bottom edge, zoom settles an image */
  variant?: RevealVariant;
}

const Reveal = ({ children, delay = 0, y = 26, className, as = "div", variant = "rise" }: RevealProps) => {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  const hidden =
    reduce || variant === "fade"
      ? { opacity: 0 }
      : variant === "mask"
        ? { opacity: 0, y: 22, clipPath: "inset(0% 0% 100% 0%)" }
        : variant === "zoom"
          ? { opacity: 0, scale: 1.06 }
          : { opacity: 0, y };

  const visible =
    variant === "mask"
      ? { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }
      : variant === "zoom"
        ? { opacity: 1, scale: 1 }
        : { opacity: 1, y: 0 };

  return (
    <MotionTag
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, margin: "-12%" }}
      transition={{
        duration: reduce ? 0.25 : variant === "mask" ? 0.9 : 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
