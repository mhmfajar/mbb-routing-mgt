import cloudImage from "~/assets/cloud.webp";
import routerImage from "~/assets/router.webp";
import switchImage from "~/assets/switch.webp";

type NodeType = "router" | "switch" | "cloud";

interface NetworkNodeLargeProps {
  label: string;
  type: NodeType;
}

export function NetworkNodeLarge({ label, type }: NetworkNodeLargeProps) {
  const imageSrc =
    type === "cloud"
      ? cloudImage
      : type === "router"
      ? routerImage
      : switchImage;

  return (
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 rounded-lg flex items-center justify-center`}>
        <img src={imageSrc} alt={type} className="object-contain" />
      </div>
      <span className="text-xs text-gray-600 mt-2 text-center max-w-[80px]">
        {label}
      </span>
    </div>
  );
}
