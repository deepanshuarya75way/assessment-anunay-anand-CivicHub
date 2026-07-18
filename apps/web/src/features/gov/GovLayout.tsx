import { Outlet, Navigate } from 'react-router-dom';

// Assuming we have an auth hook
const useAuth = () => {
  return {
    user: { role: 'GOV_ADMIN', name: 'Officer Smith' },
    isLoading: false
  };
};

export default function GovLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="p-8 text-white">Loading Government Portal...</div>;

  if (!user || !['SUPER_ADMIN', 'GOV_ADMIN', 'DEPT_HEAD', 'SUPERVISOR', 'OFFICER', 'INSPECTOR'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-white font-sans">
      {/* Gov Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            CivicOps Portal
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <a href="/gov" className="flex items-center px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
                <span className="font-medium">Department Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/gov/map" className="flex items-center px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
                <span className="font-medium">Geographic Operations</span>
              </a>
            </li>
            <li>
              <a href="/gov/analytics" className="flex items-center px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
                <span className="font-medium">Analytics</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-700 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-slate-400">{user.role}</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 flex items-center justify-between px-8 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 z-10">
          <h1 className="text-lg font-semibold">Workspace</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto bg-slate-900 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
