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
  ArrowLeft,
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

/* ─── Shared UI ─── */

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

function ExecutionBar({
  label,
  spent,
  total,
  accent = "#1a6b5a",
}: {
  label: string;
  spent: number;
  total: number;
  accent?: string;
}) {
  const rate = total > 0 ? ((spent / total) * 100).toFixed(1) : "0";
  return (
    <SectionCard>
      <h3 className="text-[13px] font-semibold mb-4" style={{ color: "#475569" }}>
        {label}
      </h3>
      <div className="w-full h-7 rounded overflow-hidden" style={{ background: "#eae7e0" }}>
        <div
          className="h-full flex items-center justify-end pr-3 text-white text-xs font-bold transition-all"
          style={{
            width: `${Math.min(Number(rate), 100)}%`,
            background: `linear-gradient(90deg, ${accent}, ${accent}cc)`,
            fontFamily: "var(--font-mono)",
          }}
        >
          {rate}%
        </div>
      </div>
      <div
        className="flex justify-between mt-2 text-xs"
        style={{ color: "#94a3b8", fontFamily: "var(--font-mono)" }}
      >
        <span>0</span>
        <span>{formatKRW(total)}</span>
      </div>
    </SectionCard>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
      style={{ color: "#2d5f8a", background: "#e8f0f8", border: "1px solid #c8d8e8" }}
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

/* ─── Detail helpers ─── */

function getDetailBudget(spent: number) {
  return {
    budget: Math.round(spent * 1.54),
    applied: Math.round(spent * 1.19),
    spent,
  };
}

/* ─── Region Detail Dashboard ─── */

function RegionDetail({
  name,
  onBack,
}: {
  name: string;
  onBack: () => void;
}) {
  const region = regionData.find((r) => r.region === name);
  if (!region) return null;

  const d = getDetailBudget(region.amount);
  const appliedRate = ((d.spent / d.applied) * 100).toFixed(1);
  const scale = region.amount / policyBudget.totalSpent;
  const industries = industryData.map((ind) => ({
    industry: ind.industry,
    amount: Math.round(ind.amount * scale),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton onClick={onBack} label="전체 대시보드" />
        <h2 className="text-base font-bold flex items-center gap-2" style={{ color: "#1e293b" }}>
          <MapPin className="w-5 h-5" style={{ color: "#6b4c7a" }} />
          {name} 상세 대시보드
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="배정 예산" value={formatKRW(d.budget)} accent="#2d5f8a" />
        <StatCard
          icon={FileText}
          label="신청액"
          value={formatKRW(d.applied)}
          sub={`예산 대비 ${((d.applied / d.budget) * 100).toFixed(1)}%`}
          accent="#6b4c7a"
        />
        <StatCard
          icon={TrendingUp}
          label="집행액"
          value={formatKRW(d.spent)}
          sub={`신청 대비 ${appliedRate}%`}
          accent="#1a6b5a"
        />
      </div>

      <ExecutionBar label="신청액 대비 집행률" spent={d.spent} total={d.applied} />

      <SectionCard>
        <SectionTitle icon={ShoppingBag} color="#8b6d3f">
          {name} — 업종별 사용 현황
        </SectionTitle>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={industries} layout="vertical">
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
            <Bar dataKey="amount" fill="#6b4c7a" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard>
        <h3 className="text-[13px] font-semibold mb-4" style={{ color: "#475569" }}>
          {name} 요약
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-xs" style={{ borderBottom: "2px solid #1b2844" }}>
                <th className="py-2.5 pr-4 font-semibold" style={{ color: "#475569" }}>항목</th>
                <th className="py-2.5 font-semibold text-right" style={{ color: "#475569" }}>금액</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "배정 예산", value: d.budget },
                { label: "신청액", value: d.applied },
                { label: "집행액", value: d.spent },
                { label: "거래 건수", value: region.txCount },
              ].map((row, i) => (
                <tr
                  key={row.label}
                  style={{
                    borderBottom: "1px solid #eae7e0",
                    background: i % 2 === 1 ? "#faf9f6" : "transparent",
                  }}
                >
                  <td className="py-2.5 pr-4 font-medium">{row.label}</td>
                  <td className="py-2.5 text-right font-mono text-xs" style={{ color: "#475569" }}>
                    {row.label === "거래 건수"
                      ? `${formatNumber(row.value)}건`
                      : formatKRW(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── Card Company Detail Dashboard ─── */

function CardCompanyDetail({
  name,
  onBack,
}: {
  name: string;
  onBack: () => void;
}) {
  const company = cardCompanyData.find((c) => c.company === name);
  if (!company) return null;

  const d = getDetailBudget(company.amount);
  const appliedRate = ((d.spent / d.applied) * 100).toFixed(1);
  const scale = company.amount / policyBudget.totalSpent;
  const regions = regionData.map((r) => ({
    region: r.region,
    amount: Math.round(r.amount * scale),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton onClick={onBack} label="전체 대시보드" />
        <h2 className="text-base font-bold flex items-center gap-2" style={{ color: "#1e293b" }}>
          <CreditCard className="w-5 h-5" style={{ color: "#2d5f8a" }} />
          {name} 상세 대시보드
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="배정 예산" value={formatKRW(d.budget)} accent="#2d5f8a" />
        <StatCard
          icon={FileText}
          label="신청액"
          value={formatKRW(d.applied)}
          sub={`예산 대비 ${((d.applied / d.budget) * 100).toFixed(1)}%`}
          accent="#6b4c7a"
        />
        <StatCard
          icon={TrendingUp}
          label="집행액"
          value={formatKRW(d.spent)}
          sub={`신청 대비 ${appliedRate}%`}
          accent="#1a6b5a"
        />
      </div>

      <ExecutionBar label="신청액 대비 집행률" spent={d.spent} total={d.applied} />

      <SectionCard>
        <SectionTitle icon={MapPin} color="#6b4c7a">
          {name} — 지역별 집행 분포
        </SectionTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regions} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eae7e0" />
            <XAxis type="number" tickFormatter={(v) => formatKRW(v)} {...AXIS_STYLE} />
            <YAxis
              type="category"
              dataKey="region"
              width={50}
              tick={{ fontSize: 11, fill: "#475569" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => formatKRW(Number(v))} />
            <Bar dataKey="amount" fill="#2d5f8a" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard>
        <h3 className="text-[13px] font-semibold mb-4" style={{ color: "#475569" }}>
          {name} 요약
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-xs" style={{ borderBottom: "2px solid #1b2844" }}>
                <th className="py-2.5 pr-4 font-semibold" style={{ color: "#475569" }}>항목</th>
                <th className="py-2.5 font-semibold text-right" style={{ color: "#475569" }}>금액</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "배정 예산", value: d.budget },
                { label: "신청액", value: d.applied },
                { label: "집행액", value: d.spent },
                { label: "거래 건수", value: company.txCount },
              ].map((row, i) => (
                <tr
                  key={row.label}
                  style={{
                    borderBottom: "1px solid #eae7e0",
                    background: i % 2 === 1 ? "#faf9f6" : "transparent",
                  }}
                >
                  <td className="py-2.5 pr-4 font-medium">{row.label}</td>
                  <td className="py-2.5 text-right font-mono text-xs" style={{ color: "#475569" }}>
                    {row.label === "거래 건수"
                      ? `${formatNumber(row.value)}건`
                      : formatKRW(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── Main Dashboard ─── */

function MainDashboard({
  onSelectRegion,
  onSelectCard,
}: {
  onSelectRegion: (name: string) => void;
  onSelectCard: (name: string) => void;
}) {
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
          className="px-2 py-1 rounded text-xs font-mono focus:outline-none"
          style={{ border: "1px solid #ddd9d0", background: "#faf9f6" }}
        />
        <span style={{ color: "#94a3b8" }}>~</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-2 py-1 rounded text-xs font-mono focus:outline-none"
          style={{ border: "1px solid #ddd9d0", background: "#faf9f6" }}
        />
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
      <ExecutionBar
        label="예산 대비 집행률"
        spent={policyBudget.totalSpent}
        total={policyBudget.totalBudget}
        accent="#1a6b5a"
      />

      {/* Distribution Charts: Region + Card Company (clickable) */}
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
                onClick={(entry) => entry.name && onSelectRegion(entry.name)}
                className="cursor-pointer"
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
          <p className="text-center text-[11px] mt-1" style={{ color: "#94a3b8" }}>
            클릭하여 지역 상세 보기
          </p>
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
                onClick={(entry) => entry.name && onSelectCard(entry.name)}
                className="cursor-pointer"
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
          <p className="text-center text-[11px] mt-1" style={{ color: "#94a3b8" }}>
            클릭하여 카드사 상세 보기
          </p>
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
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => `${Number(v).toFixed(0)}억`} />
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
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => `${Number(v).toFixed(1)}억`} />
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
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => `${Number(v).toFixed(1)}억`} />
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
                  className="cursor-pointer hover:bg-[#f0ede8] transition-colors"
                  onClick={() => onSelectRegion(r.region)}
                  style={{
                    borderBottom: "1px solid #eae7e0",
                    background: i % 2 === 1 ? "#faf9f6" : "transparent",
                  }}
                >
                  <td className="py-2.5 pr-4 font-medium" style={{ color: "#2d5f8a" }}>{r.region}</td>
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
                  className="cursor-pointer hover:bg-[#f0ede8] transition-colors"
                  onClick={() => onSelectCard(c.company)}
                  style={{
                    borderBottom: "1px solid #eae7e0",
                    background: i % 2 === 1 ? "#faf9f6" : "transparent",
                  }}
                >
                  <td className="py-2.5 pr-4 font-medium" style={{ color: "#2d5f8a" }}>{c.company}</td>
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
        <div className="px-5 py-3 flex items-center gap-2" style={{ background: "#1b2844" }}>
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
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v) => formatKRW(Number(v))} />
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
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-center">
              <div className="rounded-lg p-4" style={{ background: "#e8f4f0", border: "1px solid #c8e6dd" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" style={{ color: SC_COLOR }} />
                  <span className="text-xs font-medium" style={{ color: SC_COLOR }}>SC 정산 (T+0)</span>
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
                  <span className="text-xs font-medium" style={{ color: KRW_COLOR }}>KRW 정산 (카드사 지갑)</span>
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

/* ─── Root Component ─── */

type DetailView = { type: "region" | "card"; name: string } | null;

export default function PolicyExecution() {
  const [detailView, setDetailView] = useState<DetailView>(null);

  if (detailView?.type === "region") {
    return (
      <RegionDetail
        name={detailView.name}
        onBack={() => setDetailView(null)}
      />
    );
  }

  if (detailView?.type === "card") {
    return (
      <CardCompanyDetail
        name={detailView.name}
        onBack={() => setDetailView(null)}
      />
    );
  }

  return (
    <MainDashboard
      onSelectRegion={(name) => setDetailView({ type: "region", name })}
      onSelectCard={(name) => setDetailView({ type: "card", name })}
    />
  );
}
