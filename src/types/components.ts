// Component prop types

import type { NodeType } from "./common";

export interface NetworkNodeProps {
  label: string;
  type: NodeType;
}

export interface NetworkNodeLargeProps {
  label: string;
  type: string;
}

export interface LatencyBadgeProps {
  value: number;
}

export interface GatewayCardProps {
  name: string;
  percentage: number;
  color: string;
  maintainLink: number;
  degradeLink: number;
  improveLink: number;
}

// Chart component props
export type MiniChartProps = {
  chartData: Record<string, { name: string; data: number[]; type: string }>;
  height: number;
  title: string;
  subtitle?: string;
};

export type NationWideDonutChartProps = {
  maintain: number;
  degrade: number;
  improve: number;
};
