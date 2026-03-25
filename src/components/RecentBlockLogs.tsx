"use client";

import { ShieldAlert } from "lucide-react";
import { blockLogs, formatKRW, type BlockLog } from "@/lib/mock-data";
import { Section, Title } from "./shared";

const TYPE_COLORS: Record<string, string> = { region: "#9e3328", industry: "#b06828", period: "#6b4c7a" };
const TYPE_LABELS: Record<string, string> = { region: "지역", industry: "업종", period: "기간" };

function Badge({ type }: { type: string }) {
  return (
    <span className="badge" style={{ background: `${TYPE_COLORS[type]}0c`, color: TYPE_COLORS[type] }}>
      {TYPE_LABELS[type]}
    </span>
  );
}

export default function RecentBlockLogs({
  filterRegion,
  filterCard,
  delay = 0,
}: {
  filterRegion?: string;
  filterCard?: string;
  delay?: number;
}) {
  let filtered: BlockLog[] = blockLogs;
  if (filterRegion) filtered = filtered.filter((l) => l.region.startsWith(filterRegion));
  if (filterCard) filtered = filtered.filter((l) => l.cardCompany === filterCard);

  return (
    <Section delay={delay}>
      <Title>
        <ShieldAlert className="w-4 h-4 inline mr-1.5" style={{ color: "#9e3328" }} />
        최근 차단 내역
        {filterRegion && <span className="font-normal text-[11px] ml-2" style={{ color: "#8a919e" }}>({filterRegion})</span>}
        {filterCard && <span className="font-normal text-[11px] ml-2" style={{ color: "#8a919e" }}>({filterCard})</span>}
      </Title>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="text-left">시각</th>
              <th className="text-left">INTENT ID</th>
              <th className="text-left">유형</th>
              <th className="text-left">업종</th>
              <th className="text-left">카드사</th>
              <th className="text-left">지역</th>
              <th className="text-right">금액</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-[13px]" style={{ color: "#b4b9c4" }}>차단 내역 없음</td></tr>
            ) : (
              filtered.map((log) => {
                const time = new Date(log.timestamp).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                return (
                  <tr key={log.id} className="table-row table-row-hover">
                    <td className="font-mono text-xs" style={{ color: "#8a919e" }}>{time}</td>
                    <td className="font-mono text-xs" style={{ color: "#2d5f8a" }}>{log.intentId}</td>
                    <td><Badge type={log.violationType} /></td>
                    <td className="text-[13px]" style={{ color: "#4a5568" }}>{log.industry}</td>
                    <td className="text-[13px]" style={{ color: "#4a5568" }}>{log.cardCompany}</td>
                    <td className="text-[13px]" style={{ color: "#4a5568" }}>{log.region}</td>
                    <td className="text-right font-mono text-xs" style={{ color: "#1a1d24" }}>{formatKRW(log.amount)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
