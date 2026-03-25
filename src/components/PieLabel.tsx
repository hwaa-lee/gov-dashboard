import type { PieLabelRenderProps } from "recharts";

// Custom Pie label renderer (recharts type-safe)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderPieLabel(props: PieLabelRenderProps): any {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const midAngle = Number(props.midAngle ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const name = props.name ?? "";
  const percent = Number(props.percent ?? 0);

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const pct = (percent * 100).toFixed(0);

  if (Number(pct) < 4) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#475569"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={500}
    >
      {name} {pct}%
    </text>
  );
}
