import { useState } from 'react';
import { AIInsight } from '@civichub/shared';

interface AiSuggestionsPanelProps {
  insight: AIInsight;
  onAccept: (result: any) => void;
  onReject: () => void;
}

export default function AiSuggestionsPanel({ insight, onAccept, onReject }: AiSuggestionsPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action: 'accept' | 'reject') => {
    setIsProcessing(true);
    try {
      if (action === 'accept') {
        await onAccept(insight.result);
      } else {
        await onReject();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-accent/30 rounded-2xl p-6 shadow-[0_0_15px_rgba(var(--accent-rgb),0.1)] mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-accent/20 rounded-lg text-accent">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h3 className="font-bold text-white flex items-center gap-2">
            AI Suggestion
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-slate-300">
              {insight.confidence}% Match
            </span>
          </h3>
          <p className="text-sm text-slate-400">Based on our analysis of your report.</p>
        </div>
      </div>

      <div className="bg-black/20 rounded-xl p-4 mb-4">
        {insight.capability === 'CLASSIFICATION' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Category</div>
              <div className="font-medium text-white">{insight.result.category}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Severity</div>
              <div className="font-medium text-white">{insight.result.severity}</div>
            </div>
          </div>
        )}
        {insight.capability === 'ROUTING' && (
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Recommended Department</div>
            <div className="font-medium text-white">{insight.result.department}</div>
            {insight.result.reasoning && (
              <p className="text-sm text-slate-400 mt-2">{insight.result.reasoning}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleAction('accept')}
          disabled={isProcessing}
          className="flex-1 py-2 px-4 bg-accent hover:bg-accent/90 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          Accept Suggestion
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={isProcessing}
          className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          Ignore
        </button>
      </div>
    </div>
  );
}
