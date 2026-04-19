import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "다산어보 | 강진·고흥·보성·장흥 로컬 미디어",
  description: "전남 4개 군(강진·고흥·보성·장흥) 밀착 로컬 미디어. 투명한 보도와 주민 참여로 지역의 미래를 씁니다.",
  keywords: "강진, 고흥, 보성, 장흥, 전남 뉴스, 지역 언론, 로컬 미디어",
  openGraph: {
    title: "다산어보 | 강진·고흥·보성·장흥 로컬 미디어",
    description: "전남 4개 군(강진·고흥·보성·장흥) 밀착 로컬 미디어. 투명한 보도와 주민 참여로 지역의 미래를 씁니다.",
    url: "https://www.dasaneobo.kr",
    images: [{ url: "https://www.dasaneobo.kr/og-image.png", width: 1200, height: 630 }],
    siteName: "다산어보",
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    google: "구글_서치콘솔_인증코드입력", // 전달해주실 코드로 변경해주세요
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} ${notoSerifKR.variable}`}>
      <body>{children}</body>
    </html>
  );
}
