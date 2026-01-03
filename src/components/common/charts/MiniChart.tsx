import * as echarts from "echarts";
import { useEffect, useRef } from "react";

import type { MiniChartProps } from "~/types";

/**
 * Mini chart component for trend visualization
 */
export function MiniChart({
  chartData,
  height,
  title,
  subtitle,
}: MiniChartProps) {
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
            result += `${item.marker} ${item.seriesName}: <b>${
              item.value?.toFixed(2) || "-"
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
  }, [chartData, title, subtitle]);

  return <div ref={chartRef} style={{ height, width: "100%" }} />;
}
