import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MY PICK HASUNOSORA | 蓮ノ空女学院スクールアイドルクラブ お気に入り楽曲を選ぼう！",
  description: "蓮ノ空女学院スクールアイドルクラブ (Hasunosora Girls' High School Idol Club) のお気に入り楽曲を選び、オリジナルのグリッド画像を作成して共有できるファンツールです。",
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
