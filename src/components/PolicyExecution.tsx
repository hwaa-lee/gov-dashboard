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

/* ─── Design Tokens ─── */

const PIE_COLORS = [
  "#2d5f8a", "#1a6b5a", "#8b6d3f", "#6b4c7a", "#b8602a",
  "#4a7c7c", "#7a5c3f", "#5a6b8a", "#8a6060", "#5c7a5a",
];

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
  labelStyle: { color: "#fff", fontWeight: 600 as const, marginBottom: "4px" },
};

const AXIS = {
  tick: { fontSize: 11, fill: "#8a919e" },
  axisLine: { stroke: "#e8e5df" },
  tickLine: false as const,
};

const SC_COLOR = "#1a6b5a";
const KRW_COLOR = "#b06828";

/* ─── Shared Components ─── */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = "#1a6b5a",
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  delay?: number;
}) {
  return (
    <div
      className="card animate-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${accent}10` }}
          >
            <Icon className="w-[14px] h-[14px]" style={{ color: accent }} />
          </div>
          <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: "#8a919e" }}>
            {label}
          </span>
        </div>
        <p className="text-[26px] font-bold leading-none" style={{ fontFamily: "var(--font-mono)", color: "#1a1d24" }}>
          {value}
        </p>
        {sub && (
          <p className="text-[11px] mt-2" style={{ color: "#8a919e" }}>{sub}</p>
        )}
      </div>
    </div>
  );
}

function Section({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`card p-6 animate-in ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[13px] font-semibold mb-5" style={{ color: "#4a5568" }}>
      {children}
    </h3>
  );
}

function ProgressBar({
  label,
  spent,
  total,
  color = "#1a6b5a",
  delay = 0,
}: {
  label: string;
  spent: number;
  total: number;
  color?: string;
  delay?: number;
}) {
  const rate = total > 0 ? ((spent / total) * 100).toFixed(1) : "0";
  return (
    <Section delay={delay}>
      <SectionTitle>{label}</SectionTitle>
      <div className="w-full h-6 rounded-full overflow-hidden" style={{ background: "#f0ede8" }}>
        <div
          className="h-full flex items-center justify-end pr-3 text-white text-[11px] font-bold rounded-full"
          style={{
            width: `${Math.min(Number(rate), 100)}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            fontFamily: "var(--font-mono)",
            transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {rate}%
        </div>
      </div>
      <div className="flex justify-between mt-2 text-[11px] font-mono" style={{ color: "#b4b9c4" }}>
        <span>0</span>
        <span>{formatKRW(total)}</span>
      </div>
    </Section>
  );
}

function DataTable({
  headers,
  children,
}: {
  headers: { label: string; align?: "right" }[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="table-header">
            {headers.map((h) => (
              <th key={h.label} className={h.align === "right" ? "text-right" : "text-left"}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer transition-all"
      style={{
        color: "#2d5f8a",
        background: "#edf2f7",
        border: "1px solid #d4dde8",
      }}
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      돌아가기
    </button>
  );
}

/* ─── Detail Helpers ─── */

function getDetailBudget(spent: number) {
  return {
    budget: Math.round(spent * 1.54),
    applied: Math.round(spent * 1.19),
    spent,
  };
}

/* ─── Region Detail ─── */

function RegionDetail({ name, onBack }: { name: string; onBack: () => void }) {
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
      <div className="flex items-center gap-4 animate-in">
        <BackButton onClick={onBack} />
        <h2 className="text-[15px] font-bold flex items-center gap-2" style={{ color: "#1a1d24" }}>
          <MapPin className="w-4 h-4" style={{ color: "#6b4c7a" }} />
          {name}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="배정 예산" value={formatKRW(d.budget)} accent="#2d5f8a" delay={0.04} />
        <StatCard icon={FileText} label="신청액" value={formatKRW(d.applied)} sub={`예산 대비 ${((d.applied / d.budget) * 100).toFixed(1)}%`} accent="#6b4c7a" delay={0.08} />
        <StatCard icon={TrendingUp} label="집행액" value={formatKRW(d.spent)} sub={`신청 대비 ${appliedRate}%`} accent="#1a6b5a" delay={0.12} />
      </div>

      <ProgressBar label="신청액 대비 집행률" spent={d.spent} total={d.applied} delay={0.16} />

      <Section delay={0.20}>
        <SectionTitle>{name} 업종별 사용 현황</SectionTitle>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={industries} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0ede8" />
            <XAxis type="number" tickFormatter={(v) => formatKRW(v)} {...AXIS} />
            <YAxis type="category" dataKey="industry" width={80} tick={{ fontSize: 11, fill: "#4a5568" }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => formatKRW(Number(v))} />
            <Bar dataKey="amount" fill="#6b4c7a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      <Section delay={0.24}>
        <SectionTitle>{name} 요약</SectionTitle>
        <DataTable headers={[{ label: "항목" }, { label: "금액", align: "right" }]}>
          {[
            { label: "배정 예산", value: formatKRW(d.budget) },
            { label: "신청액", value: formatKRW(d.applied) },
            { label: "집행액", value: formatKRW(d.spent) },
            { label: "거래 건수", value: `${formatNumber(region.txCount)}건` },
          ].map((row) => (
            <tr key={row.label} className="table-row">
              <td className="font-medium" style={{ color: "#4a5568" }}>{row.label}</td>
              <td className="text-right font-mono text-xs" style={{ color: "#1a1d24" }}>{row.value}</td>
            </tr>
          ))}
        </DataTable>
      </Section>
    </div>
  );
}

/* ─── Card Company Detail ─── */

function CardCompanyDetail({ name, onBack }: { name: string; onBack: () => void }) {
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
      <div className="flex items-center gap-4 animate-in">
        <BackButton onClick={onBack} />
        <h2 className="text-[15px] font-bold flex items-center gap-2" style={{ color: "#1a1d24" }}>
          <CreditCard className="w-4 h-4" style={{ color: "#2d5f8a" }} />
          {name}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="배정 예산" value={formatKRW(d.budget)} accent="#2d5f8a" delay={0.04} />
        <StatCard icon={FileText} label="신청액" value={formatKRW(d.applied)} sub={`예산 대비 ${((d.applied / d.budget) * 100).toFixed(1)}%`} accent="#6b4c7a" delay={0.08} />
        <StatCard icon={TrendingUp} label="집행액" value={formatKRW(d.spent)} sub={`신청 대비 ${appliedRate}%`} accent="#1a6b5a" delay={0.12} />
      </div>

      <ProgressBar label="신청액 대비 집행률" spent={d.spent} total={d.applied} delay={0.16} />

      <Section delay={0.20}>
        <SectionTitle>{name} 지역별 집행 분포</SectionTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regions} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0ede8" />
            <XAxis type="number" tickFormatter={(v) => formatKRW(v)} {...AXIS} />
            <YAxis type="category" dataKey="region" width={50} tick={{ fontSize: 11, fill: "#4a5568" }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => formatKRW(Number(v))} />
            <Bar dataKey="amount" fill="#2d5f8a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      <Section delay={0.24}>
        <SectionTitle>{name} 요약</SectionTitle>
        <DataTable headers={[{ label: "항목" }, { label: "금액", align: "right" }]}>
          {[
            { label: "배정 예산", value: formatKRW(d.budget) },
            { label: "신청액", value: formatKRW(d.applied) },
            { label: "집행액", value: formatKRW(d.spent) },
            { label: "거래 건수", value: `${formatNumber(company.txCount)}건` },
          ].map((row) => (
            <tr key={row.label} className="table-row">
              <td className="font-medium" style={{ color: "#4a5568" }}>{row.label}</td>
              <td className="text-right font-mono text-xs" style={{ color: "#1a1d24" }}>{row.value}</td>
            </tr>
          ))}
        </DataTable>
      </Section>
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
      {/* Date Filter */}
      <div className="animate-in stagger-1">
        <div
          className="card inline-flex items-center gap-3 px-4 py-2.5 text-[12px]"
        >
          <CalendarRange className="w-4 h-4" style={{ color: "#8a919e" }} />
          <span className="font-medium" style={{ color: "#4a5568" }}>조회 기간</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-2.5 py-1 rounded-md text-[12px] font-mono"
            style={{ border: "1px solid var(--border)", background: "var(--bg-warm)", color: "#1a1d24" }}
          />
          <span style={{ color: "#b4b9c4" }}>~</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-2.5 py-1 rounded-md text-[12px] font-mono"
            style={{ border: "1px solid var(--border)", background: "var(--bg-warm)", color: "#1a1d24" }}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="총 예산" value={formatKRW(policyBudget.totalBudget)} sub={policyBudget.period} accent="#2d5f8a" delay={0.04} />
        <StatCard icon={FileText} label="신청액" value={formatKRW(policyBudget.appliedAmount)} sub={`총예산 대비 ${((policyBudget.appliedAmount / policyBudget.totalBudget) * 100).toFixed(1)}%`} accent="#6b4c7a" delay={0.08} />
        <StatCard icon={TrendingUp} label="집행액" value={formatKRW(policyBudget.totalSpent)} sub={`집행률 ${policyBudget.executionRate}%`} accent="#1a6b5a" delay={0.12} />
      </div>

      {/* Execution Rate */}
      <ProgressBar label="예산 대비 집행률" spent={policyBudget.totalSpent} total={policyBudget.totalBudget} delay={0.16} />

      {/* Distribution: Region + Card Company */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section delay={0.20}>
          <SectionTitle>지역별 집행 분포</SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionPie}
                cx="50%"
                cy="50%"
                outerRadius={105}
                innerRadius={40}
                dataKey="value"
                label={renderPieLabel}
                labelLine={false}
                onClick={(entry) => entry.name && onSelectRegion(entry.name)}
                className="cursor-pointer"
              >
                {regionPie.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => formatKRW(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </Section>

        <Section delay={0.24}>
          <SectionTitle>카드사별 집행 분포</SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cardPie}
                cx="50%"
                cy="50%"
                outerRadius={105}
                innerRadius={40}
                dataKey="value"
                label={renderPieLabel}
                labelLine={false}
                onClick={(entry) => entry.name && onSelectCard(entry.name)}
                className="cursor-pointer"
              >
                {cardPie.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => formatKRW(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* Industry Bar */}
      <Section delay={0.28}>
        <SectionTitle>업종별 사용 현황</SectionTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={industryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0ede8" />
            <XAxis type="number" tickFormatter={(v) => formatKRW(v)} {...AXIS} />
            <YAxis type="category" dataKey="industry" width={80} tick={{ fontSize: 11, fill: "#4a5568" }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => formatKRW(Number(v))} />
            <Bar dataKey="amount" fill="#2d5f8a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Trend Charts */}
      <Section delay={0.30}>
        <SectionTitle>집행 금액 추이</SectionTitle>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
            <XAxis dataKey="week" {...AXIS} />
            <YAxis tickFormatter={(v) => `${v}억`} {...AXIS} axisLine={false} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => `${Number(v).toFixed(0)}억`} />
            <Area type="monotone" dataKey="spentB" name="집행 금액" stroke="#1a6b5a" fill="#1a6b5a" fillOpacity={0.08} strokeWidth={2} dot={{ r: 3, fill: "#1a6b5a", strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section delay={0.32}>
          <SectionTitle>차단 금액 추이</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="week" {...AXIS} />
              <YAxis tickFormatter={(v) => `${v}억`} {...AXIS} axisLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="blockedB" name="차단 금액" fill="#9e3328" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section delay={0.34}>
          <SectionTitle>환불 금액 추이</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="week" {...AXIS} />
              <YAxis tickFormatter={(v) => `${v}억`} {...AXIS} axisLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="refundB" name="환불 금액" fill="#b06828" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* Region Table */}
      <Section delay={0.36}>
        <SectionTitle>지역별 상세</SectionTitle>
        <DataTable headers={[{ label: "지역" }, { label: "집행 금액", align: "right" }, { label: "비중", align: "right" }, { label: "거래 건수", align: "right" }]}>
          {regionData.map((r) => (
            <tr key={r.region} className="table-row table-row-hover card-interactive" onClick={() => onSelectRegion(r.region)}>
              <td className="font-medium" style={{ color: "#2d5f8a" }}>{r.region}</td>
              <td className="text-right font-mono text-xs" style={{ color: "#1a1d24" }}>{formatKRW(r.amount)}</td>
              <td className="text-right font-mono text-xs" style={{ color: "#8a919e" }}>{r.ratio}%</td>
              <td className="text-right font-mono text-xs" style={{ color: "#4a5568" }}>{formatNumber(r.txCount)}</td>
            </tr>
          ))}
        </DataTable>
      </Section>

      {/* Card Company Table */}
      <Section delay={0.38}>
        <SectionTitle>카드사별 상세</SectionTitle>
        <DataTable headers={[{ label: "카드사" }, { label: "집행 금액", align: "right" }, { label: "비중", align: "right" }, { label: "거래 건수", align: "right" }]}>
          {cardCompanyData.map((c) => (
            <tr key={c.company} className="table-row table-row-hover card-interactive" onClick={() => onSelectCard(c.company)}>
              <td className="font-medium" style={{ color: "#2d5f8a" }}>{c.company}</td>
              <td className="text-right font-mono text-xs" style={{ color: "#1a1d24" }}>{formatKRW(c.amount)}</td>
              <td className="text-right font-mono text-xs" style={{ color: "#8a919e" }}>{c.ratio}%</td>
              <td className="text-right font-mono text-xs" style={{ color: "#4a5568" }}>{formatNumber(c.txCount)}</td>
            </tr>
          ))}
        </DataTable>
      </Section>

      {/* SC/KRW Settlement */}
      <div className="card overflow-hidden animate-in" style={{ animationDelay: "0.40s" }}>
        <div className="px-6 py-3.5 flex items-center gap-2.5" style={{ background: "var(--navy)" }}>
          <Zap className="w-4 h-4" style={{ color: "var(--gold)" }} />
          <h3 className="text-[13px] font-semibold text-white">정산 현황</h3>
          <span className="text-[11px] ml-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            전체 승인 금액 기준 · SC / KRW
          </span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={scKrwPie} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" label={renderPieLabel} labelLine={false}>
                    <Cell fill={SC_COLOR} />
                    <Cell fill={KRW_COLOR} />
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v) => formatKRW(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-5 mt-3 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: SC_COLOR }} />
                  <span style={{ color: "#4a5568" }}>SC (즉시)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: KRW_COLOR }} />
                  <span style={{ color: "#4a5568" }}>KRW (카드사)</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-center">
              <div className="rounded-xl p-5" style={{ background: "#f0f7f4" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4" style={{ color: SC_COLOR }} />
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: SC_COLOR }}>SC 정산 (T+0)</span>
                </div>
                <p className="text-xl font-bold font-mono" style={{ color: "#1a1d24" }}>
                  {formatKRW(settlementSummary.scAmount)}
                </p>
                <p className="text-[11px] mt-2 font-mono" style={{ color: "#8a919e" }}>
                  {settlementSummary.scRatio}% · 평균 {settlementSummary.avgLeadTimeSC}
                </p>
              </div>
              <div className="rounded-xl p-5" style={{ background: "#fdf6ef" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Landmark className="w-4 h-4" style={{ color: KRW_COLOR }} />
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: KRW_COLOR }}>KRW 정산 (카드사)</span>
                </div>
                <p className="text-xl font-bold font-mono" style={{ color: "#1a1d24" }}>
                  {formatKRW(settlementSummary.krwAmount)}
                </p>
                <p className="text-[11px] mt-2 font-mono" style={{ color: "#8a919e" }}>
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

/* ─── Root ─── */

type DetailView = { type: "region" | "card"; name: string } | null;

export default function PolicyExecution() {
  const [detailView, setDetailView] = useState<DetailView>(null);

  if (detailView?.type === "region")
    return <RegionDetail name={detailView.name} onBack={() => setDetailView(null)} />;
  if (detailView?.type === "card")
    return <CardCompanyDetail name={detailView.name} onBack={() => setDetailView(null)} />;

  return (
    <MainDashboard
      onSelectRegion={(name) => setDetailView({ type: "region", name })}
      onSelectCard={(name) => setDetailView({ type: "card", name })}
    />
  );
}
