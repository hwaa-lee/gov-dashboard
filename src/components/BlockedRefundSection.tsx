"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatKRW, formatNumber } from "@/lib/mock-data";
import { Section, Title, TT, AX } from "./shared";

export default function BlockedRefundSection({
  blockedCount, blockedAmount, refundAmount, weeklyData, delay = 0,
}: {
  blockedCount: number; blockedAmount: number; refundAmount: number;
  weeklyData: { week: string; blockedB: number; refundB: number }[]; delay?: number;
}) {
  return (
    <Section delay={delay}>
      <Title>차단·환불 현황</Title>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-4" style={{ background: "#faf0ee" }}>
          <p className="text-xs font-medium mb-1" style={{ color: "#9e3328" }}>차단 건수</p>
          <p className="text-lg font-bold font-mono text-gray-900">{formatNumber(blockedCount)}건</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "#faf0ee" }}>
          <p className="text-xs font-medium mb-1" style={{ color: "#9e3328" }}>차단 금액</p>
          <p className="text-lg font-bold font-mono text-gray-900">{formatKRW(blockedAmount)}</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "#faf3ec" }}>
          <p className="text-xs font-medium mb-1" style={{ color: "#b06828" }}>환불 금액</p>
          <p className="text-lg font-bold font-mono text-gray-900">{formatKRW(refundAmount)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium mb-3" style={{ color: "#6b7280" }}>차단 추이</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" {...AX} />
                <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} width={50} />
                <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
                <Bar dataKey="blockedB" fill="#9e3328" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium mb-3" style={{ color: "#6b7280" }}>환불 추이</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" {...AX} />
                <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} width={50} />
                <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
                <Bar dataKey="refundB" fill="#b06828" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Section>
  );
}
