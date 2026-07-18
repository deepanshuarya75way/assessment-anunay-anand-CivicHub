import { useState } from 'react';

interface CopilotProps {
  contextType: 'issue' | 'dashboard' | 'event';
  contextId?: string;
}

export default function ContextualAICopilot({ contextType }: CopilotProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const triggerAction = (actionName: string) => {
    setLoadingAction(actionName);
    setTimeout(() => setLoadingAction(null), 1500); // Mock processing
  };

  return (
    <div className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">AI Copilot</h3>
          <p className="text-xs text-slate-400">Contextual Assistance</p>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {contextType === 'issue' && (
          <>
            <CopilotAction 
              title="Summarize Discussion" 
              description="Get a quick 3-sentence brief of the thread."
              onClick={() => triggerAction('summarize')}
              isLoading={loadingAction === 'summarize'}
            />
            <CopilotAction 
              title="Draft Official Response" 
              description="Generate a professional public response based on current status."
              onClick={() => triggerAction('draft_response')}
              isLoading={loadingAction === 'draft_response'}
            />
            <CopilotAction 
              title="Recommend Reassignment" 
              description="Analyze issue text to suggest a better department fit."
              onClick={() => triggerAction('reassign')}
              isLoading={loadingAction === 'reassign'}
            />
          </>
        )}

        {contextType === 'dashboard' && (
          <>
            <CopilotAction 
              title="Analyze SLA Breaches" 
              description="Identify common patterns in recent missed SLAs."
              onClick={() => triggerAction('analyze_sla')}
              isLoading={loadingAction === 'analyze_sla'}
            />
            <CopilotAction 
              title="Workload Balancing" 
              description="Suggest reassignment of tickets to less burdened officers."
              onClick={() => triggerAction('workload')}
              isLoading={loadingAction === 'workload'}
            />
          </>
        )}
      </div>
    </div>
  );
}

function CopilotAction({ title, description, onClick, isLoading }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-900/50 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-colors group disabled:opacity-50"
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium text-slate-200 group-hover:text-indigo-400 transition-colors">{title}</span>
        {isLoading && <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>}
      </div>
      <p className="text-xs text-slate-400">{description}</p>
    </button>
  );
}
