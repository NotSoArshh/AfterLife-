import type { DestinationKey, Mission, StatusKind } from "../types";
import { MOON_MISSIONS } from "./moon";
import { MARS_MISSIONS } from "./mars";
import { BEYOND_MISSIONS } from "./beyond";

export const MISSIONS: Mission[] = [...MOON_MISSIONS, ...MARS_MISSIONS, ...BEYOND_MISSIONS];

export const getMission = (id: string | undefined): Mission | undefined =>
  MISSIONS.find((m) => m.id === id);

export const missionsByDestination = (destination: DestinationKey) =>
  MISSIONS.filter((m) => m.destination === destination);

export const countByStatus = (): Record<StatusKind, number> =>
  MISSIONS.reduce(
    (acc, m) => {
      acc[m.status] = (acc[m.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<StatusKind, number>
  );

/** Every distinct hardware type across the collection, for the archive filters. */
export const MISSION_TYPES = Array.from(new Set(MISSIONS.flatMap((m) => m.type))).sort();

export const neighbours = (id: string) => {
  const i = MISSIONS.findIndex((m) => m.id === id);
  return {
    prev: i > 0 ? MISSIONS[i - 1] : MISSIONS[MISSIONS.length - 1],
    next: i >= 0 ? MISSIONS[(i + 1) % MISSIONS.length] : MISSIONS[0],
  };
};
