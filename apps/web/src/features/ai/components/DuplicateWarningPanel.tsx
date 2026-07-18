import { AIInsight } from '@civichub/shared';
import { Link } from 'react-router-dom';

interface DuplicateWarningPanelProps {
  insight: AIInsight;
}

export default function DuplicateWarningPanel({ insight }: DuplicateWarningPanelProps) {
  if (insight.capability !== 'DUPLICATE_DETECTION' || !insight.result?.duplicates?.length) {
    return null;
  }

  const duplicates = insight.result.duplicates;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <div>
          <h3 className="font-bold text-amber-500">Similar Issues Detected</h3>
          <p className="text-sm text-amber-500/80">We found issues that match your report with {insight.confidence}% confidence.</p>
        </div>
      </div>

      <div className="space-y-3">
        {duplicates.map((dup: any) => (
          <div key={dup.issueId} className="bg-black/20 rounded-xl p-4 flex justify-between items-center">
            <div>
              <div className="text-sm text-slate-300">Potential duplicate issue ID: {dup.issueId}</div>
              <div className="text-xs text-slate-500">Similarity Score: {Math.round(dup.score * 100)}%</div>
            </div>
            <Link 
              to={`/issues/${dup.issueId}`}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Support Existing Issue
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
