import React, { useState } from 'react';
import { RequirementAnalysisResult } from '../types/requirement';
import {
  CheckCircle2,
  Sparkles,
  RefreshCw,
  UserCheck,
  Check
} from 'lucide-react';

interface POClarificationConsoleProps {
  result: RequirementAnalysisResult;
  onResolveAnswers: (answers: Record<string, string>) => Promise<void>;
  isResolving: boolean;
}

export const POClarificationConsole: React.FC<POClarificationConsoleProps> = ({
  result,
  onResolveAnswers,
  isResolving
}) => {
  const { questions } = result;

  // Initialize selected answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    questions.forEach((q) => {
      init[q.id] = q.resolvedAnswer || q.suggestedAnswers[0] || '';
    });
    return init;
  });

  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [showCustom, setShowCustom] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
    setShowCustom((prev) => ({ ...prev, [questionId]: false }));
  };

  const handleCustomChange = (questionId: string, val: string) => {
    setCustomInputs((prev) => ({ ...prev, [questionId]: val }));
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleSubmitAll = async () => {
    await onResolveAnswers(selectedAnswers);
  };

  const answeredCount = Object.keys(selectedAnswers).filter((k) => !!selectedAnswers[k]).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors
        bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 border border-indigo-200
        dark:bg-gradient-to-r dark:from-indigo-950/60 dark:via-slate-900 dark:to-slate-900 dark:border-indigo-800/40">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-600/20 dark:text-indigo-400 dark:border-indigo-500/30">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Product Owner Decision & Clarification Console
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
              Resolve requirement ambiguities before sprint kickoff. Select recommended business decisions or provide custom parameters, then re-synthesize the approved requirement.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider block text-slate-500 dark:text-slate-400">
              Decisions Ready
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {answeredCount} of {questions.length} Answered
            </span>
          </div>
          <button
            onClick={handleSubmitAll}
            disabled={isResolving}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-700/20 transition disabled:opacity-50 cursor-pointer"
          >
            {isResolving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Re-Synthesizing Spec...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Sign Off & Re-Synthesize Requirement</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const currentAnswer = selectedAnswers[q.id];
          const isCustomOpen = showCustom[q.id];

          return (
            <div
              key={q.id ? `${q.id}-${idx}` : `q-${idx}`}
              className="rounded-2xl p-5 shadow-xs transition-colors
                bg-white border border-slate-200 hover:border-slate-300
                dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded
                    bg-slate-100 text-slate-700 border border-slate-200
                    dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    Q-{idx + 1} • {q.id}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    q.priority === 'P1'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                      : q.priority === 'P2'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                      : 'bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30'
                  }`}>
                    {q.priority} Blocker
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Target: <strong className="text-slate-700 dark:text-slate-300">{q.targetRole}</strong>
                  </span>
                </div>

                {q.resolvedAnswer && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded
                    bg-emerald-50 text-emerald-700 border border-emerald-200
                    dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Signed Off in Spec</span>
                  </span>
                )}
              </div>

              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{q.question}</h4>
              <p className="text-xs mb-3 p-2.5 rounded-lg border leading-relaxed
                bg-slate-50 border-slate-200 text-slate-600
                dark:bg-slate-950 dark:border-slate-800/80 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-300">Engineering Rationale: </span>
                {q.context}
              </p>

              {/* Quick Answer Options */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider block mb-2 text-slate-500 dark:text-slate-400">
                  Select PO Decision or Enter Custom Policy:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {q.suggestedAnswers.map((opt, optIdx) => {
                    const isSelected = currentAnswer === opt && !isCustomOpen;
                    return (
                      <button
                        key={`${q.id}-opt-${optIdx}`}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-950 shadow-xs ring-1 ring-indigo-500/40 font-semibold dark:bg-indigo-950/60 dark:text-indigo-100'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setShowCustom((prev) => ({ ...prev, [q.id]: true }))}
                    className={`p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                      isCustomOpen
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-1 ring-indigo-500/40 dark:bg-indigo-950/60 dark:text-indigo-100'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>+ Custom Answer...</span>
                  </button>
                </div>

                {isCustomOpen && (
                  <div className="mt-2.5 flex gap-2">
                    <input
                      type="text"
                      value={customInputs[q.id] || ''}
                      onChange={(e) => handleCustomChange(q.id, e.target.value)}
                      placeholder="Type custom decision or numerical boundary..."
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs font-sans transition
                        bg-white border border-indigo-400 text-slate-900 focus:outline-none
                        dark:bg-slate-950 dark:border-indigo-500/50 dark:text-slate-200"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
