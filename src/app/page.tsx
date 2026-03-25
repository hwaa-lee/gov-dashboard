"use client";

import { useState } from "react";
import { Search, Bell, User } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PolicyExecution from "@/components/PolicyExecution";
import RegionView from "@/components/RegionView";
import CardCompanyView from "@/components/CardCompanyView";

type View = { type: "overview" } | { type: "region"; name: string } | { type: "card"; name: string };

function viewTitle(v: View) {
  if (v.type === "overview") return "전체 현황";
  if (v.type === "region") return v.name;
  return v.name;
}

function viewSub(v: View) {
  if (v.type === "overview") return "예산 집행·정산 모니터링";
  if (v.type === "region") return "지역별 집행 현황";
  return "카드사별 집행 현황";
}

export default function DashboardPage() {
  const [view, setView] = useState<View>({ type: "overview" });

  return (
    <div className="flex h-screen">
      <Sidebar current={view} onNavigate={setView} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{viewTitle(view)}</h1>
            <p className="text-xs text-gray-500">{viewSub(view)}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="검색..."
                className="h-9 w-56 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-700" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">관리자</p>
                <p className="text-xs text-gray-500">여신금융협회</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {view.type === "overview" && <PolicyExecution />}
          {view.type === "region" && <RegionView region={view.name} />}
          {view.type === "card" && <CardCompanyView company={view.name} />}
        </main>
      </div>
    </div>
  );
}
