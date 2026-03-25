"use client";

import { ShieldOff, RotateCcw } from "lucide-react";
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
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg px-3 py-2.5" style={{ background: "#fef2f2" }}>
          <p className="text-[10px] font-medium mb-0.5" style={{ color: "#9e3328" }}>차단 건수</p>
          <p className="text-[15px] font-bold font-mono" style={{ color: "#1a1d24" }}>{formatNumber(blockedCount)}건</p>
        </div>
        <div className="rounded-lg px-3 py-2.5" style={{ background: "#fef2f2" }}>
          <p className="text-[10px] font-medium mb-0.5" style={{ color: "#9e3328" }}>차단 금액</p>
          <p className="text-[15px] font-bold font-mono" style={{ color: "#1a1d24" }}>{formatKRW(blockedAmount)}</p>
        </div>
        <div className="rounded-lg px-3 py-2.5" style={{ background: "#fdf6ef" }}>
          <p className="text-[10px] font-medium mb-0.5" style={{ color: "#b06828" }}>환불 금액</p>
          <p className="text-[15px] font-bold font-mono" style={{ color: "#1a1d24" }}>{formatKRW(refundAmount)}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-medium mb-2" style={{ color: "#4a5568" }}>
            <ShieldOff className="w-3 h-3 inline mr-1" style={{ color: "#9e3328" }} />차단 추이
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="week" {...AX} />
              <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="blockedB" fill="#9e3328" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-[11px] font-medium mb-2" style={{ color: "#4a5568" }}>
            <RotateCcw className="w-3 h-3 inline mr-1" style={{ color: "#b06828" }} />환불 추이
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="week" {...AX} />
              <YAxis tickFormatter={(v) => `${v.toFixed(0)}억`} {...AX} axisLine={false} />
              <Tooltip {...TT} formatter={(v) => `${Number(v).toFixed(1)}억`} />
              <Bar dataKey="refundB" fill="#b06828" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Section>
  );
}
