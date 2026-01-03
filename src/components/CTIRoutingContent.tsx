import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Button, DatePicker, TimePicker } from "antd";
import { FilterOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import * as echarts from "echarts";
import axios, { type AxiosResponse } from "axios";
import dayjs from "dayjs";

import { config } from "~/config";
import { GatewayCard, NetworkNodeLarge } from "~/components";
import ebrLocations from "~/data/ebrLocations.json";
import routerMapIcon from "~/assets/router-1-map.webp";
import warning from "~/assets/warning.webp";

const MAP_STYLE_URL = "mapbox://styles/mhmfajar/cmj9bkmus002m01sa35ty1178";

type TransitEntry = {
  transit: string;
  baseline: string;
  latency: string;
};

type TerritoryGroup = {
  [territoryId: string]: TransitEntry[];
};

type EBRTOGateways = {
  BDS: TerritoryGroup;
  BTC: TerritoryGroup;
  PNK: TerritoryGroup;
};

type EBRTOGatewaysResponse = {
  status: number;
  data: EBRTOGateways;
};

type VerifierStatus = "clear" | "not clear";

interface VerifierEntry {
  verifierid: string;
  hostname: string;
  latency: number;
  treshold: number;
  status: VerifierStatus;
}

interface CtiGatewayMessage {
  BTC: VerifierEntry[];
  BDS: VerifierEntry[];
  PNK: VerifierEntry[];
}

interface CtiGatewayResponse {
  status: boolean;
  message: CtiGatewayMessage;
}

type DataSeries = {
  name: string;
  data: number[];
  type: string;
};

type DataPerRegion = DataSeries[];

interface DataContent {
  subtitle: string;
  [region: string]: DataPerRegion | string | string[];
  range_week: string[];
  range_date: string;
}

interface TrendEbrToGwResponse {
  status: boolean;
  data: DataContent;
}

// EBR Gateway data types (for state lifting)
interface EBRGatewayEntry {
  territory: string;
  bds: { ref: string; lat: string; status: string };
  btc: { ref: string; lat: string; status: string };
  pnk: { ref: string; lat: string; status: string };
}

interface EBRGatewayChartData {
  regionName: string;
  data: Record<string, DataSeries>;
}

interface EBRGatewayTerritoryData {
  name: string;
  entries: EBRGatewayEntry[];
  chart: EBRGatewayChartData[];
  subtitle: string;
}

type MiniChartProps = {
  chartData: Record<string, DataSeries>;
  height: number;
  title: string;
  subtitle?: string;
};

function MiniChart({ chartData, height, title, subtitle }: MiniChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;

    // Init chart
    const chart = echarts.init(el, undefined, { renderer: "svg" });
    instanceRef.current = chart;

    // Color palette for series
    const colors = [
      "#e74c3c",
      "#3498db",
      "#2ecc71",
      "#9b59b6",
      "#f1c40f",
      "#1abc9c",
      "#e67e22",
      "#00bcd4",
      "#ff69b4",
      "#8bc34a",
      "#673ab7",
      "#ff5722",
    ];

    // Symbol shapes for different series
    const symbols: Array<
      "circle" | "rect" | "triangle" | "diamond" | "arrow" | "none"
    > = ["rect", "circle", "triangle", "diamond", "arrow", "rect"];

    // Create series from chartData
    const seriesData = Object.values(chartData).map((series, idx) => ({
      name: series.name,
      type: "line" as const,
      data: series.data,
      smooth: false,
      lineStyle: { width: 1.5, color: colors[idx % colors.length] },
      symbol: symbols[idx % symbols.length],
      symbolSize: 6,
      itemStyle: { color: colors[idx % colors.length] },
    }));

    const option: echarts.EChartsOption = {
      title: {
        text: title,
        subtext: subtitle || "",
        left: "center",
        top: 0,
        textStyle: { fontSize: 11, fontWeight: "bold", color: "#333" },
        subtextStyle: { fontSize: 8, color: "#999" },
      },
      grid: { top: 40, left: 35, right: 10, bottom: 10 },
      xAxis: {
        type: "category",
        data: seriesData[0]?.data?.map((_, i) => i) || [],
        axisLabel: { show: false },
        axisLine: { lineStyle: { color: "#ccc" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLabel: { fontSize: 8, color: "#666" },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "#eee" } },
      },
      series: seriesData,
      tooltip: {
        trigger: "axis",
        confine: true,
        textStyle: { fontSize: 9 },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: [4, 8],
        axisPointer: {
          type: "line",
          lineStyle: { color: "#999", type: "dashed" },
        },
        formatter: function (params: unknown) {
          const data = params as Array<{
            marker: string;
            seriesName: string;
            value: number;
          }>;
          if (!Array.isArray(data) || data.length === 0) return "";
          let result = "";
          data.forEach((item) => {
            result += `${item.marker} ${item.seriesName}: <b>${item.value?.toFixed(2) || "-"
              }</b><br/>`;
          });
          return result;
        },
      },
      legend: {
        show: false,
      },
    };

    chart.setOption(option, { notMerge: true });

    // Keep chart responsive
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => chart.resize());
      ro.observe(el);
      resizeObserverRef.current = ro;
    }

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      if (!chart.isDisposed()) chart.dispose();
      instanceRef.current = null;
    };
  }, [chartData, title]);

  return <div ref={chartRef} style={{ height, width: "100%" }} />;
}

// Nation Wide Donut Chart Component
type NationWideDonutChartProps = {
  maintain: number;
  degrade: number;
  improve: number;
};

function NationWideDonutChart({
  maintain,
  degrade,
  improve,
}: NationWideDonutChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  const total = maintain + degrade + improve;

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;

    const chart = echarts.init(el, undefined, { renderer: "svg" });
    instanceRef.current = chart;

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      series: [
        {
          name: "EBR to GW",
          type: "pie",
          radius: ["55%", "80%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          startAngle: 115,
          label: {
            show: true,
            position: "outside",
            formatter: (params) => {
              const nameMap: Record<string, string> = {
                Maintain: "MAINTAIN",
                Degrade: "DEGRADE",
                Improve: "IMPROVE",
              };
              return `{value|${params.value}} {unit|Link}\n{name|${nameMap[params.name] || params.name
                }}`;
            },
            rich: {
              value: {
                fontSize: 14,
                fontWeight: "bold",
                lineHeight: 18,
              },
              unit: {
                fontSize: 11,
                lineHeight: 18,
              },
              name: {
                fontSize: 10,
                color: "#666",
                lineHeight: 14,
              },
            },
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 52.5,
            smooth: 0.1,
          },
          labelLayout: {
            hideOverlap: false,
          },
          itemStyle: {
            borderRadius: 4,
            borderColor: "#fff",
            borderWidth: 2,
          },
          data: [
            {
              value: degrade,
              name: "Degrade",
              itemStyle: { color: "#d63031" },
              label: { color: "#d63031" },
              labelLine: { lineStyle: { color: "#d63031" } },
            },
            {
              value: improve,
              name: "Improve",
              itemStyle: { color: "#0984e3" },
              label: { color: "#0984e3" },
              labelLine: { lineStyle: { color: "#0984e3" } },
            },
            {
              value: maintain,
              name: "Maintain",
              itemStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: "#00b894" },
                    { offset: 1, color: "#1ecb6b" },
                  ],
                },
              },
              label: { color: "#00b894" },
              labelLine: { lineStyle: { color: "#00b894" } },
            },
          ],
        },
      ],
      graphic: [
        // Center text - total
        {
          type: "text",
          left: "center",
          top: "42%",
          style: {
            text: `${total}Link`,
            fontSize: 22,
            fontWeight: "bold",
            fill: "#333",
          },
        },
        // Center text - subtitle
        {
          type: "text",
          left: "center",
          top: "52%",
          style: {
            text: "EBR to GW",
            fontSize: 12,
            fill: "#666",
          },
        },
      ],
    };

    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      if (!chart.isDisposed()) chart.dispose();
      instanceRef.current = null;
    };
  }, [maintain, degrade, improve, total]);

  return <div ref={chartRef} style={{ height: 260, width: "100%" }} />;
}

// EBR Locations data loaded from ~/data/ebrLocations.json

const territoryNames = [
  "Territory 1",
  "Territory 2",
  "Territory 3",
  "Territory 4",
];

const EBR_CONNECTIONS_SOURCE_ID = "ebr-connections";
const EBR_CONNECTIONS_LAYER_ID = "ebr-connections-line";
const EBR_CONNECTIONS: Array<{
  from: string;
  to: string;
  bulge?: "north" | "south" | "auto";
  bowFactor?: number;
  segments?: number;
}> = [
    // Only connect this pair for now
    { from: "MDC", to: "PUB", bulge: "north", bowFactor: 1.2, segments: 256 },
  ];

// Territory definitions for navigation
const TERRITORIES = [
  {
    id: 1,
    name: "Territory 1",
    region: "Sumatra",
    center: { lng: 101.5, lat: 0.5 },
    zoom: 5.5,
    ebrCount: 18,
    linkToGw: 72,
    color: "#f5c842", // Gold/Yellow
  },
  {
    id: 2,
    name: "Territory 2",
    region: "Banten - Jawa Tengah",
    center: { lng: 107.5, lat: -6.8 },
    zoom: 7,
    ebrCount: 22,
    linkToGw: 88,
    color: "#f97316", // Orange
  },
  {
    id: 3,
    name: "Territory 3",
    region: "Jawa Timur - NTT",
    center: { lng: 115, lat: -8.2 },
    zoom: 6,
    ebrCount: 28,
    linkToGw: 122,
    color: "#a855f7", // Purple
  },
  {
    id: 4,
    name: "Territory 4",
    region: "Kalimantan - Papua",
    center: { lng: 125, lat: -2 },
    zoom: 4.5,
    ebrCount: 20,
    linkToGw: 80,
    color: "#00838f", // Teal
  },
];

// View state type
export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

interface CTIRoutingContentProps {
  viewState: ViewState;
  setViewState: (v: ViewState) => void;
}

type EbrConnectionProperties = { from: string; to: string };
type EbrConnectionFeature = GeoJSON.Feature<
  GeoJSON.LineString,
  EbrConnectionProperties
>;

function buildEbrConnectionsGeoJson(): GeoJSON.FeatureCollection<
  GeoJSON.LineString,
  EbrConnectionProperties
> {
  const features: EbrConnectionFeature[] = [];

  for (const conn of EBR_CONNECTIONS) {
    const { from, to } = conn;
    const fromLocation = ebrLocations.find((l) => l.pe_code === from);
    const toLocation = ebrLocations.find((l) => l.pe_code === to);
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

function curveBetweenPoints(
  from: [number, number],
  to: [number, number],
  options?: {
    segments?: number;
    bowFactor?: number;
    bulge?: "north" | "south" | "auto";
  }
) {
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

// Helper to get latency cell color
function getLatencyColor(status: string): string {
  if (status === "not clear") return "bg-red-500 text-white";
  return "bg-green-500 text-white";
}

// EBR to Gateway Slide (Slide 2)
function EBRGatewaySlide({
  onBack,
  data,
  loading,
}: {
  onBack: () => void;
  data: EBRGatewayTerritoryData[];
  loading: boolean;
}) {
  const headerGridCols = "20px 198px 80px 80px 80px 80px 80px 80px";
  const gridCols = "20px 190px 80px 80px 80px 80px 80px 80px";
  const borderStyle = "border-r-2 border-dashed border-gray-400";
  const borderChildStyle = "border-r-2 border-dashed border-gray-300";

  // Calculate responsive heights based on window height
  const territoriesCount = data.length || 4;
  // Overhead: nav (62px) + EBR header (40px) + table headers (52px) + slide toggle (40px) = ~194px
  // Spacing between territories: 20px * (territories - 1)
  const spacingTotal = 20 * (territoriesCount - 1);
  const [sectionHeight, setSectionHeight] = useState(() => {
    const availableHeight = window.innerHeight - 194 - spacingTotal;
    const calculated = Math.floor(availableHeight / territoriesCount);
    return Math.min(Math.max(calculated, 100), 175); // Min 100px, Max 175px for tidy layout
  });

  useEffect(() => {
    const handleResize = () => {
      const availableHeight = window.innerHeight - 194 - spacingTotal;
      const calculated = Math.floor(availableHeight / territoriesCount);
      setSectionHeight(Math.min(Math.max(calculated, 100), 175)); // Min 100px, Max 175px
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [territoriesCount, spacingTotal]);

  // Data rows max height = section height - territory name row (~28px)
  const dataRowsMaxHeight = sectionHeight - 28;

  return (
    <div className="flex flex-col h-[calc(100vh-62px)] relative">
      {/* Header */}
      <div className="px-4 pt-3 pb-1 flex items-center">
        <h2 className="relative text-sm font-bold text-[#1479c3] pb-1 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:w-[80px] after:bg-[#1479c3]">
          EBR to GATEWAY
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 overflow-auto">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Loading data...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg font-semibold">
                Data tidak tersedia
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Tidak ada data untuk filter yang dipilih
              </p>
            </div>
          </div>
        )}

        {/* Main flex container: Left (data grid) | Right (charts) */}
        {!loading && data.length > 0 && (
          <div className="flex">
            {/* Left: Data Grid Container */}
            <div className="scrollbar-gutter-stable direction-rtl">
              <div className="direction-ltr">
                {/* Header Row 1 - Gateway Names */}
                <div
                  className="grid text-xxs font-bold text-center text-[#5e5e5e]"
                  style={{ gridTemplateColumns: headerGridCols }}
                >
                  <div className={`col-span-2 px-2 py-1 ${borderStyle}`} />
                  <div className={`col-span-2 px-2 py-1 ${borderStyle}`}>
                    BDS
                  </div>
                  <div className={`col-span-2 px-2 py-1 ${borderStyle}`}>
                    BTC
                  </div>
                  <div className={`col-span-2 px-2 py-1 ${borderStyle}`}>
                    PNK
                  </div>
                </div>

                {/* Header Row 2 - Reference/Latency */}
                <div
                  className="grid text-xxs font-bold text-center text-[#5e5e5e]"
                  style={{ gridTemplateColumns: headerGridCols }}
                >
                  <div className={`col-span-2 px-2 py-1.5 ${borderStyle}`} />
                  <div className={`px-2 py-1.5 ${borderChildStyle}`}>
                    Reference
                  </div>
                  <div className={`px-2 py-1.5 ${borderStyle}`}>Latency</div>
                  <div className={`px-2 py-1.5 ${borderChildStyle}`}>
                    Reference
                  </div>
                  <div className={`px-2 py-1.5 ${borderStyle}`}>Latency</div>
                  <div className={`px-2 py-1.5 ${borderChildStyle}`}>
                    Reference
                  </div>
                  <div className={`px-2 py-1.5 ${borderStyle}`}>Latency</div>
                </div>

                {/* Territory Groups */}
                {data.map((territory, territoryIndex) => (
                  <React.Fragment key={`territory-${territoryIndex}`}>
                    {/* Territory Section Container - fixed height to sync with charts */}
                    <div style={{ height: sectionHeight }}>
                      {/* Territory Name Row */}
                      <div
                        className="grid text-xxs text-[#5e5e5e] bg-white rounded-tl-lg"
                        style={{ gridTemplateColumns: headerGridCols }}
                      >
                        <div
                          className={`col-span-2 px-2 py-1.5 font-bold ${borderStyle}`}
                        >
                          {territory.name}
                        </div>
                        <div className={`${borderChildStyle}`} />
                        <div className={`${borderStyle}`} />
                        <div className={`${borderChildStyle}`} />
                        <div className={`${borderStyle}`} />
                        <div className={`${borderChildStyle}`} />
                        <div className={`${borderStyle}`} />
                      </div>

                      {/* Data Rows Container (with scroll if needed) */}
                      <div
                        className="custom-scrollbar overflow-y-auto"
                        style={{
                          direction: "rtl",
                          maxHeight: dataRowsMaxHeight,
                        }}
                      >
                        {territory.entries.map((entry, idx) => (
                          <div
                            key={idx}
                            className={`grid text-xxs text-[#5e5e5e] bg-white${idx === territory.entries.length - 1
                              ? " rounded-bl-lg"
                              : ""
                              }`}
                            style={{
                              gridTemplateColumns: gridCols,
                              direction: "ltr",
                            }}
                          >
                            <div className="p-2">{idx + 1}</div>
                            <div className={`p-2 font-medium ${borderStyle}`}>
                              {entry.territory}
                            </div>
                            <div
                              className={`p-2 text-center ${borderChildStyle}`}
                            >
                              {entry.bds.ref}
                            </div>
                            <div className={`p-2 text-center ${borderStyle}`}>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] ${getLatencyColor(
                                  entry.bds.status
                                )}`}
                              >
                                {entry.bds.lat}
                              </span>
                            </div>
                            <div
                              className={`p-2 text-center ${borderChildStyle}`}
                            >
                              {entry.btc.ref}
                            </div>
                            <div className={`p-2 text-center ${borderStyle}`}>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] ${getLatencyColor(
                                  entry.btc.status
                                )}`}
                              >
                                {entry.btc.lat}
                              </span>
                            </div>
                            <div
                              className={`p-2 text-center ${borderChildStyle}`}
                            >
                              {entry.pnk.ref}
                            </div>
                            <div className={`p-2 text-center ${borderStyle}`}>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] ${getLatencyColor(
                                  entry.pnk.status
                                )}`}
                              >
                                {entry.pnk.lat}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Spacing Row - only show if not last territory */}
                    {territoryIndex !== data.length - 1 && (
                      <div
                        className="grid text-xxs"
                        style={{ gridTemplateColumns: headerGridCols }}
                      >
                        <div className={`col-span-2 py-2.5 ${borderStyle}`} />
                        <div className={`${borderChildStyle}`} />
                        <div className={`${borderStyle}`} />
                        <div className={`${borderChildStyle}`} />
                        <div className={`${borderStyle}`} />
                        <div className={`${borderChildStyle}`} />
                        <div className={`${borderStyle}`} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right: Hourly Latency Header + Charts */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-center font-bold text-xxs text-[#5e5e5e] py-2 min-h-13">
                Hourly Latency
              </div>

              {/* Charts per territory */}
              {data.map((territory, territoryIndex) => (
                <React.Fragment key={`chart-${territoryIndex}`}>
                  <div
                    className="flex items-center gap-2 bg-white rounded-r-lg"
                    style={{ height: sectionHeight }}
                  >
                    {territory.chart.map((chartItem, chartIdx) => (
                      <div key={chartIdx} className="flex-1">
                        <MiniChart
                          chartData={chartItem.data}
                          title={chartItem.regionName}
                          subtitle={territory.subtitle}
                          height={sectionHeight - 10}
                        />
                      </div>
                    ))}
                  </div>
                  {territoryIndex !== data.length - 1 && (
                    <div className="py-2.5"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Slide Toggle */}
      <div className="flex justify-center w-full absolute bottom-0">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 transition-colors bg-white px-10 rounded-t"
        >
          <UpOutlined />
        </button>
      </div>
    </div>
  );
}

// Main CTI Routing Content
export function CTIRoutingContent({ viewState }: CTIRoutingContentProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState<number | null>(
    null
  );

  // Filter state
  const [filterDate, setFilterDate] = useState(dayjs());
  const [filterHour, setFilterHour] = useState(dayjs().startOf("hour"));

  // EBR Gateway data state (lifted from EBRGatewaySlide)
  const [ebrGatewayData, setEbrGatewayData] = useState<
    EBRGatewayTerritoryData[]
  >([]);
  const [ebrGatewayLoading, setEbrGatewayLoading] = useState(true);

  // Function to zoom to a territory
  const zoomToTerritory = (territoryId: number) => {
    const map = mapRef.current;
    if (!map) return;

    const territory = TERRITORIES.find((t) => t.id === territoryId);
    if (!territory) return;

    setSelectedTerritory(territoryId);
    map.flyTo({
      center: [territory.center.lng, territory.center.lat],
      zoom: territory.zoom,
      duration: 1500,
      essential: true,
    });
  };

  // Function to reset to default view
  const resetView = () => {
    const map = mapRef.current;
    if (!map) return;

    setSelectedTerritory(null);
    map.flyTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      duration: 1500,
      essential: true,
    });
  };

  const fetchEbrGatewayData = async () => {
    try {
      setEbrGatewayLoading(true);

      const date = filterDate.format("YYYY-MM-DD");
      const hour = filterHour.hour();

      const responseCtiGateway: AxiosResponse<CtiGatewayResponse> =
        await axios.get("/api/mbb-routing-mgt/ctiGateway", {
          params: { date, hour },
          timeout: config.api.timeout,
          validateStatus: (status) => status < 600,
        });

      const responseEbrToGw: AxiosResponse<EBRTOGatewaysResponse> =
        await axios.get("/executive/api/core/core.php", {
          params: { cmd: "ebr-to-gw", date, hour },
          timeout: config.api.timeout,
        });

      const responseTrendEbrToGw: AxiosResponse<TrendEbrToGwResponse> =
        await axios.get("/api/mbb-routing-mgt/trendEbrToGw", {
          params: {
            start_week: null,
            end_week: null,
            year: null,
            verifier: "btc,bds,pnk,jt2",
            type_summary: "reg_tsel",
            region_tsel: "1,2,3,4,5,6,7,8,9,10,11,12",
            type_data: "ebr",
            parameter: "avg_latency",
            period_type: "hourly",
            start_date: date,
            end_date: date,
            start_hour: 0,
            end_hour: hour,
          },
          timeout: config.api.timeout,
        });

      const ctiData = responseCtiGateway.data.message;
      const bdsLookup = new Map(ctiData.BDS.map((e) => [e.hostname, e]));
      const btcLookup = new Map(ctiData.BTC.map((e) => [e.hostname, e]));
      const pnkLookup = new Map(ctiData.PNK.map((e) => [e.hostname, e]));

      const territoryToRegion: Record<string, string[]> = {
        "1": ["01-SUMBAGUT", "02-SUMBAGSEL", "10-SUMBAGTENG"],
        "2": ["03-JABOTABEK INNER", "12-JABOTABEK OUTER", "04-JAWA BARAT"],
        "3": ["05-JAWA TENGAH", "06-JAWA TIMUR", "07-BALINUSRA"],
        "4": ["08-KALIMANTAN", "09-SULAWESI", "11-PUMA"],
      };

      setEbrGatewayData(
        Object.entries(responseEbrToGw.data.data.BDS).map(
          ([key, value], idx) => {
            const regionKeys = territoryToRegion[key] || [];
            const chartSubtitle = responseTrendEbrToGw.data.data.subtitle || "";

            const chartData = regionKeys.map((regionKey) => {
              const regionData = responseTrendEbrToGw.data.data[regionKey];
              const chartSeriesData: Record<string, DataSeries> = {};

              if (Array.isArray(regionData)) {
                regionData.forEach((series) => {
                  if (
                    typeof series === "object" &&
                    series !== null &&
                    "name" in series &&
                    (series.name.endsWith("- BDS") ||
                      series.name.endsWith("- BTC") ||
                      series.name.endsWith("- PNK"))
                  ) {
                    chartSeriesData[series.name] = series as DataSeries;
                  }
                });
              }

              return { regionName: regionKey, data: chartSeriesData };
            });

            return {
              name: territoryNames[idx] || `Territory ${key}`,
              entries: value.map((entry) => {
                const bdsEntry = bdsLookup.get(entry.transit);
                const btcEntry = btcLookup.get(entry.transit);
                const pnkEntry = pnkLookup.get(entry.transit);

                return {
                  territory: entry.transit,
                  bds: {
                    ref: (bdsEntry?.treshold ?? 0).toFixed(2),
                    lat: (bdsEntry?.latency ?? 0).toFixed(2),
                    status: bdsEntry?.status ?? "clear",
                  },
                  btc: {
                    ref: (btcEntry?.treshold ?? 0).toFixed(2),
                    lat: (btcEntry?.latency ?? 0).toFixed(2),
                    status: btcEntry?.status ?? "clear",
                  },
                  pnk: {
                    ref: (pnkEntry?.treshold ?? 0).toFixed(2),
                    lat: (pnkEntry?.latency ?? 0).toFixed(2),
                    status: pnkEntry?.status ?? "clear",
                  },
                };
              }),
              chart: chartData,
              subtitle: chartSubtitle,
            };
          }
        )
      );
    } catch (err) {
      console.error("Failed to fetch EBR Gateway data:", err);
      setEbrGatewayData([]);
    } finally {
      setEbrGatewayLoading(false);
    }
  };

  useEffect(() => {
    fetchEbrGatewayData();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || slideIndex !== 0) return;

    const map = new mapboxgl.Map({
      accessToken: config.mapbox.accessToken,
      container: mapContainerRef.current,
      style: MAP_STYLE_URL,
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing,
      interactive: false,
      attributionControl: false,
      projection: "mercator",
    });

    const handleLoad = () => {
      // Connected line between markers (polyline)
      if (!map.getSource(EBR_CONNECTIONS_SOURCE_ID)) {
        map.addSource(EBR_CONNECTIONS_SOURCE_ID, {
          type: "geojson",
          data: buildEbrConnectionsGeoJson(),
        });
      }

      if (!map.getLayer(EBR_CONNECTIONS_LAYER_ID)) {
        map.addLayer({
          id: EBR_CONNECTIONS_LAYER_ID,
          type: "line",
          source: EBR_CONNECTIONS_SOURCE_ID,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#002060",
            "line-width": 2,
            "line-opacity": 0.65,
            "line-blur": 0.8,
          },
        });
      }

      // Hide all countries except Indonesia
      if (!map.getLayer("country-mask")) {
        map.addSource("country-boundaries", {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });

        map.addLayer(
          {
            id: "country-mask",
            type: "fill",
            source: "country-boundaries",
            "source-layer": "country_boundaries",
            filter: ["!=", ["get", "iso_3166_1"], "ID"],
            paint: {
              "fill-color": "#f5f5f5",
              "fill-opacity": 1,
            },
          },
          EBR_CONNECTIONS_LAYER_ID
        );

        // Hide country border lines (admin-0) but keep province borders (admin-1)
        // Also change water layer color to match background
        const style = map.getStyle();
        if (style?.layers) {
          for (const layer of style.layers) {
            // Hide country borders
            if (
              layer.id.includes("admin") &&
              layer.id.includes("0") &&
              layer.id.includes("boundary") &&
              layer.type === "line"
            ) {
              map.setPaintProperty(layer.id, "line-color", "#f5f5f5");
              map.setPaintProperty(layer.id, "line-opacity", 0);
            }

            // Change water layer color to #f5f5f5
            if (layer.id.includes("water") && layer.type === "fill") {
              map.setPaintProperty(layer.id, "fill-color", "#f5f5f5");
            }
          }
        }

        // Wait for country-boundaries source to load before showing map
        const onSourceData = (e: mapboxgl.MapSourceDataEvent) => {
          if (
            e.sourceId === "country-boundaries" &&
            e.isSourceLoaded &&
            map.isSourceLoaded("country-boundaries")
          ) {
            setMapReady(true);
            map.off("sourcedata", onSourceData);
          }
        };
        map.on("sourcedata", onSourceData);
      }

      markersRef.current = ebrLocations.map((location) => {
        const markerEl = document.createElement("div");
        markerEl.className = "flex flex-col items-center";
        markerEl.style.cursor = "pointer";

        const imgEl = document.createElement("img");
        imgEl.src = routerMapIcon;
        imgEl.alt = location.pe_code;
        imgEl.className = "w-12 h-12 object-contain";
        markerEl.appendChild(imgEl);

        const labelEl = document.createElement("span");
        labelEl.className =
          "text-[10px] font-bold text-[#00838f] bg-white px-1.5 py-0.5 rounded shadow -mt-2";
        labelEl.textContent = location.pe_code;
        labelEl.style.opacity = "0";
        labelEl.style.transition = "opacity 120ms ease";
        markerEl.appendChild(labelEl);

        markerEl.addEventListener("mouseenter", () => {
          labelEl.style.opacity = "1";
        });
        markerEl.addEventListener("mouseleave", () => {
          labelEl.style.opacity = "0";
        });

        return new mapboxgl.Marker({
          element: markerEl,
          anchor: "center",
          offset: [0, 0],
        })
          .setLngLat([location.lon, location.lat])
          .addTo(map);
      });
    };

    map.on("load", handleLoad);
    mapRef.current = map;

    return () => {
      map.off("load", handleLoad);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [viewState, slideIndex]);

  // Keep the map view in sync with the provided viewState
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.jumpTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing,
    });
  }, [viewState]);

  // ResizeObserver to call map.resize() when container changes size
  useEffect(() => {
    const container = mapContainerRef.current;
    const map = mapRef.current;
    if (!container || !map) return;

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mapReady]);

  // Slide 2 - EBR to Gateway
  if (slideIndex === 1) {
    return (
      <EBRGatewaySlide
        onBack={() => setSlideIndex(0)}
        data={ebrGatewayData}
        loading={ebrGatewayLoading}
      />
    );
  }

  return (
    <>
      {/* Filter Bar */}
      <div className="px-4 py-2 flex items-center gap-6 relative z-10 bg-[#f5f5f5]">
        <div className="flex items-center gap-2 text-sm bg-white px-4 py-1.5 rounded-lg">
          <span className="font-bold text-[#00838f]">Date:</span>
          <DatePicker
            value={filterDate}
            onChange={(date) => date && setFilterDate(date)}
            format="D-MM-YYYY"
            size="small"
            allowClear={false}
            className="!border-none !shadow-none"
          />
        </div>
        <div className="flex items-center gap-2 text-sm bg-white px-4 py-1.5 rounded-lg">
          <span className="font-bold text-[#00838f]">Hour:</span>
          <TimePicker
            value={filterHour}
            onChange={(time) => time && setFilterHour(time)}
            format="HH:00"
            showMinute={false}
            showSecond={false}
            size="small"
            allowClear={false}
            needConfirm={false}
            className="!border-none !shadow-none"
            suffixIcon={null}
          />
          <span className="text-gray-500 text-xs">WIB</span>
        </div>
        <Button
          type="primary"
          icon={<FilterOutlined />}
          shape="round"
          className="!bg-[#002060] hover:!bg-[#003080] hover:scale-105 transition-all duration-200"
          size="middle"
          onClick={fetchEbrGatewayData}
          loading={ebrGatewayLoading}
        >
          Filter
        </Button>
        <div className="ml-auto flex items-center gap-2 text-sm text-[#00838f] underline cursor-pointer hover:text-[#005a7f]">
          Routing Reference Best Path
          <img
            src="/src/assets/routing-reference-best-path.webp"
            alt="Best Path"
            className="h-4"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex w-full max-w-full">
        {/* Left Sidebar */}
        <div className="w-80 shrink-0 p-4 flex flex-col gap-4 relative z-10 bg-[#f5f5f5]">
          {/* Nation Wide Stats */}
          <div>
            <h3 className="relative text-center text-lg font-bold text-[#1479c3] pb-1 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:w-[160px] after:bg-[#1479c3]3">
              NATION WIDE
            </h3>

            {/* Donut Chart using ECharts */}
            <NationWideDonutChart maintain={270} degrade={28} improve={10} />
          </div>

          {/* Gateway Section */}
          <div className="flex flex-col gap-4">
            <h3 className="relative text-center text-lg font-bold text-[#1479c3] pb-1 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:w-[160px] after:bg-[#1479c3]">
              GATEWAY
            </h3>
            <div className="flex flex-col gap-3">
              <GatewayCard
                name="BTC"
                percentage={82}
                color="#00838f"
                maintainLink={65}
                degradeLink={14}
                improveLink={0}
              />
              <GatewayCard
                name="BDS"
                percentage={82}
                color="#00838f"
                maintainLink={65}
                degradeLink={14}
                improveLink={0}
              />
              <GatewayCard
                name="PNK"
                percentage={100}
                color="#00838f"
                maintainLink={79}
                degradeLink={0}
                improveLink={0}
              />
              <GatewayCard
                name="JT"
                percentage={100}
                color="#00838f"
                maintainLink={79}
                degradeLink={0}
                improveLink={0}
              />
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Link Route CTI Header */}
          <div className="bg-[#f5f5f5] p-4 relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="relative text-center text-lg font-bold text-[#1479c3] pb-1 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:w-[160px] after:bg-[#1479c3]">
                LINK ROUTE CTI
              </h3>
            </div>

            <div className="flex items-center justify-center gap-4 mb-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[#7f7f7f] font-bold">
                  Latency End-to-End :
                </span>
                <span className="text-white px-2 py-0.5 rounded inline-block bg-gradient-to-r from-[#009688] to-[#1ecb6b] font-bold">
                  31 ms
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#7f7f7f] font-bold font-italic">
                  Asymmetric
                </span>
                <img src={warning} alt="Warning" className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white m-3 rounded-xl">
              {/* Network Path - Uplink and Downlink */}
              <div className="flex items-center justify-center gap-0 relative">
                {/* EBR */}
                <NetworkNodeLarge label="EBR" type="router" />

                {/* Uplink Line with 1ms */}
                <div className="flex flex-col items-center mx-1">
                  <div className="w-17 h-0.5 bg-[#00838f] mb-1" />
                  <span className="text-[10px] font-bold bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-1.5 py-0.5 rounded">
                    1 ms
                  </span>
                </div>

                {/* PE TRANSIT */}
                <NetworkNodeLarge label="PE TRANSIT" type="switch" />

                {/* Line with 1ms */}
                <div className="flex flex-col items-center mx-1">
                  <div className="w-17 h-0.5 bg-[#00838f] mb-1" />
                  <span className="text-[10px] font-bold bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-1.5 py-0.5 rounded">
                    1 ms
                  </span>
                </div>

                {/* P */}
                <NetworkNodeLarge label="P" type="switch" />

                {/* IGW/DGW with warning */}
                <div className="flex flex-col items-center mx-1 h-[25px]">
                  <div className="w-6 h-0.5 bg-[#00838f]" />
                </div>

                {/* Cloud IPBB Telkom */}
                <NetworkNodeLarge label="Cloud IPBB Telkom" type="cloud" />

                {/* Line with 12ms */}
                <div className="flex flex-col items-center mx-1">
                  <div className="w-17 h-0.5 bg-[#00838f] mb-1" />
                  <span className="text-[10px] font-bold bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-1.5 py-0.5 rounded">
                    12 ms
                  </span>
                </div>

                {/* IGD / DGW */}
                <NetworkNodeLarge label="IGW/DGW" type="switch" />

                {/* Downlink Line with 15ms */}
                <div className="flex flex-col items-center mx-1">
                  <div className="w-17 h-0.5 bg-rose-600 mb-1" />
                  <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded">
                    15 ms
                  </span>
                </div>

                {/* Cloud IPBB Telkom (Downlink) */}
                <NetworkNodeLarge label="Cloud IPBB Telkom" type="cloud" />

                {/* Line with 1ms */}
                <div className="flex flex-col items-center mx-1 h-[25px]">
                  <div className="w-6 h-0.5 bg-[#00838f]" />
                </div>

                {/* P */}
                <NetworkNodeLarge label="P" type="switch" />

                {/* Line with 1ms */}
                <div className="flex flex-col items-center mx-1">
                  <div className="w-17 h-0.5 bg-[#00838f] mb-1" />
                  <span className="text-[10px] font-bold bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-1.5 py-0.5 rounded">
                    1 ms
                  </span>
                </div>

                {/* PE TRANSIT */}
                <NetworkNodeLarge label="PE TRANSIT" type="switch" />

                {/* Line with 1ms */}
                <div className="flex flex-col items-center mx-1">
                  <div className="w-17 h-0.5 bg-[#00838f] mb-1" />
                  <span className="text-[10px] font-bold bg-gradient-to-r from-[#009688] to-[#1ecb6b] text-white px-1.5 py-0.5 rounded">
                    1 ms
                  </span>
                </div>

                {/* EBR */}
                <NetworkNodeLarge label="EBR" type="router" />
              </div>

              {/* Uplink/Downlink Labels */}
              <div className="flex items-center gap-10 mt-3 pb-4 px-4">
                {/* Uplink Label */}
                <div className="flex-1 flex items-center">
                  <div className="flex-1 h-0.5 bg-[#007bff]"></div>
                  <span className="text-sm font-bold text-gray-500 px-3 bg-white shrink-0">
                    Uplink
                  </span>
                  <div className="flex-1 h-0.5 bg-[#007bff]"></div>
                  <span className="text-[#007bff] text-lg ml-1 shrink-0">
                    →
                  </span>
                </div>
                {/* Downlink Label */}
                <div className="flex-1 flex items-center">
                  <div className="flex-1 h-0.5 bg-[#007bff]"></div>
                  <span className="text-sm font-bold text-gray-500 px-3 bg-white shrink-0">
                    Downlink
                  </span>
                  <div className="flex-1 h-0.5 bg-[#007bff]"></div>
                  <span className="text-[#007bff] text-lg ml-1 shrink-0">
                    →
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map with Indonesia Territory Overlay */}
          <div className="flex-1 relative overflow-hidden">
            <div
              ref={mapContainerRef}
              className={`absolute inset-0 transition-opacity duration-600 ${mapReady ? "opacity-100" : "opacity-0"
                }`}
              style={{ width: "100%", height: "100%" }}
            />

            {/* Territory Navigation */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-50">
              {/* Reset View Button */}
              {selectedTerritory !== null && (
                <button
                  onClick={resetView}
                  className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md text-xs font-semibold text-gray-600 hover:bg-white transition-all flex items-center gap-2"
                >
                  <span>←</span> Reset View
                </button>
              )}

              {/* Territory Buttons - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2">
                {TERRITORIES.map((territory) => (
                  <button
                    key={territory.id}
                    onClick={() => zoomToTerritory(territory.id)}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg shadow-md transition-all backdrop-blur-sm ${selectedTerritory === territory.id
                      ? "ring-2 ring-offset-1"
                      : "hover:scale-102 hover:shadow-lg"
                      }`}
                    style={
                      {
                        backgroundColor:
                          selectedTerritory === territory.id
                            ? territory.color
                            : "rgba(255,255,255,0.95)",
                        color:
                          selectedTerritory === territory.id ? "white" : "#333",
                        "--tw-ring-color": territory.color,
                        outlineColor: territory.color,
                      } as React.CSSProperties
                    }
                  >
                    <span className="text-xs font-bold">{territory.name}</span>
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-white text-xs font-bold"
                      style={{
                        backgroundColor:
                          selectedTerritory === territory.id
                            ? "rgba(255,255,255,0.25)"
                            : territory.color,
                      }}
                    >
                      <span>{territory.ebrCount}</span>
                      <span className="text-[9px] font-medium opacity-90">
                        EBR
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Toggle */}
      <div className="flex justify-center w-full absolute bottom-0">
        <button
          onClick={() => setSlideIndex(1)}
          className="text-gray-400 hover:text-gray-600 transition-colors bg-white px-10 rounded-t"
        >
          <DownOutlined />
        </button>
      </div>
    </>
  );
}
