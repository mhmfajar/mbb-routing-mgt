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

// Routing Table Data - imported from JSON
import routingTableJson from "./routingTableData.json";

export interface RoutingRow {
    key: string;
    no: number;
    ebr: string;
    peTransit: string;
    paths: string[];
    bds: number | string;
    btc: number | string;
    jt2: number | string;
    pnk: number | string;
    grandTotal: number | string;
}

export const routingTableData: RoutingRow[] = routingTableJson.routingTableData as RoutingRow[];

// Table columns configuration - updated to match reference
export const routingTableColumns = [
    { title: "NO", dataIndex: "no", key: "no", width: 50, fixed: "left" as const },
    { title: "EBR", dataIndex: "ebr", key: "ebr", width: 150, fixed: "left" as const },
    { title: "PE-Transit", dataIndex: "peTransit", key: "peTransit", width: 180 },
    {
        title: "Path",
        dataIndex: "paths",
        key: "paths",
        width: 400,
        render: (paths: string[]) => (
            paths.map((p, i) => (
                `<div key={${i}} style="padding: 2px 0; border-bottom: ${i < paths.length - 1 ? '1px solid #f0f0f0' : 'none'}">${p}</div>`
            )).join("")
        ),
    },
    { title: "BDS", dataIndex: "bds", key: "bds", width: 70, align: "center" as const },
    { title: "BTC", dataIndex: "btc", key: "btc", width: 70, align: "center" as const },
    { title: "JT2", dataIndex: "jt2", key: "jt2", width: 70, align: "center" as const },
    { title: "PNK", dataIndex: "pnk", key: "pnk", width: 70, align: "center" as const },
    { title: "Grand Total", dataIndex: "grandTotal", key: "grandTotal", width: 100, align: "center" as const },
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
