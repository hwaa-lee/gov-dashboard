import React from "react";

export const PIE_COLORS = [
  "#6366f1", "#1a6b5a", "#8b6d3f", "#6b4c7a", "#ea580c",
  "#0891b2", "#7a5c3f", "#2d5f8a", "#dc2626", "#059669",
];

// PrimeX-style white tooltip
export const TT = {
  contentStyle: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "8px 12px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    fontSize: "12px",
    color: "#111827",
  },
  itemStyle: { color: "#6b7280", padding: "1px 0" },
  labelStyle: { color: "#111827", fontWeight: 600 as const, marginBottom: "2px" },
};

export const AX = {
  tick: { fontSize: 11, fill: "#9ca3af" },
  axisLine: { stroke: "#f3f4f6" },
  tickLine: false as const,
};

export function StatCard({ icon: Icon, label, value, sub, accent = "#1a6b5a", delay = 0 }: {
  icon: React.ElementType; label: string; value: string; sub?: string; accent?: string; delay?: number;
}) {
  return (
    <div className="card animate-in" style={{ animationDelay: `${delay}s` }}>
      <div className="px-5 py-4">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}12` }}>
            <Icon className="w-4 h-4" style={{ color: accent }} />
          </div>
          <span className="text-xs font-medium" style={{ color: "#6b7280" }}>{label}</span>
        </div>
        <p className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-mono)", color: "#111827" }}>{value}</p>
        {sub && <p className="text-[11px] mt-1.5" style={{ color: "#9ca3af" }}>{sub}</p>}
      </div>
    </div>
  );
}

export function Section({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  return <div className={`card p-5 animate-in ${className}`} style={{ animationDelay: `${delay}s` }}>{children}</div>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>{children}</h3>;
}

export function ProgressBar({ label, spent, total, color = "#1a6b5a", delay = 0 }: {
  label: string; spent: number; total: number; color?: string; delay?: number;
}) {
  const { formatKRW } = require("@/lib/mock-data");
  const rate = total > 0 ? ((spent / total) * 100).toFixed(1) : "0";
  return (
    <div className="card px-5 py-3.5 animate-in" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: "#374151" }}>{label}</span>
        <span className="text-sm font-bold font-mono" style={{ color }}>{rate}%</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(Number(rate), 100)}%`, background: color }} />
      </div>
    </div>
  );
}

export function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="table-header">
            {headers.map((h, i) => <th key={h} className={i > 0 ? "text-right" : "text-left"}>{h}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
