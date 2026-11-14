import { NASA_IMAGES } from "./nasaImages";
import type { NasaImageMeta } from "./nasaImages";

const assetPath = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const FALLBACK_IMAGE = assetPath("/img/moon-full.jpg");

export const imageMeta = (key: string | undefined): NasaImageMeta | undefined =>
  key ? NASA_IMAGES[key] : undefined;

export const imageSrc = (key: string | undefined): string =>
  assetPath(imageMeta(key)?.file ?? "/img/moon-full.jpg");

/** Human-readable alt text: the mission's own description when supplied, otherwise NASA's title. */
export const imageAlt = (key: string, fallback: string): string => {
  const meta = imageMeta(key);
  if (!meta) return fallback;
  return meta.title && meta.title !== meta.nasaId ? meta.title : fallback;
};

/** e.g. "NASA/JPL · 2004" — the credit line shown under each photograph. */
export const creditLine = (key: string | undefined): string => {
  const meta = imageMeta(key);
  if (!meta) return "NASA";
  const agency = meta.center ? (meta.center === "JPL" ? "NASA/JPL" : `NASA/${meta.center}`) : "NASA";
  const year = meta.date ? ` · ${meta.date.slice(0, 4)}` : "";
  const photographer = meta.photographer && meta.photographer !== "NASA" ? ` · ${meta.photographer}` : "";
  return `${agency}${photographer}${year}`;
};

export const creditUrl = (key: string | undefined): string | undefined => imageMeta(key)?.source;
