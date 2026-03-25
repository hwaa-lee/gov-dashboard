"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Search,
  MapPin,
  ShoppingBag,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { renderPieLabel } from "./PieLabel";
import {
  blockLogs,
  blockSummary,
  blockByCardCompany,
  formatKRW,
  type BlockLog,
} from "@/lib/mock-data";

const TYPE_COLORS: Record<string, string> = {
  region: "#9e3328",
  industry: "#b06828",
  period: "#6b4c7a",
};

const TYPE_LABELS: Record<string, string> = {
  region: "지역 위반",
  industry: "업종 위반",
  period: "기간 위반",
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  region: MapPin,
  industry: ShoppingBag,
  period: Clock,
};

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#1b2844",
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
    fontSize: "12px",
  },
  itemStyle: { color: "rgba(255,255,255,0.85)", padding: "2px 0" },
  labelStyle: { color: "#fff", fontWeight: 600 as const },
};

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md"
      style={{
        background: `${TYPE_COLORS[type]}0c`,
        color: TYPE_COLORS[type],
      }}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}

export default function BlockLogView() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCard, setFilterCard] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = blockLogs.filter((log) => {
    if (filterType !== "all" && log.violationType !== filterType) return false;
    if (filterCard !== "all" && log.cardCompany !== filterCard) return false;
    if (
      searchQuery &&
      !log.intentId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.industry.includes(searchQuery)
    )
      return false;
    return true;
  });

  const pieData = blockSummary.map((s) => ({
    name: s.type,
    value: s.count,
    code: s.code,
  }));

  return (
    <div className="space-y-6">
      {/* Violation Type Cards */}
      <div className="grid grid-cols-3 gap-4">
        {blockSummary.map((s, idx) => {
          const Icon = TYPE_ICONS[s.code];
          const isSelected = filterType === s.code;
          return (
            <div
              key={s.code}
              className={`card card-interactive animate-in ${isSelected ? "ring-2" : ""}`}
              style={{
                animationDelay: `${0.02 + idx * 0.04}s`,
                // @ts-expect-error ring color
                "--tw-ring-color": isSelected ? TYPE_COLORS[s.code] : "transparent",
              }}
              onClick={() => setFilterType(filterType === s.code ? "all" : s.code)}
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${TYPE_COLORS[s.code]}0c` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: TYPE_COLORS[s.code] }} />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: "#8a919e" }}>
                    {s.type}
                  </span>
                </div>
                <p className="text-[28px] font-bold leading-none tracking-tight" style={{ fontFamily: "var(--font-mono)", color: "#1a1d24" }}>
                  {s.count}
                  <span className="text-sm font-normal ml-0.5" style={{ color: "#b4b9c4" }}>건</span>
                </p>
                <p className="text-[11px] font-mono mt-2" style={{ color: "#8a919e" }}>{s.ratio}%</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Company Filter */}
      <div className="card p-4 animate-in stagger-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: "#8a919e" }}>
            카드사
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterCard("all")}
              className="chip"
              style={{
                background: filterCard === "all" ? "#1b2844" : "var(--bg)",
                color: filterCard === "all" ? "#fff" : "#4a5568",
                border: filterCard === "all" ? "1px solid #1b2844" : "1px solid var(--border)",
              }}
            >
              전체
            </button>
            {blockByCardCompany.map((c) => {
              const sel = filterCard === c.company;
              return (
                <button
                  key={c.company}
                  onClick={() => setFilterCard(sel ? "all" : c.company)}
                  className="chip"
                  style={{
                    background: sel ? "#1b2844" : "var(--bg)",
                    color: sel ? "#fff" : "#4a5568",
                    border: sel ? "1px solid #1b2844" : "1px solid var(--border)",
                  }}
                >
                  {c.company}
                  <span className="ml-1 font-mono text-[10px]" style={{ opacity: 0.5 }}>{c.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="card p-4 md:p-5 md:p-6 animate-in stagger-5">
          <h3 className="text-[13px] font-semibold mb-5" style={{ color: "#4a5568" }}>
            위반 유형 분포
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                dataKey="value"
                label={renderPieLabel}
                labelLine={false}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.code} fill={TYPE_COLORS[entry.code]} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Log Table */}
        <div className="lg:col-span-2 card p-4 md:p-5 md:p-6 animate-in stagger-6">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: "#4a5568" }}>
              <ShieldAlert className="w-4 h-4" style={{ color: "#9e3328" }} />
              차단 로그
            </h3>
            <div className="ml-auto">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#b4b9c4" }} />
                <input
                  type="text"
                  placeholder="intentId / 업종 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-[12px] rounded-lg"
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--bg-warm)",
                    color: "#1a1d24",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0" style={{ background: "var(--surface)" }}>
                <tr className="table-header">
                  <th className="text-left">시각</th>
                  <th className="text-left">INTENT ID</th>
                  <th className="text-left">유형</th>
                  <th className="text-left">업종</th>
                  <th className="text-left">카드사</th>
                  <th className="text-right">금액</th>
                  <th style={{ width: 32 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <LogRow
                    key={log.id}
                    log={log}
                    index={i}
                    expanded={expandedId === log.id}
                    onToggle={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-[13px]" style={{ color: "#b4b9c4" }}>
                      검색 결과 없음
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogRow({
  log,
  index,
  expanded,
  onToggle,
}: {
  log: BlockLog;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const time = new Date(log.timestamp).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <>
      <tr
        className="table-row table-row-hover cursor-pointer"
        onClick={onToggle}
        style={{
          borderBottom: expanded ? "none" : undefined,
          background: index % 2 === 1 ? "var(--bg-warm)" : "transparent",
        }}
      >
        <td className="font-mono text-xs" style={{ color: "#8a919e" }}>{time}</td>
        <td className="font-mono text-xs" style={{ color: "#2d5f8a" }}>{log.intentId}</td>
        <td><TypeBadge type={log.violationType} /></td>
        <td className="text-[13px]" style={{ color: "#4a5568" }}>{log.industry}</td>
        <td className="text-[13px]" style={{ color: "#4a5568" }}>{log.cardCompany}</td>
        <td className="text-right font-mono text-xs" style={{ color: "#1a1d24" }}>{formatKRW(log.amount)}</td>
        <td>
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5" style={{ color: "#b4b9c4" }} />
            : <ChevronDown className="w-3.5 h-3.5" style={{ color: "#b4b9c4" }} />
          }
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} className="px-4 py-4" style={{ background: "var(--bg-warm)", borderBottom: "1px solid var(--border-light)" }}>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: "#8a919e" }}>사유 코드</span>
                <p className="font-mono font-medium mt-1" style={{ color: "#1a1d24" }}>{log.reasonCode}</p>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: "#8a919e" }}>지역</span>
                <p className="font-medium mt-1" style={{ color: "#1a1d24" }}>{log.region}</p>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: "#8a919e" }}>MCC</span>
                <p className="font-mono font-medium mt-1" style={{ color: "#1a1d24" }}>{log.mcc}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
