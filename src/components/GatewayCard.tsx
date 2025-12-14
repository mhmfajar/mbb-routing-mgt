interface GatewayCardProps {
    name: string;
    percentage: number;
    color: string;
}

export function GatewayCard({ name, percentage, color }: GatewayCardProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs">
                    IGW <span style={{ color }} className="font-bold">{name}</span>
                </span>
                <span className="text-xs font-bold" style={{ color }}>
                    {percentage}%
                </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>65 Link</span>
                <span>14 Link</span>
                <span>0 Link</span>
            </div>
        </div>
    );
}
