// 정부(지자체) 대시보드 목 데이터
// 여신협회 스테이블코인 PoC 기획안 기반

// ─── 정책 집행 현황 ───
export const policyBudget = {
  totalBudget: 50_000_000_000, // 500억
  totalSpent: 32_450_000_000,  // 324.5억
  executionRate: 64.9,
  period: "2026-04 ~ 2026-06",
};

export const regionData = [
  { region: "서울", amount: 8_200_000_000, ratio: 25.3, txCount: 42_000 },
  { region: "경기", amount: 6_800_000_000, ratio: 21.0, txCount: 35_200 },
  { region: "부산", amount: 4_100_000_000, ratio: 12.6, txCount: 21_500 },
  { region: "대구", amount: 3_200_000_000, ratio: 9.9, txCount: 16_800 },
  { region: "인천", amount: 2_900_000_000, ratio: 8.9, txCount: 15_100 },
  { region: "광주", amount: 2_100_000_000, ratio: 6.5, txCount: 10_900 },
  { region: "대전", amount: 1_800_000_000, ratio: 5.5, txCount: 9_400 },
  { region: "울산", amount: 1_500_000_000, ratio: 4.6, txCount: 7_800 },
  { region: "세종", amount: 850_000_000, ratio: 2.6, txCount: 4_400 },
  { region: "기타", amount: 1_000_000_000, ratio: 3.1, txCount: 5_200 },
];

export const industryData = [
  { industry: "음식점", mcc: "5812", amount: 9_800_000_000, ratio: 30.2, txCount: 52_000 },
  { industry: "편의점/마트", mcc: "5411", amount: 7_200_000_000, ratio: 22.2, txCount: 38_000 },
  { industry: "의료/약국", mcc: "5912", amount: 4_500_000_000, ratio: 13.9, txCount: 23_000 },
  { industry: "교통", mcc: "4111", amount: 3_800_000_000, ratio: 11.7, txCount: 20_000 },
  { industry: "교육/학원", mcc: "8211", amount: 2_900_000_000, ratio: 8.9, txCount: 15_000 },
  { industry: "의류/패션", mcc: "5691", amount: 2_100_000_000, ratio: 6.5, txCount: 11_000 },
  { industry: "기타", mcc: "-", amount: 2_150_000_000, ratio: 6.6, txCount: 9_300 },
];

export const monthlyTrend = [
  { month: "4월 1주", budget: 5_000_000_000, spent: 3_200_000_000, blocked: 120 },
  { month: "4월 2주", budget: 5_000_000_000, spent: 4_100_000_000, blocked: 95 },
  { month: "4월 3주", budget: 5_000_000_000, spent: 4_800_000_000, blocked: 88 },
  { month: "4월 4주", budget: 5_000_000_000, spent: 5_200_000_000, blocked: 102 },
  { month: "5월 1주", budget: 5_000_000_000, spent: 3_800_000_000, blocked: 78 },
  { month: "5월 2주", budget: 5_000_000_000, spent: 4_500_000_000, blocked: 91 },
  { month: "5월 3주", budget: 5_000_000_000, spent: 3_600_000_000, blocked: 110 },
  { month: "5월 4주", budget: 5_000_000_000, spent: 3_250_000_000, blocked: 85 },
];

// ─── 차단 로그 ───
export type BlockLog = {
  id: string;
  intentId: string;
  timestamp: string;
  violationType: "region" | "industry" | "period" | "limit";
  reasonCode: string;
  policyVersion: string;
  amount: number;
  merchantId: string;
  merchantName: string;
  region: string;
  mcc: string;
  customerId: string;
};

export const blockLogs: BlockLog[] = [
  { id: "BL-001", intentId: "pay_a1b2c3d4", timestamp: "2026-05-15T14:23:11", violationType: "region", reasonCode: "R_REGION_MISMATCH", policyVersion: "v2.1", amount: 35000, merchantId: "M-90123", merchantName: "강남약국", region: "서울 강남", mcc: "5912", customerId: "cus_x1y2z3" },
  { id: "BL-002", intentId: "pay_e5f6g7h8", timestamp: "2026-05-15T14:45:32", violationType: "industry", reasonCode: "R_MCC_BLOCKED", policyVersion: "v2.1", amount: 120000, merchantId: "M-45678", merchantName: "럭셔리부티크", region: "부산 해운대", mcc: "5944", customerId: "cus_a4b5c6" },
  { id: "BL-003", intentId: "pay_i9j0k1l2", timestamp: "2026-05-15T15:02:18", violationType: "limit", reasonCode: "R_DAILY_LIMIT", policyVersion: "v2.1", amount: 500000, merchantId: "M-78901", merchantName: "대형마트", region: "경기 수원", mcc: "5411", customerId: "cus_d7e8f9" },
  { id: "BL-004", intentId: "pay_m3n4o5p6", timestamp: "2026-05-15T15:18:44", violationType: "period", reasonCode: "R_EXPIRED", policyVersion: "v2.0", amount: 28000, merchantId: "M-23456", merchantName: "동네식당", region: "대구 중구", mcc: "5812", customerId: "cus_g0h1i2" },
  { id: "BL-005", intentId: "pay_q7r8s9t0", timestamp: "2026-05-15T15:33:05", violationType: "region", reasonCode: "R_REGION_MISMATCH", policyVersion: "v2.1", amount: 45000, merchantId: "M-56789", merchantName: "카페모카", region: "인천 연수", mcc: "5814", customerId: "cus_j3k4l5" },
  { id: "BL-006", intentId: "pay_u1v2w3x4", timestamp: "2026-05-15T16:01:22", violationType: "limit", reasonCode: "R_MONTHLY_LIMIT", policyVersion: "v2.1", amount: 300000, merchantId: "M-01234", merchantName: "전자마트", region: "서울 종로", mcc: "5732", customerId: "cus_m6n7o8" },
  { id: "BL-007", intentId: "pay_y5z6a7b8", timestamp: "2026-05-15T16:15:38", violationType: "industry", reasonCode: "R_MCC_BLOCKED", policyVersion: "v2.1", amount: 89000, merchantId: "M-34567", merchantName: "유흥주점", region: "광주 서구", mcc: "5813", customerId: "cus_p9q0r1" },
  { id: "BL-008", intentId: "pay_c9d0e1f2", timestamp: "2026-05-15T16:42:55", violationType: "region", reasonCode: "R_REGION_MISMATCH", policyVersion: "v2.1", amount: 62000, merchantId: "M-67890", merchantName: "헬스클럽", region: "대전 유성", mcc: "7941", customerId: "cus_s2t3u4" },
  { id: "BL-009", intentId: "pay_g3h4i5j6", timestamp: "2026-05-15T17:05:11", violationType: "limit", reasonCode: "R_SINGLE_LIMIT", policyVersion: "v2.1", amount: 1200000, merchantId: "M-12345", merchantName: "가전센터", region: "경기 성남", mcc: "5732", customerId: "cus_v5w6x7" },
  { id: "BL-010", intentId: "pay_k7l8m9n0", timestamp: "2026-05-15T17:28:33", violationType: "period", reasonCode: "R_NOT_YET_VALID", policyVersion: "v2.2", amount: 15000, merchantId: "M-89012", merchantName: "문구점", region: "울산 남구", mcc: "5943", customerId: "cus_y8z9a0" },
];

export const blockSummary = [
  { type: "지역 위반", code: "region", count: 342, ratio: 38.2 },
  { type: "업종 위반", code: "industry", count: 245, ratio: 27.3 },
  { type: "한도 초과", code: "limit", count: 198, ratio: 22.1 },
  { type: "기간 위반", code: "period", count: 111, ratio: 12.4 },
];

// ─── 감사 뷰 ───
export type AuditRule = {
  version: string;
  appliedAt: string;
  changes: string;
  regionRules: string;
  industryRules: string;
  limitRules: string;
  periodRules: string;
  status: "active" | "archived";
};

export const auditRules: AuditRule[] = [
  {
    version: "v2.2",
    appliedAt: "2026-05-10",
    changes: "세종시 추가, 유흥업종 확대 차단",
    regionRules: "서울/경기/부산/대구/인천/광주/대전/울산/세종",
    industryRules: "MCC 5813(유흥), 5944(보석), 7995(도박) 차단",
    limitRules: "1회 50만, 1일 100만, 1월 300만",
    periodRules: "2026-04-01 ~ 2026-06-30",
    status: "active",
  },
  {
    version: "v2.1",
    appliedAt: "2026-04-15",
    changes: "1회 한도 30만→50만 상향, 의료업종 허용 추가",
    regionRules: "서울/경기/부산/대구/인천/광주/대전/울산",
    industryRules: "MCC 5813(유흥), 5944(보석) 차단",
    limitRules: "1회 50만, 1일 100만, 1월 300만",
    periodRules: "2026-04-01 ~ 2026-06-30",
    status: "archived",
  },
  {
    version: "v2.0",
    appliedAt: "2026-04-01",
    changes: "초기 정책 룰 설정",
    regionRules: "서울/경기/부산/대구/인천/광주/대전",
    industryRules: "MCC 5813(유흥) 차단",
    limitRules: "1회 30만, 1일 100만, 1월 300만",
    periodRules: "2026-04-01 ~ 2026-06-30",
    status: "archived",
  },
];

export type AuditTransaction = {
  intentId: string;
  timestamp: string;
  status: "Approved" | "Declined" | "Confirmed" | "Settled";
  amount: number;
  merchantName: string;
  region: string;
  mcc: string;
  policyVersion: string;
  reasonCode?: string;
  txHash?: string;
  blockNumber?: number;
};

export const auditTransactions: AuditTransaction[] = [
  { intentId: "pay_a1b2c3d4", timestamp: "2026-05-15T14:23:11", status: "Declined", amount: 35000, merchantName: "강남약국", region: "서울 강남", mcc: "5912", policyVersion: "v2.1", reasonCode: "R_REGION_MISMATCH" },
  { intentId: "pay_z9y8x7w6", timestamp: "2026-05-15T14:25:03", status: "Settled", amount: 12000, merchantName: "편의점CU", region: "서울 종로", mcc: "5411", policyVersion: "v2.1", txHash: "0xabc...f12", blockNumber: 18234567 },
  { intentId: "pay_v5u4t3s2", timestamp: "2026-05-15T14:30:18", status: "Confirmed", amount: 45000, merchantName: "한식당", region: "경기 수원", mcc: "5812", policyVersion: "v2.1", txHash: "0xdef...345", blockNumber: 18234589 },
  { intentId: "pay_e5f6g7h8", timestamp: "2026-05-15T14:45:32", status: "Declined", amount: 120000, merchantName: "럭셔리부티크", region: "부산 해운대", mcc: "5944", policyVersion: "v2.1", reasonCode: "R_MCC_BLOCKED" },
  { intentId: "pay_r1q0p9o8", timestamp: "2026-05-15T14:50:44", status: "Settled", amount: 8500, merchantName: "세븐일레븐", region: "대구 중구", mcc: "5411", policyVersion: "v2.1", txHash: "0x678...9ab", blockNumber: 18234601 },
  { intentId: "pay_n7m6l5k4", timestamp: "2026-05-15T15:05:22", status: "Approved", amount: 28000, merchantName: "김밥천국", region: "인천 연수", mcc: "5812", policyVersion: "v2.1" },
  { intentId: "pay_i9j0k1l2", timestamp: "2026-05-15T15:02:18", status: "Declined", amount: 500000, merchantName: "대형마트", region: "경기 수원", mcc: "5411", policyVersion: "v2.1", reasonCode: "R_DAILY_LIMIT" },
  { intentId: "pay_j3i2h1g0", timestamp: "2026-05-15T15:15:36", status: "Settled", amount: 32000, merchantName: "약국온누리", region: "광주 서구", mcc: "5912", policyVersion: "v2.1", txHash: "0xcde...f01", blockNumber: 18234655 },
];

// ─── 정산선택 분포 ───
export const settlementDistribution = [
  { merchantId: "M-12345", merchantName: "ABC마트", preference: "SC" as const, scRatio: 100, krwRatio: 0, avgLeadTimeSC: "5s", avgLeadTimeKRW: "-", txCount: 1250 },
  { merchantId: "M-23456", merchantName: "동네식당", preference: "KRW" as const, scRatio: 0, krwRatio: 100, avgLeadTimeSC: "-", avgLeadTimeKRW: "T+1 14h", txCount: 890 },
  { merchantId: "M-34567", merchantName: "GS편의점", preference: "SC" as const, scRatio: 100, krwRatio: 0, avgLeadTimeSC: "4s", avgLeadTimeKRW: "-", txCount: 2100 },
  { merchantId: "M-45678", merchantName: "메가커피", preference: "KRW" as const, scRatio: 0, krwRatio: 100, avgLeadTimeSC: "-", avgLeadTimeKRW: "T+1 16h", txCount: 1560 },
  { merchantId: "M-56789", merchantName: "올리브영", preference: "SC" as const, scRatio: 100, krwRatio: 0, avgLeadTimeSC: "6s", avgLeadTimeKRW: "-", txCount: 980 },
  { merchantId: "M-67890", merchantName: "버거킹", preference: "KRW" as const, scRatio: 0, krwRatio: 100, avgLeadTimeSC: "-", avgLeadTimeKRW: "T+2 10h", txCount: 1340 },
  { merchantId: "M-78901", merchantName: "다이소", preference: "SC" as const, scRatio: 100, krwRatio: 0, avgLeadTimeSC: "5s", avgLeadTimeKRW: "-", txCount: 1780 },
  { merchantId: "M-89012", merchantName: "이마트24", preference: "KRW" as const, scRatio: 0, krwRatio: 100, avgLeadTimeSC: "-", avgLeadTimeKRW: "T+1 12h", txCount: 920 },
];

export const settlementSummary = {
  totalMerchants: 168,
  scMerchants: 98,
  krwMerchants: 70,
  scRatio: 58.3,
  krwRatio: 41.7,
  avgLeadTimeSC: "5.2s",
  avgLeadTimeKRW: "T+1.4일",
  totalTxSC: 85_200,
  totalTxKRW: 62_100,
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
