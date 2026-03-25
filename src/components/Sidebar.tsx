"use client";

import { useState } from "react";
import {
  BarChart3, MapPin, CreditCard, Shield, ChevronDown,
} from "lucide-react";
import { regionData, cardCompanyData } from "@/lib/mock-data";

type View = { type: "overview" } | { type: "region"; name: string } | { type: "card"; name: string };

export default function Sidebar({
  current,
  onNavigate,
}: {
  current: View;
  onNavigate: (view: View) => void;
}) {
  const [regionOpen, setRegionOpen] = useState(current.type === "region");
  const [cardOpen, setCardOpen] = useState(current.type === "card");

  const isActive = (type: string, name?: string) => {
    if (current.type !== type) return false;
    if (name && "name" in current && current.name !== name) return false;
    return true;
  };

  const navBase = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer";
  const navActive = "bg-blue-50 text-blue-700";
  const navInactive = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <aside className="hidden lg:flex w-64 h-screen flex-col border-r border-gray-200 bg-white shrink-0 sticky top-0">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-6">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "#1b2844" }}>
          <Shield className="h-4 w-4" style={{ color: "#c8a84e" }} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">지자체 정책</p>
          <p className="text-[10px] text-gray-400">스테이블코인 PoC</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* 전체 현황 */}
        <button
          onClick={() => onNavigate({ type: "overview" })}
          className={`${navBase} w-full ${isActive("overview") ? navActive : navInactive}`}
        >
          <BarChart3 className="h-5 w-5" />
          전체 현황
        </button>

        {/* 지역별 */}
        <div>
          <button
            onClick={() => setRegionOpen(!regionOpen)}
            className={`${navBase} w-full justify-between ${current.type === "region" ? "text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <span className="flex items-center gap-3">
              <MapPin className="h-5 w-5" />
              지역별
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${regionOpen ? "rotate-180" : ""}`} />
          </button>
          {regionOpen && (
            <div className="ml-8 mt-1 space-y-0.5">
              {regionData.map((r) => (
                <button
                  key={r.region}
                  onClick={() => onNavigate({ type: "region", name: r.region })}
                  className={`w-full text-left rounded-lg px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                    isActive("region", r.region)
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {r.region}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 카드사별 */}
        <div>
          <button
            onClick={() => setCardOpen(!cardOpen)}
            className={`${navBase} w-full justify-between ${current.type === "card" ? "text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <span className="flex items-center gap-3">
              <CreditCard className="h-5 w-5" />
              카드사별
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${cardOpen ? "rotate-180" : ""}`} />
          </button>
          {cardOpen && (
            <div className="ml-8 mt-1 space-y-0.5">
              {cardCompanyData.map((c) => (
                <button
                  key={c.company}
                  onClick={() => onNavigate({ type: "card", name: c.company })}
                  className={`w-full text-left rounded-lg px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                    isActive("card", c.company)
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {c.company}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3">
        <p className="text-[10px] text-gray-400">여신금융협회 PoC</p>
        <p className="text-[10px] text-gray-300">Ethereum L2 · Mock Data</p>
      </div>
    </aside>
  );
}
