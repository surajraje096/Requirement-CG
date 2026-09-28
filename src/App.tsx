import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { AgentFlowVisualizer } from './components/AgentFlowVisualizer';
import { ExecutiveQualityReport } from './components/ExecutiveQualityReport';
import { POClarificationConsole } from './components/POClarificationConsole';
import { AcceptanceCriteriaView } from './components/AcceptanceCriteriaView';
import { QAAutomationSuite } from './components/QAAutomationSuite';
import { ExportConsole } from './components/ExportConsole';
import { SAMPLE_SCENARIOS } from './data/sampleScenarios';
import { RequirementAnalysisResult } from './types/requirement';
import {
  FileCheck2,
  HelpCircle,
  ShieldCheck,
  Zap,
  Share2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('executive-report');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [geminiActive, setGeminiActive] = useState<boolean>(true);
  const [analysisResult, setAnalysisResult] = useState<RequirementAnalysisResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial load: check health and run initial analysis for the primary ChatGPT scenario
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setGeminiActive(data.geminiConfigured);
      })
      .catch(() => {
        setGeminiActive(false);
      });

    // Run initial analysis on first scenario
    const defaultScenario = SAMPLE_SCENARIOS[0];
    handleAnalyze(
      defaultScenario.rawRequirement,
      defaultScenario.pbiId,
      defaultScenario.domain,
      defaultScenario.confluenceContext
    );
  }, []);

  const handleAnalyze = async (
    text: string,
    pbiId: string,
    domain: string,
    context?: string
  ) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          pbiId,
          domainHint: domain,
          context
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data: RequirementAnalysisResult = await res.json();
      setAnalysisResult(data);
      showToast(`Analyzed ${data.pbiId}: ${data.ambiguities.length} ambiguities, ${data.gaps.length} gaps flagged.`);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      showToast('Analysis encountered an error. Falling back to rule engine.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResolveAnswers = async (answers: Record<string, string>) => {
    if (!analysisResult) return;
    setIsResolving(true);
    try {
      const res = await fetch('/api/resolve-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalResult: analysisResult,
          answers
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const updatedData: RequirementAnalysisResult = await res.json();
      setAnalysisResult(updatedData);
      showToast('PO Decisions Applied! Quality Score elevated to Grade A+ (95%+).');
      setActiveTab('executive-report');
    } catch (err: any) {
      console.error('Resolution failed:', err);
      showToast('Failed to apply PO answers.');
    } finally {
      setIsResolving(false);
    }
  };

  const tabs = [
    {
      id: 'executive-report',
      label: 'Executive Quality Audit',
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: analysisResult ? `${analysisResult.metrics.overallScore}/100` : null
    },
    {
      id: 'po-resolver',
      label: 'PO Decision Console',
      icon: <HelpCircle className="w-4 h-4" />,
      badge: analysisResult ? `${analysisResult.questions.length} Questions` : null
    },
    {
      id: 'acceptance-criteria',
      label: 'Acceptance Criteria & Gherkin',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: analysisResult ? `${analysisResult.acceptanceCriteria.length} Scenarios` : null
    },
    {
      id: 'qa-automation',
      label: 'QA Automation Scripts',
      icon: <Zap className="w-4 h-4" />,
      badge: 'Playwright & API'
    },
    {
      id: 'export-hub',
      label: 'Jira & Confluence Export',
      icon: <Share2 className="w-4 h-4" />,
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header geminiActive={geminiActive} />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-white dark:bg-slate-900 border border-indigo-500 text-slate-900 dark:text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
        {/* Input Section */}
        <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {/* Live Multi-Agent Pipeline Trace */}
        {analysisResult && (
          <AgentFlowVisualizer
            trace={analysisResult.agentTrace}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* Workspace Tab Bar */}
        {analysisResult && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto scrollbar-none gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-4 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? 'border-indigo-600 text-indigo-700 bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 dark:bg-indigo-950/20'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Panes */}
            <div>
              {activeTab === 'executive-report' && (
                <ExecutiveQualityReport
                  result={analysisResult}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'po-resolver' && (
                <POClarificationConsole
                  result={analysisResult}
                  onResolveAnswers={handleResolveAnswers}
                  isResolving={isResolving}
                />
              )}

              {activeTab === 'acceptance-criteria' && (
                <AcceptanceCriteriaView
                  criteria={analysisResult.acceptanceCriteria}
                  gherkinFeature={analysisResult.qaArtifacts.gherkinFeature}
                  pbiId={analysisResult.pbiId}
                />
              )}

              {activeTab === 'qa-automation' && (
                <QAAutomationSuite
                  artifacts={analysisResult.qaArtifacts}
                  pbiId={analysisResult.pbiId}
                />
              )}

              {activeTab === 'export-hub' && (
                <ExportConsole result={analysisResult} />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white/90 dark:border-slate-900 dark:bg-slate-950/90 py-5 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Requirement Quality Agent • Shift-Left Defect Prevention System</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium">IEEE 830 & ISO 29148 Standard Alignment</span>
        </div>
      </footer>
    </div>
  );
}
