export type DestinationKey = "moon" | "mars" | "beyond";

export type StatusKind =
  | "left-in-place"
  | "silent"
  | "retired"
  | "in-orbit"
  | "at-rest"
  | "interstellar"
  | "still-working";

export interface StatusDef {
  key: StatusKind;
  label: string;
  short: string;
  blurb: string;
  /** true when the objects are, or contain, something still operating */
  active?: boolean;
}

export const STATUS: Record<StatusKind, StatusDef> = {
  "left-in-place": {
    key: "left-in-place",
    label: "Left in place",
    short: "On a surface",
    blurb:
      "Hardware set down by design and never meant to return. Its mission ended because the crew or the rover moved on, not because anything failed.",
  },
  silent: {
    key: "silent",
    label: "Silent",
    short: "No contact",
    blurb:
      "The mission ended when communication stopped — from dust, cold, a dead battery, or a cause engineers never fully established.",
  },
  retired: {
    key: "retired",
    label: "Retired",
    short: "Mission closed",
    blurb:
      "Deliberately concluded: the power ran out, the fuel ran out, the hardware broke, or the money did. The object itself is still where the mission left it.",
  },
  "in-orbit": {
    key: "in-orbit",
    label: "In orbit",
    short: "Still circling",
    blurb:
      "The spacecraft can no longer be controlled, but it is still travelling — circling a dwarf planet, the Sun, or the galaxy beyond.",
  },
  "at-rest": {
    key: "at-rest",
    label: "At rest",
    short: "On a surface",
    blurb:
      "A controlled or semi-controlled arrival on a body it was only ever meant to orbit. The first of its kind, and still there.",
  },
  interstellar: {
    key: "interstellar",
    label: "Outbound",
    short: "Leaving the Sun",
    blurb:
      "Travelling fast enough to escape the Solar System entirely, with no power left to call home.",
  },
  "still-working": {
    key: "still-working",
    label: "Still working",
    short: "In service",
    blurb:
      "Parts of the hardware are still answering today. Some instruments need no power at all — only someone on Earth with a laser.",
    active: true,
  },
};

export interface Milestone {
  date: string;
  label: string;
  detail?: string;
}

export interface HardwareItem {
  name: string;
  role: string;
  /** present location or condition of this specific part */
  now: string;
  active?: boolean;
}

export interface Coordinates {
  lat: number;
  lon: number;
  label: string;
  approximate?: boolean;
  body: "Moon" | "Mars";
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface Mission {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  destination: DestinationKey;
  destinationLabel: string;
  type: string[];
  agency: string;
  launched: string;
  ended: string;
  status: StatusKind;
  /** one-line fate, shown under the status badge */
  fate: string;
  location: string;
  coordinates?: Coordinates;
  heroImage: string;
  heroAlt: string;
  gallery: string[];
  tagline: string;
  summary: string;
  body: string[];
  facts: { label: string; value: string }[];
  milestones: Milestone[];
  hardware: HardwareItem[];
  achievements: string[];
  finalCondition: string;
  sources: SourceLink[];
}

export const DESTINATIONS: {
  key: DestinationKey;
  label: string;
  kicker: string;
  blurb: string;
}[] = [
  {
    key: "moon",
    label: "The Moon",
    kicker: "384,400 km away",
    blurb:
      "Six crews landed. Everything they could not carry home is still up there — descent stages, three rovers, and instruments that were switched off in 1977.",
  },
  {
    key: "mars",
    label: "Mars",
    kicker: "225 million km away",
    blurb:
      "A scrapyard of ambition across two hemispheres: landers that went quiet, rovers that outlived their warranties by years, and a helicopter that broke a rotor on its last hop.",
  },
  {
    key: "beyond",
    label: "Deep space",
    kicker: "Past the asteroid belt",
    blurb:
      "Spacecraft that finished their science and kept going: orbiting a dwarf planet, resting on an asteroid, or coasting out of the Solar System with no power left to speak.",
  },
];
