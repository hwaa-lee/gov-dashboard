"use client";

import { Wallet, TrendingUp, FileText, ShieldAlert, ShieldOff, RotateCcw } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend,
} from "recharts";
import {
  policyBudget, regionData, cardCompanyData, weeklyTrend, blockSummary,
  formatKRW, formatNumber,
} from "@/lib/mock-data";
import { StatCard, Section, Title, ProgressBar, DataTable, TT, AX } from "./shared";

const TOTAL_BLOCKED = blockSummary.reduce((s, b) => s + b.count, 0);

function getBudget(spent: number) {
  return { budget: Math.round(spent * 1.54), applied: Math.round(spent * 1.19), spent };
}

export default function RegionView({ region: regionName }: { region: string }) {
  const region = regionData.find((r) => r.region === regionName);
  if (!region) return null;

  const d = getBudget(region.amount);
  const scale = region.amount / policyBudget.totalSpent;
  const blockedCount = Math.round(TOTAL_BLOCKED * scale);
  const blockedAmount = Math.round(policyBudget.blockedAmount * scale);
  const refundAmount = Math.round(policyBudget.refundAmount * scale);

  const weekly = weeklyTrend.map((w) => ({
    week: w.week,
    spentB: Math.round(w.spent * scale) / 1e8,
    blockedB: Math.round(w.blocked * scale) / 1e8,
    refundB: Math.round(w.refund * scale) / 1e8,
  }));

  // 카드사별 신청/집행 grouped bar
  const cardGrouped = cardCompanyData.map((c) => {
    const cScale = c.amount / policyBudget.totalSpent;
    return {
      name: c.company.replace("카드", ""),
      applied: Math.round(d.applied * cScale * (policyBudget.totalSpent / region.amount) * scale),
      spent: Math.round(c.amount * scale),
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="배정 예산" value={formatKRW(d.budget)} accent="#2d5f8a" delay={0.02} />
        <StatCard icon={FileText} label="신청액" value={formatKRW(d.applied)} sub={`예산 대비 ${((d.applied / d.budget) * 100).toFixed(1)}%`} accent="#6b4c7a" delay={0.06} />
        <StatCard icon={TrendingUp} label="집행액" value={formatKRW(d.spent)} sub={`신청 대비 ${((d.spent / d.applied) * 100).toFixed(1)}%`} accent="#1a6b5a" delay={0.10} />
      </div>

      <ProgressBar label="신청액 대비 집행률" spent={d.spent} total={d.applied} delay={0.12} />

      {/* 카드사별 신청·집행 Grouped Bar */}
      <Section delay={0.14}>
        <Title>카드사별 신청·집행 현황</Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cardGrouped} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0ede8" />
            <XAxis type="number" tickFormatter={(v) => formatKRW(v)} {...AX} />
            <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 11, fill: "#4a5568" }} axisLine={false} tickLine={false} />
            <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Bar dataKey="applied" name="신청액" fill="#6b4c7a" radius={[0, 4, 4, 0]} />
            <Bar dataKey="spent" name="집행액" fill="#1a6b5a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* 주간 추이 */}
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

      {/* 차단/환불 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={ShieldAlert} label="차단 건수" value={`${formatNumber(blockedCount)}건`} accent="#9e3328" delay={0.18} />
        <StatCard icon={ShieldOff} label="차단 금액" value={formatKRW(blockedAmount)} accent="#9e3328" delay={0.20} />
        <StatCard icon={RotateCcw} label="환불 금액" value={formatKRW(refundAmount)} accent="#b06828" delay={0.22} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section delay={0.24}>
          <Title>차단 금액 추이</Title>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" /><XAxis dataKey="week" {...AX} /><YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="blockedB" name="차단" fill="#9e3328" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
        <Section delay={0.26}>
          <Title>환불 금액 추이</Title>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" /><XAxis dataKey="week" {...AX} /><YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="refundB" name="환불" fill="#b06828" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* 카드사별 상세 테이블 */}
      <Section delay={0.28}>
        <Title>카드사별 상세</Title>
        <DataTable headers={["카드사", "신청액", "집행액", "거래 건수"]}>
          {cardCompanyData.map((c) => {
            const cSpent = Math.round(c.amount * scale);
            const cApplied = Math.round(cSpent * 1.19);
            return (
              <tr key={c.company} className="table-row table-row-hover">
                <td className="font-medium">{c.company}</td>
                <td className="text-right font-mono text-xs">{formatKRW(cApplied)}</td>
                <td className="text-right font-mono text-xs">{formatKRW(cSpent)}</td>
                <td className="text-right font-mono text-xs">{formatNumber(Math.round(c.txCount * scale))}</td>
              </tr>
            );
          })}
        </DataTable>
      </Section>
    </div>
  );
}
