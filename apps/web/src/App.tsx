import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import logoUrl from './assets/logo.png';
import LoginPage from './pages/auth/LoginPage';
import DesignPlayground from './pages/DesignPlayground';
import ProfilePage from './pages/identity/ProfilePage';
import CommunityPage from './pages/communities/CommunityPage';
import CreateCommunityPage from './pages/communities/CreateCommunityPage';
import SearchPage from './pages/discovery/SearchPage';
import ExplorePage from './pages/discovery/ExplorePage';
import HashtagPage from './pages/discovery/HashtagPage';
import SearchOverlay from './features/discovery/components/SearchOverlay';
import { useAuthStore } from './stores/auth.store';
import ReportIssuePage from './pages/civic/ReportIssuePage';
import IssueDetailsPage from './pages/civic/IssueDetailsPage';
import DepartmentPage from './pages/civic/DepartmentPage';
import VolunteerDashboardPage from './pages/volunteer/VolunteerDashboardPage';
import VolunteerProfilePage from './pages/volunteer/VolunteerProfilePage';
import CampaignDirectoryPage from './pages/campaigns/CampaignDirectoryPage';
import CampaignDetailsPage from './pages/campaigns/CampaignDetailsPage';
import EventDirectoryPage from './pages/events/EventDirectoryPage';
import EventDetailsPage from './pages/events/EventDetailsPage';
import EventCalendarPage from './pages/events/EventCalendarPage';
import OrganizerDashboardPage from './pages/events/OrganizerDashboardPage';
import LandingPage from './pages/marketing/LandingPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  GlassButton, 
  Avatar, 
  AvatarFallback, 
  CivicIcon, 
  BottomSheet 
} from '@civichub/ui';

import { useMyProfile } from './features/identity/api/identity.api';
import { Spinner } from '@civichub/ui';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((state) => state.accessToken);
  if (!token) return <Navigate to="/login" />;
  return children;
}

function MyProfileRedirect() {
  const { data: myProfile, isLoading } = useMyProfile();
  
  if (isLoading) return <div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>;
  if (!myProfile) return <Navigate to="/login" />;
  
  return <Navigate to={`/users/${myProfile.username}`} replace />;
}

function GlobalLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Floating Modern Navigation */}
      <div className="fixed top-0 left-0 right-0 z-[100] pt-4 px-4 pb-4 md:pt-6 md:pb-6 pointer-events-none flex justify-center w-full">
        <header className="pointer-events-auto flex items-center justify-between w-full max-w-6xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2.5 shadow-2xl transition-all duration-300 hover:bg-black/60 hover:border-white/20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoUrl} alt="CivicHub Logo" className="h-8 w-8 rounded-full shadow-sm ring-2 ring-white/10 group-hover:ring-primary/50 transition-all duration-300" />
            <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-300">CivicHub</span>
          </Link>
          
          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/explore" className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors">Explore</Link>
            <Link to="/events" className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors">Events</Link>
            <Link to="/campaigns" className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors">Volunteer</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full cursor-pointer">
                    <Avatar size="sm" className="ring-2 ring-white/10 hover:ring-primary/40 transition-all">
                      <AvatarFallback>{user.firstName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={12} className="w-56 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl p-1 z-[60]">
                  <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                    <p className="text-sm font-semibold text-white truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer outline-none">
                      <CivicIcon name="LayoutDashboard" className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer outline-none">
                      <CivicIcon name="User" className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10 my-1 h-px" />
                  <DropdownMenuItem asChild>
                    <button onClick={logout} className="w-full flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer outline-none text-left">
                      <CivicIcon name="LogOut" className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="text-sm font-medium text-black bg-white hover:bg-gray-200 px-5 py-2 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold">Sign In</Link>
            )}
            <button className="md:hidden p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors" onClick={() => setMobileMenuOpen(true)}>
              <CivicIcon name="Menu" className="h-5 w-5" />
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Navigation */}
      <BottomSheet isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <div className="flex flex-col gap-4">
          <Link to="/explore" onClick={() => setMobileMenuOpen(false)} className="p-3 font-medium border-b">Explore Communities</Link>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="p-3 font-medium border-b">Events</Link>
          <Link to="/campaigns" onClick={() => setMobileMenuOpen(false)} className="p-3 font-medium border-b">Volunteer</Link>
          {user && (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-3 font-medium border-b text-primary">Dashboard</Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="p-3 font-medium border-b text-destructive text-left w-full">Logout</button>
            </>
          )}
        </div>
      </BottomSheet>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SearchOverlay />
      <Routes>
        <Route path="/" element={
          <GlobalLayout>
            <LandingPage />
          </GlobalLayout>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/design" element={<DesignPlayground />} />
        
        {/* Protected Dashboard Route */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <GlobalLayout>
              <DashboardPage />
            </GlobalLayout>
          </ProtectedRoute>
        } />
        
        {/* All other routes wrapped in GlobalLayout for consistency */}
        <Route path="/*" element={
          <GlobalLayout>
            <Routes>
              <Route path="/users/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><MyProfileRedirect /></ProtectedRoute>} />
              <Route path="/c/create" element={<ProtectedRoute><CreateCommunityPage /></ProtectedRoute>} />
              <Route path="/c/:slug" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
              <Route path="/hashtags/:tag" element={<ProtectedRoute><HashtagPage /></ProtectedRoute>} />
              
              <Route path="/report" element={<ProtectedRoute><ReportIssuePage /></ProtectedRoute>} />
              <Route path="/issues/:id" element={<ProtectedRoute><IssueDetailsPage /></ProtectedRoute>} />
              <Route path="/departments/:id" element={<ProtectedRoute><DepartmentPage /></ProtectedRoute>} />

              <Route path="/volunteer" element={<ProtectedRoute><VolunteerDashboardPage /></ProtectedRoute>} />
              <Route path="/volunteer/profile" element={<ProtectedRoute><VolunteerProfilePage /></ProtectedRoute>} />
              <Route path="/campaigns" element={<ProtectedRoute><CampaignDirectoryPage /></ProtectedRoute>} />
              <Route path="/campaigns/:id" element={<ProtectedRoute><CampaignDetailsPage /></ProtectedRoute>} />
              
              <Route path="/events" element={<ProtectedRoute><EventDirectoryPage /></ProtectedRoute>} />
              <Route path="/events/calendar" element={<ProtectedRoute><EventCalendarPage /></ProtectedRoute>} />
              <Route path="/events/:id" element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
              <Route path="/events/:id/dashboard" element={<ProtectedRoute><OrganizerDashboardPage /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </GlobalLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
