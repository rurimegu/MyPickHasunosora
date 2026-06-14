import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-12 border-t border-slate-200/60 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 px-4">
      {/* Contact Capsule */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/50 text-xs text-slate-600">
        <span className="font-semibold text-slate-500">Contact</span>
        <span className="text-slate-300">|</span>
        <a
          href="mailto:hime@rurino.dev"
          className="text-pink-500 hover:text-pink-600 transition-colors hover:underline font-medium"
        >
          hime@rurino.dev
        </a>
      </div>

      {/* Disclaimers */}
      <div className="max-w-2xl text-center text-[11px] leading-relaxed text-slate-400 font-normal">
        <p>
          Unofficial Fan Selection Board. Song titles, logos, and images belong to their respective rights holders.
        </p>
        <p>
          This site doesn't collect any information other than web analytics provided by{" "}
          <a
            href="https://www.cloudflare.com/web-analytics/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-pink-500 transition-colors underline decoration-slate-300 hover:decoration-pink-500"
          >
            Cloudflare
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
