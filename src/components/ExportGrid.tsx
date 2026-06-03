'use client';

import React from 'react';
import { Song, RowConfig, ColConfig, Unit, GradeClass } from '../schema/song';
import { SONGS } from '../data/songs';
import { SITE_DOMAIN } from '../utils/constants';

interface ExportGridProps {
  rows: RowConfig[];
  cols: ColConfig[];
  picks: Record<string, Song>;
  showTitles?: boolean;
}

const MEMBER_COLORS = [
  { name: 'Kaho', hex: '#f8b500' },
  { name: 'Sayaka', hex: '#5383c3' },
  { name: 'Kozue', hex: '#68be8d' },
  { name: 'Tsuzuri', hex: '#ba2636' },
  { name: 'Rurino', hex: '#e7609e' },
  { name: 'Megumi', hex: '#c8c2c6' },
  { name: 'Ginko', hex: '#a2d7dd' },
  { name: 'Kosuzu', hex: '#fad764' },
  { name: 'Hime', hex: '#9d8de2' },
  { name: 'Ceras', hex: '#f66455' },
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

const getSolidBgStyle = (unit: Unit): string => {
  switch (unit) {
    case Unit.Hasunosora: return "linear-gradient(to right, #FEF1DF, #FCFBF9)";
    case Unit.CeriseBouquet: return "linear-gradient(to right, #FCF4F7, #FCFBF9)";
    case Unit.Dollchestra: return "linear-gradient(to right, #F0FDFC, #FCFBF9)";
    case Unit.MiraCraPark: return "linear-gradient(to right, #FDF5D5, #FCFBF9)";
    case Unit.EdelNote: return "linear-gradient(to right, #F4F6F8, #FCFBF9)";
    case Unit.Other: return "linear-gradient(to right, #F5EDFC, #FCFBF9)";
    default: return "linear-gradient(to right, #FCFBF9, #FCFBF9)";
  }
};

const getSolidBorderStyle = (unit: Unit): string => {
  switch (unit) {
    case Unit.Hasunosora: return "#FCE5C8";
    case Unit.CeriseBouquet: return "#FBE0ED";
    case Unit.Dollchestra: return "#C7F5F9";
    case Unit.MiraCraPark: return "#FCEEB5";
    case Unit.EdelNote: return "#ECEFF2";
    case Unit.Other: return "#F0E3F9";
    default: return "#ECEFF2";
  }
};

export default function ExportGrid({ rows, cols, picks, showTitles = false }: ExportGridProps) {
  return (
    <div
      id="mypick-export-canvas"
      className="w-[1024px] pt-14 px-14 pb-10 flex flex-col gap-9 border border-black/5 relative overflow-hidden font-sans"
      style={{ backgroundColor: '#FAF9F5', boxSizing: 'border-box' }}
    >

      {/* Header Section */}
      <div className="flex flex-col items-center text-center gap-4 relative z-10">
        <div className="text-[48px] font-black tracking-[0.35em] text-slate-900 font-serif uppercase leading-none">
          My Pick Hasunosora
        </div>
        <div className="text-[16px] tracking-[0.28em] text-slate-500 font-semibold uppercase mt-1">
          蓮ノ空女学院スクールアイドルクラブ お気に入り楽曲選
        </div>

        {/* Gorgeous 11 Member Color segmented horizontal bar */}
        <div className="flex items-center justify-center gap-2 mt-1">
          {MEMBER_COLORS.map(c => (
            <div
              key={c.name}
              className="w-7 h-3 rounded-full"
              style={{
                backgroundColor: c.hex,
                border: 'none'
              }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Grid Columns Headers */}
      <div className="grid grid-cols-4 gap-7 relative z-10 mt-6">
        {/* Empty corner spacer */}
        <div className="col-span-1 flex items-end pb-2.5 pl-2.5">
          <div className="flex flex-col">
            <span className="font-serif text-[18px] font-bold text-slate-800 tracking-wider">SELECTIONS</span>
          </div>
        </div>

        {/* Grade Headers */}
        <div className="col-span-3 grid grid-cols-3 gap-6 text-center">
          {cols.map(col => (
            <div key={col.id} className="py-2 border-b-2 border-black/5">
              <div className="font-serif text-[24px] font-bold text-slate-900 tracking-wide">{col.name}</div>
              <div className="text-[13px] text-slate-400 tracking-wider font-semibold uppercase mt-1">{col.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Rows */}
      <div className="flex flex-col gap-6 relative z-10">
        {rows.map(row => {
          return (
            <div
              key={row.id}
              className="grid grid-cols-4 gap-7 items-center p-5 rounded-3xl border-2"
              style={{
                background: getSolidBgStyle(row.id),
                borderColor: getSolidBorderStyle(row.id)
              }}
            >
              {/* Row Header (Left Column) */}
              <div className="col-span-1 flex items-center justify-center pl-2.5 h-20 w-full">
                {getUnitLogoPath(row.id) ? (
                  <img
                    src={getUnitLogoPath(row.id)!}
                    alt={`${row.name} Logo`}
                    className="max-h-full max-w-full object-contain flex-shrink-0"
                  />
                ) : (
                    <div className="flex flex-col items-center text-center">
                      <span className="font-serif text-[20px] font-bold text-slate-900 tracking-wide">{row.name}</span>
                      <span className="text-[14px] text-slate-500 font-normal mt-1">{row.nameJa}</span>
                  </div>
                )}
              </div>

              {/* Row Grid Cells (3 Columns) */}
              <div className="col-span-3 grid grid-cols-3 gap-6">
                {cols.map(col => {
                  const cellKey = `${row.id}_${col.id}`;
                  const song = picks[cellKey];
                  const cellSongs = SONGS.filter(s => s.unit === row.id && s.class === col.id);
                  const isDisabled = cellSongs.length === 0;

                  if (isDisabled) {
                    return (
                      <div
                        key={col.id}
                        className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-[#F8F8F6] flex flex-col items-center justify-center p-4 text-slate-300/40 select-none"
                      >
                        <svg className="w-7 h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                          <rect width="16" height="16" x="4" y="4" rx="2" strokeDasharray="4 2" />
                        </svg>
                        <span className="text-[13px] tracking-widest font-bold uppercase text-center mt-2.5">Empty</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={col.id}
                      className={`aspect-square rounded-2xl overflow-hidden relative flex flex-col items-center justify-center ${
                        song
                          ? 'border border-black/5 bg-white'
                          : 'border-2 border-dashed border-slate-300 bg-white'
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
                          {showTitles && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-8 pb-5 px-3 flex flex-col justify-end min-h-[50%] z-10">
                              <span className="text-white font-serif font-black text-[18px] tracking-wide text-center drop-shadow-lg leading-normal">
                                {song.title.ja}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Empty Cell Placeholder
                          <div className="flex flex-col items-center gap-2 text-slate-300 p-4">
                            <svg className="w-7 h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                            <span className="text-[13px] tracking-widest font-semibold uppercase text-center mt-2.5">No Pick</span>
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
      <div className="flex items-center justify-center mt-8 pt-8 border-t-2 border-black/5 text-[26px] tracking-[0.45em] text-slate-700 uppercase font-black relative z-10">
        {SITE_DOMAIN}
      </div>
    </div>
  );
}
