import type { EbrConnectionFeature, EbrConnectionProperties } from "~/types";

export interface CurveOptions {
  segments?: number;
  bowFactor?: number;
  bulge?: "north" | "south" | "auto";
}

/**
 * Generate a curved line between two points using quadratic Bezier curve
 */
export function curveBetweenPoints(
  from: [number, number],
  to: [number, number],
  options?: CurveOptions
): Array<[number, number]> {
  const clampedSegments = Math.max(64, Math.floor(options?.segments ?? 256));
  const bowFactor = options?.bowFactor ?? 1.2;
  const bulge = options?.bulge ?? "north";
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const distance = Math.hypot(dx, dy);

  if (!Number.isFinite(distance) || distance === 0) return [from, to];

  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2;

  const perpX = -dy / distance;
  const perpY = dx / distance;

  const bow = distance * bowFactor;
  const controlA: [number, number] = [midX + perpX * bow, midY + perpY * bow];
  const controlB: [number, number] = [midX - perpX * bow, midY - perpY * bow];

  const control: [number, number] =
    bulge === "auto"
      ? controlA
      : bulge === "north"
      ? controlA[1] >= controlB[1]
        ? controlA
        : controlB
      : controlA[1] <= controlB[1]
      ? controlA
      : controlB;

  const coordinates: Array<[number, number]> = [];
  for (let i = 0; i <= clampedSegments; i++) {
    const t = i / clampedSegments;
    const oneMinusT = 1 - t;
    const x =
      oneMinusT * oneMinusT * from[0] +
      2 * oneMinusT * t * control[0] +
      t * t * to[0];
    const y =
      oneMinusT * oneMinusT * from[1] +
      2 * oneMinusT * t * control[1] +
      t * t * to[1];

    coordinates.push([x, y]);
  }

  return coordinates;
}

export interface EbrConnection {
  from: string;
  to: string;
  bulge?: "north" | "south" | "auto";
  bowFactor?: number;
  segments?: number;
}

export interface EbrLocation {
  pe_code: string;
  lon: number;
  lat: number;
}

/**
 * Build GeoJSON FeatureCollection for EBR connections
 */
export function buildEbrConnectionsGeoJson(
  connections: EbrConnection[],
  locations: EbrLocation[]
): GeoJSON.FeatureCollection<GeoJSON.LineString, EbrConnectionProperties> {
  const features: EbrConnectionFeature[] = [];

  for (const conn of connections) {
    const { from, to } = conn;
    const fromLocation = locations.find((l) => l.pe_code === from);
    const toLocation = locations.find((l) => l.pe_code === to);
    if (!fromLocation || !toLocation) continue;

    const coordinates = curveBetweenPoints(
      [fromLocation.lon, fromLocation.lat],
      [toLocation.lon, toLocation.lat],
      {
        segments: conn.segments ?? 256,
        bowFactor: conn.bowFactor ?? 1.2,
        bulge: conn.bulge ?? "north",
      }
    );

    features.push({
      type: "Feature",
      properties: { from, to },
      geometry: { type: "LineString", coordinates },
    });
  }

  return {
    type: "FeatureCollection",
    features,
  };
}
