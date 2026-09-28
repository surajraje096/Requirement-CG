import React, { useState } from 'react';
import { RequirementAnalysisResult } from '../types/requirement';
import { FileText, Copy, Check, Download, Share2, Layers, BookOpen, FileDown } from 'lucide-react';
import { exportExecutiveAuditPDF } from '../utils/pdfExport';

interface ExportConsoleProps {
  result: RequirementAnalysisResult;
}

export const ExportConsole: React.FC<ExportConsoleProps> = ({ result }) => {
  const [activeExportType, setActiveExportType] = useState<'jira' | 'confluence' | 'json'>('jira');
  const [copied, setCopied] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const getExportContent = () => {
    switch (activeExportType) {
      case 'jira':
        return result.qaArtifacts.jiraMarkdown;
      case 'confluence':
        return result.qaArtifacts.confluenceWikiMarkup;
      case 'json':
        return JSON.stringify(result, null, 2);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      exportExecutiveAuditPDF(result);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setTimeout(() => setIsExportingPDF(false), 800);
    }
  };

  const handleDownload = () => {
    const content = getExportContent();
    const ext = activeExportType === 'json' ? 'json' : 'txt';
    const mime = activeExportType === 'json' ? 'application/json' : 'text/plain';
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.pbiId.toLowerCase()}-${activeExportType}-audit.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors
        bg-white border border-slate-200
        dark:bg-slate-900 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Enterprise Jira & Confluence Export Hub
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Export the verified specification and quality audit directly into your team's tracking systems or download as PDF.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1 rounded-xl border flex items-center text-xs
            bg-slate-100 border-slate-200
            dark:bg-slate-950 dark:border-slate-800">
            <button
              onClick={() => setActiveExportType('jira')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeExportType === 'jira'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Jira Markdown</span>
            </button>
            <button
              onClick={() => setActiveExportType('confluence')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeExportType === 'confluence'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Confluence Wiki</span>
            </button>
            <button
              onClick={() => setActiveExportType('json')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeExportType === 'json'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Audit JSON</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer
              bg-white hover:bg-slate-50 border-slate-300 text-slate-700
              dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-xs cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .{activeExportType === 'json' ? 'json' : 'txt'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer disabled:opacity-60"
          >
            <FileDown className={`w-3.5 h-3.5 ${isExportingPDF ? 'animate-bounce' : ''}`} />
            <span>{isExportingPDF ? 'Generating...' : 'Export Executive PDF'}</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-xl border
        bg-slate-950 border-slate-800 text-slate-200">
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>{result.pbiId} • Formatted for {activeExportType.toUpperCase()}</span>
          <span>Shift-Left Quality Audit Report</span>
        </div>
        <pre className="p-5 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed selection:bg-indigo-600">
          {getExportContent()}
        </pre>
      </div>
    </div>
  );
};
