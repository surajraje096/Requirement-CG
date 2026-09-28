import React, { useState } from 'react';
import { AcceptanceCriterion } from '../types/requirement';
import { FileCode2, Copy, Check, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AcceptanceCriteriaViewProps {
  criteria: AcceptanceCriterion[];
  gherkinFeature: string;
  pbiId: string;
}

export const AcceptanceCriteriaView: React.FC<AcceptanceCriteriaViewProps> = ({
  criteria,
  gherkinFeature,
  pbiId
}) => {
  const [copiedFeature, setCopiedFeature] = useState(false);
  const [activeView, setActiveView] = useState<'cards' | 'gherkin'>('cards');

  const handleCopyFeature = () => {
    navigator.clipboard.writeText(gherkinFeature);
    setCopiedFeature(true);
    setTimeout(() => setCopiedFeature(false), 2000);
  };

  const handleDownloadFeature = () => {
    const blob = new Blob([gherkinFeature], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pbiId.toLowerCase()}-specs.feature`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'happy_path':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30';
      case 'negative_path':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30';
      case 'edge_case':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30';
      default:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controller */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 shadow-xs transition-colors
        bg-white border border-slate-200
        dark:bg-slate-900 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Acceptance Criteria & Gherkin Specifications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formulated using strict Given-When-Then BDD syntax for QA automation pipelines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl border flex items-center text-xs
            bg-slate-100 border-slate-200
            dark:bg-slate-950 dark:border-slate-800">
            <button
              onClick={() => setActiveView('cards')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                activeView === 'cards'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Structured Criteria ({criteria.length})
            </button>
            <button
              onClick={() => setActiveView('gherkin')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                activeView === 'gherkin'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Gherkin Feature (.feature)
            </button>
          </div>

          <button
            onClick={handleCopyFeature}
            className="px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer
              bg-white hover:bg-slate-50 border-slate-300 text-slate-700
              dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            {copiedFeature ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFeature ? 'Copied' : 'Copy Feature'}</span>
          </button>

          <button
            onClick={handleDownloadFeature}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.feature</span>
          </button>
        </div>
      </div>

      {/* Cards View */}
      {activeView === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteria.map((ac, idx) => (
            <div
              key={ac.id ? `${ac.id}-${idx}` : `ac-${idx}`}
              className="rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between
                bg-white border border-slate-200 hover:border-slate-300
                dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded
                      bg-indigo-50 text-indigo-700 border border-indigo-200
                      dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800/60">
                      {ac.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{ac.title}</h4>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTypeBadge(ac.type)}`}>
                    {ac.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div className="p-2.5 rounded-xl border flex items-start gap-2
                    bg-slate-50 border-slate-200
                    dark:bg-slate-950/80 dark:border-slate-800/80">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wide shrink-0 mt-0.5 text-amber-700 dark:text-amber-400">
                      GIVEN
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{ac.given}</span>
                  </div>

                  <div className="p-2.5 rounded-xl border flex items-start gap-2
                    bg-slate-50 border-slate-200
                    dark:bg-slate-950/80 dark:border-slate-800/80">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wide shrink-0 mt-0.5 text-cyan-700 dark:text-cyan-400">
                      WHEN
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{ac.when}</span>
                  </div>

                  <div className="p-2.5 rounded-xl border flex items-start gap-2
                    bg-slate-50 border-slate-200
                    dark:bg-slate-950/80 dark:border-slate-800/80">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wide shrink-0 mt-0.5 text-emerald-700 dark:text-emerald-400">
                      THEN
                    </span>
                    <span className="text-slate-900 dark:text-slate-200 font-medium leading-relaxed">{ac.then}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Deterministic & Testable
                </span>
                <span className="font-mono">ISO 29148 Verified</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Gherkin Code Viewer */
        <div className="rounded-2xl overflow-hidden shadow-xl border
          bg-slate-950 border-slate-800 text-slate-200">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-400 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              {pbiId.toLowerCase()}-specs.feature (Cucumber / SpecFlow Compatible)
            </span>
            <button
              onClick={handleCopyFeature}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-5 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed selection:bg-indigo-600">
            {gherkinFeature}
          </pre>
        </div>
      )}
    </div>
  );
};
