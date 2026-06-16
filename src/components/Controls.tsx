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
  nickname: string;
  onNicknameChange: (nickname: string) => void;
}

export default function Controls({
  onClearAll,
  onGenerate,
  onGlobalSearch,
  generating,
  hasPicks,
  totalSongs,
  nickname,
  onNicknameChange
}: ControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl w-full mx-auto px-4 mb-6 md:mb-10 flex flex-wrap items-center justify-between gap-3.5">
      <div className="flex items-center gap-2.5 text-xs text-slate-600 font-light">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{t('controls.database_loaded', { count: totalSongs })}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 justify-end w-full sm:w-auto">
        <button
          onClick={onGlobalSearch}
          className="px-4 py-2 rounded-full text-xs font-semibold border border-pink-200 text-pink-600 hover:text-white hover:bg-pink-500 transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <svg className="w-3.5 h-3.5 stroke-current text-pink-500/80" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
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
        {/* Nickname Input Capsule */}
        <div className="relative group">
          <input
            type="text"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            placeholder={t('controls.nickname_placeholder')}
            className="pl-8 pr-4 py-2 border border-slate-200 group-hover:border-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/10 rounded-full text-xs text-slate-900 placeholder-slate-400 bg-white/60 focus:bg-white transition-all w-36 sm:w-40 shadow-sm cursor-text"
          />
          <svg className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 group-hover:text-pink-500 transition-colors pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
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
