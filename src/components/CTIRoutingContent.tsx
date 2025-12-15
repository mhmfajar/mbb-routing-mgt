import React, { useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import { Button } from "antd";
import { FilterOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import ReactECharts from "echarts-for-react";

import { config } from "~/config";
import { GatewayCard, NetworkNodeLarge } from "~/components";
import ebrGatewayData from "~/data/ebrGatewayData.json";
import routerMapIcon from "~/assets/router-1-map.webp";

// EBR Locations data from the table with offsets for overlapping markers
const ebrLocations = [
  {
    treg: "TREG1",
    pe_code: "MDC",
    label: "PE SPEEDY M",
    coverage: "Medan",
    lat: 3.83726071,
    lon: 98.3535818,
    offset: [0, 0],
  },
  {
    treg: "TREG1",
    pe_code: "PUB",
    label: "PE SPEEDY PI",
    coverage: "Pulo Brayan",
    lat: 2.73429714,
    lon: 99.4859986,
    offset: [0, 0],
  },
  {
    treg: "TREG1",
    pe_code: "DRI",
    label: "PE HSI DRI",
    coverage: "Duri",
    lat: 1.74075051,
    lon: 100.866995,
    offset: [0, 0],
  },
  {
    treg: "TREG1",
    pe_code: "BDS",
    label: "PE3 TRANSIT",
    coverage: "Batam Danga",
    lat: 0.99523041,
    lon: 103.932806,
    offset: [-20, -10],
  },
  {
    treg: "TREG1",
    pe_code: "BTC",
    label: "PE SPEEDY B",
    coverage: "Batam Center",
    lat: 0.08382298,
    lon: 104.595684,
    offset: [20, 10],
  },
  {
    treg: "TREG1",
    pe_code: "PBR",
    label: "PE SPEEDY P",
    coverage: "Pekanbaru",
    lat: 0.11144286,
    lon: 101.640353,
    offset: [0, 0],
  },
  {
    treg: null,
    pe_code: "PDG",
    label: "PE HSI PDG",
    coverage: null,
    lat: -1.2694493,
    lon: 100.590796,
    offset: [0, 0],
  },
  {
    treg: "TREG1",
    pe_code: "PGC",
    label: "PE SPEEDY PI",
    coverage: "Palembang",
    lat: -2.1804841,
    lon: 104.319485,
    offset: [0, -20],
  },
  {
    treg: "TREG1",
    pe_code: "TLK",
    label: "PE SPEEDY TI",
    coverage: "Talang Kelapa",
    lat: -2.8427218,
    lon: 104.733784,
    offset: [0, 20],
  },
  // Java region - more aggressive offsets
  {
    treg: null,
    pe_code: "BKS",
    label: "PE SPEEDY BKS",
    coverage: null,
    lat: -6.1739169,
    lon: 107.109097,
    offset: [40, 0],
  },
  {
    treg: "TREG2",
    pe_code: "JT2",
    label: "PE SPEEDY JT",
    coverage: "Jatinegara",
    lat: -6.1739169,
    lon: 106.722418,
    offset: [-40, -30],
  },
  {
    treg: "TREG2",
    pe_code: "CKA",
    label: "PE SPEEDY C",
    coverage: "Cikupa",
    lat: -6.2562897,
    lon: 106.30812,
    offset: [-60, 0],
  },
  {
    treg: null,
    pe_code: "SLP",
    label: "PE SPEEDY SI",
    coverage: null,
    lat: -6.6953877,
    lon: 105.97668,
    offset: [-70, -20],
  },
  {
    treg: null,
    pe_code: "KBB",
    label: "PE SPEEDY KI",
    coverage: null,
    lat: -7.134091,
    lon: 106.77658,
    offset: [-30, 35],
  },
  {
    treg: null,
    pe_code: "BOO",
    label: "PE SPEEDY B",
    coverage: null,
    lat: -7.3532867,
    lon: 107.136717,
    offset: [0, 40],
  },
  {
    treg: "TREG3",
    pe_code: "LBG",
    label: "PE SPEEDY LI",
    coverage: "Lembong",
    lat: -7.4354574,
    lon: 107.716736,
    offset: [30, 40],
  },
  {
    treg: "TREG3",
    pe_code: "CCD",
    label: "PE SPEEDY C",
    coverage: "Cicadas",
    lat: -6.2837444,
    lon: 107.578636,
    offset: [30, -30],
  },
  {
    treg: null,
    pe_code: "CBN",
    label: "PE SPEEDY C",
    coverage: null,
    lat: -6.5307708,
    lon: 107.882455,
    offset: [50, 0],
  },
  {
    treg: null,
    pe_code: "KDS",
    label: "PE HSI KDS",
    coverage: null,
    lat: -7.0244536,
    lon: 109.926329,
    offset: [0, 0],
  },
  {
    treg: "TREG4",
    pe_code: "KBU",
    label: "PE SPEEDY KI",
    coverage: "Jogjakarta",
    lat: -7.982861,
    lon: 110.423488,
    offset: [-30, 0],
  },
  {
    treg: null,
    pe_code: "GLK",
    label: "PE HSI GLK",
    coverage: null,
    lat: -7.5449944,
    lon: 110.810167,
    offset: [30, 0],
  },
  {
    treg: "TREG4",
    pe_code: "GBL",
    label: "PE SPEEDY G",
    coverage: "Semarang",
    lat: -6.832526,
    lon: 111.031126,
    offset: [0, -30],
  },
  {
    treg: null,
    pe_code: "JBR",
    label: "PE SPEEDY JI",
    coverage: null,
    lat: -8.1195994,
    lon: 111.970204,
    offset: [-30, 0],
  },
  {
    treg: null,
    pe_code: "KD0",
    label: "PE HSI KD0",
    coverage: null,
    lat: -8.0375619,
    lon: 112.494982,
    offset: [0, -25],
  },
  {
    treg: null,
    pe_code: "ML0",
    label: "PE HSI ML0",
    coverage: null,
    lat: -8.1469415,
    lon: 112.964521,
    offset: [30, 0],
  },
  {
    treg: "TREG5",
    pe_code: "RKT",
    label: "PE SPEEDY R",
    coverage: "Rungkut",
    lat: -7.1614963,
    lon: 112.218783,
    offset: [-40, -20],
  },
  {
    treg: "TREG5",
    pe_code: "KBL",
    label: "PE SPEEDY KI",
    coverage: "Kebalen",
    lat: -7.4902293,
    lon: 112.660702,
    offset: [40, 20],
  },
  {
    treg: "TREG5",
    pe_code: "KLM",
    label: "PE SPEEDY KI",
    coverage: "Kaliasem",
    lat: -8.2836239,
    lon: 115.036015,
    offset: [-25, 0],
  },
  {
    treg: "TREG5",
    pe_code: "SGR",
    label: "PE HSI SGR",
    coverage: "Singaraja",
    lat: -8.6933834,
    lon: 115.146495,
    offset: [25, 0],
  },
  {
    treg: null,
    pe_code: "MTR",
    label: "PE2 SPEEDY J",
    coverage: null,
    lat: -8.4202589,
    lon: 116.555116,
    offset: [0, 0],
  },
  {
    treg: "TREG6",
    pe_code: "PTK",
    label: "PE SPEEDY P",
    coverage: "Pontianak",
    lat: 1.05046145,
    lon: 109.70537,
    offset: [0, 0],
  },
  {
    treg: "TREG6",
    pe_code: "SKK",
    label: "PE SPEEDY SI",
    coverage: "Seikakap",
    lat: 0.11144286,
    lon: 109.953949,
    offset: [0, 0],
  },
  {
    treg: "TREG6",
    pe_code: "BJM",
    label: "PE SPEEDY B",
    coverage: "Banjarmasin",
    lat: -3.5321475,
    lon: 114.649336,
    offset: [0, 0],
  },
  {
    treg: "TREG6",
    pe_code: "BPP",
    label: "PE SPEEDY B",
    coverage: "Balikpapan",
    lat: -1.1866086,
    lon: 116.499871,
    offset: [0, -25],
  },
  {
    treg: "TREG6",
    pe_code: "ULN",
    label: "PE SPEEDY U",
    coverage: "Ulin",
    lat: 0.05620308,
    lon: 116.389391,
    offset: [0, 25],
  },
  {
    treg: null,
    pe_code: "TRK",
    label: "PE HSI TRK",
    coverage: null,
    lat: 3.17567222,
    lon: 116.223672,
    offset: [0, 0],
  },
  {
    treg: "TREG7",
    pe_code: "PTR",
    label: "PE SPEEDY P",
    coverage: "Makassar",
    lat: -5.1294765,
    lon: 119.703782,
    offset: [0, 0],
  },
  {
    treg: "TREG7",
    pe_code: "BAL",
    label: "PE SPEEDY B, M",
    coverage: "Makassar",
    lat: -3.2012809,
    lon: 119.676162,
    offset: [0, 0],
  },
  {
    treg: "TREG7",
    pe_code: "PNK",
    label: "PE SPEEDY PI",
    coverage: "Manado",
    lat: 1.43704854,
    lon: 125.062047,
    offset: [0, 0],
  },
  {
    treg: "TREG7",
    pe_code: "AB1",
    label: "PE HSI AB1",
    coverage: "Ambon",
    lat: -3.4770109,
    lon: 126.912582,
    offset: [0, 0],
  },
  {
    treg: null,
    pe_code: "TNT",
    label: "PE SPEEDY TI",
    coverage: null,
    lat: 0.52573444,
    lon: 127.796419,
    offset: [0, 0],
  },
  {
    treg: "TREG7",
    pe_code: "SON",
    label: "PE SPEEDY SI",
    coverage: "Sorong",
    lat: -0.6619002,
    lon: 132.353707,
    offset: [0, 0],
  },
  {
    treg: "TREG7",
    pe_code: "JAP",
    label: "PE HSI JAP",
    coverage: "Jayapura",
    lat: -2.9530602,
    lon: 140.777783,
    offset: [0, 0],
  },
  {
    treg: "TREG7",
    pe_code: "TIM",
    label: "PE SPEEDY TI",
    coverage: "Timika",
    lat: -4.5515293,
    lon: 136.330976,
    offset: [0, 0],
  },
  {
    treg: "TREG5",
    pe_code: "KPN",
    label: "PE SPEEDY KI",
    coverage: "Kupang",
    lat: -9.6749413,
    lon: 123.87439,
    offset: [0, 0],
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

// Helper to get latency cell color
function getLatencyColor(lat: number, ref: number, status?: string): string {
  if (status === "danger") return "bg-red-500 text-white";
  if (status === "warning") return "bg-yellow-500 text-white";
  if (lat <= ref) return "bg-green-500 text-white";
  return "bg-green-500 text-white";
}

// Mini chart options generator for hourly latency
function getHourlyChartOption(chartName: string) {
  const hours = Array.from({ length: 11 }, (_, i) => i + 4); // Hours 4-14
  const generateData = (base: number, variance: number) =>
    Array.from({ length: 11 }, () => base + (Math.random() - 0.5) * variance);

  return {
    title: {
      text: chartName,
      subtext: "2025-12-07 04:00:00 - 2025-12-07 14:59:59",
      left: "center",
      top: 0,
      textStyle: { fontSize: 11, fontWeight: "bold", color: "#333" },
      subtextStyle: { fontSize: 8, color: "#999" },
    },
    grid: [
      { top: 45, left: 30, right: 10, height: 50 },
      { top: 110, left: 30, right: 10, height: 50 },
    ],
    xAxis: [
      {
        type: "category",
        data: hours,
        gridIndex: 0,
        axisLabel: { show: false },
        axisLine: { lineStyle: { color: "#ddd" } },
        axisTick: { show: false },
      },
      {
        type: "category",
        data: hours,
        gridIndex: 1,
        axisLabel: { fontSize: 8, color: "#999" },
        axisLine: { lineStyle: { color: "#ddd" } },
        axisTick: { show: false },
      },
    ],
    yAxis: [
      {
        type: "value",
        gridIndex: 0,
        min: 36,
        max: 54,
        interval: 6,
        axisLabel: { fontSize: 8, color: "#999" },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "#f0f0f0" } },
      },
      {
        type: "value",
        gridIndex: 1,
        min: 6,
        max: 24,
        interval: 6,
        axisLabel: { fontSize: 8, color: "#999" },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "#f0f0f0" } },
      },
    ],
    series: [
      // Top chart series
      {
        type: "line",
        data: generateData(48, 8),
        xAxisIndex: 0,
        yAxisIndex: 0,
        lineStyle: { width: 1.5, color: "#e74c3c" },
        symbol: "circle",
        symbolSize: 4,
        itemStyle: { color: "#e74c3c" },
      },
      {
        type: "line",
        data: generateData(44, 6),
        xAxisIndex: 0,
        yAxisIndex: 0,
        lineStyle: { width: 1.5, color: "#3498db" },
        symbol: "diamond",
        symbolSize: 4,
        itemStyle: { color: "#3498db" },
      },
      {
        type: "line",
        data: generateData(46, 5),
        xAxisIndex: 0,
        yAxisIndex: 0,
        lineStyle: { width: 1.5, color: "#00bcd4" },
        symbol: "triangle",
        symbolSize: 4,
        itemStyle: { color: "#00bcd4" },
      },
      {
        type: "line",
        data: generateData(42, 4),
        xAxisIndex: 0,
        yAxisIndex: 0,
        lineStyle: { width: 1.5, color: "#2ecc71" },
        symbol: "rect",
        symbolSize: 4,
        itemStyle: { color: "#2ecc71" },
      },
      // Bottom chart series
      {
        type: "line",
        data: generateData(14, 6),
        xAxisIndex: 1,
        yAxisIndex: 1,
        lineStyle: { width: 1.5, color: "#e74c3c" },
        symbol: "circle",
        symbolSize: 4,
        itemStyle: { color: "#e74c3c" },
      },
      {
        type: "line",
        data: generateData(12, 5),
        xAxisIndex: 1,
        yAxisIndex: 1,
        lineStyle: { width: 1.5, color: "#3498db" },
        symbol: "diamond",
        symbolSize: 4,
        itemStyle: { color: "#3498db" },
      },
      {
        type: "line",
        data: generateData(16, 4),
        xAxisIndex: 1,
        yAxisIndex: 1,
        lineStyle: { width: 1.5, color: "#00bcd4" },
        symbol: "triangle",
        symbolSize: 4,
        itemStyle: { color: "#00bcd4" },
      },
      {
        type: "line",
        data: generateData(10, 3),
        xAxisIndex: 1,
        yAxisIndex: 1,
        lineStyle: { width: 1.5, color: "#2ecc71" },
        symbol: "rect",
        symbolSize: 4,
        itemStyle: { color: "#2ecc71" },
      },
    ],
    tooltip: {
      trigger: "axis",
      textStyle: { fontSize: 10 },
      axisPointer: { type: "line" },
    },
  };
}

// EBR to Gateway Slide (Slide 2)
function EBRGatewaySlide({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-[calc(100vh-62px)]">
      {/* Header */}
      <div className="px-4 py-3 flex items-center">
        <h2 className="relative text-lg font-bold text-[#1479c3] pb-1 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:w-[140px] after:bg-[#1479c3]">
          EBR to GATEWAY
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 px-5">
        {/* Table Header */}
        <div className="flex">
          {/* Left: Data Columns Header */}
          <div
            className="flex-1 pl-2"
            style={{ direction: "rtl", scrollbarGutter: "stable" }}
          >
            <table
              className="w-full text-xs border-collapse table-fixed"
              style={{ direction: "ltr" }}
            >
              <colgroup>
                <col className="w-[5px]" />
                <col className="w-[100px]" />
                <col className="w-[50px]" />
                <col className="w-[50px]" />
                <col className="w-[50px]" />
                <col className="w-[50px]" />
                <col className="w-[50px]" />
                <col className="w-[50px]" />
              </colgroup>
              <thead className="font-bold text-center text-[#5e5e5e]">
                <tr>
                  <th
                    className="px-2 py-1 border-r-2 border-dashed border-gray-400"
                    rowSpan={2}
                    colSpan={2}
                  />
                  <th
                    className="px-2 py-1 border-r-2 border-dashed border-gray-400"
                    colSpan={2}
                  >
                    BDS
                  </th>
                  <th
                    className="px-2 py-1 border-r-2 border-dashed border-gray-400"
                    colSpan={2}
                  >
                    BTC
                  </th>
                  <th
                    className="px-2 py-1 border-r-2 border-dashed border-gray-400"
                    colSpan={2}
                  >
                    PNK
                  </th>
                </tr>
                <tr>
                  <th className="px-2 py-1 border-r-2 border-dashed border-gray-300">
                    Reference
                  </th>
                  <th className="px-2 py-1 border-r-2 border-dashed border-gray-400">
                    Latency
                  </th>
                  <th className="px-2 py-1 border-r-2 border-dashed border-gray-300">
                    Reference
                  </th>
                  <th className="px-2 py-1 border-r-2 border-dashed border-gray-400">
                    Latency
                  </th>
                  <th className="px-2 py-1 border-r-2 border-dashed border-gray-300">
                    Reference
                  </th>
                  <th className="px-2 py-1 border-r-2 border-dashed border-gray-400">
                    Latency
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          {/* Right: Hourly Latency Header */}
          <div className="flex-1 flex items-center justify-center font-bold text-xs text-[#5e5e5e]">
            Hourly Latency
          </div>
        </div>

        {/* Territory Groups */}
        {ebrGatewayData.territories.map((territory, territoryIndex) => (
          <React.Fragment key={territory.id}>
            <div className="flex bg-white rounded-lg">
              {/* Left: Territory Name + Data Rows */}
              <div className="flex-1">
                {/* Territory Name Row */}
                <div
                  className="pl-2"
                  style={{ direction: "rtl", scrollbarGutter: "stable" }}
                >
                  <table
                    className="w-full text-xs border-collapse text-[#5e5e5e] table-fixed"
                    style={{ direction: "ltr" }}
                  >
                    <colgroup>
                      <col className="w-[5px]" />
                      <col className="w-[100px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td
                          colSpan={2}
                          className="pl-0 pr-2 py-1.5 font-bold border-r-2 border-dashed border-gray-400"
                        >
                          {territory.name}
                        </td>
                        <td
                          colSpan={2}
                          className="border-r-2 border-dashed border-gray-400"
                        ></td>
                        <td
                          colSpan={2}
                          className="border-r-2 border-dashed border-gray-400"
                        ></td>
                        <td
                          colSpan={2}
                          className="border-r-2 border-dashed border-gray-400"
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Data Rows */}
                <div
                  className={`custom-scrollbar pl-2 ${
                    territory.entries.length > 5
                      ? "max-h-[150px] overflow-y-scroll"
                      : ""
                  }`}
                  style={{ direction: "rtl", scrollbarGutter: "stable" }}
                >
                  <table
                    className="w-full text-xs border-collapse text-[#5e5e5e] table-fixed"
                    style={{ direction: "ltr" }}
                  >
                    <colgroup>
                      <col className="w-[5px]" />
                      <col className="w-[100px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                    </colgroup>
                    <tbody>
                      {territory.entries.map((entry, idx) => (
                        <tr key={idx}>
                          <td className="pl-0 pr-1 py-1.5">{entry.no}</td>
                          <td className="pl-1 pr-2 py-1.5 font-medium border-r-2 border-dashed border-gray-400">
                            {entry.ebr}
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            {entry.bds.ref}
                          </td>
                          <td className="px-2 py-1.5 text-center border-r-2 border-dashed border-gray-400">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${getLatencyColor(
                                entry.bds.lat,
                                entry.bds.ref,
                                (entry.bds as { status?: string }).status
                              )}`}
                            >
                              {entry.bds.lat}
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            {entry.btc.ref}
                          </td>
                          <td className="px-2 py-1.5 text-center border-r-2 border-dashed border-gray-400">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${getLatencyColor(
                                entry.btc.lat,
                                entry.btc.ref,
                                (entry.btc as { status?: string }).status
                              )}`}
                            >
                              {entry.btc.lat}
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            {entry.pnk.ref}
                          </td>
                          <td className="px-2 py-1.5 text-center border-r-2 border-dashed border-gray-400">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${getLatencyColor(
                                entry.pnk.lat,
                                entry.pnk.ref
                              )}`}
                            >
                              {entry.pnk.lat}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Right: Multiple Charts */}
              <div className="flex-1 flex items-center gap-2">
                {ebrGatewayData.hourlyCharts
                  .slice(territoryIndex * 3, territoryIndex * 3 + 3)
                  .map((chart, chartIdx) => (
                    <div key={chartIdx} className="flex-1">
                      <ReactECharts
                        option={getHourlyChartOption(chart.name)}
                        style={{ height: 170, width: "100%" }}
                        opts={{ renderer: "svg" }}
                      />
                    </div>
                  ))}
              </div>
            </div>
            {/* Spacing - only show if not last territory */}
            {territoryIndex !== ebrGatewayData.territories.length - 1 && (
              <div className="flex">
                <div
                  className="flex-1 pl-2"
                  style={{ direction: "rtl", scrollbarGutter: "stable" }}
                >
                  <table
                    className="w-full text-xs border-collapse text-[#5e5e5e] table-fixed"
                    style={{ direction: "ltr" }}
                  >
                    <colgroup>
                      <col className="w-[5px]" />
                      <col className="w-[100px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                      <col className="w-[50px]" />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td
                          colSpan={2}
                          className="px-2 py-2.5 font-bold text-[#1479c3] border-r-2 border-dashed border-gray-400"
                        ></td>
                        <td
                          colSpan={2}
                          className="border-r-2 border-dashed border-gray-400"
                        ></td>
                        <td
                          colSpan={2}
                          className="border-r-2 border-dashed border-gray-400"
                        ></td>
                        <td
                          colSpan={2}
                          className="border-r-2 border-dashed border-gray-400"
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex-1"></div>
              </div>
            )}
          </React.Fragment>
        ))}
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
  const [slideIndex, setSlideIndex] = useState(0);

  // Slide 2 - EBR to Gateway
  if (slideIndex === 1) {
    return <EBRGatewaySlide onBack={() => setSlideIndex(0)} />;
  }

  return (
    <>
      {/* Filter Bar */}
      <div className="px-4 py-2 flex items-center gap-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm bg-white px-4 py-1.5 rounded-lg">
          <span className="font-bold text-[#00838f]">Date:</span>
          <span className="text-gray-700">8-12-2025</span>
        </div>
        <div className="flex items-center gap-2 text-sm bg-white px-4 py-1.5 rounded-lg">
          <span className="font-bold text-[#00838f]">Hour:</span>
          <span className="text-gray-700">06:00 WIB</span>
        </div>
        <Button
          type="primary"
          icon={<FilterOutlined />}
          shape="round"
          className="!bg-[#002060]"
          size="middle"
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
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-gray-200 p-4 flex flex-col gap-4">
          {/* Nation Wide Stats */}
          <div>
            <h3 className="text-[#00838f] font-bold text-lg mb-2 text-center border-b-2 border-[#002060] pb-2">
              NATION WIDE
            </h3>

            {/* Donut Chart using ECharts */}
            <ReactECharts
              option={{
                tooltip: {
                  trigger: "item",
                  formatter: "{b}: {c} Link ({d}%)",
                },
                graphic: [
                  {
                    type: "text",
                    left: "center",
                    top: "43%",
                    style: {
                      text: "308Link",
                      fontSize: 18,
                      fontWeight: "bold",
                      fill: "#333",
                    },
                  },
                  {
                    type: "text",
                    left: "center",
                    top: "54%",
                    style: {
                      text: "EBR to GW",
                      fontSize: 11,
                      fill: "#666",
                    },
                  },
                ],
                series: [
                  {
                    type: "pie",
                    radius: ["35%", "55%"],
                    center: ["50%", "50%"],
                    avoidLabelOverlap: true,
                    startAngle: 60,
                    label: {
                      show: true,
                      position: "outside",
                      formatter: "{value|{c}} {unit|Link}\n{name|{b}}",
                      rich: {
                        value: {
                          fontSize: 12,
                          fontWeight: "bold",
                        },
                        unit: {
                          fontSize: 10,
                        },
                        name: {
                          fontSize: 9,
                          color: "#666",
                        },
                      },
                    },
                    labelLine: {
                      show: true,
                      length: 15,
                      length2: 20,
                      lineStyle: {
                        color: "#999",
                      },
                    },
                    data: [
                      {
                        value: 28,
                        name: "DEGRADE",
                        itemStyle: { color: "#dc2626" },
                        label: { color: "#dc2626" },
                      },
                      {
                        value: 10,
                        name: "IMPROVE",
                        itemStyle: { color: "#0ea5e9" },
                        label: { color: "#0ea5e9" },
                      },
                      {
                        value: 270,
                        name: "MAINTAIN",
                        itemStyle: { color: "#22c55e" },
                        label: { color: "#22c55e" },
                      },
                    ],
                  },
                ],
              }}
              style={{ height: 250, width: "100%" }}
              opts={{ renderer: "svg" }}
            />
          </div>

          {/* Gateway Section */}
          <div>
            <h3 className="text-[#00838f] font-bold text-lg mb-3">GATEWAY</h3>
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
        <div className="flex-1 flex flex-col">
          {/* Link Route CTI Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#00838f] font-bold text-sm">
                LINK ROUTE CTI
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-xs">
                  Latency End-to-End:{" "}
                  <span className="bg-[#00838f] text-white px-2 py-0.5 rounded">
                    31 ms
                  </span>
                </span>
                <span className="text-yellow-600 flex items-center gap-1 text-xs">
                  Asymmetric <span className="text-yellow-500">⚠️</span>
                </span>
              </div>
            </div>

            {/* Network Path - Uplink and Downlink */}
            <div className="flex items-center justify-center gap-0 relative">
              {/* EBR */}
              <NetworkNodeLarge label="EBR" type="router" />

              {/* Uplink Line with 1ms */}
              <div className="flex flex-col items-center mx-1">
                <span className="text-[10px] bg-[#22c55e] text-white px-1.5 py-0.5 rounded mb-0.5">
                  1 ms
                </span>
                <div className="w-12 h-0.5 bg-[#00838f]"></div>
              </div>

              {/* PE TRANSIT */}
              <NetworkNodeLarge label="PE TRANSIT" type="switch" />

              {/* Line with 1ms */}
              <div className="flex flex-col items-center mx-1">
                <span className="text-[10px] bg-[#22c55e] text-white px-1.5 py-0.5 rounded mb-0.5">
                  1 ms
                </span>
                <div className="w-12 h-0.5 bg-[#00838f]"></div>
              </div>

              {/* P */}
              <NetworkNodeLarge label="P" type="switch" />

              {/* Line with 12ms */}
              <div className="flex flex-col items-center mx-1">
                <span className="text-[10px] bg-[#22c55e] text-white px-1.5 py-0.5 rounded mb-0.5">
                  12 ms
                </span>
                <div className="w-12 h-0.5 bg-[#00838f]"></div>
              </div>

              {/* Cloud IPBB Telkom */}
              <NetworkNodeLarge label="Cloud IPBB Telkom" type="cloud" />

              {/* IGW/DGW with warning */}
              <div className="flex flex-col items-center mx-2">
                <div className="w-12 h-0.5 bg-[#00838f]"></div>
              </div>
              <div className="relative">
                <NetworkNodeLarge label="IGW/DGW" type="router" />
                <span className="absolute -top-1 -right-1 text-yellow-500 text-lg">
                  ⚠️
                </span>
              </div>

              {/* Downlink Line with 15ms */}
              <div className="flex flex-col items-center mx-1">
                <span className="text-[10px] bg-[#f97316] text-white px-1.5 py-0.5 rounded mb-0.5">
                  15 ms
                </span>
                <div className="w-12 h-0.5 bg-[#00838f]"></div>
              </div>

              {/* Cloud IPBB Telkom (Downlink) */}
              <NetworkNodeLarge label="Cloud IPBB Telkom" type="cloud" />

              {/* Line with 1ms */}
              <div className="flex flex-col items-center mx-1">
                <span className="text-[10px] bg-[#22c55e] text-white px-1.5 py-0.5 rounded mb-0.5">
                  1 ms
                </span>
                <div className="w-12 h-0.5 bg-[#00838f]"></div>
              </div>

              {/* P */}
              <NetworkNodeLarge label="P" type="switch" />

              {/* Line with 1ms */}
              <div className="flex flex-col items-center mx-1">
                <span className="text-[10px] bg-[#22c55e] text-white px-1.5 py-0.5 rounded mb-0.5">
                  1 ms
                </span>
                <div className="w-12 h-0.5 bg-[#00838f]"></div>
              </div>

              {/* PE TRANSIT */}
              <NetworkNodeLarge label="PE TRANSIT" type="switch" />

              {/* Line with 1ms */}
              <div className="flex flex-col items-center mx-1">
                <span className="text-[10px] bg-[#22c55e] text-white px-1.5 py-0.5 rounded mb-0.5">
                  1 ms
                </span>
                <div className="w-12 h-0.5 bg-[#00838f]"></div>
              </div>

              {/* EBR */}
              <NetworkNodeLarge label="EBR" type="router" />
            </div>

            {/* Uplink/Downlink Labels */}
            <div className="flex justify-center items-center gap-8 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Uplink</span>
                <div className="flex items-center">
                  <div className="w-24 h-1 bg-[#00838f]"></div>
                  <span className="text-[#00838f]">▶</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Downlink</span>
                <div className="flex items-center">
                  <div className="w-24 h-1 bg-[#00838f]"></div>
                  <span className="text-[#00838f]">▶</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map with Indonesia Territory Overlay */}
          <div className="flex-1 relative">
            <Map
              {...viewState}
              // Remove onMove to prevent updating viewState
              mapboxAccessToken={config.mapbox.accessToken}
              style={{ width: "100%", height: "100%", background: "#c5e8f0" }}
              mapStyle="mapbox://styles/mapbox/light-v11"
              attributionControl={false}
              projection={{ name: "mercator" }}
              dragPan={false}
              dragRotate={false}
              scrollZoom={false}
              doubleClickZoom={false}
              touchZoomRotate={false}
              keyboard={false}
              interactive={false}
            >
              {/* EBR Location Markers with offset */}
              {ebrLocations.map((location) => (
                <Marker
                  key={location.pe_code}
                  longitude={location.lon}
                  latitude={location.lat}
                  anchor="center"
                  offset={location.offset as [number, number]}
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={routerMapIcon}
                      alt={location.pe_code}
                      className="w-12 h-12 object-contain"
                    />
                    <span className="text-[10px] font-bold text-[#00838f] bg-white px-1.5 py-0.5 rounded shadow -mt-2">
                      {location.pe_code}
                    </span>
                  </div>
                </Marker>
              ))}
            </Map>

            {/* Territory Marker */}
            {/* <div className="absolute bottom-20 left-1/4 bg-white rounded-lg shadow-lg p-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#00838f] font-bold">TERRITORY 1</span>
                <span className="bg-green-500 text-white px-1 rounded text-[10px]">
                  100%
                </span>
              </div>
              <div className="text-yellow-600 font-bold">18 EBR</div>
            </div> */}
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
