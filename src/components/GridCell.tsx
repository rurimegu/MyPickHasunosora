'use client';

import React from 'react';
import { Song, RowConfig, ColConfig } from '../schema/song';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();

  if (disabled) {
    return (
      <div className="aspect-square rounded-xl border border-dashed border-slate-200/80 bg-slate-50/10 flex flex-col items-center justify-center p-1.5 sm:p-3 text-slate-300 select-none cursor-not-allowed">
        <svg className="w-4 h-4 md:w-5 md:h-5 stroke-current text-slate-300/70" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
          <rect width="16" height="16" x="4" y="4" rx="2" strokeDasharray="4 2" />
        </svg>
        <span className="text-[7px] md:text-[9px] tracking-wider font-bold uppercase text-center mt-1 md:mt-2 text-slate-400">Empty</span>
      </div>
    );
  }

  const isEn = i18n.language.startsWith('en');
  const labelWidthClass = isEn ? 'w-12' : 'w-7';

  return (
    <div
      onClick={onClick}
      className={`aspect-square rounded-xl cursor-pointer overflow-hidden relative flex flex-col items-center justify-center group transition-all duration-300 shadow-sm transform-gpu isolate ${
        song
          ? 'border border-black/5 bg-white/40 hover:bg-white/75'
          : 'border border-dashed border-slate-300/70 bg-white/20 hover:bg-white/45'
      }`}
    >
      {song ? (
        <div className="w-full h-full absolute inset-0 flex flex-col rounded-xl overflow-hidden">
          {/* Cover image */}
          <img 
            src={song.coverUrl} 
            alt={song.title.romaji}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Dark gradient overlay at the bottom */}
          <div 
            className="absolute inset-x-0 bottom-0 pt-6 md:pt-10 pb-1.5 md:pb-2.5 px-1 md:px-2 flex flex-col justify-end pointer-events-none z-0 rounded-b-xl"
            style={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 0) 100%)' }}
          >
            <div className="text-[8px] md:text-[10.5px] font-bold text-white tracking-wide truncate text-center" title={song.title.ja}>
              {song.title.ja}
            </div>
            <div className="text-[6.5px] md:text-[8px] text-white/75 font-semibold uppercase tracking-wider truncate text-center mt-0.5" title={song.title.romaji}>
              {song.title.romaji}
            </div>
          </div>

          {/* Hover overlay with credits */}
          <div className="absolute inset-0 rounded-xl backdrop-blur-[4px] bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-3 gap-1.5 text-left z-10 pointer-events-none">
            {/* Lyricist Capsule */}
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-lg px-2 py-0.5 overflow-hidden min-w-0">
              <span className={`text-[7.5px] font-extrabold tracking-wider text-pink-300 uppercase flex-shrink-0 ${labelWidthClass}`}>{t('search.lyricist')}</span>
              <span className="text-[9px] font-bold text-white truncate" title={song.lyricist.ja}>{song.lyricist.ja}</span>
            </div>
            {/* Composer Capsule */}
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-lg px-2 py-0.5 overflow-hidden min-w-0">
              <span className={`text-[7.5px] font-extrabold tracking-wider text-cyan-300 uppercase flex-shrink-0 ${labelWidthClass}`}>{t('search.composer')}</span>
              <span className="text-[9px] font-bold text-white truncate" title={song.composer.ja}>{song.composer.ja}</span>
            </div>
            {/* Arranger Capsule */}
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-lg px-2 py-0.5 overflow-hidden min-w-0">
              <span className={`text-[7.5px] font-extrabold tracking-wider text-amber-300 uppercase flex-shrink-0 ${labelWidthClass}`}>{t('search.arranger')}</span>
              <span className="text-[9px] font-bold text-white truncate" title={song.arranger.ja}>{song.arranger.ja}</span>
            </div>
          </div>

          {/* Clear Button */}
          <button
            onClick={onClear}
            className="clear-btn absolute top-1.5 right-1.5 w-5.5 h-5.5 rounded-full bg-white/95 border border-black/10 text-slate-700 hover:text-white hover:bg-pink-500 hover:border-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 cursor-pointer shadow-md"
            title={t('grid.clear_pick')}
          >
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </button>
        </div>
      ) : (
        // Empty Cell Placeholder
        <div className="flex flex-col items-center gap-1 md:gap-2 text-slate-400 group-hover:text-pink-500 transition-colors duration-300 p-1.5 sm:p-3">
          <svg className="w-4 h-4 md:w-6 md:h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="text-[7px] md:text-[10px] tracking-wider font-semibold uppercase text-center">{t('grid.pick_song')}</span>
        </div>
      )}
    </div>
  );
}
