'use client';

import React from 'react';
import { Song, RowConfig, ColConfig } from '../schema/song';

interface GridCellProps {
  row: RowConfig;
  col: ColConfig;
  song: Song | undefined;
  disabled?: boolean;
  onClick: () => void;
  onClear: (e: React.MouseEvent) => void;
}

export default function GridCell({
  row,
  col,
  song,
  disabled = false,
  onClick,
  onClear
}: GridCellProps) {
  if (disabled) {
    return (
      <div className="aspect-square rounded-xl border border-dashed border-slate-200/80 bg-slate-50/10 flex flex-col items-center justify-center p-3 text-slate-300 select-none cursor-not-allowed">
        <svg className="w-5 h-5 stroke-current text-slate-300/70" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
          <rect width="16" height="16" x="4" y="4" rx="2" strokeDasharray="4 2" />
        </svg>
        <span className="text-[9px] tracking-wider font-bold uppercase text-center mt-2 text-slate-400">Empty</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`aspect-square rounded-xl cursor-pointer overflow-hidden relative flex flex-col items-center justify-center group transition-all duration-300 shadow-sm ${
        song
          ? 'border border-black/5 bg-white/40 hover:bg-white/75'
          : 'border border-dashed border-slate-300/70 bg-white/20 hover:bg-white/45'
      }`}
    >
      {song ? (
        <div className="w-full h-full absolute inset-0 flex flex-col">
          {/* Cover image */}
          <img 
            src={song.coverUrl} 
            alt={song.title.romaji}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Dark gradient overlay at the bottom */}
          <div 
            className="absolute inset-x-0 bottom-0 pt-10 pb-2.5 px-2 flex flex-col justify-end pointer-events-none z-0"
            style={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 0) 100%)' }}
          >
            <div className="text-[10.5px] font-bold text-white tracking-wide truncate text-center" title={song.title.ja}>
              {song.title.ja}
            </div>
            <div className="text-[8px] text-white/75 font-semibold uppercase tracking-wider truncate text-center mt-0.5" title={song.title.romaji}>
              {song.title.romaji}
            </div>
          </div>

          {/* Hover overlay with credits */}
          <div className="absolute inset-0 backdrop-blur-[4px] bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-3 gap-1.5 text-left z-10 pointer-events-none">
            {/* Lyricist Capsule */}
            <div className="flex flex-col bg-white/10 border border-white/10 rounded-xl px-2.5 py-1">
              <span className="text-[5.5px] font-extrabold tracking-[0.2em] text-pink-300 uppercase">Lyricist</span>
              <span className="text-[9px] font-bold text-white truncate mt-0.5" title={song.lyricist.ja}>{song.lyricist.ja}</span>
            </div>
            {/* Composer Capsule */}
            <div className="flex flex-col bg-white/10 border border-white/10 rounded-xl px-2.5 py-1">
              <span className="text-[5.5px] font-extrabold tracking-[0.2em] text-cyan-300 uppercase">Composer</span>
              <span className="text-[9px] font-bold text-white truncate mt-0.5" title={song.composer.ja}>{song.composer.ja}</span>
            </div>
            {/* Arranger Capsule */}
            <div className="flex flex-col bg-white/10 border border-white/10 rounded-xl px-2.5 py-1">
              <span className="text-[5.5px] font-extrabold tracking-[0.2em] text-amber-300 uppercase">Arranger</span>
              <span className="text-[9px] font-bold text-white truncate mt-0.5" title={song.arranger.ja}>{song.arranger.ja}</span>
            </div>
          </div>

          {/* Clear Button */}
          <button
            onClick={onClear}
            className="clear-btn absolute top-1.5 right-1.5 w-5.5 h-5.5 rounded-full bg-white/95 border border-black/10 text-slate-700 hover:text-white hover:bg-pink-500 hover:border-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 cursor-pointer shadow-md"
            title="Clear Pick"
          >
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </button>
        </div>
      ) : (
        // Empty Cell Placeholder
        <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-pink-500 transition-colors duration-300 p-3">
          <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="text-[10px] tracking-wider font-semibold uppercase text-center">Pick Song</span>
        </div>
      )}
    </div>
  );
}
