import React from "react";

export const PIE_COLORS = [
  "#2d5f8a", "#1a6b5a", "#8b6d3f", "#6b4c7a", "#b8602a",
  "#4a7c7c", "#7a5c3f", "#5a6b8a", "#8a6060", "#5c7a5a",
];

export const TT = {
  contentStyle: { background: "#1b2844", border: "none", borderRadius: "8px", padding: "8px 12px", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", fontSize: "11px" },
  itemStyle: { color: "rgba(255,255,255,0.85)", padding: "1px 0" },
  labelStyle: { color: "#fff", fontWeight: 600 as const, marginBottom: "2px" },
};

export const AX = {
  tick: { fontSize: 10, fill: "#8a919e" },
  axisLine: { stroke: "#e8e5df" },
  tickLine: false as const,
};

export function StatCard({ icon: Icon, label, value, sub, accent = "#1a6b5a", delay = 0 }: {
  icon: React.ElementType; label: string; value: string; sub?: string; accent?: string; delay?: number;
}) {
  return (
    <div className="card animate-in" style={{ animationDelay: `${delay}s` }}>
      <div className="px-4 py-3.5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}10` }}>
            <Icon className="w-4 h-4" style={{ color: accent }} />
          </div>
          <span className="text-[11px] font-medium" style={{ color: "#8a919e" }}>{label}</span>
        </div>
        <p className="text-[22px] font-bold leading-none tracking-tight" style={{ fontFamily: "var(--font-mono)", color: "#1a1d24" }}>{value}</p>
        {sub && <p className="text-[10px] mt-1.5" style={{ color: "#8a919e" }}>{sub}</p>}
      </div>
    </div>
  );
}

export function Section({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  return <div className={`card p-4 animate-in ${className}`} style={{ animationDelay: `${delay}s` }}>{children}</div>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[12px] font-semibold mb-3" style={{ color: "#4a5568" }}>{children}</h3>;
}

export function ProgressBar({ label, spent, total, color = "#1a6b5a", delay = 0 }: {
  label: string; spent: number; total: number; color?: string; delay?: number;
}) {
  const { formatKRW } = require("@/lib/mock-data");
  const rate = total > 0 ? ((spent / total) * 100).toFixed(1) : "0";
  return (
    <div className="card px-4 py-3 animate-in" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold" style={{ color: "#4a5568" }}>{label}</span>
        <span className="text-[12px] font-bold font-mono" style={{ color }}>{rate}%</span>
      </div>
      <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: "#f0ede8" }}>
        <div className="h-full rounded-full"
          style={{ width: `${Math.min(Number(rate), 100)}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }} />
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
