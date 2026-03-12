import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

function getRiskInfo(value: number) {
  if (value <= 30) return { label: "Low Risk", color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500", barColor: "from-emerald-400 to-emerald-600" };
  if (value <= 60) return { label: "Medium Risk", color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-500", barColor: "from-amber-400 to-amber-600" };
  if (value <= 80) return { label: "High Risk", color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-500", barColor: "from-orange-400 to-orange-600" };
  return { label: "Critical Risk", color: "text-red-500 dark:text-red-400", bg: "bg-red-500", barColor: "from-red-400 to-red-600" };
}

const sizeConfig = {
  sm: { width: "w-16", height: "h-1.5", text: "text-xs" },
  md: { width: "w-24", height: "h-2", text: "text-sm" },
  lg: { width: "w-32", height: "h-2.5", text: "text-base" },
};

export function RiskGauge({ value, size = "md", showLabel = true, className }: RiskGaugeProps) {
  const info = getRiskInfo(value);
  const config = sizeConfig[size];

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <div className={cn("rounded-full bg-muted overflow-hidden", config.width, config.height)}>
          <div
            className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", info.barColor)}
            style={{ width: `${Math.min(value, 100)}%` }}
          />
        </div>
        <span className={cn("font-semibold tabular-nums", config.text, info.color)}>
          {value.toFixed(0)}%
        </span>
      </div>
      {showLabel && (
        <span className={cn("text-xs font-medium", info.color)}>{info.label}</span>
      )}
    </div>
  );
}

export function RiskBadge({ category, className }: { category: string; className?: string }) {
  const styles: Record<string, string> = {
    low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    critical: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  const key = category.toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold",
        styles[key] || styles.medium,
        className
      )}
    >
      {category}
    </span>
  );
}
