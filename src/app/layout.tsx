import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serifKR = Noto_Serif_KR({
  variable: "--font-serif-kr",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const sansKR = Noto_Sans_KR({
  variable: "--font-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "지자체 정책 대시보드 | 스테이블코인 PoC",
  description: "정책쿠폰/지역화폐 집행·정산·감사 통합 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${serifKR.variable} ${sansKR.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
