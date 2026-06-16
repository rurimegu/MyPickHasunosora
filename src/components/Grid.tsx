import React, { forwardRef } from 'react';
import { Song, RowConfig, ColConfig, Unit, GradeClass } from '../schema/song';
import { SONGS } from '../data/songs';
import GridCell from './GridCell';
import { useTranslation } from 'react-i18next';
import { getUnitKey, getGradeKey } from '../i18n/config';

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
  const { t } = useTranslation();
  return (
    <div 
      ref={ref} 
      className="glass-panel rounded-2xl md:rounded-3xl p-4 md:p-8 border border-black/5 shadow-xl overflow-hidden relative"
    >
      {/* Grid Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-3.5 md:gap-6 relative z-10">
        
        {/* Columns Headers */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 text-center items-end">
          {/* Selections corner title (1st column) */}
          <div className="col-span-1 flex items-end pb-1 md:pb-2 pl-1 md:pl-2">
            <div className="flex flex-col text-left">
              <span className="font-serif text-[10px] sm:text-xs md:text-base font-bold text-slate-800 tracking-wider">{t('grid.selections')}</span>
            </div>
          </div>
          {/* Grade Headers (3 columns) */}
          <div className="col-span-3 grid grid-cols-3 gap-2 md:gap-4 text-center">
            {cols.map(col => {
              const gradeKey = getGradeKey(col.id);
              return (
                <div key={col.id} className="py-1 md:py-2">
                  <div className="font-serif text-xs sm:text-sm md:text-lg font-bold text-slate-900 tracking-wide">
                    {t(`grades.${gradeKey}_short`)}
                  </div>
                  <div className="text-[8px] md:text-[10px] text-slate-500 tracking-wider font-light uppercase mt-0.5 leading-tight">
                    {t(`grades.${gradeKey}`)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid Rows */}
        <div className="space-y-2 md:space-y-4">
          {rows.map(row => {
            return (
              <div 
                key={row.id} 
                className="grid grid-cols-4 gap-2 md:gap-4 items-center p-1.5 sm:p-2 md:p-3.5 rounded-xl md:rounded-2xl border transition-all duration-300"
                style={{ 
                  '--glow-color': row.glowColor,
                  background: row.bgStyle,
                  borderColor: row.borderStyle
                } as React.CSSProperties}
              >
                {/* Row Header (Left Column) */}
                <div className="col-span-1 flex items-center justify-center pl-1 h-10 sm:h-12 md:h-16 w-full">
                  {getUnitLogoPath(row.id) ? (
                    <img 
                      src={getUnitLogoPath(row.id)!} 
                      alt={`${row.name} Logo`}
                      className="max-h-full max-w-full object-contain flex-shrink-0"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <span className="font-serif text-[9px] sm:text-xs md:text-sm font-bold text-slate-900 tracking-wide leading-tight">
                        {t(`units.${getUnitKey(row.id)}`)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Row Grid Cells (3 Columns) */}
                <div className="col-span-3 grid grid-cols-3 gap-2 md:gap-4">
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
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
});

Grid.displayName = 'Grid';

export default Grid;
