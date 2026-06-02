'use client';

import React from 'react';
import { Song, RowConfig, ColConfig, Unit, GradeClass } from '../schema/song';
import { SONGS } from '../data/songs';

interface ExportGridProps {
  rows: RowConfig[];
  cols: ColConfig[];
  picks: Record<string, Song>;
}

const MEMBER_COLORS = [
  { name: 'Kaho', hex: '#f8b500' },
  { name: 'Sayaka', hex: '#5383c3' },
  { name: 'Kozue', hex: '#68be8d' },
  { name: 'Tsuzuri', hex: '#ba2636' },
  { name: 'Rurino', hex: '#e7609e' },
  { name: 'Megumi', hex: '#ffffff', border: true },
  { name: 'Ginko', hex: '#a2d7dd' },
  { name: 'Kosuzu', hex: '#fad3cf' },
  { name: 'Hime', hex: '#9b72b0' },
  { name: 'Ceras', hex: '#f56455' },
  { name: 'Izumi', hex: '#1ebecd' }
];

const getUnitLogoPath = (unit: Unit): string | null => {
  switch (unit) {
    case Unit.CeriseBouquet: return '/logos/cerisebouquet.png';
    case Unit.Dollchestra: return '/logos/dollchestra.png';
    case Unit.MiraCraPark: return '/logos/miracrapark.png';
    case Unit.EdelNote: return '/logos/edelnote.png';
    case Unit.Hasunosora: return '/logos/hasunosora.png';
    default: return null;
  }
};

export default function ExportGrid({ rows, cols, picks }: ExportGridProps) {
  return (
    <div
      id="mypick-export-canvas"
      className="w-[1024px] bg-[#FAF9F5] pt-12 px-12 pb-8 flex flex-col gap-8 border border-black/5 shadow-2xl relative overflow-hidden font-sans"
      style={{ boxSizing: 'border-box' }}
    >

      {/* Header Section */}
      <div className="flex flex-col items-center text-center gap-3.5 relative z-10">
        <div className="text-3xl font-black tracking-[0.3em] text-slate-900 font-serif uppercase">
          My Pick Hasunosora
        </div>
        <div className="text-[11px] tracking-[0.25em] text-slate-500 font-medium uppercase">
          蓮ノ空女学院スクールアイドルクラブ お気に入り楽曲選
        </div>

        {/* Gorgeous 11 Member Color segmented horizontal bar */}
        <div className="flex items-center justify-center gap-1 mt-1">
          {MEMBER_COLORS.map(c => (
            <div
              key={c.name}
              className="w-4 h-1.5 rounded-full shadow-xs"
              style={{
                backgroundColor: c.hex,
                border: c.border ? '1px solid rgba(0, 0, 0, 0.15)' : 'none'
              }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Grid Columns Headers */}
      <div className="grid grid-cols-4 gap-6 relative z-10 mt-4">
        {/* Empty corner spacer */}
        <div className="col-span-1 flex items-end pb-2 pl-2">
          <div className="flex flex-col">
            <span className="font-serif text-xs font-bold text-slate-800 tracking-wider">SELECTIONS</span>
          </div>
        </div>

        {/* Grade Headers */}
        <div className="col-span-3 grid grid-cols-3 gap-5 text-center">
          {cols.map(col => (
            <div key={col.id} className="py-1.5 border-b border-black/5">
              <div className="font-serif text-base font-bold text-slate-900 tracking-wide">{col.name}</div>
              <div className="text-[9px] text-slate-400 tracking-wider font-light uppercase mt-0.5">{col.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Rows */}
      <div className="flex flex-col gap-5 relative z-10">
        {rows.map(row => {
          return (
            <div
              key={row.id}
              className="grid grid-cols-4 gap-6 items-center p-4 rounded-2xl border"
              style={{
                background: row.bgStyle,
                borderColor: row.borderStyle
              }}
            >
              {/* Row Header (Left Column) */}
              <div className="col-span-1 flex items-center justify-center pl-2 h-16 w-full">
                {getUnitLogoPath(row.id) ? (
                  <img
                    src={getUnitLogoPath(row.id)!}
                    alt={`${row.name} Logo`}
                    className="max-h-full max-w-full object-contain flex-shrink-0"
                  />
                ) : (
                  <div className="flex flex-col">
                    <span className="font-serif text-sm font-bold text-slate-900 tracking-wide">{row.name}</span>
                    <span className="text-[10px] text-slate-500 font-light mt-0.5">{row.nameJa}</span>
                  </div>
                )}
              </div>

              {/* Row Grid Cells (3 Columns) */}
              <div className="col-span-3 grid grid-cols-3 gap-5">
                {cols.map(col => {
                  const cellKey = `${row.id}_${col.id}`;
                  const song = picks[cellKey];
                  const cellSongs = SONGS.filter(s => s.unit === row.id && s.class === col.id);
                  const isDisabled = cellSongs.length === 0;

                  if (isDisabled) {
                    return (
                      <div
                        key={col.id}
                        className="aspect-square rounded-xl border border-dashed border-slate-200/60 bg-slate-50/5 flex flex-col items-center justify-center p-3 text-slate-300/40 select-none"
                      >
                        <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                          <rect width="16" height="16" x="4" y="4" rx="2" strokeDasharray="4 2" />
                        </svg>
                        <span className="text-[8px] tracking-wider font-bold uppercase text-center mt-1.5">Empty</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={col.id}
                      className={`aspect-square rounded-xl overflow-hidden relative flex flex-col items-center justify-center shadow-xs ${
                        song
                          ? 'border border-black/5 bg-white/30'
                          : 'border border-dashed border-slate-300/80 bg-white/10'
                      }`}
                    >
                      {song ? (
                        <div className="w-full h-full absolute inset-0 flex flex-col">
                          {/* Cover image */}
                          <img
                            src={song.coverUrl}
                            alt={song.title.romaji}
                            className="absolute inset-0 w-full h-full object-cover"
                          />

                          {/* Dark gradient overlay at the bottom */}
                          <div 
                            className="absolute inset-x-0 bottom-0 pt-10 pb-2.5 px-2 flex flex-col justify-end z-0"
                            style={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 0) 100%)' }}
                          >
                            <div className="text-[10px] font-bold text-white tracking-wide truncate text-center">
                              {song.title.ja}
                            </div>
                            <div className="text-[7.5px] text-white/75 font-semibold uppercase tracking-wider truncate text-center mt-0.5">
                              {song.title.romaji}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Empty Cell Placeholder
                        <div className="flex flex-col items-center gap-1.5 text-slate-300 p-3">
                          <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          <span className="text-[8px] tracking-wider font-semibold uppercase text-center">No Pick</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Watermark / Footer */}
      <div className="flex items-center justify-center mt-5 pt-5 border-t border-black/5 text-[15px] tracking-[0.4em] text-slate-600 uppercase font-extrabold relative z-10">
        mypick.rurino.dev
      </div>
    </div>
  );
}
