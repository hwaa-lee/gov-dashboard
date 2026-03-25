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
  ShieldAlert,
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
  blockSummary,
  formatKRW,
  formatNumber,
} from "@/lib/mock-data";
import { renderPieLabel } from "./PieLabel";

/* ─── Tokens ─── */

const PIE_COLORS = [
  "#2d5f8a", "#1a6b5a", "#8b6d3f", "#6b4c7a", "#b8602a",
  "#4a7c7c", "#7a5c3f", "#5a6b8a", "#8a6060", "#5c7a5a",
];

const TT = {
  contentStyle: { background: "#1b2844", border: "none", borderRadius: "8px", padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", fontSize: "12px" },
  itemStyle: { color: "rgba(255,255,255,0.85)", padding: "2px 0" },
  labelStyle: { color: "#fff", fontWeight: 600 as const, marginBottom: "4px" },
};

const AX = { tick: { fontSize: 11, fill: "#8a919e" }, axisLine: { stroke: "#e8e5df" }, tickLine: false as const };

const SC_COLOR = "#1a6b5a";
const KRW_COLOR = "#b06828";

const TOTAL_BLOCKED = blockSummary.reduce((s, b) => s + b.count, 0);

/* ─── Shared UI ─── */

function StatCard({ icon: Icon, label, value, sub, accent = "#1a6b5a", delay = 0 }: {
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

function Section({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <div className={`card p-5 md:p-6 animate-in ${className}`} style={{ animationDelay: `${delay}s` }}>{children}</div>;
}

function Title({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[13px] font-semibold mb-5" style={{ color: "#4a5568" }}>{children}</h3>;
}

function Bar2({ label, spent, total, color = "#1a6b5a", delay = 0 }: {
  label: string; spent: number; total: number; color?: string; delay?: number;
}) {
  const rate = total > 0 ? ((spent / total) * 100).toFixed(1) : "0";
  return (
    <Section delay={delay}>
      <Title>{label}</Title>
      <div className="w-full h-6 rounded-full overflow-hidden" style={{ background: "#f0ede8" }}>
        <div className="h-full flex items-center justify-end pr-3 text-white text-[11px] font-bold rounded-full"
          style={{ width: `${Math.min(Number(rate), 100)}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, fontFamily: "var(--font-mono)", transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
          {rate}%
        </div>
      </div>
      <div className="flex justify-between mt-2 text-[11px] font-mono" style={{ color: "#b4b9c4" }}>
        <span>0</span><span>{formatKRW(total)}</span>
      </div>
    </Section>
  );
}

function TH({ headers }: { headers: { label: string; align?: "right" }[] }) {
  return (
    <thead>
      <tr className="table-header">
        {headers.map((h) => <th key={h.label} className={h.align === "right" ? "text-right" : "text-left"}>{h.label}</th>)}
      </tr>
    </thead>
  );
}

/* ─── Helpers ─── */

function getBudget(spent: number) {
  return { budget: Math.round(spent * 1.54), applied: Math.round(spent * 1.19), spent };
}

function getWeekly(scale: number) {
  return weeklyTrend.map((w) => ({
    week: w.week,
    spentB: Math.round(w.spent * scale) / 100_000_000,
    blockedB: Math.round(w.blocked * scale) / 100_000_000,
    refundB: Math.round(w.refund * scale) / 100_000_000,
  }));
}

/* ─── Filter Bar ─── */

function FilterBar({
  dateFrom, dateTo, setDateFrom, setDateTo,
  selectedRegion, setSelectedRegion,
  selectedCard, setSelectedCard,
}: {
  dateFrom: string; dateTo: string;
  setDateFrom: (v: string) => void; setDateTo: (v: string) => void;
  selectedRegion: string; setSelectedRegion: (v: string) => void;
  selectedCard: string; setSelectedCard: (v: string) => void;
}) {
  const selectStyle = {
    border: "1px solid var(--border)",
    background: "var(--bg-warm)",
    color: "#1a1d24",
  };

  return (
    <div className="card inline-flex items-center gap-3 px-4 py-2.5 text-[12px] flex-wrap animate-in stagger-1">
      <CalendarRange className="w-4 h-4" style={{ color: "#8a919e" }} />
      <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
        className="px-2.5 py-1 rounded-md text-[12px] font-mono" style={selectStyle} />
      <span style={{ color: "#b4b9c4" }}>~</span>
      <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
        className="px-2.5 py-1 rounded-md text-[12px] font-mono" style={selectStyle} />

      <span className="w-px h-5 mx-1" style={{ background: "var(--border)" }} />

      <MapPin className="w-3.5 h-3.5" style={{ color: "#6b4c7a" }} />
      <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}
        className="px-2.5 py-1 rounded-md text-[12px] font-medium cursor-pointer" style={selectStyle}>
        <option value="all">전체 지역</option>
        {regionData.map((r) => <option key={r.region} value={r.region}>{r.region}</option>)}
      </select>

      <CreditCard className="w-3.5 h-3.5" style={{ color: "#2d5f8a" }} />
      <select value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)}
        className="px-2.5 py-1 rounded-md text-[12px] font-medium cursor-pointer" style={selectStyle}>
        <option value="all">전체 카드사</option>
        {cardCompanyData.map((c) => <option key={c.company} value={c.company}>{c.company}</option>)}
      </select>
    </div>
  );
}

/* ─── Region Detail ─── */

function RegionDetail({ name }: { name: string }) {
  const region = regionData.find((r) => r.region === name);
  if (!region) return null;

  const d = getBudget(region.amount);
  const scale = region.amount / policyBudget.totalSpent;
  const weekly = getWeekly(scale);
  const blockedCount = Math.round(TOTAL_BLOCKED * scale);
  const blockedAmount = Math.round(policyBudget.blockedAmount * scale);
  const refundAmount = Math.round(policyBudget.refundAmount * scale);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="배정 예산" value={formatKRW(d.budget)} accent="#2d5f8a" delay={0.04} />
        <StatCard icon={FileText} label="신청액" value={formatKRW(d.applied)} sub={`예산 대비 ${((d.applied / d.budget) * 100).toFixed(1)}%`} accent="#6b4c7a" delay={0.08} />
        <StatCard icon={TrendingUp} label="집행액" value={formatKRW(d.spent)} sub={`신청 대비 ${((d.spent / d.applied) * 100).toFixed(1)}%`} accent="#1a6b5a" delay={0.12} />
      </div>

      <Bar2 label="신청액 대비 집행률" spent={d.spent} total={d.applied} delay={0.14} />

      {/* Weekly Trend */}
      <Section delay={0.16}>
        <Title>주간 집행 추이</Title>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
            <XAxis dataKey="week" {...AX} />
            <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
            <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
            <Area type="monotone" dataKey="spentB" name="집행" stroke="#1a6b5a" fill="#1a6b5a" fillOpacity={0.08} strokeWidth={2} dot={{ r: 3, fill: "#1a6b5a", strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      {/* 카드사별 신청/집행 분포 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section delay={0.18}>
          <Title>카드사별 신청 분포</Title>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={cardCompanyData.map(c => ({ name: c.company, value: Math.round(getBudget(Math.round(c.amount * scale)).applied) }))} cx="50%" cy="50%" outerRadius={95} innerRadius={35} dataKey="value" label={renderPieLabel} labelLine={false}>
                {cardCompanyData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </Section>

        <Section delay={0.20}>
          <Title>카드사별 집행 분포</Title>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={cardCompanyData.map(c => ({ name: c.company, value: Math.round(c.amount * scale) }))} cx="50%" cy="50%" outerRadius={95} innerRadius={35} dataKey="value" label={renderPieLabel} labelLine={false}>
                {cardCompanyData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* Blocked Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={ShieldAlert} label="차단 건수" value={`${formatNumber(blockedCount)}건`} accent="#9e3328" delay={0.22} />
        <StatCard icon={ShieldOff} label="차단 금액" value={formatKRW(blockedAmount)} accent="#9e3328" delay={0.24} />
        <StatCard icon={RotateCcw} label="환불 금액" value={formatKRW(refundAmount)} accent="#b06828" delay={0.26} />
      </div>

      {/* Blocked + Refund Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section delay={0.28}>
          <Title>차단 금액 추이</Title>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="week" {...AX} />
              <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="blockedB" name="차단" fill="#9e3328" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
        <Section delay={0.30}>
          <Title>환불 금액 추이</Title>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="week" {...AX} />
              <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="refundB" name="환불" fill="#b06828" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* Summary Table */}
      <Section delay={0.32}>
        <Title>{name} 요약</Title>
        <div className="overflow-x-auto">
          <table className="w-full">
            <TH headers={[{ label: "항목" }, { label: "금액", align: "right" }]} />
            <tbody>
              {[
                { l: "배정 예산", v: formatKRW(d.budget) },
                { l: "신청액", v: formatKRW(d.applied) },
                { l: "집행액", v: formatKRW(d.spent) },
                { l: "차단 금액", v: formatKRW(blockedAmount) },
                { l: "환불 금액", v: formatKRW(refundAmount) },
                { l: "거래 건수", v: `${formatNumber(region.txCount)}건` },
              ].map((r) => (
                <tr key={r.l} className="table-row">
                  <td className="font-medium" style={{ color: "#4a5568" }}>{r.l}</td>
                  <td className="text-right font-mono text-xs" style={{ color: "#1a1d24" }}>{r.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

/* ─── Card Company Detail ─── */

function CardCompanyDetail({ name }: { name: string }) {
  const company = cardCompanyData.find((c) => c.company === name);
  if (!company) return null;

  const d = getBudget(company.amount);
  const scale = company.amount / policyBudget.totalSpent;
  const weekly = getWeekly(scale);
  const regions = regionData.map((r) => ({ name: r.region, value: Math.round(r.amount * scale) }));
  const blockedCount = Math.round(TOTAL_BLOCKED * scale);
  const blockedAmount = Math.round(policyBudget.blockedAmount * scale);
  const refundAmount = Math.round(policyBudget.refundAmount * scale);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="배정 예산" value={formatKRW(d.budget)} accent="#2d5f8a" delay={0.04} />
        <StatCard icon={FileText} label="신청액" value={formatKRW(d.applied)} sub={`예산 대비 ${((d.applied / d.budget) * 100).toFixed(1)}%`} accent="#6b4c7a" delay={0.08} />
        <StatCard icon={TrendingUp} label="집행액" value={formatKRW(d.spent)} sub={`신청 대비 ${((d.spent / d.applied) * 100).toFixed(1)}%`} accent="#1a6b5a" delay={0.12} />
      </div>

      <Bar2 label="신청액 대비 집행률" spent={d.spent} total={d.applied} delay={0.14} />

      {/* Weekly Trend */}
      <Section delay={0.16}>
        <Title>주간 집행 추이</Title>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
            <XAxis dataKey="week" {...AX} />
            <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
            <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
            <Area type="monotone" dataKey="spentB" name="집행" stroke="#1a6b5a" fill="#1a6b5a" fillOpacity={0.08} strokeWidth={2} dot={{ r: 3, fill: "#1a6b5a", strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      {/* 지역별 신청/집행 현황 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section delay={0.18}>
          <Title>지역별 신청 현황</Title>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={regionData.map(r => ({ name: r.region, value: Math.round(getBudget(Math.round(r.amount * scale)).applied) }))} cx="50%" cy="50%" outerRadius={95} innerRadius={35} dataKey="value" label={renderPieLabel} labelLine={false}>
                {regionData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </Section>

        <Section delay={0.20}>
          <Title>지역별 집행 현황</Title>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={regions} cx="50%" cy="50%" outerRadius={95} innerRadius={35} dataKey="value" label={renderPieLabel} labelLine={false}>
                {regions.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* Blocked Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={ShieldAlert} label="차단 건수" value={`${formatNumber(blockedCount)}건`} accent="#9e3328" delay={0.22} />
        <StatCard icon={ShieldOff} label="차단 금액" value={formatKRW(blockedAmount)} accent="#9e3328" delay={0.24} />
        <StatCard icon={RotateCcw} label="환불 금액" value={formatKRW(refundAmount)} accent="#b06828" delay={0.26} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section delay={0.28}>
          <Title>차단 금액 추이</Title>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="week" {...AX} />
              <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="blockedB" name="차단" fill="#9e3328" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
        <Section delay={0.30}>
          <Title>환불 금액 추이</Title>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="week" {...AX} />
              <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="refundB" name="환불" fill="#b06828" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </div>

      <Section delay={0.32}>
        <Title>{name} 요약</Title>
        <div className="overflow-x-auto">
          <table className="w-full">
            <TH headers={[{ label: "항목" }, { label: "금액", align: "right" }]} />
            <tbody>
              {[
                { l: "배정 예산", v: formatKRW(d.budget) },
                { l: "신청액", v: formatKRW(d.applied) },
                { l: "집행액", v: formatKRW(d.spent) },
                { l: "차단 금액", v: formatKRW(blockedAmount) },
                { l: "환불 금액", v: formatKRW(refundAmount) },
                { l: "거래 건수", v: `${formatNumber(company.txCount)}건` },
              ].map((r) => (
                <tr key={r.l} className="table-row">
                  <td className="font-medium" style={{ color: "#4a5568" }}>{r.l}</td>
                  <td className="text-right font-mono text-xs" style={{ color: "#1a1d24" }}>{r.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

/* ─── Main Dashboard ─── */

function MainDashboard({
  onSelectRegion, onSelectCard,
}: {
  onSelectRegion: (name: string) => void;
  onSelectCard: (name: string) => void;
}) {
  const regionPie = regionData.map((r) => ({ name: r.region, value: r.amount }));
  const cardPie = cardCompanyData.map((c) => ({ name: c.company, value: c.amount }));
  const trendData = weeklyTrend.map((w) => ({
    ...w, spentB: w.spent / 1e8, blockedB: w.blocked / 1e8, refundB: w.refund / 1e8,
  }));
  const scKrwPie = [
    { name: "SC (스테이블코인)", value: settlementSummary.scAmount },
    { name: "KRW (원화)", value: settlementSummary.krwAmount },
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="총 예산" value={formatKRW(policyBudget.totalBudget)} sub={policyBudget.period} accent="#2d5f8a" delay={0.04} />
        <StatCard icon={FileText} label="신청액" value={formatKRW(policyBudget.appliedAmount)} sub={`총예산 대비 ${((policyBudget.appliedAmount / policyBudget.totalBudget) * 100).toFixed(1)}%`} accent="#6b4c7a" delay={0.08} />
        <StatCard icon={TrendingUp} label="집행액" value={formatKRW(policyBudget.totalSpent)} sub={`집행률 ${policyBudget.executionRate}%`} accent="#1a6b5a" delay={0.12} />
      </div>

      <Bar2 label="예산 대비 집행률" spent={policyBudget.totalSpent} total={policyBudget.totalBudget} delay={0.14} />

      {/* Pies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section delay={0.16}>
          <Title>지역별 집행 분포</Title>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={regionPie} cx="50%" cy="50%" outerRadius={105} innerRadius={40} dataKey="value" label={renderPieLabel} labelLine={false}
                onClick={(e) => e.name && onSelectRegion(e.name)} className="cursor-pointer">
                {regionPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </Section>

        <Section delay={0.18}>
          <Title>카드사별 집행 분포</Title>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={cardPie} cx="50%" cy="50%" outerRadius={105} innerRadius={40} dataKey="value" label={renderPieLabel} labelLine={false}
                onClick={(e) => e.name && onSelectCard(e.name)} className="cursor-pointer">
                {cardPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* Industry */}
      <Section delay={0.20}>
        <Title>업종별 사용 현황</Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={industryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0ede8" />
            <XAxis type="number" tickFormatter={(v) => formatKRW(v)} {...AX} />
            <YAxis type="category" dataKey="industry" width={80} tick={{ fontSize: 11, fill: "#4a5568" }} axisLine={false} tickLine={false} />
            <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
            <Bar dataKey="amount" fill="#2d5f8a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Trends */}
      <Section delay={0.22}>
        <Title>집행 금액 추이</Title>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
            <XAxis dataKey="week" {...AX} />
            <YAxis tickFormatter={(v) => `${v}억`} {...AX} axisLine={false} />
            <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(0)}억`} />
            <Area type="monotone" dataKey="spentB" name="집행 금액" stroke="#1a6b5a" fill="#1a6b5a" fillOpacity={0.08} strokeWidth={2} dot={{ r: 3, fill: "#1a6b5a", strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section delay={0.24}>
          <Title>차단 금액 추이</Title>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="week" {...AX} />
              <YAxis tickFormatter={(v) => `${v}억`} {...AX} axisLine={false} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="blockedB" name="차단 금액" fill="#9e3328" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section delay={0.26}>
          <Title>환불 금액 추이</Title>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="week" {...AX} />
              <YAxis tickFormatter={(v) => `${v}억`} {...AX} axisLine={false} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="refundB" name="환불 금액" fill="#b06828" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* Tables */}
      <Section delay={0.28}>
        <Title>지역별 상세</Title>
        <div className="overflow-x-auto">
          <table className="w-full">
            <TH headers={[{ label: "지역" }, { label: "집행 금액", align: "right" }, { label: "비중", align: "right" }, { label: "거래 건수", align: "right" }]} />
            <tbody>
              {regionData.map((r) => (
                <tr key={r.region} className="table-row table-row-hover card-interactive" onClick={() => onSelectRegion(r.region)}>
                  <td className="font-medium" style={{ color: "#2d5f8a" }}>{r.region}</td>
                  <td className="text-right font-mono text-xs" style={{ color: "#1a1d24" }}>{formatKRW(r.amount)}</td>
                  <td className="text-right font-mono text-xs" style={{ color: "#8a919e" }}>{r.ratio}%</td>
                  <td className="text-right font-mono text-xs" style={{ color: "#4a5568" }}>{formatNumber(r.txCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section delay={0.30}>
        <Title>카드사별 상세</Title>
        <div className="overflow-x-auto">
          <table className="w-full">
            <TH headers={[{ label: "카드사" }, { label: "집행 금액", align: "right" }, { label: "비중", align: "right" }, { label: "거래 건수", align: "right" }]} />
            <tbody>
              {cardCompanyData.map((c) => (
                <tr key={c.company} className="table-row table-row-hover card-interactive" onClick={() => onSelectCard(c.company)}>
                  <td className="font-medium" style={{ color: "#2d5f8a" }}>{c.company}</td>
                  <td className="text-right font-mono text-xs" style={{ color: "#1a1d24" }}>{formatKRW(c.amount)}</td>
                  <td className="text-right font-mono text-xs" style={{ color: "#8a919e" }}>{c.ratio}%</td>
                  <td className="text-right font-mono text-xs" style={{ color: "#4a5568" }}>{formatNumber(c.txCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* SC/KRW */}
      <div className="card overflow-hidden animate-in" style={{ animationDelay: "0.32s" }}>
        <div className="px-6 py-3.5 flex items-center gap-2.5" style={{ background: "var(--navy)" }}>
          <Zap className="w-4 h-4" style={{ color: "var(--gold)" }} />
          <h3 className="text-[13px] font-semibold text-white">정산 현황</h3>
          <span className="text-[11px] ml-1" style={{ color: "rgba(255,255,255,0.35)" }}>전체 승인 금액 · SC / KRW</span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={scKrwPie} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" label={renderPieLabel} labelLine={false}>
                    <Cell fill={SC_COLOR} /><Cell fill={KRW_COLOR} />
                  </Pie>
                  <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
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
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: SC_COLOR }}>SC (T+0)</span>
                </div>
                <p className="text-xl font-bold font-mono" style={{ color: "#1a1d24" }}>{formatKRW(settlementSummary.scAmount)}</p>
                <p className="text-[11px] mt-2 font-mono" style={{ color: "#8a919e" }}>{settlementSummary.scRatio}% · {settlementSummary.avgLeadTimeSC}</p>
              </div>
              <div className="rounded-xl p-5" style={{ background: "#fdf6ef" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Landmark className="w-4 h-4" style={{ color: KRW_COLOR }} />
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: KRW_COLOR }}>KRW (카드사)</span>
                </div>
                <p className="text-xl font-bold font-mono" style={{ color: "#1a1d24" }}>{formatKRW(settlementSummary.krwAmount)}</p>
                <p className="text-[11px] mt-2 font-mono" style={{ color: "#8a919e" }}>{settlementSummary.krwRatio}% · {settlementSummary.avgLeadTimeKRW}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Root ─── */

export default function PolicyExecution() {
  const [dateFrom, setDateFrom] = useState("2026-04-01");
  const [dateTo, setDateTo] = useState("2026-06-30");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCard, setSelectedCard] = useState("all");

  const handleRegion = (name: string) => { setSelectedRegion(name); setSelectedCard("all"); };
  const handleCard = (name: string) => { setSelectedCard(name); setSelectedRegion("all"); };

  const isDetail = selectedRegion !== "all" || selectedCard !== "all";

  return (
    <div className="space-y-6">
      <FilterBar
        dateFrom={dateFrom} dateTo={dateTo}
        setDateFrom={setDateFrom} setDateTo={setDateTo}
        selectedRegion={selectedRegion} setSelectedRegion={handleRegion}
        selectedCard={selectedCard} setSelectedCard={handleCard}
      />

      {isDetail && (
        <div className="animate-in stagger-1">
          <h2 className="text-[15px] font-bold flex items-center gap-2" style={{ color: "#1a1d24" }}>
            {selectedRegion !== "all" && <><MapPin className="w-4 h-4" style={{ color: "#6b4c7a" }} />{selectedRegion}</>}
            {selectedCard !== "all" && <><CreditCard className="w-4 h-4" style={{ color: "#2d5f8a" }} />{selectedCard}</>}
          </h2>
        </div>
      )}

      {selectedRegion !== "all" ? (
        <RegionDetail name={selectedRegion} />
      ) : selectedCard !== "all" ? (
        <CardCompanyDetail name={selectedCard} />
      ) : (
        <MainDashboard onSelectRegion={handleRegion} onSelectCard={handleCard} />
      )}
    </div>
  );
}
