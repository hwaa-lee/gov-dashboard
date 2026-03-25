"use client";

import { useState } from "react";
import { CalendarRange } from "lucide-react";

export default function DateFilter() {
  const [dateFrom, setDateFrom] = useState("2026-04-01");
  const [dateTo, setDateTo] = useState("2026-06-30");

  const inputStyle = {
    border: "1px solid var(--border)",
    background: "var(--bg-warm)",
    color: "#1a1d24",
  };

  return (
    <div className="card inline-flex items-center gap-3 px-4 py-2.5 text-[12px] animate-in stagger-1">
      <CalendarRange className="w-4 h-4" style={{ color: "#8a919e" }} />
      <span className="font-medium" style={{ color: "#4a5568" }}>조회 기간</span>
      <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
        className="px-2.5 py-1 rounded-md text-[12px] font-mono" style={inputStyle} />
      <span style={{ color: "#b4b9c4" }}>~</span>
      <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
        className="px-2.5 py-1 rounded-md text-[12px] font-mono" style={inputStyle} />
    </div>
  );
}
