// Filter Options Data
export const regionOptions = [
    { value: "01-Sumbagut", label: "01-Sumbagut" },
    { value: "02-Sumbagsel", label: "02-Sumbagsel" },
    { value: "03-Jabodetabek", label: "03-Jabodetabek" },
    { value: "04-Jateng", label: "04-Jateng" },
];

export const ebrOptions = [
    { value: "AHZ.1", label: "AHZ.1" },
    { value: "AHZ.2", label: "AHZ.2" },
    { value: "BTC.1", label: "BTC.1" },
];

export const gatewayOptions = [
    { value: "BTC", label: "BTC" },
    { value: "BDS", label: "BDS" },
    { value: "JKT", label: "JKT" },
];

export const dateOptions = [
    { value: "1-5 December 2025", label: "1-5 December 2025" },
    { value: "6-10 December 2025", label: "6-10 December 2025" },
];

// Routing Table Data
export interface RoutingRow {
    key: string;
    no: number;
    ebr: string;
    peEbrTransit: string;
    path: string;
    p: string;
    uplink: { ebr: string; pe: string; p: string; cloud: string };
    downlink: { igw: string; cloud: string; p: string; pe: string };
    total: number;
    status: string;
}

export const routingTableData: RoutingRow[] = [
    {
        key: "1",
        no: 1,
        ebr: "JKT-EBR-1",
        peEbrTransit: "PE-01-METRANJKT",
        path: "PE 01 MTA via JKT 01 via CDN via YGY via SBY...",
        p: "P1",
        uplink: { ebr: "1", pe: "1", p: "1", cloud: "12" },
        downlink: { igw: "1", cloud: "1", p: "1", pe: "1" },
        total: 18,
        status: "Symmetric",
    },
    {
        key: "2",
        no: 2,
        ebr: "JKT-EBR-2",
        peEbrTransit: "PE-02-METRANJKT",
        path: "PE 02 MTA via JKT 02 via CDN via YGY via SBY...",
        p: "P1",
        uplink: { ebr: "1", pe: "1", p: "1", cloud: "12" },
        downlink: { igw: "1", cloud: "1", p: "1", pe: "1" },
        total: 18,
        status: "Symmetric",
    },
    {
        key: "3",
        no: 3,
        ebr: "JKT-EBR-3",
        peEbrTransit: "PE-03-METRANJKT",
        path: "PE 03 MTA via JKT 03 via CDN via YGY via SBY...",
        p: "P2",
        uplink: { ebr: "1", pe: "2", p: "1", cloud: "15" },
        downlink: { igw: "2", cloud: "1", p: "1", pe: "1" },
        total: 24,
        status: "Asymmetric",
    },
];

// Table columns configuration
export const routingTableColumns = [
    { title: "No", dataIndex: "no", key: "no", width: 50 },
    { title: "EBR", dataIndex: "ebr", key: "ebr", width: 100 },
    { title: "PE EBR / Transit", dataIndex: "peEbrTransit", key: "peEbrTransit", width: 150 },
    { title: "Path", dataIndex: "path", key: "path", ellipsis: true },
    { title: "P", dataIndex: "p", key: "p", width: 50 },
    {
        title: "Uplink (ms)",
        children: [
            { title: "EBR", dataIndex: ["uplink", "ebr"], key: "ulEbr", width: 50 },
            { title: "PE", dataIndex: ["uplink", "pe"], key: "ulPe", width: 50 },
            { title: "P", dataIndex: ["uplink", "p"], key: "ulP", width: 50 },
            { title: "Cloud", dataIndex: ["uplink", "cloud"], key: "ulCloud", width: 60 },
        ],
    },
    {
        title: "Downlink (ms)",
        children: [
            { title: "IGW", dataIndex: ["downlink", "igw"], key: "dlIgw", width: 50 },
            { title: "Cloud", dataIndex: ["downlink", "cloud"], key: "dlCloud", width: 60 },
            { title: "P", dataIndex: ["downlink", "p"], key: "dlP", width: 50 },
            { title: "PE", dataIndex: ["downlink", "pe"], key: "dlPe", width: 50 },
        ],
    },
    { title: "Total", dataIndex: "total", key: "total", width: 60 },
];

// History Routing Data
export interface HistoryEntry {
    key: string;
    timestamp: string;
    date: string;
    totalLatency: number;
    status: "Normal" | "Degrade";
    path: string;
    changes: string;
}

export const historyRoutingData: HistoryEntry[] = [
    {
        key: "1",
        timestamp: "14:30:00",
        date: "14-12-2025",
        totalLatency: 31,
        status: "Normal",
        path: "EBR → PE TRANSIT → P1 → Cloud IPBB → IGW/DGW",
        changes: "No changes",
    },
    {
        key: "2",
        timestamp: "12:15:00",
        date: "14-12-2025",
        totalLatency: 45,
        status: "Degrade",
        path: "EBR → PE TRANSIT → P2 → Cloud IPBB → IGW/DGW",
        changes: "Path changed from P1 to P2, latency increased",
    },
    {
        key: "3",
        timestamp: "08:00:00",
        date: "14-12-2025",
        totalLatency: 28,
        status: "Normal",
        path: "EBR → PE TRANSIT → P1 → Cloud IPBB → IGW/DGW",
        changes: "Initial routing",
    },
    {
        key: "4",
        timestamp: "18:45:00",
        date: "13-12-2025",
        totalLatency: 52,
        status: "Degrade",
        path: "EBR → PE TRANSIT → P2 → Cloud IPBB → IGW/DGW",
        changes: "High latency detected on P2",
    },
    {
        key: "5",
        timestamp: "10:30:00",
        date: "13-12-2025",
        totalLatency: 30,
        status: "Normal",
        path: "EBR → PE TRANSIT → P1 → Cloud IPBB → IGW/DGW",
        changes: "Routing optimized",
    },
];

// Transport Bundle Data
export interface TransportBundle {
    id: string;
    name: string;
    type: string;
    capacity: string;
    utilization: number;
    status: "Active" | "Standby" | "Maintenance";
}

export interface TransportBundleDetail {
    ebrKey: string;
    bundles: TransportBundle[];
}

export const transportBundleData: TransportBundleDetail[] = [
    {
        ebrKey: "1",
        bundles: [
            { id: "TB-001", name: "METRO-JKT-01", type: "10GE", capacity: "10 Gbps", utilization: 65, status: "Active" },
            { id: "TB-002", name: "CORE-JKT-CDN", type: "100GE", capacity: "100 Gbps", utilization: 45, status: "Active" },
            { id: "TB-003", name: "BACKBONE-YGY", type: "100GE", capacity: "100 Gbps", utilization: 30, status: "Active" },
            { id: "TB-004", name: "BACKBONE-SBY", type: "100GE", capacity: "100 Gbps", utilization: 55, status: "Active" },
        ],
    },
    {
        ebrKey: "2",
        bundles: [
            { id: "TB-005", name: "METRO-JKT-02", type: "10GE", capacity: "10 Gbps", utilization: 70, status: "Active" },
            { id: "TB-006", name: "CORE-JKT-CDN-B", type: "100GE", capacity: "100 Gbps", utilization: 50, status: "Active" },
            { id: "TB-007", name: "BACKBONE-YGY-B", type: "100GE", capacity: "100 Gbps", utilization: 35, status: "Standby" },
            { id: "TB-008", name: "BACKBONE-SBY-B", type: "100GE", capacity: "100 Gbps", utilization: 40, status: "Active" },
        ],
    },
    {
        ebrKey: "3",
        bundles: [
            { id: "TB-009", name: "METRO-JKT-03", type: "10GE", capacity: "10 Gbps", utilization: 85, status: "Active" },
            { id: "TB-010", name: "CORE-JKT-CDN-C", type: "100GE", capacity: "100 Gbps", utilization: 75, status: "Active" },
            { id: "TB-011", name: "BACKBONE-YGY-C", type: "40GE", capacity: "40 Gbps", utilization: 90, status: "Maintenance" },
            { id: "TB-012", name: "BACKBONE-SBY-C", type: "100GE", capacity: "100 Gbps", utilization: 60, status: "Active" },
        ],
    },
];
