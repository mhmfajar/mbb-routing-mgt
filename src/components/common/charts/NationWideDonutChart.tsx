import * as echarts from "echarts";
import { useEffect, useRef } from "react";

import type { NationWideDonutChartProps } from "~/types";

/**
 * Nation Wide Donut Chart for EBR Gateway status overview
 */
export function NationWideDonutChart({
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
      animation: true,
      animationDuration: 800,
      animationEasing: "elasticOut",
      animationDelay: 0,
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      series: [
        {
          name: "EBR to GW",
          type: "pie",
          radius: ["48%", "72%"],
          center: ["50%", "54%"],
          avoidLabelOverlap: false,
          startAngle: 115,
          animationType: "scale",
          animationEasing: "elasticOut",
          label: {
            show: true,
            position: "outside",
            overflow: "none",
            formatter: (params) => {
              const nameMap: Record<string, string> = {
                Maintain: "MAINTAIN",
                Degrade: "DEGRADE",
                Improve: "IMPROVE",
              };
              return `{value|${params.value}} {unit|Link}\n{name|${
                nameMap[params.name] || params.name
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
            length: 12,
            length2: 35,
            smooth: 0.2,
          },
          labelLayout: (params) => {
            // Fixed positions for each label regardless of data values
            const labelPositions: Record<
              string,
              { x: number; y: number; align: "left" | "right" }
            > = {
              Degrade: { x: 15, y: 22, align: "left" }, // Top-left
              Improve: { x: 270, y: 22, align: "right" }, // Top-right
              Maintain: { x: 270, y: 240, align: "right" }, // Bottom-right
            };

            const name = params.text?.includes("DEGRADE")
              ? "Degrade"
              : params.text?.includes("IMPROVE")
              ? "Improve"
              : params.text?.includes("MAINTAIN")
              ? "Maintain"
              : "";

            const pos = labelPositions[name];
            if (pos && params.labelLinePoints) {
              const startPoint = params.labelLinePoints[0] as number[];
              const labelTextY = pos.y + 10;

              let middleX: number;
              let endX: number;

              if (pos.align === "left") {
                middleX = startPoint[0] - 12;
                endX = pos.x + 60;
              } else {
                middleX = startPoint[0] + 12;
                endX = pos.x - 60;
              }

              const labelLinePoints: [number, number][] = [
                [startPoint[0], startPoint[1]],
                [middleX, labelTextY],
                [endX, labelTextY],
              ];

              return {
                x: pos.x,
                y: pos.y,
                align: pos.align,
                labelLinePoints: labelLinePoints,
              };
            }
            return {};
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
          top: "46%",
          style: {
            text: `${total}Link`,
            fontSize: 20,
            fontWeight: "bold",
            fill: "#333",
          },
        },
        // Center text - subtitle
        {
          type: "text",
          left: "center",
          top: "55%",
          style: {
            text: "EBR to GW",
            fontSize: 11,
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

  return <div ref={chartRef} style={{ height: 260, width: 285 }} />;
}
