// Filter Options Data
export const regionOptions = [
    { value: "SUMBAGUT", label: "01 - SUMBAGUT" },
    { value: "SUMBAGSEL", label: "02 - SUMBAGSEL" },
    { value: "JABOTABEK INNER", label: "03 - JABOTABEK INNER" },
    { value: "JAWA BARAT", label: "04 - JAWA BARAT" },
    { value: "JAWA TENGAH", label: "05 - JAWA TENGAH" },
    { value: "JAWA TIMUR", label: "06 - JAWA TIMUR" },
    { value: "BALINUSRA", label: "07 - BALINUSRA" },
    { value: "KALIMANTAN", label: "08 - KALIMANTAN" },
    { value: "SULAWESI", label: "09 - SULAWESI" },
    { value: "SUMBAGTENG", label: "10 - SUMBAGTENG" },
    { value: "PUMA", label: "11 - PUMA" },
    { value: "JABOTABEK OUTER", label: "12 - JABOTABEK OUTER" },
];

export const ebrOptions = [
    { value: "AHZ.1", label: "AHZ.1" },
    { value: "AHZ.2", label: "AHZ.2" },
    { value: "BTC.1", label: "BTC.1" },
];

// EBR options organized by region
export const ebrOptionsByRegion: Record<string, { value: string; label: string }[]> = {
    "SUMBAGUT": [
        { value: "EBR Amir Hamzah.1", label: "EBR Amir Hamzah.1" },
        { value: "EBR Amir Hamzah.2", label: "EBR Amir Hamzah.2" },
        { value: "EBR LBR.1", label: "EBR LBR.1" },
        { value: "EBR LBR.2", label: "EBR LBR.2" },
        { value: "EBR PMS.1", label: "EBR PMS.1" },
        { value: "EBR PMS.2", label: "EBR PMS.2" },
    ],
    "SUMBAGSEL": [
        { value: "EBR DLD.1", label: "EBR DLD.1" },
        { value: "EBR DLD.2", label: "EBR DLD.2" },
        { value: "EBR PHM.1", label: "EBR PHM.1" },
        { value: "EBR PHM.2", label: "EBR PHM.2" },
        { value: "EBR JAM.1", label: "EBR JAM.1" },
        { value: "EBR JAM.2", label: "EBR JAM.2" },
    ],
    "JABOTABEK INNER": [
        { value: "EBR BUARAN.1", label: "EBR BUARAN.1" },
        { value: "EBR BUARAN.2", label: "EBR BUARAN.2" },
        { value: "EBR TBS.1", label: "EBR TBS.1" },
        { value: "EBR TBS.2", label: "EBR TBS.2" },
        { value: "EBR BSD.1", label: "EBR BSD.1" },
        { value: "EBR BSD.2", label: "EBR BSD.2" },
    ],
    "JAWA BARAT": [
        { value: "EBR DAGO.1", label: "EBR DAGO.1" },
        { value: "EBR DAGO.2", label: "EBR DAGO.2" },
        { value: "EBR SOETA.1", label: "EBR SOETA.1" },
        { value: "EBR SOETA.2", label: "EBR SOETA.2" },
    ],
    "JAWA TENGAH": [
        { value: "EBR SLO.1", label: "EBR SLO.1" },
        { value: "EBR SLO.2", label: "EBR SLO.2" },
        { value: "EBR KBU.1", label: "EBR KBU.1" },
        { value: "EBR KBU.2", label: "EBR KBU.2" },
        { value: "EBR SMR.1", label: "EBR SMR.1" },
        { value: "EBR SMR.2", label: "EBR SMR.2" },
    ],
    "JAWA TIMUR": [
        { value: "EBR Gayungan.1", label: "EBR Gayungan.1" },
        { value: "EBR Gayungan.2", label: "EBR Gayungan.2" },
        { value: "EBR HRM.1", label: "EBR HRM.1" },
        { value: "EBR HRM.2", label: "EBR HRM.2" },
        { value: "EBR MLG.1", label: "EBR MLG.1" },
        { value: "EBR MLG.2", label: "EBR MLG.2" },
    ],
    "BALINUSRA": [
        { value: "EBR Renon.1", label: "EBR Renon.1" },
        { value: "EBR Renon.2", label: "EBR Renon.2" },
        { value: "EBR SGR.1", label: "EBR SGR.1" },
        { value: "EBR SGR.2", label: "EBR SGR.2" },
        { value: "EBR MMR.1", label: "EBR MMR.1" },
        { value: "EBR MMR.2", label: "EBR MMR.2" },
    ],
    "KALIMANTAN": [
        { value: "EBR BJB.1", label: "EBR BJB.1" },
        { value: "EBR BJB.2", label: "EBR BJB.2" },
        { value: "EBR BPP.1", label: "EBR BPP.1" },
        { value: "EBR BPP.2", label: "EBR BPP.2" },
        { value: "EBR PTK.1", label: "EBR PTK.1" },
        { value: "EBR PTK.2", label: "EBR PTK.2" },
        { value: "EBR SMD.1", label: "EBR SMD.1" },
        { value: "EBR SMD.2", label: "EBR SMD.2" },
        { value: "EBR PLK.1", label: "EBR PLK.1" },
        { value: "EBR PLK.2", label: "EBR PLK.2" },
    ],
    "SULAWESI": [
        { value: "EBR Pengayoman.1", label: "EBR Pengayoman.1" },
        { value: "EBR Pengayoman.2", label: "EBR Pengayoman.2" },
        { value: "EBR Sudiang.1", label: "EBR Sudiang.1" },
        { value: "EBR Sudiang.2", label: "EBR Sudiang.2" },
        { value: "EBR PAL.1", label: "EBR PAL.1" },
        { value: "EBR PAL.2", label: "EBR PAL.2" },
        { value: "EBR MDO.1", label: "EBR MDO.1" },
        { value: "EBR MDO.2", label: "EBR MDO.2" },
    ],
    "SUMBAGTENG": [
        { value: "EBR KENANGA.1", label: "EBR KENANGA.1" },
        { value: "EBR KENANGA.2", label: "EBR KENANGA.2" },
        { value: "EBR MARPOYAN ARIFIN AHMAD.1", label: "EBR MARPOYAN ARIFIN AHMAD.1" },
        { value: "EBR MARPOYAN ARIFIN AHMAD.2", label: "EBR MARPOYAN ARIFIN AHMAD.2" },
        { value: "EBR Batam.1", label: "EBR Batam.1" },
        { value: "EBR Batam.2", label: "EBR Batam.2" },
        { value: "EBR PDG.1", label: "EBR PDG.1" },
        { value: "EBR PDG.2", label: "EBR PDG.2" },
    ],
    "PUMA": [
        { value: "EBR JAP.1", label: "EBR JAP.1" },
        { value: "EBR JAP.2", label: "EBR JAP.2" },
        { value: "EBR TIM.1", label: "EBR TIM.1" },
        { value: "EBR TIM.2", label: "EBR TIM.2" },
        { value: "EBR SOR.1", label: "EBR SOR.1" },
        { value: "EBR SOR.2", label: "EBR SOR.2" },
        { value: "EBR AB.1", label: "EBR AB.1" },
        { value: "EBR AB.2", label: "EBR AB.2" },
    ],
    "JABOTABEK OUTER": [
        { value: "EBR BUARAN.1", label: "EBR BUARAN.1" },
        { value: "EBR BUARAN.2", label: "EBR BUARAN.2" },
        { value: "EBR TBS.1", label: "EBR TBS.1" },
        { value: "EBR TBS.2", label: "EBR TBS.2" },
        { value: "EBR BSD.1", label: "EBR BSD.1" },
        { value: "EBR BSD.2", label: "EBR BSD.2" },
    ],
};

export const gatewayOptions = [
    { value: "BDS", label: "BDS" },
    { value: "BTC", label: "BTC" },
    { value: "JT2", label: "JT2" },
    { value: "PNK", label: "PNK" },
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
