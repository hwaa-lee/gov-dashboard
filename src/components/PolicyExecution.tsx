"use client";

import { Wallet, TrendingUp, ShoppingBag, FileText, Zap, Landmark, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import {
  policyBudget, regionData, cardCompanyData, industryData, weeklyTrend,
  settlementSummary, blockSummary, formatKRW, formatNumber,
} from "@/lib/mock-data";
import { renderPieLabel } from "./PieLabel";
import { PIE_COLORS, BRAND, BRAND_LIGHT, TT, AX, StatCard, Section, Title, DataTable, TR, TD } from "./shared";
import BlockedRefundSection from "./BlockedRefundSection";
import RecentBlockLogs from "./RecentBlockLogs";

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
    <div className="space-y-6">
      {/* Stats - 4 col grid like TailPanel */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Wallet} label="총 예산" value={formatKRW(policyBudget.totalBudget)} sub={policyBudget.period} accent="#2d5f8a" delay={0.02} />
        <StatCard icon={FileText} label="신청액" value={formatKRW(policyBudget.appliedAmount)} sub={`총예산 대비 ${((policyBudget.appliedAmount / policyBudget.totalBudget) * 100).toFixed(1)}%`} accent="#6b4c7a" delay={0.04} />
        <StatCard icon={TrendingUp} label="집행액" value={formatKRW(policyBudget.totalSpent)} sub={`집행률 ${policyBudget.executionRate}%`} accent="#1a6b5a" delay={0.06} />
        <StatCard icon={BarChart3} label="집행률" value={`${policyBudget.executionRate}%`} sub={`${formatKRW(policyBudget.totalSpent)} / ${formatKRW(policyBudget.totalBudget)}`} accent="#8b6d3f" delay={0.08} />
      </div>

      {/* Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section delay={0.12}>
          <Title>지역별 집행 분포</Title>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={regionPie} cx="50%" cy="50%" outerRadius={110} innerRadius={45} dataKey="value" label={renderPieLabel} labelLine={false}>
                  {regionPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section delay={0.14}>
          <Title>카드사별 집행 분포</Title>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cardPie} cx="50%" cy="50%" outerRadius={110} innerRadius={45} dataKey="value" label={renderPieLabel} labelLine={false}>
                  {cardPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      {/* Cross Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section delay={0.16}>
          <Title>카드사별 신청·집행</Title>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cardGrouped}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => formatKRW(v)} {...AX} axisLine={false} width={65} />
                <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                <Bar dataKey="신청액" fill={BRAND_LIGHT} radius={[4, 4, 0, 0]} />
                <Bar dataKey="집행액" fill={BRAND} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section delay={0.18}>
          <Title>업종별 사용 현황 (상위)</Title>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="industry" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => formatKRW(v)} {...AX} axisLine={false} width={65} />
                <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
                <Bar dataKey="amount" name="집행액" fill={BRAND} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      {/* Trend - PrimeX gradient area */}
      <Section delay={0.20}>
        <Title>집행 금액 추이</Title>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="gradSpent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" {...AX} />
              <YAxis tickFormatter={(v) => `${v}억`} {...AX} axisLine={false} width={65} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(0)}억`} />
              <Area type="monotone" dataKey="spentB" name="집행 금액" stroke={BRAND} strokeWidth={2} fill="url(#gradSpent)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* Blocked / Refund */}
      <BlockedRefundSection
        blockedCount={TOTAL_BLOCKED}
        blockedAmount={policyBudget.blockedAmount}
        refundAmount={policyBudget.refundAmount}
        weeklyData={trend}
        delay={0.22}
      />

      {/* Settlement SC/KRW */}
      <Section delay={0.24}>
        <Title>정산 현황 SC / KRW</Title>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: "SC", value: settlementSummary.scAmount }, { name: "KRW", value: settlementSummary.krwAmount }]}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" label={renderPieLabel} labelLine={false}>
                  <Cell fill="#1a6b5a" /><Cell fill="#b06828" />
                </Pie>
                <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-5 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#1a6b5a" }} />SC (즉시)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#b06828" }} />KRW (카드사)</span>
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-center">
            <div className="rounded-xl p-5" style={{ background: "#f0f7f4" }}>
              <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4" style={{ color: "#1a6b5a" }} /><span className="text-xs font-medium" style={{ color: "#1a6b5a" }}>SC 정산 (T+0)</span></div>
              <p className="text-xl font-bold font-mono text-gray-900">{formatKRW(settlementSummary.scAmount)}</p>
              <p className="text-xs mt-1.5 font-mono text-gray-500">{settlementSummary.scRatio}% · {settlementSummary.avgLeadTimeSC}</p>
            </div>
            <div className="rounded-xl p-5" style={{ background: "#fdf6ef" }}>
              <div className="flex items-center gap-2 mb-2"><Landmark className="w-4 h-4" style={{ color: "#b06828" }} /><span className="text-xs font-medium" style={{ color: "#b06828" }}>KRW 정산 (카드사)</span></div>
              <p className="text-xl font-bold font-mono text-gray-900">{formatKRW(settlementSummary.krwAmount)}</p>
              <p className="text-xs mt-1.5 font-mono text-gray-500">{settlementSummary.krwRatio}% · {settlementSummary.avgLeadTimeKRW}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section delay={0.26}>
          <Title>지역별 상세</Title>
          <DataTable headers={["지역", "집행액", "비중", "건수"]}>
            {regionData.map((r) => (
              <TR key={r.region}>
                <TD>{r.region}</TD>
                <TD right mono>{formatKRW(r.amount)}</TD>
                <TD right mono muted>{r.ratio}%</TD>
                <TD right mono>{formatNumber(r.txCount)}</TD>
              </TR>
            ))}
          </DataTable>
        </Section>

        <Section delay={0.28}>
          <Title>카드사별 상세</Title>
          <DataTable headers={["카드사", "신청액", "집행액", "건수"]}>
            {cardCompanyData.map((c) => (
              <TR key={c.company}>
                <TD>{c.company}</TD>
                <TD right mono>{formatKRW(Math.round(c.amount * 1.19))}</TD>
                <TD right mono>{formatKRW(c.amount)}</TD>
                <TD right mono>{formatNumber(c.txCount)}</TD>
              </TR>
            ))}
          </DataTable>
        </Section>
      </div>

      <RecentBlockLogs delay={0.30} />
    </div>
  );
}
