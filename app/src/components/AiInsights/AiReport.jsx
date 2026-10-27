import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { marked } from 'marked';

export default function AiReport({ aiAnalysis, aiLoading, onGenerate }) {
  return (
    <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" /> Vitalist Health Clinical Summary
          </h2>
          <p className="text-xs text-slate-500">
            Automated longitudinal pattern detection &amp; symptom correlations.
          </p>
        </div>
        <button
          onClick={onGenerate}
          disabled={aiLoading}
          className="w-full sm:w-auto justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {aiLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{aiAnalysis ? 'Regenerate Analysis' : 'Generate AI Report'}</span>
        </button>
      </div>

      {aiAnalysis ? (
        <div 
          className="bg-blue-50/50 p-4 sm:p-5 rounded-xl border border-blue-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 markdown-content overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: marked.parse(aiAnalysis) }}
        />
      ) : (
        <div className="p-6 sm:p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 space-y-2">
          <Sparkles className="w-8 h-8 text-blue-400 mx-auto" />
          <p className="text-xs font-semibold">
            Click &quot;Generate AI Report&quot; to perform an automated clinical analysis on
            your logged health metrics.
          </p>
        </div>
      )}
    </div>
  );
}
