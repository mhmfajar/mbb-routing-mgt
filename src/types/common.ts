// Common shared types used across the application

export interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
}

export type NodeType = "router" | "switch" | "cloud";

export type TabId = "cti-routing" | "routing-on-demand";
