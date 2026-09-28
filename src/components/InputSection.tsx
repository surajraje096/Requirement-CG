import React, { useState, useRef } from 'react';
import { SAMPLE_SCENARIOS, SampleScenario } from '../data/sampleScenarios';
import { parseUploadedDocument, ParsedDocumentResult } from '../utils/documentParser';
import {
  Sparkles,
  FileText,
  BookOpen,
  Layers,
  Info,
  Check,
  RefreshCw,
  Target,
  CheckCircle2,
  ListChecks,
  ShieldAlert,
  Upload,
  FileUp,
  X,
  FileCheck,
  FileDown,
  ArrowRight
} from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (text: string, pbiId: string, domain: string, context?: string) => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SAMPLE_SCENARIOS[0].id);
  const [pbiId, setPbiId] = useState<string>(SAMPLE_SCENARIOS[0].pbiId);
  const [domain, setDomain] = useState<string>(SAMPLE_SCENARIOS[0].domain);
  const [requirementText, setRequirementText] = useState<string>(SAMPLE_SCENARIOS[0].rawRequirement);
  const [confluenceContext, setConfluenceContext] = useState<string>(SAMPLE_SCENARIOS[0].confluenceContext || '');
  const [showContext, setShowContext] = useState<boolean>(false);
  const [isParsingDoc, setIsParsingDoc] = useState<boolean>(false);
  const [uploadedDoc, setUploadedDoc] = useState<ParsedDocumentResult | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeScenario = SAMPLE_SCENARIOS.find((s) => s.id === selectedScenarioId);

  const handleSelectScenario = (scenario: SampleScenario) => {
    setSelectedScenarioId(scenario.id);
    setPbiId(scenario.pbiId);
    setDomain(scenario.domain);
    setRequirementText(scenario.rawRequirement);
    setConfluenceContext(scenario.confluenceContext || '');
    setUploadedDoc(null);
    setUploadError(null);
  };

  const handleCustomMode = () => {
    setSelectedScenarioId('custom');
    setPbiId('PBI-2045');
    setDomain('Enterprise Software');
    setRequirementText('');
    setConfluenceContext('');
    setUploadedDoc(null);
    setUploadError(null);
  };

  const handleFileProcess = async (file: File) => {
    setIsParsingDoc(true);
    setUploadError(null);
    try {
      const parsed = await parseUploadedDocument(file);
      setUploadedDoc(parsed);
      setSelectedScenarioId('uploaded-doc');
      setRequirementText(parsed.text);
      if (parsed.detectedPbiId) setPbiId(parsed.detectedPbiId);
      if (parsed.detectedDomain) setDomain(parsed.detectedDomain);
    } catch (err: any) {
      console.error('File parsing error:', err);
      setUploadError(err.message || 'Failed to extract text from document');
    } finally {
      setIsParsingDoc(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleClearUploadedDoc = () => {
    setUploadedDoc(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    handleSelectScenario(SAMPLE_SCENARIOS[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirementText.trim() || isAnalyzing) return;
    onAnalyze(requirementText, pbiId, domain, confluenceContext);
  };

  return (
    <div className="rounded-2xl p-5 shadow-lg transition-colors duration-200
      bg-white border border-slate-200 text-slate-900
      dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md,.markdown,.json,.csv,.feature"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Source Ingestion Tabs: PBI vs BRD vs Confluence vs Combined */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Source Ingestion:
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
              1. PBI / User Story
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800">
              2. BRD Document (.docx / .pdf)
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
              3. Confluence Rules & Policies
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition cursor-pointer
                bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700
                dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:border-indigo-800 dark:text-indigo-300"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload BRD / PRD File</span>
            </button>
            <button
              type="button"
              onClick={handleCustomMode}
              className={`text-xs px-2.5 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                selectedScenarioId === 'custom'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              + Blank Input
            </button>
          </div>
        </div>

        {/* Preset Scenarios Quick Selector */}
        <div className="mt-3">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 block">
            Or test with industry benchmark scenarios:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_SCENARIOS.map((scenario) => {
              const isSelected = selectedScenarioId === scenario.id;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => handleSelectScenario(scenario)}
                  className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-500 shadow-sm dark:bg-indigo-950/40 dark:border-indigo-500/80 dark:shadow-md dark:shadow-indigo-950/40 ring-1 ring-indigo-500/50'
                      : 'bg-slate-50/90 border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-800/50 dark:border-slate-700/60 dark:hover:bg-slate-800 dark:hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded
                        bg-indigo-100 text-indigo-800 border border-indigo-200
                        dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800/60">
                        {scenario.pbiId}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded
                        bg-amber-100 text-amber-800 border border-amber-200
                        dark:bg-amber-950/30 dark:text-amber-400/90 dark:border-amber-900/40">
                        {scenario.badge}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 line-clamp-1">{scenario.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">{scenario.description}</p>
                  </div>
                  {isSelected && (
                    <div className="mt-2.5 flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <span>Active Scenario</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drag and Drop Zone / Upload Status Banner */}
        {uploadedDoc ? (
          <div className="mt-3.5 p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3
            bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Uploaded Document: {uploadedDoc.fileName}
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-300">
                    {(uploadedDoc.fileSize / 1024).toFixed(1)} KB
                  </span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Extracted {uploadedDoc.text.length} characters ({uploadedDoc.text.split(/\s+/).filter(Boolean).length} words). Ready for Quality Audit analysis.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-xs rounded-lg border font-medium transition cursor-pointer
                  bg-white hover:bg-emerald-100/50 border-emerald-300 text-emerald-800
                  dark:bg-slate-900 dark:border-emerald-800 dark:text-emerald-300"
              >
                Change Document
              </button>
              <button
                type="button"
                onClick={handleClearUploadedDoc}
                title="Remove uploaded document"
                className="p-1 rounded-lg text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-3.5 p-3 rounded-xl border border-dashed text-center transition cursor-pointer ${
              isDragging
                ? 'bg-indigo-50 border-indigo-500 scale-[1.01] dark:bg-indigo-950/40 dark:border-indigo-400'
                : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-300 dark:bg-slate-950/40 dark:hover:bg-slate-900/60 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <FileUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>
                {isParsingDoc ? 'Extracting text from document...' : 'Drag & drop your PRD, BRD, User Story, or Specification file here (.pdf, .docx, .txt, .md, .feature) or click to browse'}
              </span>
            </div>
            {uploadError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-semibold">{uploadError}</p>
            )}
          </div>
        )}

        {/* Highlighted Scenario Mission, Tasks & Benefits Card */}
        {activeScenario && (activeScenario.scenarioSummary || activeScenario.tasks) && (
          <div className="mt-3.5 p-4 rounded-xl border transition-all
            bg-gradient-to-r from-indigo-50/70 via-slate-50 to-emerald-50/50 border-indigo-200/80
            dark:bg-gradient-to-r dark:from-indigo-950/30 dark:via-slate-900 dark:to-emerald-950/20 dark:border-indigo-800/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Scenario */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-indigo-300">
                  <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                  <span>Scenario</span>
                </div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  {activeScenario.scenarioSummary || 'Many defects originate from unclear requirements.'}
                </p>
              </div>

              {/* Tasks */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-indigo-300">
                  <ListChecks className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Tasks</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-1">
                  {activeScenario.tasks ? (
                    activeScenario.tasks.map((task, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span className="leading-snug">{task}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>Analyze PBIs, BRDs, Confluence pages.</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>Detect ambiguous requirements.</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>Identify missing acceptance criteria.</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Benefits</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  {activeScenario.benefits ? (
                    activeScenario.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 font-medium text-emerald-800 dark:text-emerald-300">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold">
                          ✓
                        </span>
                        <span>{benefit}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-2 font-medium text-emerald-800 dark:text-emerald-300">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold">✓</span>
                        <span>Shift-left quality.</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium text-emerald-800 dark:text-emerald-300">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold">✓</span>
                        <span>Reduced requirement defects.</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              PBI / Ticket Identifier
            </label>
            <input
              type="text"
              value={pbiId}
              onChange={(e) => setPbiId(e.target.value)}
              placeholder="e.g. PAY-4028 or STORY-104"
              className="w-full px-3 py-1.5 rounded-lg text-xs font-mono transition
                bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white
                dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 dark:focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Target Business Domain
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. Fintech, Healthcare, E-Commerce"
              className="w-full px-3 py-1.5 rounded-lg text-xs transition
                bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white
                dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 dark:focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 rounded-lg border text-xs
              bg-slate-100 border-slate-200
              dark:bg-slate-950 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowContext(false)}
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  !showContext
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PBI & BRD Specification</span>
              </button>
              <button
                type="button"
                onClick={() => setShowContext(true)}
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  showContext
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>+ Confluence Architecture & Rules Page</span>
                {confluenceContext.trim() && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            </div>

            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Input: {requirementText.length} chars {confluenceContext.trim() ? `• Confluence: ${confluenceContext.length} chars` : ''}
            </span>
          </div>

          {/* Primary Requirement / PBI / BRD Textarea */}
          <div>
            <label className="text-xs font-semibold flex items-center justify-between mb-1 text-slate-800 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                1. PBI / User Story / BRD Specification Text
              </span>
              <span className="text-[11px] font-normal text-slate-400">
                Paste PBI tickets, User Stories, or uploaded BRD sections here
              </span>
            </label>
            <textarea
              rows={3}
              value={requirementText}
              onChange={(e) => setRequirementText(e.target.value)}
              placeholder="e.g. A user should be able to transfer money quickly to another account..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-sans leading-relaxed resize-y transition
                bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white
                dark:bg-slate-950 dark:border-slate-700/80 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-500/50"
            />
          </div>

          {/* Confluence Specification & Policy Constraints */}
          {showContext && (
            <div className="p-3.5 rounded-xl space-y-1.5 transition border
              bg-amber-50/50 border-amber-200
              dark:bg-slate-950/80 dark:border-amber-900/40">
              <label className="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-300">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  2. Confluence Page Architecture & Business Rules Context
                </span>
                <span className="text-[10px] font-normal text-amber-700 dark:text-amber-400">
                  Used by Rule Conflict Agent to highlight contradictions
                </span>
              </label>
              <textarea
                rows={2}
                value={confluenceContext}
                onChange={(e) => setConfluenceContext(e.target.value)}
                placeholder="Paste relevant Confluence architecture pages, security policies, compliance regulations, or API limits to detect rule conflicts..."
                className="w-full px-3 py-2 rounded-lg text-xs font-sans transition
                  bg-white border border-amber-300/80 text-slate-900 focus:outline-none focus:border-amber-500
                  dark:bg-slate-900 dark:border-amber-900/60 dark:text-slate-200"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>
              The agent will flag vague phrases, missing acceptance criteria, rule conflicts, and generate Gherkin scenarios.
            </span>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || !requirementText.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Running Multi-Agent Audit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Run Quality Audit & Agent Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* 3-Step Workflow & Download Guide */}
        <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800">
            <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Upload Document or Paste</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Drag in PDF, Word (.docx), Markdown, or paste draft text.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800">
            <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Run Quality Audit</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">6 cooperating agents detect ambiguities, gaps, and rule conflicts.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Download & Export</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Export Executive PDF, Jira Markdown, Confluence Wiki, Gherkin & Tests.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
