"use client";

import { Wallet, TrendingUp, ShoppingBag, FileText, Zap, Landmark } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import {
  policyBudget, regionData, cardCompanyData, industryData, weeklyTrend,
  settlementSummary, blockSummary, formatKRW, formatNumber,
} from "@/lib/mock-data";
import { renderPieLabel } from "./PieLabel";
import { PIE_COLORS, TT, AX, StatCard, Section, Title, ProgressBar, DataTable } from "./shared";
import DateFilter from "./DateFilter";
import BlockedRefundSection from "./BlockedRefundSection";
import RecentBlockLogs from "./RecentBlockLogs";

const SC = "#1a6b5a";
const KRW = "#b06828";
const TOTAL_BLOCKED = blockSummary.reduce((s, b) => s + b.count, 0);

export default function PolicyExecution() {
  const regionPie = regionData.map((r) => ({ name: r.region, value: r.amount }));
  const cardPie = cardCompanyData.map((c) => ({ name: c.company, value: c.amount }));

  const cardGrouped = cardCompanyData.map((c) => ({
    name: c.company.replace("카드", ""),
    신청액: Math.round(c.amount * 1.19),
    집행액: c.amount,
  }));

  const trend = weeklyTrend.map((w) => ({
    week: w.week, spentB: w.spent / 1e8, blockedB: w.blocked / 1e8, refundB: w.refund / 1e8,
  }));

  return (
    <div className="space-y-4">
      {/* ① 기간 필터 */}
      <DateFilter />

      {/* ② 핵심 수치 + 집행률 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="총 예산" value={formatKRW(policyBudget.totalBudget)} sub={policyBudget.period} accent="#2d5f8a" delay={0.02} />
        <StatCard icon={FileText} label="신청액" value={formatKRW(policyBudget.appliedAmount)} sub={`총예산 대비 ${((policyBudget.appliedAmount / policyBudget.totalBudget) * 100).toFixed(1)}%`} accent="#6b4c7a" delay={0.06} />
        <StatCard icon={TrendingUp} label="집행액" value={formatKRW(policyBudget.totalSpent)} sub={`집행률 ${policyBudget.executionRate}%`} accent="#1a6b5a" delay={0.10} />
      </div>
      <ProgressBar label="예산 대비 집행률" spent={policyBudget.totalSpent} total={policyBudget.totalBudget} delay={0.12} />

      {/* ③ 분포 현황 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section delay={0.14}>
          <Title>지역별 집행 분포</Title>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={regionPie} cx="50%" cy="50%" outerRadius={105} innerRadius={40} dataKey="value" label={renderPieLabel} labelLine={false}>
                {regionPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </Section>
        <Section delay={0.16}>
          <Title>카드사별 집행 분포</Title>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={cardPie} cx="50%" cy="50%" outerRadius={105} innerRadius={40} dataKey="value" label={renderPieLabel} labelLine={false}>
                {cardPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* ④ 교차 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section delay={0.18}>
          <Title>카드사별 신청·집행</Title>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={cardGrouped} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0ede8" />
              <XAxis type="number" tickFormatter={(v) => formatKRW(v)} {...AX} />
              <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 11, fill: "#4a5568" }} axisLine={false} tickLine={false} />
              <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              <Bar dataKey="신청액" fill="#6b4c7a" radius={[0, 4, 4, 0]} />
              <Bar dataKey="집행액" fill="#1a6b5a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
        <Section delay={0.20}>
          <Title>업종별 사용 현황</Title>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={industryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0ede8" />
              <XAxis type="number" tickFormatter={(v) => formatKRW(v)} {...AX} />
              <YAxis type="category" dataKey="industry" width={80} tick={{ fontSize: 11, fill: "#4a5568" }} axisLine={false} tickLine={false} />
              <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
              <Bar dataKey="amount" name="집행액" fill="#2d5f8a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* ⑤ 추이 */}
      <Section delay={0.22}>
        <Title>집행 금액 추이</Title>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
            <XAxis dataKey="week" {...AX} />
            <YAxis tickFormatter={(v) => `${v}억`} {...AX} axisLine={false} />
            <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(0)}억`} />
            <Area type="monotone" dataKey="spentB" name="집행 금액" stroke="#1a6b5a" fill="#1a6b5a" fillOpacity={0.08} strokeWidth={2} dot={{ r: 3, fill: "#1a6b5a", strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      {/* ⑥ 차단·환불 */}
      <BlockedRefundSection
        blockedCount={TOTAL_BLOCKED}
        blockedAmount={policyBudget.blockedAmount}
        refundAmount={policyBudget.refundAmount}
        weeklyData={trend}
        delay={0.24}
      />

      {/* ⑦ 정산 현황 */}
      <div className="card overflow-hidden animate-in" style={{ animationDelay: "0.26s" }}>
        <div className="px-6 py-3.5 flex items-center gap-2.5" style={{ background: "var(--navy)" }}>
          <Zap className="w-4 h-4" style={{ color: "var(--gold)" }} />
          <h3 className="text-[13px] font-semibold text-white">정산 현황 SC / KRW</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={[{ name: "SC", value: settlementSummary.scAmount }, { name: "KRW", value: settlementSummary.krwAmount }]} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={renderPieLabel} labelLine={false}>
                    <Cell fill={SC} /><Cell fill={KRW} />
                  </Pie>
                  <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-5 mt-2 text-[11px]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: SC }} />SC (즉시)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: KRW }} />KRW (카드사)</span>
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-center">
              <div className="rounded-xl p-5" style={{ background: "#f0f7f4" }}>
                <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4" style={{ color: SC }} /><span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: SC }}>SC (T+0)</span></div>
                <p className="text-xl font-bold font-mono" style={{ color: "#1a1d24" }}>{formatKRW(settlementSummary.scAmount)}</p>
                <p className="text-[11px] mt-1.5 font-mono" style={{ color: "#8a919e" }}>{settlementSummary.scRatio}% · {settlementSummary.avgLeadTimeSC}</p>
              </div>
              <div className="rounded-xl p-5" style={{ background: "#fdf6ef" }}>
                <div className="flex items-center gap-2 mb-2"><Landmark className="w-4 h-4" style={{ color: KRW }} /><span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: KRW }}>KRW (카드사)</span></div>
                <p className="text-xl font-bold font-mono" style={{ color: "#1a1d24" }}>{formatKRW(settlementSummary.krwAmount)}</p>
                <p className="text-[11px] mt-1.5 font-mono" style={{ color: "#8a919e" }}>{settlementSummary.krwRatio}% · {settlementSummary.avgLeadTimeKRW}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ⑧ 상세 테이블 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section delay={0.28}>
          <Title>지역별 상세</Title>
          <DataTable headers={["지역", "집행액", "비중", "건수"]}>
            {regionData.map((r) => (
              <tr key={r.region} className="table-row table-row-hover">
                <td className="font-medium">{r.region}</td>
                <td className="text-right font-mono text-xs">{formatKRW(r.amount)}</td>
                <td className="text-right font-mono text-xs" style={{ color: "#8a919e" }}>{r.ratio}%</td>
                <td className="text-right font-mono text-xs">{formatNumber(r.txCount)}</td>
              </tr>
            ))}
          </DataTable>
        </Section>
        <Section delay={0.30}>
          <Title>카드사별 상세</Title>
          <DataTable headers={["카드사", "신청액", "집행액", "건수"]}>
            {cardCompanyData.map((c) => (
              <tr key={c.company} className="table-row table-row-hover">
                <td className="font-medium">{c.company}</td>
                <td className="text-right font-mono text-xs">{formatKRW(Math.round(c.amount * 1.19))}</td>
                <td className="text-right font-mono text-xs">{formatKRW(c.amount)}</td>
                <td className="text-right font-mono text-xs">{formatNumber(c.txCount)}</td>
              </tr>
            ))}
          </DataTable>
        </Section>
      </div>

      {/* ⑨ 최근 차단 로그 */}
      <RecentBlockLogs delay={0.32} />
    </div>
  );
}
