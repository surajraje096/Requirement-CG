import React from 'react';
import { ShieldAlert, Sparkles, Cpu } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

interface HeaderProps {
  geminiActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ geminiActive }) => {
  return (
    <header className="border-b sticky top-0 z-40 backdrop-blur-md transition-colors duration-200
      bg-white/90 border-slate-200 shadow-xs
      dark:bg-slate-900/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-black/5 dark:ring-white/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Requirement Quality Agent
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full
                bg-indigo-50 text-indigo-700 border border-indigo-200
                dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">
                Shift-Left AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated Requirement Gap & Ambiguity Detection • PO Clarifications • Gherkin QA Pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
            bg-slate-100/80 border-slate-200 text-slate-700
            dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Agent Engine:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Orchestrator v2.4</span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${
            geminiActive 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300' 
              : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300'
          }`}>
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500 dark:text-amber-300" />
            <span className="hidden sm:inline">{geminiActive ? 'Gemini 3.8 Flash' : 'Hybrid Rule Engine'}</span>
          </div>

          {/* Theme Selector */}
          <div className="pl-1 border-l border-slate-200 dark:border-slate-800">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </header>
  );
};

