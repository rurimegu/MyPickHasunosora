"use client";

import React, { useState } from "react";
import { Song, RowConfig, ColConfig } from "../schema/song";

interface SearchModalProps {
  row: RowConfig | undefined;
  col: ColConfig | undefined;
  songs: Song[];
  onClose: () => void;
  onSelect: (song: Song) => void;
}

export default function SearchModal({
  row,
  col,
  songs,
  onClose,
  onSelect,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const normalizeStr = (str: string): string => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, "");
  };

  const filteredSongs = songs.filter((song) => {
    // Only show applicable songs (matching unit and class)
    if (row && song.unit !== row.id) return false;
    if (col && song.class !== col.id) return false;

    if (!searchQuery) return true;
    const q = normalizeStr(searchQuery);

    const titleJa = normalizeStr(song.title.ja);
    const titleRo = normalizeStr(song.title.romaji);
    const artistJa = normalizeStr(song.artist.ja);
    const artistRo = normalizeStr(song.artist.romaji);
    const lyricistJa = normalizeStr(song.lyricist.ja);
    const lyricistRo = normalizeStr(song.lyricist.romaji);
    const composerJa = normalizeStr(song.composer.ja);
    const composerRo = normalizeStr(song.composer.romaji);
    const arrangerJa = normalizeStr(song.arranger.ja);
    const arrangerRo = normalizeStr(song.arranger.romaji);

    return (
      titleJa.includes(q) ||
      titleRo.includes(q) ||
      artistJa.includes(q) ||
      artistRo.includes(q) ||
      lyricistJa.includes(q) ||
      lyricistRo.includes(q) ||
      composerJa.includes(q) ||
      composerRo.includes(q) ||
      arrangerJa.includes(q) ||
      arrangerRo.includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Modal Content Card */}
      <div className="w-full max-w-2xl glass-panel border border-black/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="text-lg font-bold text-slate-950 tracking-wide font-serif">
              {row ? `Select Song for ${row.name}` : "Global Song Search"}
            </h3>
            <p className="text-[10px] text-pink-500 mt-0.5 tracking-wider font-semibold">
              {col ? col.label : "All 103, 104, and 105期 Songs"}
            </p>
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

        {/* Search Input Area */}
        <div className="p-5 border-b border-black/5 bg-slate-50/30">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Title, Artist, Lyricist, Composer, Arranger, or Romaji..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full py-3 pl-11 pr-4 bg-white border border-slate-200 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500/20 rounded-2xl text-sm text-slate-900 placeholder-slate-400 transition-all duration-300 shadow-sm"
            />
            <svg
              className="w-4 h-4 absolute left-4 top-3.5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 no-scrollbar">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => {
              return (
                <div
                  key={`${song.title.romaji}_${song.unit}`}
                  onClick={() => {
                    const selection = window.getSelection()?.toString();
                    if (selection) return;
                    onSelect(song);
                  }}
                  className="p-3.5 rounded-2xl bg-white border border-slate-100 hover:border-pink-300 hover:bg-slate-50/50 cursor-pointer flex items-center gap-4 group transition-all duration-300 shadow-sm"
                >
                  {/* Cover Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-slate-100 flex-shrink-0 border border-slate-200">
                    <img
                      src={song.coverUrl}
                      alt={song.title.romaji}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-pink-600 transition-colors">
                        {song.title.ja}
                      </h4>
                      <span className="text-[9px] text-slate-500 font-semibold tracking-wider ml-2">
                        {song.class === 0
                          ? "103期"
                          : song.class === 1
                            ? "104期"
                            : "105期"}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                      {song.title.romaji} •{" "}
                      <span className="text-slate-700 font-semibold">
                        {song.artist.ja}
                      </span>
                    </div>

                    {/* Credits footer */}
                    <div className="flex items-center gap-x-2 gap-y-0.5 mt-2 pt-2 border-t border-slate-100 text-[8.5px] text-slate-400 truncate">
                      <span className="truncate flex-shrink-0">
                        <span className="font-bold tracking-wider text-pink-500/90 uppercase mr-1">
                          Lyricist
                        </span>
                        <span className="font-bold text-slate-600">
                          {song.lyricist.ja}
                        </span>
                      </span>
                      <span className="text-slate-200 font-light">|</span>
                      <span className="truncate flex-shrink-0">
                        <span className="font-bold tracking-wider text-cyan-600/90 uppercase mr-1">
                          Composer
                        </span>
                        <span className="font-bold text-slate-600">
                          {song.composer.ja}
                        </span>
                      </span>
                      <span className="text-slate-200 font-light">|</span>
                      <span className="truncate flex-shrink-0">
                        <span className="font-bold tracking-wider text-amber-500/90 uppercase mr-1">
                          Arranger
                        </span>
                        <span className="font-bold text-slate-600">
                          {song.arranger.ja}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 font-light text-xs">
              No songs found matching your search terms.
            </div>
          )}
        </div>

        {/* Modal Footer info */}
        <div className="p-4 bg-slate-50 border-t border-black/5 text-center text-[9px] text-slate-500 font-light">
          Found {filteredSongs.length} matching songs out of {songs.length}{" "}
          total.
        </div>
      </div>
    </div>
  );
}
