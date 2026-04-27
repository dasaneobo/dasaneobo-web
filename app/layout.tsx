import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_CONFIG } from "@/constants/siteConfig";

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
  metadataBase: new URL(SITE_CONFIG.url),
  title: { default: SITE_CONFIG.name, template: `%s | ${SITE_CONFIG.name}` },
  description: SITE_CONFIG.description,
  keywords: "강진, 장흥, 고흥, 보성, 전남 뉴스, 지역 언론, 독립언론",
  openGraph: {
    title: { default: SITE_CONFIG.name, template: `%s | ${SITE_CONFIG.name}` },
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    images: [{ url: `${SITE_CONFIG.url}/og-image.png`, width: 1200, height: 630 }],
    siteName: SITE_CONFIG.name,
    locale: "ko_KR",
    type: "website",
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  verification: {
    google: "FafkuE0YBRZtLsqTthBQeQT2wWpk90jfoLvp5OGXhCw",
  },
  other: {
    "naver-site-verification": "b791cfcfeb56042ca8f327c4929200f1ece79f05",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: { '@type': 'ImageObject', url: `${SITE_CONFIG.url}/logo.png` },
  };

  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} ${notoSerifKR.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title={`${SITE_CONFIG.name} RSS`} href="/feed.xml" />
      </head>
      <body>
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
