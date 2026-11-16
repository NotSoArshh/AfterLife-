import { getMission } from "./missions";
import type { HardwareItem, Mission } from "./types";

export type ModelKind =
  | "lander"
  | "rover"
  | "helicopter"
  | "telescope"
  | "probe"
  | "instrument"
  | "plaque";

export interface ModelPart {
  id: string;
  label: string;
  /** what this specific part did — structural, not a new factual claim */
  note: string;
}

export interface HardwareModel {
  id: string;
  kind: ModelKind;
  variant?: string;
  title: string;
  missionId: string;
  /** the exact hardware record this model represents, for role/now text */
  hardwareName: string;
  parts: ModelPart[];
}

/**
 * Nine objects the collection can be explored as. The prose in the panel comes
 * from the mission record itself (role / now), so the explorer cannot drift
 * from the verified text; the part notes describe the geometry on screen.
 */
export const HARDWARE_MODELS: HardwareModel[] = [
  {
    id: "lunar-module",
    kind: "lander",
    variant: "lm",
    title: "Lunar Module",
    missionId: "apollo-lunar-modules",
    hardwareName: "Descent stage",
    parts: [
      { id: "body", label: "Descent stage", note: "The octagonal platform that held propellant, equipment bays and the main engine." },
      { id: "engine", label: "Descent engine", note: "The throttleable engine that slowed the cabin to a landing." },
      { id: "legs", label: "Landing gear", note: "Four legs with footpads, sized to take the landing load." },
      { id: "cabin", label: "Ascent stage", note: "Crew cabin and the engine that returned the crew to lunar orbit." },
      { id: "antenna", label: "Antennas", note: "Voice and telemetry links back to Earth." },
    ],
  },
  {
    id: "lunar-rover",
    kind: "rover",
    variant: "lrv",
    title: "Lunar Roving Vehicle",
    missionId: "lunar-roving-vehicles",
    hardwareName: "Wire-mesh wheels",
    parts: [
      { id: "chassis", label: "Chassis", note: "Aluminium frame that folded into a 1.5 m wedge for the journey." },
      { id: "wheels", label: "Wire-mesh wheels", note: "Woven metal wheels with titanium treads — flexible, so no pneumatic tyre." },
      { id: "seats", label: "Seats and controls", note: "Two seats, with the controls between them." },
      { id: "mast", label: "Mast and antenna", note: "Carried the antenna used to relay television to Earth." },
      { id: "fenders", label: "Fenders", note: "Dust guards over the wheels." },
    ],
  },
  {
    id: "viking-lander",
    kind: "lander",
    variant: "viking",
    title: "Viking lander",
    missionId: "viking",
    hardwareName: "Lander body and legs",
    parts: [
      { id: "body", label: "Lander bus", note: "The platform that carried a biological laboratory, cameras and a sampling arm." },
      { id: "legs", label: "Three legs", note: "Three-legged stance for a stable landing." },
      { id: "engine", label: "Retro-rockets", note: "Used during descent to slow the lander." },
      { id: "cabin", label: "Instrument deck", note: "Held the experiments and the sample-processing inlet." },
      { id: "antenna", label: "Antennas", note: "Returned data directly to Earth." },
    ],
  },
  {
    id: "ingenuity",
    kind: "helicopter",
    title: "Ingenuity",
    missionId: "ingenuity",
    hardwareName: "Counter-rotating rotors",
    parts: [
      { id: "fuselage", label: "Fuselage", note: "Held the avionics, heaters and batteries that had to survive Martian nights." },
      { id: "rotors", label: "Rotor system", note: "Two counter-rotating rotors, four blades each, at roughly 2,400–2,900 rpm." },
      { id: "legs", label: "Landing legs", note: "Four thin legs, with the solar array between them." },
      { id: "solar", label: "Solar array", note: "Charged the batteries each sol to run the heaters overnight." },
      { id: "camera", label: "Navigation camera", note: "Pointed down and forward to track the ground during flight." },
    ],
  },
  {
    id: "spirit-rover",
    kind: "rover",
    variant: "six",
    title: "Spirit & Opportunity",
    missionId: "spirit-opportunity",
    hardwareName: "Rocker-bogie mobility system",
    parts: [
      { id: "chassis", label: "Rocker-bogie", note: "Suspension that let each rover climb over 30-degree slopes." },
      { id: "wheels", label: "Six wheels", note: "Each wheel driven, with cleats for loose soil." },
      { id: "seats", label: "Instrument deck", note: "Solar arrays and instruments sat on the flat deck." },
      { id: "mast", label: "Camera mast", note: "Raised the panoramic and navigation cameras above the deck." },
      { id: "fenders", label: "Instrument arm", note: "An arm for placing spectrometers against rocks." },
    ],
  },
  {
    id: "kepler",
    kind: "telescope",
    title: "Kepler",
    missionId: "kepler",
    hardwareName: "Photometer",
    parts: [
      { id: "barrel", label: "Photometer", note: "A 0.95 m Schmidt telescope feeding the largest camera flown in deep space at the time." },
      { id: "aperture", label: "Aperture", note: "Light entered here and fell on the detector array." },
      { id: "arrays", label: "Solar array", note: "Powered the spacecraft in its Earth-trailing orbit." },
      { id: "wheels", label: "Reaction wheels", note: "Held the pointing steady; two of them failed." },
    ],
  },
  {
    id: "near",
    kind: "probe",
    title: "NEAR Shoemaker",
    missionId: "near-shoemaker",
    hardwareName: "Solar panels",
    parts: [
      { id: "bus", label: "Spacecraft bus", note: "Octagonal body carrying the instruments, thrusters and propellant." },
      { id: "arrays", label: "Solar panels", note: "Four panels, the mission's power source all the way to Eros." },
      { id: "dish", label: "High-gain antenna", note: "The main link back to Earth." },
      { id: "thrusters", label: "Thrusters", note: "Attitude control; the last of the fuel was spent slowing the descent to the surface." },
    ],
  },
  {
    id: "alsep-lrrr",
    kind: "instrument",
    title: "Laser Ranging Retroreflector",
    missionId: "alsep",
    hardwareName: "Laser Ranging Retroreflector",
    parts: [
      { id: "array", label: "Array", note: "Set up by the crew and aimed at Earth." },
      { id: "cubes", label: "Corner cubes", note: "Each cube returns a laser pulse straight back the way it came." },
      { id: "mount", label: "Mount", note: "Holds the array at the angle needed for ranging." },
      { id: "cable", label: "Cable run", note: "Connected the ALSEP instruments to their central station." },
    ],
  },
  {
    id: "pioneer-plaque",
    kind: "plaque",
    title: "Pioneer plaque",
    missionId: "pioneer",
    hardwareName: "Plaque",
    parts: [
      { id: "plate", label: "Plate", note: "A gold-anodised aluminium plate." },
      { id: "engraving", label: "Engraving", note: "Shows where the spacecraft came from, and who sent it." },
      { id: "mount", label: "Mount", note: "Fixed to the spacecraft, facing outward." },
    ],
  },
];

export interface ResolvedModel {
  model: HardwareModel;
  mission: Mission | undefined;
  hardware: HardwareItem | undefined;
}

export const resolveModel = (model: HardwareModel): ResolvedModel => {
  const mission = getMission(model.missionId);
  return {
    model,
    mission,
    hardware: mission?.hardware.find((h) => h.name === model.hardwareName),
  };
};
