"use client";

import {
  ArrowLeftRight,
  Zap,
  Landmark,
  Users,
  Timer,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  settlementDistribution,
  settlementSummary,
  formatNumber,
} from "@/lib/mock-data";
import { renderPieLabel } from "./PieLabel";

const SC_COLOR = "#1a6b5a";
const KRW_COLOR = "#b06828";

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

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden"
      style={{
        border: "1px solid #eae7e0",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div className="h-[3px]" style={{ background: accent }} />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-4 h-4" style={{ color: accent }} />
          <span className="text-xs font-medium" style={{ color: "#475569" }}>
            {label}
          </span>
        </div>
        <p
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-mono)", color: "#1e293b" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-1.5" style={{ color: "#94a3b8" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SettlementView() {
  const s = settlementSummary;

  const pieData = [
    { name: "SC 정산", value: s.scMerchants, color: SC_COLOR },
    { name: "KRW 정산", value: s.krwMerchants, color: KRW_COLOR },
  ];

  const barData = settlementDistribution.map((m) => ({
    name: m.merchantName,
    txCount: m.txCount,
    preference: m.preference,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="참여 가맹점"
          value={`${s.totalMerchants}개`}
          sub={`SC ${s.scMerchants}개 / KRW ${s.krwMerchants}개`}
          accent="#475569"
        />
        <StatCard
          icon={Zap}
          label="SC 정산 (T+0)"
          value={`${s.scRatio}%`}
          sub={`${formatNumber(s.totalTxSC)}건 / 평균 ${s.avgLeadTimeSC}`}
          accent={SC_COLOR}
        />
        <StatCard
          icon={Landmark}
          label="KRW 정산 (T+1~2)"
          value={`${s.krwRatio}%`}
          sub={`${formatNumber(s.totalTxKRW)}건 / 평균 ${s.avgLeadTimeKRW}`}
          accent={KRW_COLOR}
        />
        <StatCard
          icon={Timer}
          label="정산 리드타임 비교"
          value={s.avgLeadTimeSC}
          sub={`SC 즉시 vs KRW ${s.avgLeadTimeKRW}`}
          accent="#8b6d3f"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie: SC vs KRW */}
        <div
          className="bg-white rounded-lg p-5"
          style={{
            border: "1px solid #eae7e0",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <h3
            className="text-[13px] font-semibold mb-4"
            style={{ color: "#475569" }}
          >
            SC / KRW 선택 비중
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={renderPieLabel}
                labelLine={false}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 text-xs">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ background: SC_COLOR }}
              />
              <span style={{ color: "#475569" }}>SC (즉시)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ background: KRW_COLOR }}
              />
              <span style={{ color: "#475569" }}>KRW (배치)</span>
            </span>
          </div>
        </div>

        {/* Bar: Merchant TX count */}
        <div
          className="lg:col-span-2 bg-white rounded-lg p-5"
          style={{
            border: "1px solid #eae7e0",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <h3
            className="text-[13px] font-semibold mb-4"
            style={{ color: "#475569" }}
          >
            가맹점별 거래 건수 (정산 선택별)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eae7e0"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#475569" }}
                axisLine={{ stroke: "#ddd9d0" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatNumber(v)}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v) => formatNumber(Number(v))}
              />
              <Bar dataKey="txCount" radius={[3, 3, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.preference === "SC" ? SC_COLOR : KRW_COLOR}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail Table */}
      <div
        className="bg-white rounded-lg p-5"
        style={{
          border: "1px solid #eae7e0",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <h3
          className="text-[13px] font-semibold mb-4"
          style={{ color: "#475569" }}
        >
          <ArrowLeftRight
            className="w-4 h-4 inline mr-1.5"
            style={{ color: "#8b6d3f" }}
          />
          가맹점별 정산 상세
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr
                className="text-left text-xs"
                style={{ borderBottom: "2px solid #1b2844" }}
              >
                <th className="py-2.5 pr-4 font-semibold" style={{ color: "#475569" }}>
                  가맹점 ID
                </th>
                <th className="py-2.5 pr-4 font-semibold" style={{ color: "#475569" }}>
                  가맹점명
                </th>
                <th className="py-2.5 pr-4 font-semibold" style={{ color: "#475569" }}>
                  정산 선택
                </th>
                <th className="py-2.5 pr-4 font-semibold text-right" style={{ color: "#475569" }}>
                  거래 건수
                </th>
                <th className="py-2.5 pr-4 font-semibold text-right" style={{ color: "#475569" }}>
                  SC 리드타임
                </th>
                <th className="py-2.5 font-semibold text-right" style={{ color: "#475569" }}>
                  KRW 리드타임
                </th>
              </tr>
            </thead>
            <tbody>
              {settlementDistribution.map((m, i) => (
                <tr
                  key={m.merchantId}
                  className="transition-colors"
                  style={{
                    borderBottom: "1px solid #eae7e0",
                    background: i % 2 === 1 ? "#faf9f6" : "transparent",
                  }}
                >
                  <td
                    className="py-2.5 pr-4 font-mono text-xs"
                    style={{ color: "#94a3b8" }}
                  >
                    {m.merchantId}
                  </td>
                  <td className="py-2.5 pr-4 font-medium">{m.merchantName}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded"
                      style={{
                        background:
                          m.preference === "SC" ? "#e8f4f0" : "#faf3ec",
                        color: m.preference === "SC" ? SC_COLOR : KRW_COLOR,
                      }}
                    >
                      {m.preference === "SC" ? (
                        <Zap className="w-3 h-3" />
                      ) : (
                        <Landmark className="w-3 h-3" />
                      )}
                      {m.preference === "SC" ? "SC (T+0)" : "KRW (T+1~2)"}
                    </span>
                  </td>
                  <td
                    className="py-2.5 pr-4 text-right font-mono text-xs"
                    style={{ color: "#475569" }}
                  >
                    {formatNumber(m.txCount)}
                  </td>
                  <td
                    className="py-2.5 pr-4 text-right font-mono text-xs"
                    style={{ color: "#94a3b8" }}
                  >
                    {m.avgLeadTimeSC}
                  </td>
                  <td
                    className="py-2.5 text-right font-mono text-xs"
                    style={{ color: "#94a3b8" }}
                  >
                    {m.avgLeadTimeKRW}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
