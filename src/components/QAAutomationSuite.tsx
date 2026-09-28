import React, { useState } from 'react';
import { QAPipelineArtifacts } from '../types/requirement';
import { Terminal, Copy, Check, Download, Zap, Code2 } from 'lucide-react';

interface QAAutomationSuiteProps {
  artifacts: QAPipelineArtifacts;
  pbiId: string;
}

export const QAAutomationSuite: React.FC<QAAutomationSuiteProps> = ({ artifacts, pbiId }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'e2e' | 'api'>('e2e');
  const [copied, setCopied] = useState(false);

  const currentCode = activeCodeTab === 'e2e'
    ? artifacts.cypressOrPlaywrightTest
    : artifacts.apiTestScript;

  const currentFilename = activeCodeTab === 'e2e'
    ? `${pbiId.toLowerCase()}-e2e.spec.ts`
    : `${pbiId.toLowerCase()}-api.test.ts`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFilename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors
        bg-white border border-slate-200
        dark:bg-slate-900 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Automated QA Test Fixtures (Playwright / Jest)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Turn approved acceptance criteria directly into automated E2E and API regression tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl border flex items-center text-xs
            bg-slate-100 border-slate-200
            dark:bg-slate-950 dark:border-slate-800">
            <button
              onClick={() => setActiveCodeTab('e2e')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeCodeTab === 'e2e'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Playwright / Cypress E2E</span>
            </button>
            <button
              onClick={() => setActiveCodeTab('api')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeCodeTab === 'api'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Supertest / Jest API</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer
              bg-white hover:bg-slate-50 border-slate-300 text-slate-700
              dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .ts</span>
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="rounded-2xl overflow-hidden shadow-xl border
        bg-slate-950 border-slate-800 text-slate-200">
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-200 font-semibold">{currentFilename}</span>
          </div>
          <span>TypeScript • Ready to Execute in CI/CD</span>
        </div>
        <pre className="p-5 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed selection:bg-indigo-600">
          {currentCode}
        </pre>
      </div>
    </div>
  );
};
