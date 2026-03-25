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
        className="h-[3px] shrink-0"
        style={{
          background:
            "linear-gradient(90deg, #c8a84e, #d4b969 40%, #c8a84e 80%, #a08838)",
        }}
      />

      {/* Header */}
      <header style={{ background: "#1b2844" }}>
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex items-center gap-4">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
            style={{
              background: "rgba(200,168,78,0.12)",
              border: "1px solid rgba(200,168,78,0.25)",
            }}
          >
            <Shield className="w-5 h-5" style={{ color: "#c8a84e" }} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              지자체 정책 대시보드
            </h1>
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              스테이블코인 기반 결제·정산 PoC — 정책쿠폰·지역화폐 모니터링
            </p>
          </div>
          <div
            className="ml-auto flex items-center gap-3 text-xs shrink-0"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#4ade80",
                  boxShadow: "0 0 6px rgba(74,222,128,0.5)",
                }}
              />
              실시간
            </span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span className="font-mono">2026-05-15 17:30 KST</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav
          className="border-t"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                      isActive
                        ? "text-white"
                        : "text-white/40 hover:text-white/65"
                    }`}
                    style={{
                      borderBottomColor: isActive ? "#c8a84e" : "transparent",
                      background: isActive
                        ? "rgba(255,255,255,0.04)"
                        : "transparent",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-6 flex-1 w-full">
        {activeTab === "execution" && <PolicyExecution />}
        {activeTab === "blocklog" && <BlockLogView />}
      </main>

      {/* Footer */}
      <footer style={{ background: "#1b2844" }}>
        <div
          className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between text-xs"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <span>
            여신금융협회 스테이블코인 PoC — 정책쿠폰·지역화폐 대시보드 (Mock)
          </span>
          <span className="font-mono">
            Model 3: 정책 룰 기반 자동 집행·정산·감사 | Ethereum L2
          </span>
        </div>
      </footer>
    </div>
  );
}
