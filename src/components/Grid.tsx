'use client';

import React, { forwardRef } from 'react';
import { Song, RowConfig, ColConfig, Unit, GradeClass } from '../schema/song';
import { SONGS } from '../data/songs';
import GridCell from './GridCell';

interface GridProps {
  rows: RowConfig[];
  cols: ColConfig[];
  picks: Record<string, Song>;
  onCellClick: (rowId: Unit, colId: GradeClass) => void;
  onClearCell: (rowId: Unit, colId: GradeClass, e: React.MouseEvent) => void;
}

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

const Grid = forwardRef<HTMLDivElement, GridProps>(({
  rows,
  cols,
  picks,
  onCellClick,
  onClearCell
}, ref) => {
  return (
    <div 
      ref={ref} 
      className="glass-panel rounded-3xl p-8 border border-black/5 shadow-xl overflow-hidden relative"
    >
      {/* Grid Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        
        {/* Grid Left Corner Info Column */}
        <div className="md:col-span-1 flex flex-col justify-between pr-4 border-r border-black/5 pb-6 md:pb-0">
          <div className="space-y-4">
            <div className="text-2xl font-serif font-bold text-slate-950 tracking-wide">
              SELECTIONS
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-light">
              Click any empty cell in the grid to search and add your absolute favorite song for each unit and class combination.
            </p>
          </div>
          
          {/* Branding watermark */}
          <div className="mt-8 pt-6 border-t border-black/5">
            <div className="font-serif text-sm tracking-wider font-bold text-slate-800">
              蓮ノ空女学院スクールアイドルクラブ
            </div>
            <div className="text-[9px] tracking-widest text-slate-400 uppercase font-light mt-1">
              hasunosora girls' high school idol club
            </div>
          </div>
        </div>

        {/* Grid Grid Areas Column */}
        <div className="md:col-span-3 flex flex-col gap-6">
          {/* Columns Headers */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {cols.map(col => (
              <div key={col.id} className="py-2">
                <div className="font-serif text-lg font-bold text-slate-900 tracking-wide">{col.name}</div>
                <div className="text-[10px] text-slate-500 tracking-wider font-light uppercase mt-0.5">{col.label}</div>
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          <div className="space-y-4">
            {rows.map(row => {
              return (
                <div 
                  key={row.id} 
                  className="grid grid-cols-3 gap-4 p-3.5 rounded-2xl border transition-all duration-300"
                  style={{ 
                    '--glow-color': row.glowColor,
                    background: row.bgStyle,
                    borderColor: row.borderStyle
                  } as React.CSSProperties}
                >
                  {/* Row Header (Inside row block) */}
                  <div className="col-span-3 flex items-center justify-between px-1.5 pb-2 border-b border-black/5">
                    <div className="flex items-center gap-3">
                      {getUnitLogoPath(row.id) ? (
                        <img 
                          src={getUnitLogoPath(row.id)!} 
                          alt={`${row.name} Logo`}
                          className="h-6 w-auto object-contain flex-shrink-0"
                        />
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-sm font-bold text-slate-900 tracking-wide">{row.name}</span>
                          <span className="text-[10px] text-slate-500 font-light">{row.nameJa}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row Grid Cells */}
                  {cols.map(col => {
                    const cellKey = `${row.id}_${col.id}`;
                    const song = picks[cellKey];
                    const cellSongs = SONGS.filter(s => s.unit === row.id && s.class === col.id);
                    const isDisabled = cellSongs.length === 0;

                    return (
                      <GridCell
                        key={col.id}
                        row={row}
                        col={col}
                        song={song}
                        disabled={isDisabled}
                        onClick={() => !isDisabled && onCellClick(row.id, col.id)}
                        onClear={(e) => onClearCell(row.id, col.id, e)}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
});

Grid.displayName = 'Grid';

export default Grid;
