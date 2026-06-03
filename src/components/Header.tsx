'use client';

import React from 'react';

export default function Header() {
  return (
    <header className="max-w-7xl w-full mx-auto px-4 pt-6 md:pt-12 pb-4 md:pb-8 flex flex-col items-center text-center">
      <div className="mb-3 text-xs tracking-[0.3em] font-semibold text-pink-400 uppercase text-glow-pink">
        Link! Like! Love Live!
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-slate-950 mb-2">
        MY PICK <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-cyan-500 to-amber-500 font-extrabold">HASUNOSORA</span>
      </h1>
      <div className="font-sans text-sm text-slate-600 tracking-wider max-w-2xl font-light">
        蓮ノ空女学院スクールアイドルクラブのお気に入りの楽曲を選ぼう！
      </div>
    </header>
  );
}
