'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MyPickSite {
  siteName: string;
  groupNameJa: string;
  url: string;
  isActive?: boolean;
}

const OTHER_SITES: MyPickSite[] = [
  {
    siteName: 'My Pick LLerNote',
    groupNameJa: 'ラブライブ！シリーズ',
    url: 'https://hamproductions.github.io/llernote/mypick/'
  },
  {
    siteName: 'My Pick Aqours',
    groupNameJa: 'Aqours',
    url: 'https://aqours-mypick.ccwu.cc'
  },
  {
    siteName: 'My Pick Nijigasaki',
    groupNameJa: '虹ヶ咲学園スクールアイドル同好会',
    url: 'https://mypick-nijigaku.naufalalfa.com'
  },
  {
    siteName: 'My Pick Liella!',
    groupNameJa: 'Liella!',
    url: 'https://mypick-liella.kotoha.moe'
  },
  {
    siteName: 'My Pick Hasunosora',
    groupNameJa: '蓮ノ空女学院スクールアイドルクラブ',
    url: 'https://mypick.rurino.dev',
    isActive: true
  },
  {
    siteName: 'スクステMyPick蓮ノ空',
    groupNameJa: 'Link！Like！ラブライブ！',
    url: 'https://skst-mypick.sukisuki.club'
  },
  {
    siteName: 'My Pick IKIZULIVE!',
    groupNameJa: 'いきづらい部！',
    url: 'https://mypick-ikizulive.kotoha.moe/'
  },
  {
    siteName: 'My Pick =LOVE',
    groupNameJa: '＝LOVE',
    url: 'https://mypick.kozueginko.com/'
  },
  {
    siteName: 'My Pick ≠ME',
    groupNameJa: '≠ME',
    url: 'https://mypick-not-equal-me.kozueginko.com/'
  },
  {
    siteName: 'My Pick ≒JOY',
    groupNameJa: '≒JOY',
    url: 'https://mypick-nearly-equal-joy.kozueginko.com/'
  }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation();

  // Prevent background scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/98 border-r border-slate-200/80 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-serif text-sm font-bold text-slate-800 tracking-wider uppercase">
            {t('sidebar.title')}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          <div className="space-y-2.5">
            {OTHER_SITES.map((site) => {
              if (site.isActive) {
                return (
                  <div
                    key={site.url}
                    className="block p-4 rounded-2xl border-2 border-pink-200 bg-pink-50/20 shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-pink-600 tracking-wide">
                            {site.siteName}
                          </h4>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-pink-100 text-pink-600 leading-none">
                            Here
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium mt-1.5 block">
                          {site.groupNameJa}
                        </span>
                      </div>
                      <span className="text-pink-500 text-sm select-none">★</span>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={site.url}
                  href={site.url}
                  target="_blank"
                  rel="noopener"
                  className="block p-4 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-slate-50/50 transition-all duration-300 shadow-sm group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 tracking-wide group-hover:text-pink-600 transition-colors">
                        {site.siteName}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                        {site.groupNameJa}
                      </span>
                    </div>
                    <svg
                      className="w-3.5 h-3.5 text-slate-300 group-hover:text-pink-500 group-hover:translate-x-0.5 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Footer with Disclaimer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[9.5px] leading-relaxed text-slate-400 font-normal">
            {t('sidebar.disclaimer')}
          </p>
        </div>
      </div>
    </>
  );
}
