"use client";

import { useState } from "react";
import { ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import { blockLogs, formatKRW, type BlockLog } from "@/lib/mock-data";
import { Section, Title } from "./shared";

const TYPE_COLORS: Record<string, string> = { region: "#9e3328", industry: "#b06828", period: "#6b4c7a" };
const TYPE_LABELS: Record<string, string> = { region: "지역", industry: "업종", period: "기간" };

const PAGE_SIZE = 5;

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
  const [page, setPage] = useState(0);

  let filtered: BlockLog[] = blockLogs;
  if (filterRegion) filtered = filtered.filter((l) => l.region.startsWith(filterRegion));
  if (filterCard) filtered = filtered.filter((l) => l.cardCompany === filterCard);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <Section delay={delay}>
      <div className="flex items-center justify-between mb-4">
        <Title>
          <ShieldAlert className="w-4 h-4 inline mr-1.5" style={{ color: "#9e3328" }} />
          최근 차단 내역
          {filterRegion && <span className="font-normal text-xs ml-2 text-gray-400">({filterRegion})</span>}
          {filterCard && <span className="font-normal text-xs ml-2 text-gray-400">({filterCard})</span>}
        </Title>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-gray-500 text-left">시각</th>
              <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-gray-500 text-left">Intent ID</th>
              <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-gray-500 text-left">유형</th>
              <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-gray-500 text-left">업종</th>
              <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-gray-500 text-left">카드사</th>
              <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-gray-500 text-left">지역</th>
              <th className="pb-3 text-xs font-medium uppercase tracking-wider text-gray-500 text-right">금액</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paged.length === 0 ? (
              <tr><td colSpan={7} className="py-10 text-center text-sm text-gray-400">차단 내역 없음</td></tr>
            ) : (
              paged.map((log) => {
                const time = new Date(log.timestamp).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                return (
                  <tr key={log.id} className="transition-colors hover:bg-gray-50">
                    <td className="py-3 pr-4 font-mono text-xs text-gray-400">{time}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-blue-600">{log.intentId}</td>
                    <td className="py-3 pr-4"><Badge type={log.violationType} /></td>
                    <td className="py-3 pr-4 text-sm text-gray-700">{log.industry}</td>
                    <td className="py-3 pr-4 text-sm text-gray-700">{log.cardCompany}</td>
                    <td className="py-3 pr-4 text-sm text-gray-700">{log.region}</td>
                    <td className="py-3 text-right font-mono text-sm text-gray-900">{formatKRW(log.amount)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {filtered.length}건 중 {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                style={{
                  background: page === i ? "#2d5f8a" : "transparent",
                  color: page === i ? "#fff" : "#6b7280",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
