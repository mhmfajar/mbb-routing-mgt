import type { NetworkNodeProps, NodeType } from "~/types";

const ICONS: Record<NodeType, string> = {
  router: "🔷",
  switch: "❄️",
  cloud: "☁️",
};

export function NetworkNode({ label, type }: NetworkNodeProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xl">{ICONS[type]}</span>
      <span className="text-[10px] text-gray-600 mt-1">{label}</span>
    </div>
  );
}
