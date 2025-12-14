interface LatencyBadgeProps {
    value: string;
}

export function LatencyBadge({ value }: LatencyBadgeProps) {
    return (
        <span className="bg-[#00838f] text-white text-[10px] px-2 py-0.5 rounded">
            {value}
        </span>
    );
}
