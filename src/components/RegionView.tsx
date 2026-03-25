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
import { StatCard, Section, Title, ProgressBar, DataTable, TT, AX } from "./shared";
import DateFilter from "./DateFilter";
import BlockedRefundSection from "./BlockedRefundSection";
import RecentBlockLogs from "./RecentBlockLogs";

const TOTAL_BLOCKED = blockSummary.reduce((s, b) => s + b.count, 0);

export default function RegionView({ region: name }: { region: string }) {
  const region = regionData.find((r) => r.region === name);
  if (!region) return null;

  const scale = region.amount / policyBudget.totalSpent;
  const budget = Math.round(region.amount * 1.54);
  const applied = Math.round(region.amount * 1.19);
  const spent = region.amount;

  const weekly = weeklyTrend.map((w) => ({
    week: w.week, spentB: Math.round(w.spent * scale) / 1e8,
    blockedB: Math.round(w.blocked * scale) / 1e8, refundB: Math.round(w.refund * scale) / 1e8,
  }));

  const cardGrouped = cardCompanyData.map((c) => ({
    name: c.company.replace("카드", ""),
    신청액: Math.round(c.amount * scale * 1.19),
    집행액: Math.round(c.amount * scale),
  }));

  const blockedCount = Math.round(TOTAL_BLOCKED * scale);
  const blockedAmount = Math.round(policyBudget.blockedAmount * scale);
  const refundAmount = Math.round(policyBudget.refundAmount * scale);

  return (
    <div className="space-y-4">
      <DateFilter />

      {/* ① 핵심 수치 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="배정 예산" value={formatKRW(budget)} accent="#2d5f8a" delay={0.02} />
        <StatCard icon={FileText} label="신청액" value={formatKRW(applied)} sub={`예산 대비 ${((applied / budget) * 100).toFixed(1)}%`} accent="#6b4c7a" delay={0.06} />
        <StatCard icon={TrendingUp} label="집행액" value={formatKRW(spent)} sub={`신청 대비 ${((spent / applied) * 100).toFixed(1)}%`} accent="#1a6b5a" delay={0.10} />
      </div>
      <ProgressBar label="신청액 대비 집행률" spent={spent} total={applied} delay={0.12} />

      {/* ② 교차 분석: 카드사별 신청·집행 */}
      <Section delay={0.14}>
        <Title>카드사별 신청·집행 현황</Title>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={cardGrouped} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" tickFormatter={(v) => formatKRW(v)} {...AX} />
            <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 11, fill: "#4a5568" }} axisLine={false} tickLine={false} />
            <Tooltip {...TT} formatter={(v) => formatKRW(Number(v))} />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Bar dataKey="신청액" fill="#6b4c7a" radius={[0, 4, 4, 0]} />
            <Bar dataKey="집행액" fill="#1a6b5a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* ③ 추이 */}
      <Section delay={0.16}>
        <Title>주간 집행 추이</Title>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" {...AX} />
            <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
            <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
            <Area type="monotone" dataKey="spentB" name="집행" stroke="#1a6b5a" fill="#1a6b5a" fillOpacity={0.08} strokeWidth={2} dot={{ r: 3, fill: "#1a6b5a", strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      {/* ④ 차단·환불 */}
      <BlockedRefundSection blockedCount={blockedCount} blockedAmount={blockedAmount} refundAmount={refundAmount} weeklyData={weekly} delay={0.18} />

      {/* ⑤ 상세 테이블 */}
      <Section delay={0.20}>
        <Title>카드사별 상세</Title>
        <DataTable headers={["카드사", "신청액", "집행액", "거래 건수"]}>
          {cardCompanyData.map((c) => {
            const cSpent = Math.round(c.amount * scale);
            return (
              <tr key={c.company} className="table-row table-row-hover">
                <td className="font-medium">{c.company}</td>
                <td className="text-right font-mono text-xs">{formatKRW(Math.round(cSpent * 1.19))}</td>
                <td className="text-right font-mono text-xs">{formatKRW(cSpent)}</td>
                <td className="text-right font-mono text-xs">{formatNumber(Math.round(c.txCount * scale))}</td>
              </tr>
            );
          })}
        </DataTable>
      </Section>

      {/* ⑥ 최근 차단 로그 */}
      <RecentBlockLogs filterRegion={name} delay={0.22} />
    </div>
  );
}
