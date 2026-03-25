"use client";

import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  MapPin,
  ShoppingBag,
  CreditCard,
  FileText,
  ShieldOff,
  RotateCcw,
  Zap,
  Landmark,
  CalendarRange,
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
  AreaChart,
  Area,
} from "recharts";
import {
  policyBudget,
  regionData,
  cardCompanyData,
  industryData,
  weeklyTrend,
  settlementSummary,
  formatKRW,
  formatNumber,
} from "@/lib/mock-data";
import { renderPieLabel } from "./PieLabel";

const COLORS = [
  "#2d5f8a", "#1a6b5a", "#8b6d3f", "#6b4c7a", "#b8602a",
  "#4a7c7c", "#7a5c3f", "#5a6b8a", "#8a6060", "#5c7a5a",
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

const CARD_STYLE = {
  border: "1px solid #eae7e0",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const SC_COLOR = "#1a6b5a";
const KRW_COLOR = "#b06828";

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
    <div className="bg-white rounded-lg overflow-hidden" style={CARD_STYLE}>
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

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-lg p-5 ${className}`} style={CARD_STYLE}>
      {children}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  color,
  children,
}: {
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className="text-[13px] font-semibold mb-4" style={{ color: "#475569" }}>
      <Icon className="w-4 h-4 inline mr-1.5" style={{ color }} />
      {children}
    </h3>
  );
}

export default function PolicyExecution() {
  const [dateFrom, setDateFrom] = useState("2026-04-01");
  const [dateTo, setDateTo] = useState("2026-06-30");

  const regionPie = regionData.map((r) => ({ name: r.region, value: r.amount }));
  const cardPie = cardCompanyData.map((c) => ({ name: c.company, value: c.amount }));

  const trendData = weeklyTrend.map((w) => ({
    ...w,
    spentB: w.spent / 100_000_000,
    blockedB: w.blocked / 100_000_000,
    refundB: w.refund / 100_000_000,
  }));

  const scKrwPie = [
    { name: "SC (스테이블코인)", value: settlementSummary.scAmount },
    { name: "KRW (원화)", value: settlementSummary.krwAmount },
  ];

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="flex items-center gap-3">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs"
          style={{ background: "#fff", ...CARD_STYLE }}
        >
          <CalendarRange className="w-4 h-4" style={{ color: "#6b4c7a" }} />
          <span className="font-medium" style={{ color: "#475569" }}>
            조회 기간
          </span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            min="2026-01-01"
            max="2026-12-31"
            className="px-2 py-1 rounded text-xs font-mono focus:outline-none"
            style={{ border: "1px solid #ddd9d0", background: "#faf9f6" }}
          />
          <span style={{ color: "#94a3b8" }}>~</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            min="2026-01-01"
            max="2026-12-31"
            className="px-2 py-1 rounded text-xs font-mono focus:outline-none"
            style={{ border: "1px solid #ddd9d0", background: "#faf9f6" }}
          />
        </div>
        <span className="text-[11px]" style={{ color: "#94a3b8" }}>
          PoC 데이터: 2026년만 조회 가능
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Wallet}
          label="총 예산"
          value={formatKRW(policyBudget.totalBudget)}
          sub={policyBudget.period}
          accent="#2d5f8a"
        />
        <StatCard
          icon={FileText}
          label="신청액"
          value={formatKRW(policyBudget.appliedAmount)}
          sub={`총예산 대비 ${((policyBudget.appliedAmount / policyBudget.totalBudget) * 100).toFixed(1)}%`}
          accent="#6b4c7a"
        />
        <StatCard
          icon={TrendingUp}
          label="집행액"
          value={formatKRW(policyBudget.totalSpent)}
          sub={`집행률 ${policyBudget.executionRate}%`}
          accent="#1a6b5a"
        />
      </div>

      {/* Execution Rate Bar */}
      <SectionCard>
        <h3 className="text-[13px] font-semibold mb-4" style={{ color: "#475569" }}>
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
      </SectionCard>

      {/* Distribution Charts: Region + Card Company */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Pie */}
        <SectionCard>
          <SectionTitle icon={MapPin} color="#6b4c7a">
            지역별 집행 분포
          </SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionPie}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={renderPieLabel}
                labelLine={false}
              >
                {regionPie.map((_, i) => (
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
        </SectionCard>

        {/* Card Company Pie */}
        <SectionCard>
          <SectionTitle icon={CreditCard} color="#2d5f8a">
            카드사별 집행 분포
          </SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cardPie}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={renderPieLabel}
                labelLine={false}
              >
                {cardPie.map((_, i) => (
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
        </SectionCard>
      </div>

      {/* Industry Bar */}
      <SectionCard>
        <SectionTitle icon={ShoppingBag} color="#8b6d3f">
          업종별 사용 현황
        </SectionTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={industryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eae7e0" />
            <XAxis type="number" tickFormatter={(v) => formatKRW(v)} {...AXIS_STYLE} />
            <YAxis
              type="category"
              dataKey="industry"
              width={80}
              tick={{ fontSize: 11, fill: "#475569" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => formatKRW(Number(v))} />
            <Bar dataKey="amount" fill="#2d5f8a" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Separated Charts: 집행 / 차단 / 환불 */}
      <SectionCard>
        <SectionTitle icon={TrendingUp} color="#1a6b5a">
          집행 금액 추이
        </SectionTitle>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eae7e0" />
            <XAxis dataKey="week" {...AXIS_STYLE} />
            <YAxis tickFormatter={(v) => `${v}억`} {...AXIS_STYLE} axisLine={false} />
            <Tooltip
              {...TOOLTIP_STYLE}
              formatter={(v) => `${Number(v).toFixed(0)}억`}
            />
            <Area
              type="monotone"
              dataKey="spentB"
              name="집행 금액"
              stroke="#1a6b5a"
              fill="#1a6b5a"
              fillOpacity={0.15}
              strokeWidth={2}
              dot={{ r: 4, fill: "#1a6b5a" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard>
          <SectionTitle icon={ShieldOff} color="#9e3328">
            차단 금액 추이
          </SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eae7e0" />
              <XAxis dataKey="week" {...AXIS_STYLE} />
              <YAxis tickFormatter={(v) => `${v}억`} {...AXIS_STYLE} axisLine={false} />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v) => `${Number(v).toFixed(1)}억`}
              />
              <Bar dataKey="blockedB" name="차단 금액" fill="#9e3328" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard>
          <SectionTitle icon={RotateCcw} color="#b06828">
            환불 금액 추이
          </SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eae7e0" />
              <XAxis dataKey="week" {...AXIS_STYLE} />
              <YAxis tickFormatter={(v) => `${v}억`} {...AXIS_STYLE} axisLine={false} />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v) => `${Number(v).toFixed(1)}억`}
              />
              <Bar dataKey="refundB" name="환불 금액" fill="#b06828" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Region Detail Table */}
      <SectionCard>
        <h3 className="text-[13px] font-semibold mb-4" style={{ color: "#475569" }}>
          지역별 상세
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-xs" style={{ borderBottom: "2px solid #1b2844" }}>
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
                  style={{
                    borderBottom: "1px solid #eae7e0",
                    background: i % 2 === 1 ? "#faf9f6" : "transparent",
                  }}
                >
                  <td className="py-2.5 pr-4 font-medium">{r.region}</td>
                  <td className="py-2.5 pr-4 text-right font-mono text-xs" style={{ color: "#475569" }}>
                    {formatKRW(r.amount)}
                  </td>
                  <td className="py-2.5 pr-4 text-right font-mono text-xs" style={{ color: "#94a3b8" }}>
                    {r.ratio}%
                  </td>
                  <td className="py-2.5 text-right font-mono text-xs" style={{ color: "#475569" }}>
                    {formatNumber(r.txCount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Card Company Detail Table */}
      <SectionCard>
        <h3 className="text-[13px] font-semibold mb-4" style={{ color: "#475569" }}>
          카드사별 상세
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-xs" style={{ borderBottom: "2px solid #1b2844" }}>
                <th className="py-2.5 pr-4 font-semibold" style={{ color: "#475569" }}>카드사</th>
                <th className="py-2.5 pr-4 font-semibold text-right" style={{ color: "#475569" }}>집행 금액</th>
                <th className="py-2.5 pr-4 font-semibold text-right" style={{ color: "#475569" }}>비중</th>
                <th className="py-2.5 font-semibold text-right" style={{ color: "#475569" }}>거래 건수</th>
              </tr>
            </thead>
            <tbody>
              {cardCompanyData.map((c, i) => (
                <tr
                  key={c.company}
                  style={{
                    borderBottom: "1px solid #eae7e0",
                    background: i % 2 === 1 ? "#faf9f6" : "transparent",
                  }}
                >
                  <td className="py-2.5 pr-4 font-medium">{c.company}</td>
                  <td className="py-2.5 pr-4 text-right font-mono text-xs" style={{ color: "#475569" }}>
                    {formatKRW(c.amount)}
                  </td>
                  <td className="py-2.5 pr-4 text-right font-mono text-xs" style={{ color: "#94a3b8" }}>
                    {c.ratio}%
                  </td>
                  <td className="py-2.5 text-right font-mono text-xs" style={{ color: "#475569" }}>
                    {formatNumber(c.txCount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* SC/KRW Settlement Section */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ border: "1px solid #eae7e0", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
      >
        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{ background: "#1b2844" }}
        >
          <Zap className="w-4 h-4" style={{ color: "#c8a84e" }} />
          <h3 className="text-[13px] font-semibold text-white">
            정산 현황 — SC / KRW
          </h3>
          <span className="text-[11px] ml-2" style={{ color: "rgba(255,255,255,0.45)" }}>
            전체 승인 금액 기준 정산 방식 분포
          </span>
        </div>
        <div className="bg-white p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie */}
            <div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={scKrwPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={renderPieLabel}
                    labelLine={false}
                  >
                    <Cell fill={SC_COLOR} />
                    <Cell fill={KRW_COLOR} />
                  </Pie>
                  <Tooltip
                    {...TOOLTIP_STYLE}
                    formatter={(v) => formatKRW(Number(v))}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: SC_COLOR }} />
                  <span style={{ color: "#475569" }}>SC (즉시 정산)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: KRW_COLOR }} />
                  <span style={{ color: "#475569" }}>KRW (카드사 지갑)</span>
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-center">
              <div className="rounded-lg p-4" style={{ background: "#e8f4f0", border: "1px solid #c8e6dd" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" style={{ color: SC_COLOR }} />
                  <span className="text-xs font-medium" style={{ color: SC_COLOR }}>
                    SC 정산 (T+0)
                  </span>
                </div>
                <p className="text-xl font-bold font-mono" style={{ color: "#1e293b" }}>
                  {formatKRW(settlementSummary.scAmount)}
                </p>
                <p className="text-xs mt-1 font-mono" style={{ color: "#94a3b8" }}>
                  {settlementSummary.scRatio}% · 평균 {settlementSummary.avgLeadTimeSC}
                </p>
              </div>
              <div className="rounded-lg p-4" style={{ background: "#faf3ec", border: "1px solid #f0dcc8" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="w-4 h-4" style={{ color: KRW_COLOR }} />
                  <span className="text-xs font-medium" style={{ color: KRW_COLOR }}>
                    KRW 정산 (카드사 지갑)
                  </span>
                </div>
                <p className="text-xl font-bold font-mono" style={{ color: "#1e293b" }}>
                  {formatKRW(settlementSummary.krwAmount)}
                </p>
                <p className="text-xs mt-1 font-mono" style={{ color: "#94a3b8" }}>
                  {settlementSummary.krwRatio}% · 평균 {settlementSummary.avgLeadTimeKRW}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
