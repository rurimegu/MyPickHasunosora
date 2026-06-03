import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mypick.rurino.dev"),
  title: "MY PICK HASUNOSORA | 蓮ノ空女学院スクールアイドルクラブ お気に入り楽曲を選ぼう！",
  description: "蓮ノ空女学院スクールアイドルクラブ (Hasunosora Girls' High School Idol Club) のお気に入り楽曲を選び、オリジナルのグリッド画像を作成して共有できるファンツールです。",
  keywords: [
    "蓮ノ空",
    "リンクラ",
    "蓮ノ空女学院スクールアイドルクラブ",
    "お気に入り楽曲",
    "My Pick",
    "Hasunosora",
    "Link! Like! Love Live!",
    "リンクラ楽曲",
    "蓮ノ空楽曲"
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    title: "MY PICK HASUNOSORA | 蓮ノ空女学院スクールアイドルクラブ お気に入り楽曲を選ぼう！",
    description: "蓮ノ空女学院スクールアイドルクラブ (Hasunosora Girls' High School Idol Club) のお気に入り楽曲を選び、オリジナルのグリッド画像を作成して共有できるファンツールです。",
    url: "https://mypick.rurino.dev",
    siteName: "MY PICK HASUNOSORA",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "MY PICK HASUNOSORA Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "MY PICK HASUNOSORA | 蓮ノ空女学院スクールアイドルクラブ お気に入り楽曲を選ぼう！",
    description: "蓮ノ空女学院スクールアイドルクラブ (Hasunosora Girls' High School Idol Club) のお気に入り楽曲を選び、オリジナルのグリッド画像を作成して共有できるファンツールです。",
    images: ["/icon-192.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
