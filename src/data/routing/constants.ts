import type { EbrConnection } from "~/utils/geo";

export const TERRITORY_NAMES = [
  "Territory 1",
  "Territory 2",
  "Territory 3",
  "Territory 4",
];

export const EBR_CONNECTIONS_SOURCE_ID = "ebr-connections";
export const EBR_CONNECTIONS_LAYER_ID = "ebr-connections-line";

export const EBR_CONNECTIONS: EbrConnection[] = [
  { from: "MDC", to: "PUB", bulge: "north", bowFactor: 1.2, segments: 256 },
];

export interface Territory {
  id: number;
  name: string;
  region: string;
  center: { lng: number; lat: number };
  zoom: number;
  ebrCount: number;
  linkToGw: number;
  color: string;
}

export const TERRITORIES: Territory[] = [
  {
    id: 1,
    name: "Territory 1",
    region: "Sumatra",
    center: { lng: 101.5, lat: 0.5 },
    zoom: 5.5,
    ebrCount: 18,
    linkToGw: 72,
    color: "#f5c842",
  },
  {
    id: 2,
    name: "Territory 2",
    region: "Banten - Jawa Tengah",
    center: { lng: 107.5, lat: -6.8 },
    zoom: 7,
    ebrCount: 22,
    linkToGw: 88,
    color: "#f97316",
  },
  {
    id: 3,
    name: "Territory 3",
    region: "Jawa Timur - NTT",
    center: { lng: 115, lat: -8.2 },
    zoom: 6,
    ebrCount: 28,
    linkToGw: 122,
    color: "#a855f7",
  },
  {
    id: 4,
    name: "Territory 4",
    region: "Kalimantan - Papua",
    center: { lng: 125, lat: -2 },
    zoom: 4.5,
    ebrCount: 20,
    linkToGw: 80,
    color: "#00838f",
  },
];

export const MAP_STYLE_URL =
  "mapbox://styles/mhmfajar/cmj9bkmus002m01sa35ty1178";
