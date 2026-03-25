import React from "react";

export const PIE_COLORS = [
  "#2d5f8a", "#1a6b5a", "#8b6d3f", "#6b4c7a", "#b8602a",
  "#4a7c7c", "#7a5c3f", "#5a6b8a", "#8a6060", "#5c7a5a",
];

export const TT = {
  contentStyle: { background: "#1b2844", border: "none", borderRadius: "8px", padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", fontSize: "12px" },
  itemStyle: { color: "rgba(255,255,255,0.85)", padding: "2px 0" },
  labelStyle: { color: "#fff", fontWeight: 600 as const, marginBottom: "4px" },
};

export const AX = {
  tick: { fontSize: 11, fill: "#8a919e" },
  axisLine: { stroke: "#e8e5df" },
  tickLine: false as const,
};

export function StatCard({ icon: Icon, label, value, sub, accent = "#1a6b5a", delay = 0 }: {
  icon: React.ElementType; label: string; value: string; sub?: string; accent?: string; delay?: number;
}) {
  return (
    <div className="card animate-in" style={{ animationDelay: `${delay}s` }}>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${accent}10` }}>
            <Icon className="w-5 h-5" style={{ color: accent }} />
          </div>
          <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: "#8a919e" }}>{label}</span>
        </div>
        <p className="text-[28px] font-bold leading-none tracking-tight" style={{ fontFamily: "var(--font-mono)", color: "#1a1d24" }}>{value}</p>
        {sub && <p className="text-[11px] mt-2" style={{ color: "#8a919e" }}>{sub}</p>}
      </div>
    </div>
  );
}

export function Section({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  return <div className={`card p-5 md:p-6 animate-in ${className}`} style={{ animationDelay: `${delay}s` }}>{children}</div>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[13px] font-semibold mb-5" style={{ color: "#4a5568" }}>{children}</h3>;
}

export function ProgressBar({ label, spent, total, color = "#1a6b5a", delay = 0 }: {
  label: string; spent: number; total: number; color?: string; delay?: number;
}) {
  const { formatKRW } = require("@/lib/mock-data");
  const rate = total > 0 ? ((spent / total) * 100).toFixed(1) : "0";
  return (
    <Section delay={delay}>
      <Title>{label}</Title>
      <div className="w-full h-6 rounded-full overflow-hidden" style={{ background: "#f0ede8" }}>
        <div className="h-full flex items-center justify-end pr-3 text-white text-[11px] font-bold rounded-full"
          style={{ width: `${Math.min(Number(rate), 100)}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, fontFamily: "var(--font-mono)" }}>
          {rate}%
        </div>
      </div>
      <div className="flex justify-between mt-2 text-[11px] font-mono" style={{ color: "#b4b9c4" }}>
        <span>0</span><span>{formatKRW(total)}</span>
      </div>
    </Section>
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
