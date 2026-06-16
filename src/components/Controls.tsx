'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface ControlsProps {
  onClearAll: () => void;
  onGenerate: () => void;
  onGlobalSearch: () => void;
  generating: boolean;
  hasPicks: boolean;
  totalSongs: number;
}

export default function Controls({
  onClearAll,
  onGenerate,
  onGlobalSearch,
  generating,
  hasPicks,
  totalSongs
}: ControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl w-full mx-auto px-4 mb-6 md:mb-10 flex flex-wrap items-center justify-between gap-3.5">
      <div className="flex items-center gap-2.5 text-xs text-slate-600 font-light">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{t('controls.database_loaded', { count: totalSongs })}</span>
      </div>
      <div className="flex items-center gap-3.5">
        <button
          onClick={onGlobalSearch}
          className="px-4 py-2 rounded-full text-xs font-semibold border border-pink-200 text-pink-600 hover:text-white hover:bg-pink-500 transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <svg className="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {t('controls.search_all')}
        </button>
        <button
          onClick={onClearAll}
          disabled={!hasPicks}
          className="px-4 py-2 rounded-full text-xs font-medium border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-all duration-300 cursor-pointer"
        >
          {t('controls.clear_grid')}
        </button>
        <button
          onClick={onGenerate}
          disabled={generating || !hasPicks}
          className="px-5 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg hover:shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 cursor-pointer flex items-center gap-2"
        >
          {generating ? (
            <>
              <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              {t('controls.generating')}
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t('controls.generate')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
