import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'detector' | 'dashboard' | 'history' | 'methodology') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 mt-16 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
              <span className="font-bold text-white text-base tracking-tight">TruthGuard</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              AI-Powered Fake News Detection & Explainable Linguistic Forensics System. Built for academic fact-checking, transparency, and calibrated uncertainty.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <button
              onClick={() => onSelectTab('detector')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              News Detector
            </button>
            <button
              onClick={() => onSelectTab('dashboard')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Analytics Dashboard
            </button>
            <button
              onClick={() => onSelectTab('history')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Audit History
            </button>
            <button
              onClick={() => onSelectTab('methodology')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Engineering Methodology
            </button>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>TruthGuard AI</span>
            <span aria-hidden="true">·</span>
            <span>NLP & Transformer Pipeline</span>
            <span aria-hidden="true">·</span>
            <span>Google Gemini Integration</span>
          </div>
          <div>
            <span>Evaluative Forensic Prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
