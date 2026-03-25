"use client";

import { useState } from "react";
import {
  FileSearch,
  History,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  auditRules,
  auditTransactions,
  formatKRW,
  type AuditRule,
  type AuditTransaction,
} from "@/lib/mock-data";

const STATUS_STYLE: Record<
  string,
  { bg: string; text: string; icon: React.ElementType }
> = {
  Approved: { bg: "#e8f4f0", text: "#1a6b5a", icon: Clock },
  Confirmed: { bg: "#f8f4ea", text: "#8a7030", icon: Clock },
  Settled: { bg: "#e8f4f0", text: "#1a6b5a", icon: CheckCircle },
  Declined: { bg: "#faf0ee", text: "#9e3328", icon: XCircle },
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.Approved;
  const Icon = style.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded"
      style={{ background: style.bg, color: style.text }}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

export default function AuditView() {
  const [expandedRule, setExpandedRule] = useState<string | null>("v2.2");
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTx = auditTransactions.filter(
    (tx) => statusFilter === "all" || tx.status === statusFilter
  );

  const statusCounts = auditTransactions.reduce(
    (acc, tx) => {
      acc[tx.status] = (acc[tx.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(["Approved", "Confirmed", "Settled", "Declined"] as const).map(
          (s) => {
            const style = STATUS_STYLE[s];
            const Icon = style.icon;
            const isSelected = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() =>
                  setStatusFilter(statusFilter === s ? "all" : s)
                }
                className="bg-white rounded-lg overflow-hidden text-left transition-all cursor-pointer"
                style={{
                  border: isSelected
                    ? `2px solid ${style.text}`
                    : "1px solid #eae7e0",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <div className="h-[3px]" style={{ background: style.text }} />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="p-1.5 rounded"
                      style={{ background: style.bg }}
                    >
                      <Icon className="w-4 h-4" style={{ color: style.text }} />
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "#475569" }}
                    >
                      {s}
                    </span>
                  </div>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "#1e293b",
                    }}
                  >
                    {statusCounts[s] || 0}
                    <span
                      className="text-sm font-normal ml-0.5"
                      style={{ color: "#94a3b8" }}
                    >
                      건
                    </span>
                  </p>
                </div>
              </button>
            );
          }
        )}
      </div>

      {/* Rule Version History */}
      <div
        className="bg-white rounded-lg p-5"
        style={{
          border: "1px solid #eae7e0",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <h3
          className="text-[13px] font-semibold mb-4 flex items-center gap-2"
          style={{ color: "#475569" }}
        >
          <History className="w-4 h-4" style={{ color: "#8b6d3f" }} />
          룰 버전/변경 이력
        </h3>
        <div className="space-y-3">
          {auditRules.map((rule) => (
            <RuleCard
              key={rule.version}
              rule={rule}
              expanded={expandedRule === rule.version}
              onToggle={() =>
                setExpandedRule(
                  expandedRule === rule.version ? null : rule.version
                )
              }
            />
          ))}
        </div>
      </div>

      {/* Transaction Drill-down */}
      <div
        className="bg-white rounded-lg p-5"
        style={{
          border: "1px solid #eae7e0",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <h3
            className="text-[13px] font-semibold flex items-center gap-2"
            style={{ color: "#475569" }}
          >
            <FileSearch className="w-4 h-4" style={{ color: "#2d5f8a" }} />
            거래 단위 근거 로그 (Drill-down)
          </h3>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ml-auto text-xs rounded-md px-2 py-1.5 focus:outline-none"
            style={{
              border: "1px solid #ddd9d0",
              background: "#faf9f6",
              color: "#475569",
            }}
          >
            <option value="all">전체 상태</option>
            <option value="Approved">Approved</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Settled">Settled</option>
            <option value="Declined">Declined</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr
                className="text-left"
                style={{ borderBottom: "2px solid #1b2844" }}
              >
                <th className="py-2 pr-3 font-semibold" style={{ color: "#475569" }}>시각</th>
                <th className="py-2 pr-3 font-semibold" style={{ color: "#475569" }}>intentId</th>
                <th className="py-2 pr-3 font-semibold" style={{ color: "#475569" }}>상태</th>
                <th className="py-2 pr-3 font-semibold" style={{ color: "#475569" }}>가맹점</th>
                <th className="py-2 pr-3 font-semibold text-right" style={{ color: "#475569" }}>금액</th>
                <th className="py-2 pr-3 font-semibold" style={{ color: "#475569" }}>정책 버전</th>
                <th className="py-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((tx, i) => (
                <TxRow
                  key={tx.intentId}
                  tx={tx}
                  index={i}
                  expanded={expandedTx === tx.intentId}
                  onToggle={() =>
                    setExpandedTx(
                      expandedTx === tx.intentId ? null : tx.intentId
                    )
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RuleCard({
  rule,
  expanded,
  onToggle,
}: {
  rule: AuditRule;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isActive = rule.status === "active";
  return (
    <div
      className="rounded-lg transition overflow-hidden"
      style={{
        border: isActive ? "1px solid #c8a84e40" : "1px solid #eae7e0",
        background: isActive ? "#fffdf5" : "white",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left cursor-pointer"
      >
        <span
          className="text-sm font-bold font-mono"
          style={{ color: isActive ? "#1b2844" : "#94a3b8" }}
        >
          {rule.version}
        </span>
        {isActive && (
          <span
            className="text-[10px] px-2 py-0.5 rounded font-medium"
            style={{ background: "#1b2844", color: "#c8a84e" }}
          >
            적용 중
          </span>
        )}
        <span className="text-xs ml-2" style={{ color: "#94a3b8" }}>
          적용일: {rule.appliedAt}
        </span>
        <span
          className="text-xs ml-auto mr-2"
          style={{ color: "#475569" }}
        >
          {rule.changes}
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4" style={{ color: "#94a3b8" }} />
        ) : (
          <ChevronDown className="w-4 h-4" style={{ color: "#94a3b8" }} />
        )}
      </button>
      {expanded && (
        <div
          className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3"
          style={{ borderTop: "1px solid #eae7e0" }}
        >
          <div>
            <span className="font-medium" style={{ color: "#94a3b8" }}>
              지역 제한
            </span>
            <p className="mt-1" style={{ color: "#475569" }}>
              {rule.regionRules}
            </p>
          </div>
          <div>
            <span className="font-medium" style={{ color: "#94a3b8" }}>
              업종 제한
            </span>
            <p className="mt-1" style={{ color: "#475569" }}>
              {rule.industryRules}
            </p>
          </div>
          <div>
            <span className="font-medium" style={{ color: "#94a3b8" }}>
              한도 제한
            </span>
            <p className="mt-1 font-mono" style={{ color: "#475569" }}>
              {rule.limitRules}
            </p>
          </div>
          <div>
            <span className="font-medium" style={{ color: "#94a3b8" }}>
              유효 기간
            </span>
            <p className="mt-1 font-mono" style={{ color: "#475569" }}>
              {rule.periodRules}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function TxRow({
  tx,
  index,
  expanded,
  onToggle,
}: {
  tx: AuditTransaction;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const time = new Date(tx.timestamp).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <>
      <tr
        className="cursor-pointer transition-colors"
        onClick={onToggle}
        style={{
          borderBottom: expanded ? "none" : "1px solid #eae7e0",
          background: index % 2 === 1 ? "#faf9f6" : "transparent",
        }}
      >
        <td className="py-2 pr-3 font-mono" style={{ color: "#94a3b8" }}>
          {time}
        </td>
        <td className="py-2 pr-3 font-mono" style={{ color: "#2d5f8a" }}>
          {tx.intentId}
        </td>
        <td className="py-2 pr-3">
          <StatusBadge status={tx.status} />
        </td>
        <td className="py-2 pr-3">{tx.merchantName}</td>
        <td className="py-2 pr-3 text-right font-mono">
          {formatKRW(tx.amount)}
        </td>
        <td className="py-2 pr-3 font-mono" style={{ color: "#94a3b8" }}>
          {tx.policyVersion}
        </td>
        <td className="py-2">
          {expanded ? (
            <ChevronUp className="w-4 h-4" style={{ color: "#94a3b8" }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: "#94a3b8" }} />
          )}
        </td>
      </tr>
      {expanded && (
        <tr style={{ borderBottom: "1px solid #eae7e0" }}>
          <td colSpan={7} className="p-4" style={{ background: "#faf9f6" }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span style={{ color: "#94a3b8" }}>지역</span>
                <p className="font-medium mt-0.5">{tx.region}</p>
              </div>
              <div>
                <span style={{ color: "#94a3b8" }}>MCC</span>
                <p className="font-mono font-medium mt-0.5">{tx.mcc}</p>
              </div>
              {tx.reasonCode && (
                <div>
                  <span style={{ color: "#94a3b8" }}>차단 사유</span>
                  <p className="font-mono font-medium mt-0.5" style={{ color: "#9e3328" }}>
                    {tx.reasonCode}
                  </p>
                </div>
              )}
              {tx.txHash && (
                <div>
                  <span style={{ color: "#94a3b8" }}>txHash</span>
                  <p
                    className="font-mono font-medium mt-0.5 flex items-center gap-1"
                    style={{ color: "#2d5f8a" }}
                  >
                    {tx.txHash}
                    <ExternalLink className="w-3 h-3" />
                  </p>
                </div>
              )}
              {tx.blockNumber && (
                <div>
                  <span style={{ color: "#94a3b8" }}>Block #</span>
                  <p className="font-mono font-medium mt-0.5">
                    {tx.blockNumber.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
