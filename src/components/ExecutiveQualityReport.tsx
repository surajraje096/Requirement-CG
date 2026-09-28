import React, { useState } from 'react';
import { RequirementAnalysisResult } from '../types/requirement';
import { exportExecutiveAuditPDF } from '../utils/pdfExport';
import {
  AlertTriangle,
  AlertCircle,
  ListChecks,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  TrendingDown,
  Sparkles,
  SlidersHorizontal,
  SplitSquareVertical,
  FileDown,
  Printer,
  ShieldCheck,
  Share2
} from 'lucide-react';

interface ExecutiveQualityReportProps {
  result: RequirementAnalysisResult;
  onNavigateTab: (tabId: string) => void;
}

export const ExecutiveQualityReport: React.FC<ExecutiveQualityReportProps> = ({ result, onNavigateTab }) => {
  const [copiedClarified, setCopiedClarified] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [showDiff, setShowDiff] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const { metrics, ambiguities, gaps, conflicts, suggestedClarifiedRequirement } = result;

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

  const handlePrint = () => {
    window.print();
  };

  const handleCopyClarified = () => {
    navigator.clipboard.writeText(suggestedClarifiedRequirement);
    setCopiedClarified(true);
    setTimeout(() => setCopiedClarified(false), 2000);
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) {
      return 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-950/80 dark:border-emerald-500/40';
    }
    if (grade.startsWith('B')) {
      return 'text-cyan-700 bg-cyan-50 border-cyan-300 dark:text-cyan-400 dark:bg-cyan-950/80 dark:border-cyan-500/40';
    }
    if (grade.startsWith('C')) {
      return 'text-amber-700 bg-amber-50 border-amber-300 dark:text-amber-400 dark:bg-amber-950/80 dark:border-amber-500/40';
    }
    return 'text-rose-700 bg-rose-50 border-rose-300 dark:text-rose-400 dark:bg-rose-950/80 dark:border-rose-500/40';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'bg-amber-500 text-amber-600 dark:text-amber-400';
    return 'bg-rose-500 text-rose-600 dark:text-rose-400';
  };

  const filteredAmbiguities = ambiguities.filter(a => activeFilter === 'all' || a.severity === activeFilter);
  const filteredGaps = gaps.filter(g => activeFilter === 'all' || g.severity === activeFilter);

  return (
    <div className="space-y-6">
      {/* Executive Report Header & Action Bar */}
      <div className="rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors
        bg-white border border-slate-200 text-slate-900
        dark:bg-slate-900 dark:border-slate-800 dark:text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                {result.pbiId}
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Executive Quality Audit Report
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Shift-Left Defect Risk Assessment & ISO 29148 / IEEE 830 Quality Index for Stakeholders
            </p>
          </div>
        </div>

        {/* Stakeholder Action Buttons: Export PDF & Print */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            title="Print or Save to Local PDF via Browser"
            className="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer
              bg-white hover:bg-slate-50 border-slate-200 text-slate-700
              dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm
              bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60 disabled:cursor-not-allowed
              dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            <FileDown className={`w-4 h-4 ${isExportingPDF ? 'animate-bounce' : ''}`} />
            <span>{isExportingPDF ? 'Generating PDF...' : 'Export Executive PDF'}</span>
          </button>
        </div>
      </div>
      {/* Top Metric Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Quality Score */}
        <div className="rounded-2xl p-5 shadow-sm flex items-center justify-between transition-colors
          bg-white border border-slate-200 text-slate-900
          dark:bg-slate-900 dark:border-slate-800 dark:text-white">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider block text-slate-500 dark:text-slate-400">
              Quality Index
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
                {metrics.overallScore}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">/ 100</span>
            </div>
            <div className="mt-2 w-32 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${getScoreColor(metrics.overallScore).split(' ')[0]}`}
                style={{ width: `${metrics.overallScore}%` }}
              />
            </div>
          </div>
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-2xl shadow-xs ${getGradeColor(metrics.grade)}`}>
            {metrics.grade}
          </div>
        </div>

        {/* Defect Leakage Risk */}
        <div className="rounded-2xl p-5 shadow-sm transition-colors
          bg-white border border-slate-200 text-slate-900
          dark:bg-slate-900 dark:border-slate-800 dark:text-white">
          <span className="text-xs font-semibold uppercase tracking-wider block text-slate-500 dark:text-slate-400">
            Defect Leakage Risk
          </span>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
              metrics.defectLeakageRisk === 'High'
                ? 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                : metrics.defectLeakageRisk === 'Moderate'
                ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
            }`}>
              {metrics.defectLeakageRisk} Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {metrics.riskSummary}
          </p>
        </div>

        {/* Shift-Left Rework Savings */}
        <div className="rounded-2xl p-5 shadow-sm transition-colors
          bg-white border border-slate-200 text-slate-900
          dark:bg-slate-900 dark:border-slate-800 dark:text-white">
          <span className="text-xs font-semibold uppercase tracking-wider block text-slate-500 dark:text-slate-400">
            Shift-Left Rework Saved
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
              ~{metrics.estimatedReworkHours}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">hours QA/Dev</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Eliminates sprint churn & bug reopening</span>
          </div>
        </div>

        {/* Audit Finding Counts */}
        <div className="rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-colors
          bg-white border border-slate-200 text-slate-900
          dark:bg-slate-900 dark:border-slate-800 dark:text-white">
          <span className="text-xs font-semibold uppercase tracking-wider block text-slate-500 dark:text-slate-400">
            Audit Flag Summary
          </span>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="text-center p-1.5 rounded-lg bg-rose-50 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/40">
              <span className="block text-lg font-bold text-rose-600 dark:text-rose-400 font-mono">{ambiguities.length}</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Ambiguities</span>
            </div>
            <div className="text-center p-1.5 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/40">
              <span className="block text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">{gaps.length}</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Gaps</span>
            </div>
            <div className="text-center p-1.5 rounded-lg bg-orange-50 border border-orange-200 dark:bg-orange-950/30 dark:border-orange-900/40">
              <span className="block text-lg font-bold text-orange-600 dark:text-orange-400 font-mono">{conflicts.length}</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Conflicts</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('po-resolver')}
            className="mt-2 text-[11px] text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium flex items-center justify-end gap-1 transition cursor-pointer"
          >
            <span>Resolve with PO</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Core Agent Tasks & Shift-Left Value Matrix */}
      <div className="rounded-2xl p-5 border shadow-xs transition-all
        bg-gradient-to-r from-slate-50 via-indigo-50/20 to-emerald-50/20 border-slate-200
        dark:bg-gradient-to-r dark:from-slate-900 dark:via-indigo-950/20 dark:to-emerald-950/20 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Agent Audit Missions & Shift-Left Deliverables
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
              ✓ Benefit: Shift-Left Quality
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
              ✓ Benefit: Reduced Requirement Defects
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Task 1: Detect Ambiguous Requirements */}
          <div className="p-3.5 rounded-xl border bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  Detect Ambiguous Requirements
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  {ambiguities.length} Flagged
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Detects vague adjectives, subjective latency ("quickly"), and non-testable boundaries in PBIs and BRDs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('all');
                document.getElementById('findings-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-3 text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Inspect Ambiguities</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Task 2: Identify Missing Acceptance Criteria */}
          <div className="p-3.5 rounded-xl border bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5 text-amber-500" />
                  Identify Missing Acceptance Criteria
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {gaps.length} Gaps
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Catches unhandled negative flows, error recovery, API timeouts, and missing boundary value validations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('acceptance-criteria')}
              className="mt-3 text-[11px] font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Generated BDD Criteria</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Task 3: Highlight Conflicting Business Rules */}
          <div className="p-3.5 rounded-xl border bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-orange-700 dark:text-orange-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                  Highlight Conflicting Business Rules
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                  {conflicts.length} Rules
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Resolves direct contradictions between Confluence architecture guidelines and active Jira PBI constraints.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                document.getElementById('conflicts-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-3 text-[11px] font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Examine Contradictions</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Task 4: Suggest Clarifications for Product Owners */}
          <div className="p-3.5 rounded-xl border bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Suggest Clarifications for POs
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  {result.questions.length} Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Delivers prioritized multiple-choice questions for 1-click PO sign-off and instant requirement re-synthesis.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('po-resolver')}
              className="mt-3 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Open PO Clarification Console</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 5 Quality Dimensions Meter Grid */}
      <div className="rounded-2xl p-5 shadow-sm transition-colors
        bg-white border border-slate-200 text-slate-900
        dark:bg-slate-900 dark:border-slate-800 dark:text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-800 dark:text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Requirement Quality Dimensions (Shift-Left Criteria)
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">IEEE 830 / ISO 29148 Standard Alignment</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { name: 'Completeness', data: metrics.completeness },
            { name: 'Testability', data: metrics.testability },
            { name: 'Clarity', data: metrics.clarity },
            { name: 'Consistency', data: metrics.consistency },
            { name: 'Traceability', data: metrics.traceability },
          ].map((dim, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border flex flex-col justify-between transition-colors
              bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{dim.name}</span>
                  <span className={`text-xs font-bold font-mono ${getScoreColor(dim.data.score).split(' ')[1]}`}>
                    {dim.data.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-700 ${getScoreColor(dim.data.score).split(' ')[0]}`}
                    style={{ width: `${dim.data.score}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-3">
                {dim.data.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Clarified Requirement Hero Card */}
      <div className="rounded-2xl p-5 shadow-md relative overflow-hidden transition-colors
        bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border border-indigo-200
        dark:bg-gradient-to-br dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 dark:border-indigo-500/40">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Suggested Clarified Requirement</h3>
              <p className="text-xs text-slate-600 dark:text-indigo-200/70">
                Unambiguous, audit-ready version incorporating quantifiable parameters and error paths
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiff(!showDiff)}
              className="px-2.5 py-1 text-xs rounded-lg border flex items-center gap-1.5 transition cursor-pointer
                bg-white hover:bg-slate-50 border-slate-300 text-slate-700
                dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              <SplitSquareVertical className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{showDiff ? 'Standard View' : 'Compare with Original'}</span>
            </button>
            <button
              onClick={handleCopyClarified}
              className="px-3 py-1 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              {copiedClarified ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedClarified ? 'Copied to Clipboard!' : 'Copy Clarified Text'}</span>
            </button>
          </div>
        </div>

        {showDiff ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-950/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">
                Original Input (Ambiguous & Incomplete)
              </span>
              <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-sans">{result.originalText}</p>
            </div>
            <div className="p-3.5 rounded-xl border bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                Synthesized Specification (Quantified & Testable)
              </span>
              <p className="text-xs text-emerald-900 dark:text-emerald-200/90 leading-relaxed font-sans">{suggestedClarifiedRequirement}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border mt-2
            bg-white border-indigo-200 shadow-xs
            dark:bg-slate-950/80 dark:border-indigo-900/50">
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium">
              "{suggestedClarifiedRequirement}"
            </p>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Eliminates subjective terms • Ready for Jira backlog commitment</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('po-resolver')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Simulate Product Owner Sign-off</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Finding Tabs */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-800 dark:text-slate-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            Detailed Findings & Defect Prevention Breakdown
          </h3>

          <div className="flex items-center gap-1 p-1 rounded-lg border text-xs
            bg-slate-100 border-slate-200
            dark:bg-slate-900 dark:border-slate-800">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-0.5 rounded-md font-medium transition cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All Severities
            </button>
            <button
              onClick={() => setActiveFilter('high')}
              className={`px-2.5 py-0.5 rounded-md font-medium transition cursor-pointer ${
                activeFilter === 'high'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              High Severity Only
            </button>
            <button
              onClick={() => setActiveFilter('medium')}
              className={`px-2.5 py-0.5 rounded-md font-medium transition cursor-pointer ${
                activeFilter === 'medium'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Medium
            </button>
          </div>
        </div>

        {/* Section 1: Ambiguities */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Ambiguities Flagged ({filteredAmbiguities.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAmbiguities.map((item, idx) => (
              <div key={item.id ? `${item.id}-${idx}` : `amb-${idx}`} className="p-4 rounded-xl border transition
                bg-white border-slate-200 hover:border-slate-300 shadow-xs
                dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded
                      bg-slate-100 text-slate-600 border border-slate-200
                      dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                      {item.id}
                    </span>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded
                      bg-rose-50 text-rose-700 border border-rose-200
                      dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900/50">
                      "{item.phrase}"
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    item.severity === 'high'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                      : 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                  }`}>
                    {item.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">{item.explanation}</p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-[11px]">
                  <div className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-300">QA Impact: </span>
                    {item.impactOnQA}
                  </div>
                  <div className="p-2 rounded-lg border font-medium
                    bg-indigo-50 border-indigo-100 text-indigo-900
                    dark:bg-indigo-950/30 dark:border-indigo-900/40 dark:text-indigo-300">
                    <span className="font-bold text-indigo-700 dark:text-indigo-200">Recommended Fix: </span>
                    {item.suggestedClarification}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Gaps */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Missing Acceptance Criteria & Gaps ({filteredGaps.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredGaps.map((item, idx) => (
              <div key={item.id ? `${item.id}-${idx}` : `gap-${idx}`} className="p-4 rounded-xl border transition
                bg-white border-slate-200 hover:border-slate-300 shadow-xs
                dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded
                      bg-slate-100 text-slate-600 border border-slate-200
                      dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                      {item.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">{item.title}</h4>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    item.severity === 'high'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                      : 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                  }`}>
                    {item.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">{item.description}</p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] p-2 rounded-lg border
                  bg-amber-50 border-amber-200 text-amber-900
                  dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-300/90">
                  <span className="font-bold text-amber-800 dark:text-amber-200">Suggested Addition: </span>
                  {item.suggestedAddition}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Conflicts */}
        {conflicts.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold flex items-center gap-1.5 text-orange-700 dark:text-orange-300">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Conflicting Business Rules ({conflicts.length})
            </span>

            <div className="space-y-3">
              {conflicts.map((item, idx) => (
                <div key={item.id ? `${item.id}-${idx}` : `conf-${idx}`} className="p-4 rounded-xl border
                  bg-white border-orange-200 dark:bg-slate-900 dark:border-orange-900/40">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-xs font-bold text-orange-800 dark:text-orange-200">{item.title}</h4>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded
                      bg-orange-100 text-orange-800 border border-orange-200
                      dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30">
                      Rule Conflict
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">{item.explanation}</p>
                  <div className="p-2.5 rounded-lg border text-[11px]
                    bg-slate-50 border-slate-200 text-slate-800
                    dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300">
                    <span className="font-bold text-indigo-600 dark:text-indigo-300">Recommended Resolution: </span>
                    {item.recommendedResolution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
