import { useState } from 'react';
import ContextualAICopilot from './ContextualAICopilot';

export default function CaseWorkspace() {
  const [activeTab, setActiveTab] = useState('discussion');

  return (
    <div className="h-full flex gap-6">
      {/* Main Column */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Issue Header */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider">High Priority</span>
                <span className="text-slate-400 text-sm">Issue #4928</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Massive pothole on 4th and Main</h2>
              <p className="text-slate-300">Reported 2 hours ago by Citizen Jane. It&apos;s causing traffic delays and vehicle damage.</p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">
              Update Status
            </button>
          </div>
          <div className="flex gap-6 border-t border-slate-700 pt-4 mt-4">
            <div>
              <div className="text-xs text-slate-500 uppercase">Assigned To</div>
              <div className="font-medium text-white">Officer Smith (Public Works)</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase">SLA Status</div>
              <div className="font-medium text-emerald-400">Response Met (22h left for Resolution)</div>
            </div>
          </div>
        </div>

        {/* Workspace Tabs */}
        <div className="flex-1 bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
          <div className="flex border-b border-slate-700 bg-slate-800">
            {['discussion', 'inspections', 'timeline', 'official_response'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab 
                    ? 'border-b-2 border-indigo-500 text-indigo-400 bg-slate-800/50' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'discussion' && (
              <div className="space-y-6">
                {/* Mock comments */}
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                  <div className="font-medium text-sm text-indigo-400 mb-1">Citizen Jane</div>
                  <p className="text-slate-300">I almost popped my tire on this!</p>
                </div>
              </div>
            )}
            {activeTab === 'inspections' && (
              <div className="text-slate-400 flex items-center justify-center h-full">
                No inspections scheduled yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar: AI Copilot */}
      <div className="w-96 flex flex-col">
        <ContextualAICopilot contextType="issue" contextId="4928" />
      </div>
    </div>
  );
}
