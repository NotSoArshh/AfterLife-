import { useState } from "react";
import { creditLine, creditUrl, FALLBACK_IMAGE, imageAlt, imageMeta, imageSrc } from "../data/images";

interface ImageFrameProps {
  imageKey: string;
  alt: string;
  className?: string;
  /** short caption shown beneath the image */
  caption?: string;
  showCredit?: boolean;
  eager?: boolean;
  /** decorative images are hidden from assistive tech */
  decorative?: boolean;
}

const ImageFrame = ({
  imageKey,
  alt,
  className = "",
  caption,
  showCredit = true,
  eager = false,
  decorative = false,
}: ImageFrameProps) => {
  const [failed, setFailed] = useState(false);
  const meta = imageMeta(imageKey);
  const src = failed ? FALLBACK_IMAGE : imageSrc(imageKey);
  const label = failed ? "Moon, photographed from orbit (NASA)" : imageAlt(imageKey, alt);
  const credit = creditLine(failed ? "moon-full" : imageKey);
  const link = creditUrl(failed ? "moon-full" : imageKey);

  return (
    <figure className={`frame ${className}`.trim()}>
      <div className="frame__media">
        <img
          src={src}
          alt={decorative ? "" : alt || label}
          aria-hidden={decorative || undefined}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      </div>
      {(caption || showCredit) && (
        <figcaption className="frame__cap">
          {caption && <span className="frame__captionText">{caption}</span>}
          {showCredit && (
            <span className="frame__credit">
              {link ? (
                <a href={link} target="_blank" rel="noreferrer">
                  {credit}
                </a>
              ) : (
                credit
              )}
              {meta?.nasaId && <span className="frame__id"> · {meta.nasaId}</span>}
              {failed && <span className="frame__id"> · image unavailable, placeholder shown</span>}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageFrame;
