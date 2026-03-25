"use client";

import { useState } from "react";
import { BarChart3, ShieldAlert, Shield } from "lucide-react";
import PolicyExecution from "@/components/PolicyExecution";
import BlockLogView from "@/components/BlockLogView";

const tabs = [
  { id: "execution", label: "대시보드", icon: BarChart3 },
  { id: "blocklog", label: "차단 로그", icon: ShieldAlert },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("execution");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Gold accent line */}
      <div
        className="h-[2px] shrink-0"
        style={{
          background: "linear-gradient(90deg, #a08838, #c8a84e 30%, #d4b969 60%, #c8a84e 80%, #a08838)",
        }}
      />

      {/* Header */}
      <header style={{ background: "var(--navy)" }}>
        <div className="max-w-[1440px] mx-auto px-8 py-6 flex items-center gap-5">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
            style={{
              background: "rgba(200,168,78,0.10)",
              border: "1px solid rgba(200,168,78,0.18)",
            }}
          >
            <Shield className="w-[18px] h-[18px]" style={{ color: "var(--gold)" }} />
          </div>
          <div>
            <h1
              className="text-[17px] font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-serif-kr), serif" }}
            >
              지자체 정책 대시보드
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>
              스테이블코인 기반 결제·정산 PoC
            </p>
          </div>
          <div
            className="ml-auto flex items-center gap-3 text-[11px] shrink-0"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-[5px] h-[5px] rounded-full"
                style={{
                  background: "#4ade80",
                  boxShadow: "0 0 6px rgba(74,222,128,0.4)",
                }}
              />
              실시간
            </span>
            <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
            <span className="font-mono">2026-05-15 17:30 KST</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-all cursor-pointer relative"
                    style={{
                      color: isActive ? "#fff" : "rgba(255,255,255,0.35)",
                      background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                      borderRadius: "6px 6px 0 0",
                    }}
                  >
                    <Icon className="w-[14px] h-[14px]" />
                    {tab.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                        style={{ background: "var(--gold)" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-[1440px] mx-auto px-8 py-8 flex-1 w-full">
        {activeTab === "execution" && <PolicyExecution />}
        {activeTab === "blocklog" && <BlockLogView />}
      </main>

      {/* Footer */}
      <footer style={{ background: "var(--navy)" }}>
        <div
          className="max-w-[1440px] mx-auto px-8 py-4 flex items-center justify-between text-[11px]"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          <span>여신금융협회 스테이블코인 PoC — 정책쿠폰·지역화폐 대시보드</span>
          <span className="font-mono">Ethereum L2 · 정책 룰 기반 자동 집행·정산</span>
        </div>
      </footer>
    </div>
  );
}
