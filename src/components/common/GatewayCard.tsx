import type { GatewayCardProps } from "~/types";

export function GatewayCard({
  name,
  percentage,
  maintainLink = 65,
  degradeLink = 14,
  improveLink = 0,
}: GatewayCardProps) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        {/* IGW Name */}
        <div className="w-16 text-xxs font-medium">
          <span className="text-gray-600">IGW </span>
          <span className="text-[#00838f] font-bold underline decoration-2">
            {name}
          </span>
        </div>

        {/* Colored boxes */}
        <div className="flex gap-1.5 flex-1">
          {/* Green box - Maintain with percentage */}
          <div className="flex-1 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-lg flex flex-col items-center justify-center py-2 px-3">
            <span className="text-white text-sm font-bold leading-tight">
              {percentage}%
            </span>
            <span className="text-white text-xxs font-medium underline">
              {maintainLink} Link
            </span>
          </div>

          {/* Red box - Degrade */}
          <div className="bg-[#be185d] rounded-lg flex flex-col items-center justify-center py-2 px-4">
            <span className="text-white text-sm font-bold underline">
              {degradeLink}
            </span>
            <span className="text-white text-xxs">Link</span>
          </div>

          {/* Blue box - Improve */}
          <div className="bg-[#0ea5e9] rounded-lg flex flex-col items-center justify-center py-2 px-4">
            <span className="text-white text-sm font-bold underline">
              {improveLink}
            </span>
            <span className="text-white text-xxs">Link</span>
          </div>
        </div>
      </div>
    </div>
  );
}
