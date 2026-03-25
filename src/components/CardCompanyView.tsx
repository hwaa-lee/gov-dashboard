"use client";

import { Wallet, TrendingUp, FileText } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend,
} from "recharts";
import {
  policyBudget, regionData, cardCompanyData, weeklyTrend, blockSummary,
  formatKRW, formatNumber,
} from "@/lib/mock-data";
import { BRAND, BRAND_LIGHT, TT, AX, StatCard, Section, Title, ProgressBar, DataTable, TR, TD } from "./shared";
import DateFilter from "./DateFilter";
import BlockedRefundSection from "./BlockedRefundSection";
import RecentBlockLogs from "./RecentBlockLogs";

const TOTAL_BLOCKED = blockSummary.reduce((s, b) => s + b.count, 0);

export default function CardCompanyView({ company: name }: { company: string }) {
  const company = cardCompanyData.find((c) => c.company === name);
  if (!company) return null;

  const scale = company.amount / policyBudget.totalSpent;
  const budget = Math.round(company.amount * 1.54);
  const applied = Math.round(company.amount * 1.19);
  const spent = company.amount;

  const weekly = weeklyTrend.map((w) => ({
    week: w.week, spentB: Math.round(w.spent * scale) / 1e8,
    blockedB: Math.round(w.blocked * scale) / 1e8, refundB: Math.round(w.refund * scale) / 1e8,
  }));

  const regionGrouped = regionData.map((r) => ({
    name: r.region,
    신청액: Math.round(r.amount * scale * 1.19),
    집행액: Math.round(r.amount * scale),
  }));

  return (
    <div className="space-y-6">
      <DateFilter />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Wallet} label="배정 예산" value={formatKRW(budget)} delay={0.02} />
        <StatCard icon={FileText} label="신청액" value={formatKRW(applied)} sub={`예산 대비 ${((applied / budget) * 100).toFixed(1)}%`} delay={0.05} />
        <StatCard icon={TrendingUp} label="집행액" value={formatKRW(spent)} sub={`신청 대비 ${((spent / applied) * 100).toFixed(1)}%`} accent="#1a6b5a" delay={0.08} />
      </div>

      <ProgressBar label="신청액 대비 집행률" spent={spent} total={applied} delay={0.10} />

      <Section delay={0.12}>
        <Title>지역별 신청·집행 현황</Title>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionGrouped}>
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

      <Section delay={0.14}>
        <Title>주간 집행 추이</Title>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekly}>
              <defs>
                <linearGradient id="gradCard" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" {...AX} />
              <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} width={65} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Area type="monotone" dataKey="spentB" name="집행" stroke={BRAND} strokeWidth={2} fill="url(#gradCard)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <BlockedRefundSection
        blockedCount={Math.round(TOTAL_BLOCKED * scale)}
        blockedAmount={Math.round(policyBudget.blockedAmount * scale)}
        refundAmount={Math.round(policyBudget.refundAmount * scale)}
        weeklyData={weekly} delay={0.16}
      />

      <Section delay={0.18}>
        <Title>지역별 상세</Title>
        <DataTable headers={["지역", "신청액", "집행액", "거래 건수"]}>
          {regionData.map((r) => {
            const rSpent = Math.round(r.amount * scale);
            return (
              <TR key={r.region}>
                <TD>{r.region}</TD>
                <TD right mono>{formatKRW(Math.round(rSpent * 1.19))}</TD>
                <TD right mono>{formatKRW(rSpent)}</TD>
                <TD right mono>{formatNumber(Math.round(r.txCount * scale))}</TD>
              </TR>
            );
          })}
        </DataTable>
      </Section>

      <RecentBlockLogs filterCard={name} delay={0.20} />
    </div>
  );
}
