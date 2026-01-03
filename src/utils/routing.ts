// Routing utility functions

import type { PathSegment } from "~/types";

/**
 * Determine the source type based on node value
 */
export function getSourceType(value: string, isLast: boolean): string {
    if (isLast) return "router";
    if (value.startsWith("EBR")) return "router";
    if (value.startsWith("P")) return "switch";
    return "unknown";
}

export interface MappedRoutingNode {
    value: string;
    source: string;
}

/**
 * Map path segments to nodes with source types for rendering
 */
export function mapRoutingData(data: PathSegment[]): MappedRoutingNode[] {
    const result: MappedRoutingNode[] = [];

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        // 'from' node
        if (i === 0) {
            result.push({
                value: item.from,
                source: getSourceType(item.from, false),
            });
        }
        // 'line' value
        result.push({ value: item.value, source: "line" });
        // 'to' node
        const isLast = i === data.length - 1;
        result.push({ value: item.to, source: getSourceType(item.to, isLast) });
    }

    return result;
}
