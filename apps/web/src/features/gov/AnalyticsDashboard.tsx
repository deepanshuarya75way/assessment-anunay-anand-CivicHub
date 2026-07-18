import { useState } from 'react';
import ContextualAICopilot from './ContextualAICopilot';

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('7d');

  return (
    <div className="h-full flex gap-6">
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Department Analytics</h2>
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="text-sm text-slate-400 mb-2">Total Issues</div>
            <div className="text-3xl font-bold text-white">1,284</div>
            <div className="text-sm text-emerald-400 mt-2">↑ 12% vs last period</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="text-sm text-slate-400 mb-2">Avg Resolution Time</div>
            <div className="text-3xl font-bold text-white">2.4 days</div>
            <div className="text-sm text-amber-400 mt-2">↓ 5% vs last period</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="text-sm text-slate-400 mb-2">SLA Compliance</div>
            <div className="text-3xl font-bold text-white">94.2%</div>
            <div className="text-sm text-emerald-400 mt-2">↑ 2.1% vs last period</div>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex-1 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
            <span className="text-slate-400">Pre-computed Time-Series Chart Placeholder</span>
          </div>
        </div>
      </div>

      <div className="w-96 flex flex-col">
        <ContextualAICopilot contextType="dashboard" />
      </div>
    </div>
  );
}
