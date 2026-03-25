"use client";

import { ShieldOff, RotateCcw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatKRW, formatNumber } from "@/lib/mock-data";
import { Section, Title, TT, AX } from "./shared";

export default function BlockedRefundSection({
  blockedCount,
  blockedAmount,
  refundAmount,
  weeklyData,
  delay = 0,
}: {
  blockedCount: number;
  blockedAmount: number;
  refundAmount: number;
  weeklyData: { week: string; blockedB: number; refundB: number }[];
  delay?: number;
}) {
  return (
    <Section delay={delay}>
      <Title>차단·환불 현황</Title>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-4" style={{ background: "#fef2f2" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#9e3328" }}>차단 건수</p>
          <p className="text-lg font-bold font-mono" style={{ color: "#1a1d24" }}>{formatNumber(blockedCount)}건</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "#fef2f2" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#9e3328" }}>차단 금액</p>
          <p className="text-lg font-bold font-mono" style={{ color: "#1a1d24" }}>{formatKRW(blockedAmount)}</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "#fdf6ef" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#b06828" }}>환불 금액</p>
          <p className="text-lg font-bold font-mono" style={{ color: "#1a1d24" }}>{formatKRW(refundAmount)}</p>
        </div>
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-[12px] font-medium mb-3" style={{ color: "#4a5568" }}>
            <ShieldOff className="w-3.5 h-3.5 inline mr-1" style={{ color: "#9e3328" }} />차단 추이
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="week" {...AX} />
              <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="blockedB" name="차단" fill="#9e3328" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-[12px] font-medium mb-3" style={{ color: "#4a5568" }}>
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" style={{ color: "#b06828" }} />환불 추이
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="week" {...AX} />
              <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="refundB" name="환불" fill="#b06828" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Section>
  );
}
