import React from "react";

/* PrimeX Brand Palette */
export const BRAND = "#6366f1";

export const PIE_COLORS = [
  "#6366f1", "#16a34a", "#ea580c", "#8b5cf6", "#0891b2",
  "#dc2626", "#ca8a04", "#2563eb", "#db2777", "#059669",
];

/* PrimeX Tooltip: white bg, subtle shadow */
export const TT = {
  contentStyle: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "10px 14px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    fontSize: "12px",
    color: "#111827",
  },
  itemStyle: { color: "#6b7280", padding: "2px 0" },
  labelStyle: { color: "#111827", fontWeight: 600 as const, marginBottom: "4px" },
};

/* PrimeX Axis: very light, minimal */
export const AX = {
  tick: { fontSize: 12, fill: "#94a3b8" },
  axisLine: { stroke: "#f1f5f9" },
  tickLine: false as const,
};

/* PrimeX Stat Card: icon top-right, number prominent */
export function StatCard({ icon: Icon, label, value, sub, accent, delay = 0 }: {
  icon: React.ElementType; label: string; value: string; sub?: string; accent?: string; delay?: number;
}) {
  return (
    <div className="card animate-in" style={{ animationDelay: `${delay}s` }}>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">{label}</span>
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <p className="mt-2 text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-mono)" }}>{value}</p>
        {sub && (
          <p className="mt-1 text-sm" style={{ color: accent || "#6b7280" }}>{sub}</p>
        )}
      </div>
    </div>
  );
}

/* PrimeX Section Card */
export function Section({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  return <div className={`card p-6 animate-in ${className}`} style={{ animationDelay: `${delay}s` }}>{children}</div>;
}

/* PrimeX Section Title */
export function Title({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-lg font-semibold text-gray-900">{children}</h3>;
}

/* Progress Bar */
export function ProgressBar({ label, spent, total, color = "#6366f1", delay = 0 }: {
  label: string; spent: number; total: number; color?: string; delay?: number;
}) {
  const { formatKRW } = require("@/lib/mock-data");
  const rate = total > 0 ? ((spent / total) * 100).toFixed(1) : "0";
  return (
    <div className="card px-6 py-4 animate-in" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold font-mono" style={{ color }}>{rate}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-100">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(Number(rate), 100)}%`, background: color }} />
      </div>
      <div className="flex justify-between mt-2 text-xs font-mono text-gray-400">
        <span>0</span><span>{formatKRW(total)}</span>
      </div>
    </div>
  );
}

/* PrimeX Table: uppercase headers, divide-y */
export function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {headers.map((h, i) => (
              <th key={h} className={`pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-gray-500 ${i > 0 ? "text-right" : "text-left"}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">{children}</tbody>
      </table>
    </div>
  );
}

/* PrimeX Table Row */
export function TR({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr className={`transition-colors hover:bg-gray-50 ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      {children}
    </tr>
  );
}

export function TD({ children, mono, muted, right }: {
  children: React.ReactNode; mono?: boolean; muted?: boolean; right?: boolean;
}) {
  return (
    <td className={`py-3 pr-4 text-sm ${right ? "text-right" : ""} ${mono ? "font-mono" : ""} ${muted ? "text-gray-400" : "text-gray-900"}`}>
      {children}
    </td>
  );
}
