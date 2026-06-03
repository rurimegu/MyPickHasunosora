'use client';

import { useState, useEffect, useRef } from 'react';
import { Unit, GradeClass, Song, RowConfig, ColConfig } from '../schema/song';
import { SONGS } from '../data/songs';
import Header from '../components/Header';
import Controls from '../components/Controls';
import Grid from '../components/Grid';
import SearchModal from '../components/SearchModal';
import ExportGrid from '../components/ExportGrid';

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

function oklabToRgb(L: number, a: number, b: number, alpha: number = 1): string {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const gamma = (c: number) => {
    if (c <= 0.0031308) return 12.92 * c;
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.05;
  };

  const rVal = Math.round(Math.max(0, Math.min(1, gamma(r_lin))) * 255);
  const gVal = Math.round(Math.max(0, Math.min(1, gamma(g_lin))) * 255);
  const bVal = Math.round(Math.max(0, Math.min(1, gamma(b_lin))) * 255);

  return `rgba(${rVal}, ${gVal}, ${bVal}, ${alpha})`;
}

function labToRgb(L: number, a: number, b: number, alpha: number = 1): string {
  // Standard D65 illuminant reference points
  const Xn = 0.95047;
  const Yn = 1.00000;
  const Zn = 1.08883;

  let fy = (L + 16) / 116;
  let fx = fy + a / 500;
  let fz = fy - b / 200;

  const e = 0.008856;
  const k = 903.3;

  let xr = fx * fx * fx > e ? fx * fx * fx : (116 * fx - 16) / k;
  let yr = L > 8 ? Math.pow((L + 16) / 116, 3) : L / k;
  let zr = fz * fz * fz > e ? fz * fz * fz : (116 * fz - 16) / k;

  let X = xr * Xn;
  let Y = yr * Yn;
  let Z = zr * Zn;

  // Convert XYZ to linear sRGB
  let r_lin = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  let g_lin = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  let b_lin = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;

  const gamma = (c: number) => {
    if (c <= 0.0031308) return 12.92 * c;
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.05;
  };

  const rVal = Math.round(Math.max(0, Math.min(1, gamma(r_lin))) * 255);
  const gVal = Math.round(Math.max(0, Math.min(1, gamma(g_lin))) * 255);
  const bVal = Math.round(Math.max(0, Math.min(1, gamma(b_lin))) * 255);

  return `rgba(${rVal}, ${gVal}, ${bVal}, ${alpha})`;
}

function lchToRgb(L: number, C: number, H: number, alpha: number = 1): string {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  return labToRgb(L, a, b, alpha);
}

function oklchToRgb(L: number, C: number, H: number, alpha: number = 1): string {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  return oklabToRgb(L, a, b, alpha);
}

function convertColorString(str: string): string {
  if (!str || typeof str !== 'string') return str;

  // 1. oklch
  const oklchRegex = /oklch\(\s*([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+(?:deg|rad|grad|turn)?)(?:\s*\/\s*([0-9.]+%?))?\s*\)/gi;
  let newStr = str.replace(oklchRegex, (match, pL, pC, pH, pA) => {
    const L = pL.endsWith('%') ? parseFloat(pL) / 100 : parseFloat(pL);
    const C = pC.endsWith('%') ? parseFloat(pC) / 100 : parseFloat(pC);
    let H = parseFloat(pH);
    if (pH.endsWith('rad')) H = (parseFloat(pH) * 180) / Math.PI;
    if (pH.endsWith('grad')) H = (parseFloat(pH) * 360) / 400;
    if (pH.endsWith('turn')) H = parseFloat(pH) * 360;

    let alpha = 1;
    if (pA) {
      alpha = pA.endsWith('%') ? parseFloat(pA) / 100 : parseFloat(pA);
    }
    return oklchToRgb(L, C, H, alpha);
  });

  // 2. oklab
  const oklabRegex = /oklab\(\s*([0-9.]+%?)\s+([-0-9.]+%?)\s+([-0-9.]+%?)(?:\s*\/\s*([0-9.]+%?))?\s*\)/gi;
  newStr = newStr.replace(oklabRegex, (match, pL, pa, pb, pA) => {
    const L = pL.endsWith('%') ? parseFloat(pL) / 100 : parseFloat(pL);
    const a = pa.endsWith('%') ? parseFloat(pa) / 100 : parseFloat(pa);
    const b = pb.endsWith('%') ? parseFloat(pb) / 100 : parseFloat(pb);

    let alpha = 1;
    if (pA) {
      alpha = pA.endsWith('%') ? parseFloat(pA) / 100 : parseFloat(pA);
    }
    return oklabToRgb(L, a, b, alpha);
  });

  // 3. lab
  const labRegex = /lab\(\s*([0-9.]+%?)\s+([-0-9.]+%?)\s+([-0-9.]+%?)(?:\s*\/\s*([0-9.]+%?))?\s*\)/gi;
  newStr = newStr.replace(labRegex, (match, pL, pa, pb, pA) => {
    const L = pL.endsWith('%') ? parseFloat(pL) : parseFloat(pL);
    const a = pa.endsWith('%') ? parseFloat(pa) : parseFloat(pa);
    const b = pb.endsWith('%') ? parseFloat(pb) : parseFloat(pb);

    let alpha = 1;
    if (pA) {
      alpha = pA.endsWith('%') ? parseFloat(pA) / 100 : parseFloat(pA);
    }
    return labToRgb(L, a, b, alpha);
  });

  // 4. lch
  const lchRegex = /lch\(\s*([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+(?:deg|rad|grad|turn)?)(?:\s*\/\s*([0-9.]+%?))?\s*\)/gi;
  newStr = newStr.replace(lchRegex, (match, pL, pC, pH, pA) => {
    const L = pL.endsWith('%') ? parseFloat(pL) : parseFloat(pL);
    const C = pC.endsWith('%') ? parseFloat(pC) : parseFloat(pC);
    let H = parseFloat(pH);
    if (pH.endsWith('rad')) H = (parseFloat(pH) * 180) / Math.PI;
    if (pH.endsWith('grad')) H = (parseFloat(pH) * 360) / 400;
    if (pH.endsWith('turn')) H = parseFloat(pH) * 360;

    let alpha = 1;
    if (pA) {
      alpha = pA.endsWith('%') ? parseFloat(pA) / 100 : parseFloat(pA);
    }
    return lchToRgb(L, C, H, alpha);
  });

  return newStr;
}

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
    <div className="flex-1 flex flex-col pb-20">
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

      <main className="max-w-7xl w-full mx-auto px-6 flex-1 flex flex-col">
        <Grid
          ref={gridRef}
          rows={ROWS}
          cols={COLS}
          picks={picks}
          onCellClick={handleCellClick}
          onClearCell={handleClearCell}
        />
      </main>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          {/* Overlay Backdrop */}
          <div 
            onClick={() => setPreviewUrl(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          {/* Modal Content Card */}
          <div className="w-full max-w-4xl glass-panel border border-black/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-black/5 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-950 tracking-wide">
                    Image Preview
                  </h3>
                  <p className="text-[10px] text-pink-500 mt-0.5 tracking-wider font-semibold">
                    This is exactly how your exported selection card will look.
                  </p>
                </div>
                
                {/* Option Toggle to Show Song Titles */}
                <label className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm cursor-pointer hover:bg-slate-50 select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={showTitles}
                    disabled={generating}
                    onChange={(e) => setShowTitles(e.target.checked)}
                    className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400 border-slate-300 transition cursor-pointer disabled:opacity-50"
                  />
                  <span className="text-xs font-bold text-slate-700">Show Song Titles</span>
                </label>
              </div>
              <button 
                onClick={() => setPreviewUrl(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-950 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                </svg>
              </button>
            </div>

            {/* Generated Image View Area */}
            <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-slate-50/30 max-h-[60vh] no-scrollbar relative">
              <img
                src={previewUrl}
                alt="Hasunosora Picks Preview"
                className={`max-w-full max-h-[50vh] object-contain rounded-2xl border border-black/10 shadow-lg transition-opacity duration-200 ${
                  generating ? 'opacity-50 blur-[2px]' : 'opacity-100'
                }`}
              />
              {generating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-pulse">
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating Preview...
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-5 bg-slate-50 border-t border-black/5 flex items-center justify-end gap-3.5">
              <button
                onClick={() => setPreviewUrl(null)}
                className="px-6 py-2.5 rounded-full text-xs font-medium border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = 'Hasunosora_MyPicks.png';
                  link.href = previewUrl;
                  link.click();
                }}
                className="px-7 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg hover:shadow-pink-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM2 18h16v2H2v-2z" />
                </svg>
                Download Image
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Hidden off-screen grid canvas container for absolute consistency & device-independence during export */}
      <div className="fixed -left-[9999px] -top-[9999px] overflow-hidden pointer-events-none select-none">
        <ExportGrid rows={ROWS} cols={COLS} picks={picks} showTitles={showTitles} />
      </div>
    </div>
  );
}
