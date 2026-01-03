// Routing feature specific types

import type { DataSeries } from "./api";
import type { ViewState } from "./common";

// EBR Gateway data types for state
export interface EBRGatewayEntry {
    territory: string;
    bds: { ref: string; lat: string; status: string };
    btc: { ref: string; lat: string; status: string };
    pnk: { ref: string; lat: string; status: string };
}

export interface EBRGatewayChartData {
    regionName: string;
    data: Record<string, DataSeries>;
}

export interface EBRGatewayTerritoryData {
    name: string;
    entries: EBRGatewayEntry[];
    chart: EBRGatewayChartData[];
    subtitle: string;
}

// Map/GeoJSON types
export type EbrConnectionProperties = { from: string; to: string };

export type EbrConnectionFeature = GeoJSON.Feature<
    GeoJSON.LineString,
    EbrConnectionProperties
>;

// CTI Routing Content Props
export interface CTIRoutingContentProps {
    viewState: ViewState;
    setViewState: (v: ViewState) => void;
}
