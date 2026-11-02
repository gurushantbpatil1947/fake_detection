import React from 'react';
import { ShieldCheck, User as UserIcon, LogOut, Sparkles } from 'lucide-react';
import { User } from '../types/index.ts';

interface NavbarProps {
  currentTab: 'detector' | 'dashboard' | 'history' | 'methodology';
  onSelectTab: (tab: 'detector' | 'dashboard' | 'history' | 'methodology') => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenAuth,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => onSelectTab('detector')}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 shrink-0 cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30">
            <ShieldCheck className="h-5 w-5 text-indigo-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            TruthGuard
          </span>
        </button>

        {/* Zone 2: 4 Clean Single-Line Text Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectTab('detector')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              currentTab === 'detector'
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            News Detector
          </button>
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              currentTab === 'dashboard'
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              currentTab === 'history'
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Analysis History
          </button>
          <button
            onClick={() => onSelectTab('methodology')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              currentTab === 'methodology'
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Methodology
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
                <div className="h-7 w-7 rounded-full bg-slate-800 ring-1 ring-slate-700 flex items-center justify-center font-semibold text-slate-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium truncate max-w-[120px]">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                title="Sign out"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-sm shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>

      </div>

      {/* Mobile nav drawer */}
      <div className="flex md:hidden border-t border-slate-800/60 bg-slate-950 px-4 py-2 overflow-x-auto gap-4 text-xs">
        <button
          onClick={() => onSelectTab('detector')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'detector' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Detector
        </button>
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'dashboard' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onSelectTab('history')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'history' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          History
        </button>
        <button
          onClick={() => onSelectTab('methodology')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'methodology' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          Methodology
        </button>
      </div>
    </header>
  );
};
