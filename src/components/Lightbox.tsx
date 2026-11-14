import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { creditLine, creditUrl, imageAlt, imageSrc } from "../data/images";

interface LightboxProps {
  images: { key: string; alt: string }[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const Lightbox = ({ images, index, onClose, onIndexChange }: LightboxProps) => {
  const open = index !== null;

  const step = useCallback(
    (dir: number) => {
      if (index === null) return;
      const next = (index + dir + images.length) % images.length;
      onIndexChange(next);
    },
    [index, images.length, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, step]);

  const current = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <button type="button" className="lightbox__close" onClick={onClose} aria-label="Close viewer">
            Close
          </button>
          <motion.figure
            className="lightbox__figure"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={imageSrc(current.key)} alt={imageAlt(current.key, current.alt) || current.alt} />
            <figcaption>
              <span>{imageAlt(current.key, current.alt)}</span>
              <a href={creditUrl(current.key)} target="_blank" rel="noreferrer">
                {creditLine(current.key)}
              </a>
            </figcaption>
          </motion.figure>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next image"
              >
                ›
              </button>
              <span className="lightbox__count">
                {index + 1} / {images.length}
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
