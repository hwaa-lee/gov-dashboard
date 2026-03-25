"use client";

import {
  Wallet,
  TrendingUp,
  MapPin,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  policyBudget,
  regionData,
  industryData,
  monthlyTrend,
  formatKRW,
  formatNumber,
} from "@/lib/mock-data";
import { renderPieLabel } from "./PieLabel";

const COLORS = [
  "#2d5f8a",
  "#1a6b5a",
  "#8b6d3f",
  "#6b4c7a",
  "#b8602a",
  "#4a7c7c",
  "#7a5c3f",
  "#5a6b8a",
  "#8a6060",
  "#5c7a5a",
];

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
  labelStyle: { color: "#fff", fontWeight: 600 as const, marginBottom: "4px" },
};

const AXIS_STYLE = {
  tick: { fontSize: 11, fill: "#94a3b8" },
  axisLine: { stroke: "#ddd9d0" },
  tickLine: false as const,
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = "#1a6b5a",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
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
          <span
            className="text-xs font-medium"
            style={{ color: "#475569" }}
          >
            {label}
          </span>
        </div>
        <p
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-mono)",
            color: "#1e293b",
          }}
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

export default function PolicyExecution() {
  const pieData = regionData.map((r) => ({
    name: r.region,
    value: r.amount,
  }));

  const trendData = monthlyTrend.map((m) => ({
    ...m,
    spentBillion: m.spent / 1_000_000_000,
    budgetBillion: m.budget / 1_000_000_000,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Wallet}
          label="총 예산"
          value={formatKRW(policyBudget.totalBudget)}
          sub={policyBudget.period}
          accent="#2d5f8a"
        />
        <StatCard
          icon={TrendingUp}
          label="집행 금액"
          value={formatKRW(policyBudget.totalSpent)}
          sub={`집행률 ${policyBudget.executionRate}%`}
          accent="#1a6b5a"
        />
        <StatCard
          icon={MapPin}
          label="집행 지역"
          value={`${regionData.length}개 지역`}
          sub="서울 최다 (25.3%)"
          accent="#6b4c7a"
        />
        <StatCard
          icon={AlertTriangle}
          label="총 차단 건수"
          value={formatNumber(
            monthlyTrend.reduce((s, m) => s + m.blocked, 0)
          )}
          sub="기간 내 정책 위반 차단"
          accent="#9e3328"
        />
      </div>

      {/* Execution Rate Bar */}
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
          예산 대비 집행률
        </h3>
        <div className="w-full h-7 rounded overflow-hidden" style={{ background: "#eae7e0" }}>
          <div
            className="h-full flex items-center justify-end pr-3 text-white text-xs font-bold transition-all"
            style={{
              width: `${policyBudget.executionRate}%`,
              background: "linear-gradient(90deg, #1a6b5a, #248a72)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {policyBudget.executionRate}%
          </div>
        </div>
        <div
          className="flex justify-between mt-2 text-xs"
          style={{ color: "#94a3b8", fontFamily: "var(--font-mono)" }}
        >
          <span>0</span>
          <span>{formatKRW(policyBudget.totalBudget)}</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Pie */}
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
            <MapPin
              className="w-4 h-4 inline mr-1.5"
              style={{ color: "#6b4c7a" }}
            />
            지역별 집행 분포
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={renderPieLabel}
                labelLine={false}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v) => formatKRW(Number(v))}
                labelFormatter={(l) => `${l}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Industry Bar */}
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
            <ShoppingBag
              className="w-4 h-4 inline mr-1.5"
              style={{ color: "#8b6d3f" }}
            />
            업종별 사용 현황
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={industryData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#eae7e0"
              />
              <XAxis
                type="number"
                tickFormatter={(v) => formatKRW(v)}
                {...AXIS_STYLE}
              />
              <YAxis
                type="category"
                dataKey="industry"
                width={80}
                tick={{ fontSize: 11, fill: "#475569" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v) => formatKRW(Number(v))}
              />
              <Bar dataKey="amount" fill="#2d5f8a" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Line */}
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
          <TrendingUp
            className="w-4 h-4 inline mr-1.5"
            style={{ color: "#1a6b5a" }}
          />
          기간별 집행 추이
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eae7e0" />
            <XAxis dataKey="month" {...AXIS_STYLE} />
            <YAxis
              yAxisId="left"
              tickFormatter={(v) => `${v}억`}
              domain={[0, 60]}
              {...AXIS_STYLE}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              {...AXIS_STYLE}
              axisLine={false}
            />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="spentBillion"
              name="집행액(억)"
              stroke="#1a6b5a"
              strokeWidth={2}
              dot={{ r: 4, fill: "#1a6b5a" }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="blocked"
              name="차단 건수"
              stroke="#9e3328"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: "#9e3328" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Region Detail Table */}
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
          지역별 상세
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr
                className="text-left text-xs"
                style={{ borderBottom: "2px solid #1b2844" }}
              >
                <th className="py-2.5 pr-4 font-semibold" style={{ color: "#475569" }}>지역</th>
                <th className="py-2.5 pr-4 font-semibold text-right" style={{ color: "#475569" }}>집행 금액</th>
                <th className="py-2.5 pr-4 font-semibold text-right" style={{ color: "#475569" }}>비중</th>
                <th className="py-2.5 font-semibold text-right" style={{ color: "#475569" }}>거래 건수</th>
              </tr>
            </thead>
            <tbody>
              {regionData.map((r, i) => (
                <tr
                  key={r.region}
                  className="transition-colors"
                  style={{
                    borderBottom: "1px solid #eae7e0",
                    background: i % 2 === 1 ? "#faf9f6" : "transparent",
                  }}
                >
                  <td className="py-2.5 pr-4 font-medium">{r.region}</td>
                  <td
                    className="py-2.5 pr-4 text-right font-mono text-xs"
                    style={{ color: "#475569" }}
                  >
                    {formatKRW(r.amount)}
                  </td>
                  <td
                    className="py-2.5 pr-4 text-right font-mono text-xs"
                    style={{ color: "#94a3b8" }}
                  >
                    {r.ratio}%
                  </td>
                  <td
                    className="py-2.5 text-right font-mono text-xs"
                    style={{ color: "#475569" }}
                  >
                    {formatNumber(r.txCount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Industry Detail Table */}
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
          업종별 상세
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr
                className="text-left text-xs"
                style={{ borderBottom: "2px solid #1b2844" }}
              >
                <th className="py-2.5 pr-4 font-semibold" style={{ color: "#475569" }}>업종</th>
                <th className="py-2.5 pr-4 font-semibold" style={{ color: "#475569" }}>MCC</th>
                <th className="py-2.5 pr-4 font-semibold text-right" style={{ color: "#475569" }}>집행 금액</th>
                <th className="py-2.5 pr-4 font-semibold text-right" style={{ color: "#475569" }}>비중</th>
                <th className="py-2.5 font-semibold text-right" style={{ color: "#475569" }}>거래 건수</th>
              </tr>
            </thead>
            <tbody>
              {industryData.map((ind, i) => (
                <tr
                  key={ind.industry}
                  className="transition-colors"
                  style={{
                    borderBottom: "1px solid #eae7e0",
                    background: i % 2 === 1 ? "#faf9f6" : "transparent",
                  }}
                >
                  <td className="py-2.5 pr-4 font-medium">{ind.industry}</td>
                  <td
                    className="py-2.5 pr-4 font-mono text-xs"
                    style={{ color: "#94a3b8" }}
                  >
                    {ind.mcc}
                  </td>
                  <td
                    className="py-2.5 pr-4 text-right font-mono text-xs"
                    style={{ color: "#475569" }}
                  >
                    {formatKRW(ind.amount)}
                  </td>
                  <td
                    className="py-2.5 pr-4 text-right font-mono text-xs"
                    style={{ color: "#94a3b8" }}
                  >
                    {ind.ratio}%
                  </td>
                  <td
                    className="py-2.5 text-right font-mono text-xs"
                    style={{ color: "#475569" }}
                  >
                    {formatNumber(ind.txCount)}
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
