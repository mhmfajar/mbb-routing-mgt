/**
 * Get Tailwind CSS classes for latency status color
 */
export function getLatencyColor(status: string): string {
  if (status === "not clear") return "bg-red-500 text-white";
  return "bg-green-500 text-white";
}
