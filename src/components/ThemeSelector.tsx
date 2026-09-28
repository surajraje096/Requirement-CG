import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Sun, Moon, Palette, Check, Compass, Terminal, Shield, Flame } from 'lucide-react';

interface ThemeOption {
  id: ThemeMode;
  name: string;
  badge: string;
  icon: React.ReactNode;
  bgPreview: string;
  accentPreview: string;
}

const THEMES: ThemeOption[] = [
  {
    id: 'executive-navy',
    name: 'Executive Navy',
    badge: 'Stakeholder Presenter',
    icon: <Shield className="w-3.5 h-3.5 text-blue-400" />,
    bgPreview: 'bg-slate-900 border-blue-800',
    accentPreview: 'bg-blue-600'
  },
  {
    id: 'light',
    name: 'Enterprise Light',
    badge: 'Clean & Crisp',
    icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
    bgPreview: 'bg-white border-slate-300',
    accentPreview: 'bg-indigo-600'
  },
  {
    id: 'dark',
    name: 'Obsidian Midnight',
    badge: 'Deep Dark',
    icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />,
    bgPreview: 'bg-slate-900 border-slate-700',
    accentPreview: 'bg-indigo-500'
  },
  {
    id: 'nordic',
    name: 'Nordic Arctic',
    badge: 'Cool Slate',
    icon: <Compass className="w-3.5 h-3.5 text-sky-400" />,
    bgPreview: 'bg-slate-900 border-sky-800',
    accentPreview: 'bg-sky-500'
  },
  {
    id: 'cyber',
    name: 'QA Cyber Terminal',
    badge: 'DevOps Green',
    icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" />,
    bgPreview: 'bg-emerald-950 border-emerald-800',
    accentPreview: 'bg-emerald-500'
  },
  {
    id: 'sunset',
    name: 'Sunset Crimson',
    badge: 'Defect Hunter',
    icon: <Flame className="w-3.5 h-3.5 text-rose-400" />,
    bgPreview: 'bg-rose-950 border-rose-800',
    accentPreview: 'bg-rose-500'
  }
];

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, toggleLightDark, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentThemeObj = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="relative flex items-center gap-1.5" ref={dropdownRef}>
      {/* Quick 1-click Light / Dark toggle */}
      <button
        type="button"
        onClick={toggleLightDark}
        title={isDark ? 'Switch to Enterprise Light Theme' : 'Switch to Executive Theme'}
        className="p-1.5 rounded-lg border transition flex items-center justify-center cursor-pointer shadow-xs
          bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700
          dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600" />
        )}
      </button>

      {/* Theme Picker Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer shadow-xs
          bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800
          dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200"
      >
        <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span className="hidden sm:inline font-semibold">{currentThemeObj.name}</span>
        <span className="text-[10px] opacity-60">▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-68 rounded-xl border p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95
          bg-white border-slate-200 text-slate-900
          dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
          <div className="px-2 py-1.5 mb-1 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select App Theme
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
              6 Themes
            </span>
          </div>

          <div className="space-y-1">
            {THEMES.map((item) => {
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTheme(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-2.5 py-2 rounded-lg text-left text-xs transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1">
                      <div className={`w-3.5 h-3.5 rounded-full border ${item.bgPreview}`} />
                      <div className={`w-2 h-2 rounded-full ${item.accentPreview}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{item.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{item.badge}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
