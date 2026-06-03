'use client';

import { useState, useEffect, useRef } from 'react';
import { Unit, GradeClass, Song, RowConfig, ColConfig } from '../schema/song';
import { SONGS } from '../data/songs';
import Header from '../components/Header';
import Controls from '../components/Controls';
import Grid from '../components/Grid';
import SearchModal from '../components/SearchModal';
import ExportGrid from '../components/ExportGrid';
import PreviewModal from '../components/PreviewModal';
import { convertColorString } from '../utils/colors';


const ROWS: RowConfig[] = [
  {
    id: Unit.Hasunosora,
    name: "Hasunosora Girls' High School Idol Club",
    nameJa: "蓮ノ空女学院スクールアイドルクラブ",
    colorClass: "from-orange-100/70 to-white/40 border-orange-200/60",
    textColor: "text-orange-600",
    glowColor: "rgba(249, 115, 22, 0.1)",
    accentColor: "bg-orange-500",
    bgStyle: "linear-gradient(to right, rgba(255, 237, 213, 0.7), rgba(255, 255, 255, 0.4))",
    borderStyle: "rgba(254, 215, 170, 0.6)"
  },
  {
    id: Unit.CeriseBouquet,
    name: "Cerise Bouquet",
    nameJa: "スリーズブーケ",
    colorClass: "from-pink-100/70 to-white/40 border-pink-200/60",
    textColor: "text-pink-600",
    glowColor: "rgba(236, 72, 153, 0.1)",
    accentColor: "bg-pink-500",
    bgStyle: "linear-gradient(to right, rgba(253, 242, 248, 0.7), rgba(255, 255, 255, 0.4))",
    borderStyle: "rgba(251, 207, 232, 0.6)"
  },
  {
    id: Unit.Dollchestra,
    name: "DOLLCHESTRA",
    nameJa: "ドルケストラ",
    colorClass: "from-cyan-100/70 to-white/40 border-cyan-200/60",
    textColor: "text-cyan-600",
    glowColor: "rgba(6, 182, 212, 0.1)",
    accentColor: "bg-cyan-500",
    bgStyle: "linear-gradient(to right, rgba(236, 254, 255, 0.7), rgba(255, 255, 255, 0.4))",
    borderStyle: "rgba(165, 243, 252, 0.6)"
  },
  {
    id: Unit.MiraCraPark,
    name: "Mira-Cra Park!",
    nameJa: "みらくらぱーく！",
    colorClass: "from-amber-100/70 to-white/40 border-amber-200/60",
    textColor: "text-amber-600",
    glowColor: "rgba(251, 191, 36, 0.1)",
    accentColor: "bg-amber-400",
    bgStyle: "linear-gradient(to right, rgba(254, 243, 199, 0.7), rgba(255, 255, 255, 0.4))",
    borderStyle: "rgba(253, 230, 138, 0.6)"
  },
  {
    id: Unit.EdelNote,
    name: "Edel Note",
    nameJa: "エーデルノート",
    colorClass: "from-slate-100/70 to-white/40 border-slate-200/60",
    textColor: "text-slate-600",
    glowColor: "rgba(148, 163, 184, 0.1)",
    accentColor: "bg-slate-400",
    bgStyle: "linear-gradient(to right, rgba(241, 245, 249, 0.7), rgba(255, 255, 255, 0.4))",
    borderStyle: "rgba(226, 232, 240, 0.6)"
  },
  {
    id: Unit.Other,
    name: "Other",
    nameJa: "シャッフル・ソロ・その他",
    colorClass: "from-purple-100/70 to-white/40 border-purple-200/60",
    textColor: "text-purple-600",
    glowColor: "rgba(168, 85, 247, 0.1)",
    accentColor: "bg-purple-500",
    bgStyle: "linear-gradient(to right, rgba(243, 232, 255, 0.7), rgba(255, 255, 255, 0.4))",
    borderStyle: "rgba(233, 213, 252, 0.6)"
  }
];

const COLS: ColConfig[] = [
  { id: GradeClass.C103, name: "103期", label: "103rd Class (2023)" },
  { id: GradeClass.C104, name: "104期", label: "104th Class (2024)" },
  { id: GradeClass.C105, name: "105期", label: "105th Class (2025)" }
];



export default function Home() {
  const [picks, setPicks] = useState<Record<string, Song>>({});
  const [activeCell, setActiveCell] = useState<{ rowUnit: Unit; colClass: GradeClass } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showTitles, setShowTitles] = useState(false);
  
  const gridRef = useRef<HTMLDivElement>(null);

  // Load selections from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hasu_mypicks');
    if (saved) {
      try {
        setPicks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved picks", e);
      }
    }
  }, []);

  // Re-generate image preview when showTitles changes (if preview modal is currently active)
  useEffect(() => {
    if (previewUrl) {
      const timer = setTimeout(() => {
        handleGenerateImage();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showTitles]);

  // Save picks to localStorage
  const savePicks = (newPicks: Record<string, Song>) => {
    setPicks(newPicks);
    localStorage.setItem('hasu_mypicks', JSON.stringify(newPicks));
  };

  const handleCellClick = (rowUnit: Unit, colClass: GradeClass) => {
    setActiveCell({ rowUnit, colClass });
    setShowModal(true);
  };

  const handleGlobalSearchClick = () => {
    setActiveCell(null);
    setShowModal(true);
  };

  const handleSelectSong = (song: Song) => {
    const newPicks = { ...picks };
    if (activeCell) {
      const cellKey = `${activeCell.rowUnit}_${activeCell.colClass}`;
      newPicks[cellKey] = song;
    } else {
      const cellKey = `${song.unit}_${song.class}`;
      newPicks[cellKey] = song;
    }
    savePicks(newPicks);
    setShowModal(false);
    setActiveCell(null);
  };

  const handleClearCell = (rowUnit: Unit, colClass: GradeClass, e: React.MouseEvent) => {
    e.stopPropagation();
    const cellKey = `${rowUnit}_${colClass}`;
    const newPicks = { ...picks };
    delete newPicks[cellKey];
    savePicks(newPicks);
  };

  const handleClearAllPicks = () => {
    if (window.confirm("Are you sure you want to clear all your picks?")) {
      savePicks({});
    }
  };

  const handleGenerateImage = async () => {
    if (generating) return;
    setGenerating(true);

    const originalGetComputedStyle = window.getComputedStyle;
    try {
      // Override global getComputedStyle temporarily to translate oklch/oklab to rgba
      window.getComputedStyle = function (elt, pseudoElt) {
        const styleDecl = originalGetComputedStyle.call(window, elt, pseudoElt);
        return new Proxy(styleDecl, {
          get(target: any, prop: string | symbol) {
            if (prop === 'getPropertyValue') {
              return function (propertyName: string) {
                const val = target.getPropertyValue(propertyName);
                return convertColorString(val);
              };
            }
            const val = Reflect.get(target, prop);
            if (typeof val === 'function') {
              return val.bind(target);
            }
            if (typeof val === 'string') {
              return convertColorString(val);
            }
            return val;
          }
        }) as any;
      };

      const html2canvas = (await import('html2canvas')).default;
      const exportElement = document.getElementById('mypick-export-canvas');
      if (exportElement) {
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const canvas = await html2canvas(exportElement, {
          useCORS: true,
          backgroundColor: '#FAF9F5',
          scale: 2,
          logging: false
        });

        const image = canvas.toDataURL('image/png');
        setPreviewUrl(image);
      }
    } catch (err) {
      console.error("Failed to generate image", err);
      alert("Failed to generate image. Please try again.");
    } finally {
      // Restore original getComputedStyle
      window.getComputedStyle = originalGetComputedStyle;
      setGenerating(false);
    }
  };

  const activeRowConfig = activeCell ? ROWS.find(r => r.id === activeCell.rowUnit) : undefined;
  const activeColConfig = activeCell ? COLS.find(c => c.id === activeCell.colClass) : undefined;

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 via-cyan-400 to-amber-400 shadow-md" />

      <Header />

      <Controls
        onClearAll={handleClearAllPicks}
        onGenerate={handleGenerateImage}
        onGlobalSearch={handleGlobalSearchClick}
        generating={generating}
        hasPicks={Object.keys(picks).length > 0}
        totalSongs={SONGS.length}
      />

      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 flex-1 flex flex-col">
        <Grid
          ref={gridRef}
          rows={ROWS}
          cols={COLS}
          picks={picks}
          onCellClick={handleCellClick}
          onClearCell={handleClearCell}
        />
      </main>

      <footer className="w-full py-8 mt-12 border-t border-slate-200/60 bg-white/40 backdrop-blur-sm text-center">
        <p className="text-xs text-slate-500 font-medium">
          Contact: <a href="mailto:hime@rurino.dev" className="text-pink-500 hover:text-pink-600 transition-colors hover:underline">hime@rurino.dev</a>
        </p>
      </footer>

      {showModal && (
        <SearchModal
          row={activeRowConfig}
          col={activeColConfig}
          songs={SONGS}
          onClose={() => setShowModal(false)}
          onSelect={handleSelectSong}
        />
      )}

      {previewUrl && (
        <PreviewModal
          previewUrl={previewUrl}
          onClose={() => setPreviewUrl(null)}
          showTitles={showTitles}
          onToggleShowTitles={setShowTitles}
          generating={generating}
        />
      )}

      {/* Hidden off-screen grid canvas container for absolute consistency & device-independence during export */}
      <div className="fixed -left-[9999px] -top-[9999px] overflow-hidden pointer-events-none select-none">
        <ExportGrid rows={ROWS} cols={COLS} picks={picks} showTitles={showTitles} />
      </div>
    </div>
  );
}
