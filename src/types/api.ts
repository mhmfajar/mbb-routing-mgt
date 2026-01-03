// API Response types

// EBR to Gateway API types
export type TransitEntry = {
  transit: string;
  baseline: string;
  latency: string;
};

export type TerritoryGroup = {
  [territoryId: string]: TransitEntry[];
};

export type EBRTOGateways = {
  BDS: TerritoryGroup;
  BTC: TerritoryGroup;
  PNK: TerritoryGroup;
};

export type EBRTOGatewaysResponse = {
  status: number;
  data: EBRTOGateways;
};

// EBR to GW Response types (with status field)
export type EbrToGwTransitEntry = {
  transit: string;
  baseline: string;
  latency: string;
  status: string;
};

export type EbrToGwTerritoryGroup = {
  [territoryId: string]: EbrToGwTransitEntry[];
};

export type EbrToGwData = {
  BDS: EbrToGwTerritoryGroup;
  BTC: EbrToGwTerritoryGroup;
  PNK: EbrToGwTerritoryGroup;
};

export type EbrToGwResponse = {
  status: number;
  data: EbrToGwData;
};

// Verifier/Gateway types
export type VerifierStatus = "clear" | "not clear";

export interface VerifierEntry {
  verifierid: string;
  hostname: string;
  latency: number;
  treshold: number;
  status: VerifierStatus;
}

export interface CtiGatewayMessage {
  BTC: VerifierEntry[];
  BDS: VerifierEntry[];
  PNK: VerifierEntry[];
  JT2: VerifierEntry[];
}

export interface CtiGatewayResponse {
  status: boolean;
  message: CtiGatewayMessage;
  nation_wide: {
    degrade: number;
    maintain: number;
    improev: number;
  };
  total_teritory: {
    teritory_1: string;
    teritory_2: string;
    teritory_3: string;
    teritory_4: string;
  };
}

// Trend EBR to GW types
export type DataSeries = {
  name: string;
  data: number[];
  type: string;
};

export type DataPerRegion = DataSeries[];

export interface DataContent {
  subtitle: string;
  [region: string]: DataPerRegion | string | string[];
  range_week: string[];
  range_date: string;
}

export interface TrendEbrToGwResponse {
  status: boolean;
  data: DataContent;
}

// Filter Route API types
export interface PathSegment {
  from: string;
  to: string;
  value: string;
}

export interface InformationEntry {
  latency_ebr_gw: number;
  status_symmetric: string;
}

export interface UplinkEntry {
  region: string;
  tera: string;
  target: string;
  date_: string;
  hour_: number;
  ebr: string;
  latency_ebr: number;
  transit: string;
  path: string;
  type: string;
  paths: PathSegment[];
  information: InformationEntry;
}

export interface DownlinkEntry {
  region: string;
  tera: string;
  ip_address: string;
  target: string;
  date_: string;
  hour_: number;
  ebr: string;
  latency: number;
  transit: string;
  path: string;
  type: string;
  paths: PathSegment[];
}

export interface GroupedRouteEntry {
  uplink: UplinkEntry | null;
  downlink: DownlinkEntry | null;
  information: InformationEntry | null;
}

export interface FilterRouteApiData {
  uplink: UplinkEntry[];
  downlink: DownlinkEntry[];
}

export interface FilterRouteResponse {
  status: boolean;
  data: FilterRouteApiData;
}
