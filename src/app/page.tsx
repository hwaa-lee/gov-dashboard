"use client";

import { useState } from "react";
import { Menu, CalendarRange, Bell, User } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dateFrom, setDateFrom] = useState("2026-04-01");
  const [dateTo, setDateTo] = useState("2026-06-30");

  const inputStyle = "h-8 rounded-lg border border-gray-200 bg-gray-50 px-2.5 text-xs font-mono text-gray-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100";

  return (
    <div className="flex h-screen">
      <Sidebar current={view} onNavigate={setView} collapsed={!sidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shrink-0 gap-4">
          {/* Left: toggle + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 cursor-pointer shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate">{viewTitle(view)}</h1>
              <p className="text-[11px] text-gray-400 truncate">{viewSub(view)}</p>
            </div>
          </div>

          {/* Center: date filter */}
          <div className="flex items-center gap-2 shrink-0">
            <CalendarRange className="h-4 w-4 text-gray-400" />
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputStyle} />
            <span className="text-gray-300 text-xs">~</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputStyle} />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="relative rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-700" />
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium text-gray-900">관리자</p>
                <p className="text-[10px] text-gray-400">여신금융협회</p>
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
