// 정부(지자체) 대시보드 목 데이터
// 여신협회 스테이블코인 PoC 기획안 기반

// ─── 정책 집행 현황 ───
export const policyBudget = {
  totalBudget: 50_000_000_000,
  appliedAmount: 38_500_000_000,
  totalSpent: 32_450_000_000,
  blockedAmount: 2_850_000_000,
  refundAmount: 1_200_000_000,
  executionRate: 64.9,
  period: "2026-04 ~ 2026-06",
};

export const regionData = [
  { region: "서울", amount: 8_200_000_000, ratio: 26.0, txCount: 42_000 },
  { region: "경기", amount: 6_800_000_000, ratio: 21.6, txCount: 35_200 },
  { region: "부산", amount: 4_100_000_000, ratio: 13.0, txCount: 21_500 },
  { region: "대구", amount: 3_200_000_000, ratio: 10.2, txCount: 16_800 },
  { region: "인천", amount: 2_900_000_000, ratio: 9.2, txCount: 15_100 },
  { region: "광주", amount: 2_100_000_000, ratio: 6.7, txCount: 10_900 },
  { region: "대전", amount: 1_800_000_000, ratio: 5.7, txCount: 9_400 },
  { region: "울산", amount: 1_500_000_000, ratio: 4.8, txCount: 7_800 },
  { region: "세종", amount: 850_000_000, ratio: 2.7, txCount: 4_400 },
];

export const cardCompanyData = [
  { company: "신한카드", amount: 7_200_000_000, ratio: 22.2, txCount: 37_000 },
  { company: "삼성카드", amount: 6_500_000_000, ratio: 20.0, txCount: 33_500 },
  { company: "KB국민카드", amount: 5_800_000_000, ratio: 17.9, txCount: 30_000 },
  { company: "현대카드", amount: 4_200_000_000, ratio: 12.9, txCount: 21_700 },
  { company: "하나카드", amount: 3_100_000_000, ratio: 9.6, txCount: 16_000 },
  { company: "우리카드", amount: 2_400_000_000, ratio: 7.4, txCount: 12_400 },
  { company: "롯데카드", amount: 1_800_000_000, ratio: 5.5, txCount: 9_300 },
  { company: "비씨카드", amount: 1_450_000_000, ratio: 4.5, txCount: 8_400 },
];

export const industryData = [
  { industry: "음식점", mcc: "5812", amount: 9_800_000_000, ratio: 30.2, txCount: 52_000 },
  { industry: "편의점/마트", mcc: "5411", amount: 7_200_000_000, ratio: 22.2, txCount: 38_000 },
  { industry: "의료/약국", mcc: "5912", amount: 4_500_000_000, ratio: 13.9, txCount: 23_000 },
  { industry: "교통", mcc: "4111", amount: 3_800_000_000, ratio: 11.7, txCount: 20_000 },
  { industry: "교육/학원", mcc: "8211", amount: 2_900_000_000, ratio: 8.9, txCount: 15_000 },
  { industry: "의류/패션", mcc: "5691", amount: 2_100_000_000, ratio: 6.5, txCount: 11_000 },
];

// 주간 추이 (집행/차단/환불 금액 분리)
export const weeklyTrend = [
  { week: "4월 1주", spent: 3_200_000_000, blocked: 320_000_000, refund: 120_000_000 },
  { week: "4월 2주", spent: 4_100_000_000, blocked: 280_000_000, refund: 95_000_000 },
  { week: "4월 3주", spent: 4_800_000_000, blocked: 250_000_000, refund: 180_000_000 },
  { week: "4월 4주", spent: 5_200_000_000, blocked: 380_000_000, refund: 150_000_000 },
  { week: "5월 1주", spent: 3_800_000_000, blocked: 290_000_000, refund: 110_000_000 },
  { week: "5월 2주", spent: 4_500_000_000, blocked: 350_000_000, refund: 200_000_000 },
  { week: "5월 3주", spent: 3_600_000_000, blocked: 410_000_000, refund: 165_000_000 },
  { week: "5월 4주", spent: 3_250_000_000, blocked: 270_000_000, refund: 180_000_000 },
];

// ─── 차단 로그 ───
export type BlockLog = {
  id: string;
  intentId: string;
  timestamp: string;
  violationType: "region" | "industry" | "period";
  reasonCode: string;
  amount: number;
  industry: string;
  mcc: string;
  region: string;
  cardCompany: string;
};

export const blockLogs: BlockLog[] = [
  { id: "BL-001", intentId: "pay_a1b2c3d4", timestamp: "2026-05-15T14:23:11", violationType: "region", reasonCode: "R_REGION_MISMATCH", amount: 35000, industry: "의료/약국", mcc: "5912", region: "서울 강남", cardCompany: "신한카드" },
  { id: "BL-002", intentId: "pay_e5f6g7h8", timestamp: "2026-05-15T14:45:32", violationType: "industry", reasonCode: "R_MCC_BLOCKED", amount: 120000, industry: "보석/귀금속", mcc: "5944", region: "부산 해운대", cardCompany: "삼성카드" },
  { id: "BL-003", intentId: "pay_m3n4o5p6", timestamp: "2026-05-15T15:18:44", violationType: "period", reasonCode: "R_EXPIRED", amount: 28000, industry: "음식점", mcc: "5812", region: "대구 중구", cardCompany: "KB국민카드" },
  { id: "BL-004", intentId: "pay_q7r8s9t0", timestamp: "2026-05-15T15:33:05", violationType: "region", reasonCode: "R_REGION_MISMATCH", amount: 45000, industry: "카페", mcc: "5814", region: "인천 연수", cardCompany: "현대카드" },
  { id: "BL-005", intentId: "pay_y5z6a7b8", timestamp: "2026-05-15T16:15:38", violationType: "industry", reasonCode: "R_MCC_BLOCKED", amount: 89000, industry: "유흥주점", mcc: "5813", region: "광주 서구", cardCompany: "하나카드" },
  { id: "BL-006", intentId: "pay_c9d0e1f2", timestamp: "2026-05-15T16:42:55", violationType: "region", reasonCode: "R_REGION_MISMATCH", amount: 62000, industry: "스포츠/레저", mcc: "7941", region: "대전 유성", cardCompany: "우리카드" },
  { id: "BL-007", intentId: "pay_g3h4i5j6", timestamp: "2026-05-15T17:05:11", violationType: "industry", reasonCode: "R_MCC_BLOCKED", amount: 75000, industry: "도박", mcc: "7995", region: "경기 성남", cardCompany: "롯데카드" },
  { id: "BL-008", intentId: "pay_k7l8m9n0", timestamp: "2026-05-15T17:28:33", violationType: "period", reasonCode: "R_NOT_YET_VALID", amount: 15000, industry: "문구/사무", mcc: "5943", region: "울산 남구", cardCompany: "비씨카드" },
  { id: "BL-009", intentId: "pay_p1q2r3s4", timestamp: "2026-05-15T17:45:19", violationType: "region", reasonCode: "R_REGION_MISMATCH", amount: 38000, industry: "편의점/마트", mcc: "5411", region: "서울 마포", cardCompany: "신한카드" },
  { id: "BL-010", intentId: "pay_t5u6v7w8", timestamp: "2026-05-15T18:02:41", violationType: "industry", reasonCode: "R_MCC_BLOCKED", amount: 250000, industry: "보석/귀금속", mcc: "5944", region: "경기 분당", cardCompany: "삼성카드" },
];

export const blockSummary = [
  { type: "지역 위반", code: "region", count: 342, ratio: 44.7 },
  { type: "업종 위반", code: "industry", count: 312, ratio: 40.8 },
  { type: "기간 위반", code: "period", count: 111, ratio: 14.5 },
];

export const blockByCardCompany = [
  { company: "신한카드", count: 125 },
  { company: "삼성카드", count: 108 },
  { company: "KB국민카드", count: 98 },
  { company: "현대카드", count: 87 },
  { company: "하나카드", count: 72 },
  { company: "우리카드", count: 65 },
  { company: "롯데카드", count: 58 },
  { company: "비씨카드", count: 52 },
];

// ─── 정산 현황 (SC/KRW) ───
export const settlementSummary = {
  scAmount: 18_900_000_000,
  krwAmount: 13_550_000_000,
  scRatio: 58.3,
  krwRatio: 41.7,
  avgLeadTimeSC: "5.2s",
  avgLeadTimeKRW: "T+1.4일",
};

// ─── 유틸리티 ───
export function formatKRW(value: number): string {
  if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(1)}조`;
  if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(0)}억`;
  if (value >= 10_000) return `${(value / 10_000).toFixed(0)}만`;
  return value.toLocaleString();
}

export function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}
