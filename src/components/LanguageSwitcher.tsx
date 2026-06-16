'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({
  className = ""
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = i18n.language || 'ja';

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const languages = [
    { code: 'ja', label: '日本語' },
    { code: 'en', label: 'English' },
    { code: 'zh-CN', label: '简体中文' },
    { code: 'zh-TW', label: '繁體中文' }
  ];

  const isLanguageSelected = (code: string) => {
    const current = currentLang.toLowerCase();
    const target = code.toLowerCase();
    return current === target || current.startsWith(target + '-') || (target === 'zh-cn' && current === 'zh');
  };

  const currentLangLabel = languages.find(l => isLanguageSelected(l.code))?.label || '日本語';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-100/60 flex items-center justify-center gap-1 cursor-pointer"
        title="Change Language / 言語切替"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.918M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-[10px] font-bold tracking-wider">{currentLangLabel}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
          {languages.map((lang) => {
            const isSelected = isLanguageSelected(lang.code);
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer text-left"
              >
                <span>{lang.label}</span>
                {isSelected && (
                  <svg
                    className="w-3.5 h-3.5 text-pink-500 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
