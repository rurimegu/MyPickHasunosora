import React from 'react';

interface PreviewModalProps {
  previewUrl: string;
  onClose: () => void;
  showTitles: boolean;
  onToggleShowTitles: (show: boolean) => void;
  generating: boolean;
}

export default function PreviewModal({
  previewUrl,
  onClose,
  showTitles,
  onToggleShowTitles,
  generating,
}: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
      {/* Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      
      {/* Modal Content Card */}
      <div className="w-full max-w-4xl glass-panel border border-black/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 bg-white">
        
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
                onChange={(e) => onToggleShowTitles(e.target.checked)}
                className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400 border-slate-300 transition cursor-pointer disabled:opacity-50"
              />
              <span className="text-xs font-bold text-slate-700">Show Song Titles</span>
            </label>
          </div>
          <button 
            onClick={onClose}
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
            onClick={onClose}
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
  );
}
