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

const TYPE_BG: Record<string, string> = {
  region: "#faf0ee",
  industry: "#faf3ec",
  period: "#f4f0f6",
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
    borderRadius: "6px",
    padding: "10px 14px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    fontSize: "12px",
  },
  itemStyle: { color: "rgba(255,255,255,0.85)", padding: "2px 0" },
  labelStyle: { color: "#fff", fontWeight: 600 as const },
};

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded"
      style={{ background: TYPE_BG[type], color: TYPE_COLORS[type] }}
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
      {/* Violation Type Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {blockSummary.map((s) => {
          const Icon = TYPE_ICONS[s.code];
          const isSelected = filterType === s.code;
          return (
            <div
              key={s.code}
              className="bg-white rounded-lg overflow-hidden cursor-pointer transition-all"
              style={{
                border: isSelected
                  ? `2px solid ${TYPE_COLORS[s.code]}`
                  : "1px solid #eae7e0",
                boxShadow: isSelected
                  ? `0 0 0 1px ${TYPE_COLORS[s.code]}20`
                  : "0 1px 2px rgba(0,0,0,0.04)",
              }}
              onClick={() =>
                setFilterType(filterType === s.code ? "all" : s.code)
              }
            >
              <div className="h-[3px]" style={{ background: TYPE_COLORS[s.code] }} />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: TYPE_COLORS[s.code] }} />
                  <span className="text-xs font-medium" style={{ color: "#475569" }}>
                    {s.type}
                  </span>
                </div>
                <p
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-mono)", color: "#1e293b" }}
                >
                  {s.count}
                  <span className="text-sm font-normal ml-0.5" style={{ color: "#94a3b8" }}>건</span>
                </p>
                <p className="text-xs font-mono mt-1" style={{ color: "#94a3b8" }}>
                  {s.ratio}%
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Company Filter */}
      <div
        className="bg-white rounded-lg p-4"
        style={{
          border: "1px solid #eae7e0",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <span className="text-xs font-medium mr-3" style={{ color: "#475569" }}>
          카드사 필터
        </span>
        <div className="inline-flex flex-wrap gap-2 mt-2">
          <button
            onClick={() => setFilterCard("all")}
            className="px-3 py-1 text-xs rounded-full font-medium transition-all cursor-pointer"
            style={{
              background: filterCard === "all" ? "#1b2844" : "#f5f3ef",
              color: filterCard === "all" ? "#fff" : "#475569",
              border: filterCard === "all" ? "1px solid #1b2844" : "1px solid #ddd9d0",
            }}
          >
            전체
          </button>
          {blockByCardCompany.map((c) => {
            const isSelected = filterCard === c.company;
            return (
              <button
                key={c.company}
                onClick={() =>
                  setFilterCard(isSelected ? "all" : c.company)
                }
                className="px-3 py-1 text-xs rounded-full font-medium transition-all cursor-pointer"
                style={{
                  background: isSelected ? "#1b2844" : "#f5f3ef",
                  color: isSelected ? "#fff" : "#475569",
                  border: isSelected ? "1px solid #1b2844" : "1px solid #ddd9d0",
                }}
              >
                {c.company}
                <span
                  className="ml-1 font-mono"
                  style={{ color: isSelected ? "rgba(255,255,255,0.6)" : "#94a3b8" }}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div
          className="bg-white rounded-lg p-5"
          style={{
            border: "1px solid #eae7e0",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <h3 className="text-[13px] font-semibold mb-4" style={{ color: "#475569" }}>
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
        <div
          className="lg:col-span-2 bg-white rounded-lg p-5"
          style={{
            border: "1px solid #eae7e0",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <h3
              className="text-[13px] font-semibold flex items-center gap-1.5"
              style={{ color: "#475569" }}
            >
              <ShieldAlert className="w-4 h-4" style={{ color: "#9e3328" }} />
              차단 로그 상세
            </h3>
            <div className="ml-auto">
              <div className="relative">
                <Search
                  className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: "#94a3b8" }}
                />
                <input
                  type="text"
                  placeholder="intentId / 업종 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-md focus:outline-none"
                  style={{
                    border: "1px solid #ddd9d0",
                    background: "#faf9f6",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left" style={{ borderBottom: "2px solid #1b2844" }}>
                  <th className="py-2 pr-3 font-semibold" style={{ color: "#475569" }}>시각</th>
                  <th className="py-2 pr-3 font-semibold" style={{ color: "#475569" }}>intentId</th>
                  <th className="py-2 pr-3 font-semibold" style={{ color: "#475569" }}>유형</th>
                  <th className="py-2 pr-3 font-semibold" style={{ color: "#475569" }}>업종</th>
                  <th className="py-2 pr-3 font-semibold" style={{ color: "#475569" }}>카드사</th>
                  <th className="py-2 pr-3 font-semibold text-right" style={{ color: "#475569" }}>금액</th>
                  <th className="py-2 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <LogRow
                    key={log.id}
                    log={log}
                    index={i}
                    expanded={expandedId === log.id}
                    onToggle={() =>
                      setExpandedId(expandedId === log.id ? null : log.id)
                    }
                  />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center" style={{ color: "#94a3b8" }}>
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
        className="cursor-pointer transition-colors"
        onClick={onToggle}
        style={{
          borderBottom: expanded ? "none" : "1px solid #eae7e0",
          background: index % 2 === 1 ? "#faf9f6" : "transparent",
        }}
      >
        <td className="py-2 pr-3 font-mono" style={{ color: "#94a3b8" }}>
          {time}
        </td>
        <td className="py-2 pr-3 font-mono" style={{ color: "#2d5f8a" }}>
          {log.intentId}
        </td>
        <td className="py-2 pr-3">
          <TypeBadge type={log.violationType} />
        </td>
        <td className="py-2 pr-3">{log.industry}</td>
        <td className="py-2 pr-3" style={{ color: "#475569" }}>{log.cardCompany}</td>
        <td className="py-2 pr-3 text-right font-mono">
          {formatKRW(log.amount)}
        </td>
        <td className="py-2">
          {expanded ? (
            <ChevronUp className="w-4 h-4" style={{ color: "#94a3b8" }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: "#94a3b8" }} />
          )}
        </td>
      </tr>
      {expanded && (
        <tr style={{ borderBottom: "1px solid #eae7e0" }}>
          <td colSpan={7} className="p-4" style={{ background: "#faf9f6" }}>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span style={{ color: "#94a3b8" }}>사유 코드</span>
                <p className="font-mono font-medium mt-0.5">{log.reasonCode}</p>
              </div>
              <div>
                <span style={{ color: "#94a3b8" }}>지역</span>
                <p className="font-medium mt-0.5">{log.region}</p>
              </div>
              <div>
                <span style={{ color: "#94a3b8" }}>MCC</span>
                <p className="font-mono font-medium mt-0.5">{log.mcc}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
