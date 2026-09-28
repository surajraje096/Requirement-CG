import React from 'react';
import { AgentTraceStep } from '../types/requirement';
import { Bot, Search, AlertCircle, FileSpreadsheet, MessageSquare, Clock } from 'lucide-react';

interface AgentFlowVisualizerProps {
  trace: AgentTraceStep[];
  isAnalyzing: boolean;
}

export const AgentFlowVisualizer: React.FC<AgentFlowVisualizerProps> = ({ trace, isAnalyzing }) => {
  const getIcon = (agentName: string) => {
    if (agentName.includes('Parser')) return <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    if (agentName.includes('Ambiguity')) return <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />;
    if (agentName.includes('Gap')) return <Bot className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
    if (agentName.includes('Conflict')) return <AlertCircle className="w-4 h-4 text-orange-500 dark:text-orange-400" />;
    if (agentName.includes('Acceptance')) return <FileSpreadsheet className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
    return <MessageSquare className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />;
  };

  return (
    <div className="rounded-xl p-4 shadow-xs transition-colors duration-200
      bg-white border border-slate-200 text-slate-900
      dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Agentic Orchestration Pipeline Trace
          </span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          6 Specialized Agents Cooperating in Real-Time
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {trace.map((step, idx) => {
          const isFlagged = step.status === 'flagged';
          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border transition-all text-left flex flex-col justify-between ${
                isAnalyzing
                  ? 'bg-slate-100 border-slate-300 dark:bg-slate-800/40 dark:border-slate-700/60 animate-pulse'
                  : isFlagged
                  ? 'bg-rose-50/80 border-rose-200 hover:border-rose-300 dark:bg-rose-950/20 dark:border-rose-900/40 dark:hover:border-rose-700/60'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 dark:bg-slate-800/60 dark:border-slate-700/70 dark:hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1 rounded bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    {getIcon(step.agentName)}
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    isFlagged
                      ? 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                  }`}>
                    {isFlagged ? `${step.findingsCount} Flags` : 'Passed'}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{step.agentName}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{step.summary}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {step.durationMs}ms
                </span>
                <span className="font-mono text-indigo-600 dark:text-indigo-300 font-medium">Agent {idx + 1}/6</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
