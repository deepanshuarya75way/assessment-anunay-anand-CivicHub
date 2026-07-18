import React, { useState } from 'react';
import { GlassNavbar } from '@civichub/ui';
import { CommunityFeed } from '../components/CommunityFeed';
import { CreatePostDialog } from '../components/CreatePostDialog';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';
import { Link } from 'react-router-dom';

export const DashboardLayout: React.FC = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { user } = useAuthStore();

  const sidebarItems = [
    { label: 'Feed', href: '/dashboard' },
    { label: 'Communities', href: '/communities' },
    { label: 'Events', href: '/events' },
    { label: 'Saved', href: '/saved' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      <GlassNavbar>
        <div className="flex justify-between items-center w-full">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">CivicHub</div>
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Home</Link>
            <Link to="/explore" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Explore</Link>
            <Link to="/notifications" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Notifications</Link>
          </div>
          <img src={(user as any)?.avatarUrl || 'https://via.placeholder.com/150'} alt="Avatar" className="w-8 h-8 rounded-full bg-slate-200" />
        </div>
      </GlassNavbar>
      
      <div className="pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <div className="space-y-2">
              {sidebarItems.map(item => (
                <Link key={item.label} to={item.href} className="block p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <main className="lg:col-span-3">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Community Feed</h1>
          </div>
          
          <CommunityFeed />
        </main>
      </div>

      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 p-4 rounded-full flex items-center justify-center"
      >
        <Plus size={24} />
      </button>

      <CreatePostDialog 
        isOpen={isCreatePostOpen} 
        onClose={() => setIsCreatePostOpen(false)} 
      />
    </div>
  );
};
