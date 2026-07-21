import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  PostCard, 
  PageShell,
  SectionContainer
} from '@civichub/ui';
import { ArrowRight, Globe, AlertCircle, Users, Clock, ShieldCheck, Sparkles, LayoutDashboard, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  const [publicPosts, setPublicPosts] = useState<any[]>([]);

  useEffect(() => {
    // Mock response
    setPublicPosts([
      {
        id: '1',
        author: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah', role: 'Volunteer' },
        content: 'Just finished organizing the local park cleanup! We collected over 50 bags of trash. 🌳💚',
        timestamp: '2 hours ago',
        likes: 124,
        comments: 18,
      },
      {
        id: '2',
        author: { name: 'Mayor Office', avatar: 'https://i.pravatar.cc/150?u=mayor', role: 'Official' },
        content: 'The new transit expansion plan has been approved. Construction starts next month.',
        timestamp: '5 hours ago',
        likes: 892,
        comments: 156,
      }
    ]);
  }, []);

  return (
    <PageShell withNav={false}>
      <div className="bg-black min-h-screen font-sans selection:bg-primary/30">
        
        {/* 1. Hero Section */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Stunning Background Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-60 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] opacity-40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] opacity-40 pointer-events-none" />

          {/* Floating UI Elements for depth */}
          <motion.div 
            animate={{ y: [0, -20, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-[10%] hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-2xl"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Pothole Fixed</p>
              <p className="text-xs text-gray-400">Main Street • 2m ago</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }} 
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-[10%] hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-2xl"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">New Volunteer</p>
              <p className="text-xs text-gray-400">Sarah joined Park Cleanup</p>
            </div>
          </motion.div>

          <SectionContainer className="text-center relative z-10 w-full" size="default">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md shadow-lg cursor-default hover:bg-white/10 transition-colors">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-medium text-gray-300">CivicHub 2.0 is now live</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-[7rem] font-extrabold tracking-tighter text-white mb-8 leading-[1.05]">
                The OS for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-purple-500">
                  Civic Life.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                Connect with your community, report issues, volunteer for campaigns, and participate in local governance—all in one beautiful platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
                <Link to="/login" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 hover:bg-gray-100 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 text-lg">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/explore" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-medium rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 text-lg">
                    Explore Communities
                  </button>
                </Link>
              </div>
            </motion.div>
          </SectionContainer>
        </section>

        {/* 2. Social Proof / Stats */}
        <SectionContainer className="relative z-20 pb-24">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400"><AlertCircle /></div>
                <h4 className="text-4xl font-bold text-white mb-1">14k+</h4>
                <p className="text-gray-400 font-medium">Issues Resolved</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-400"><Users /></div>
                <h4 className="text-4xl font-bold text-white mb-1">3.8k</h4>
                <p className="text-gray-400 font-medium">Active Volunteers</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 text-purple-400"><Globe /></div>
                <h4 className="text-4xl font-bold text-white mb-1">150+</h4>
                <p className="text-gray-400 font-medium">Communities</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-4 text-orange-400"><Clock /></div>
                <h4 className="text-4xl font-bold text-white mb-1">2.4d</h4>
                <p className="text-gray-400 font-medium">Avg Resolution</p>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* 3. Modern Bento Grid Features */}
        <SectionContainer padded className="py-24">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">run a city.</span></h2>
            <p className="text-xl text-gray-400">CivicHub replaces dozens of fragmented tools with one cohesive, beautifully designed ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ gridAutoRows: 'minmax(320px, auto)' }}>
            {/* Large Feature */}
            <motion.div whileHover={{ scale: 0.98 }} transition={{ duration: 0.4 }} className="md:col-span-2 rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden relative group backdrop-blur-sm cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-10 relative z-10 w-full md:w-3/5 h-full flex flex-col justify-center">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Interactive Explorer</h3>
                <p className="text-gray-400 text-lg">Discover local events, reported issues, and active volunteer opportunities visually on a beautiful interactive map.</p>
              </div>
              {/* Decorative Map Graphic placeholder */}
              <div className="absolute top-0 right-0 w-[45%] h-full hidden md:flex items-center justify-center">
                 <div className="w-[120%] h-[120%] bg-black/40 border-l border-white/10 rounded-l-3xl shadow-2xl group-hover:-translate-x-2 transition-transform duration-500 backdrop-blur-xl flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <LayoutDashboard className="w-24 h-24 text-white/10" />
                 </div>
              </div>
            </motion.div>
            
            {/* Tall Feature */}
            <motion.div whileHover={{ scale: 0.98 }} transition={{ duration: 0.4 }} className="md:row-span-2 rounded-[2rem] bg-white/5 border border-white/10 p-10 relative overflow-hidden group backdrop-blur-sm cursor-pointer flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                <Sparkles className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">AI Integrations</h3>
              <p className="text-gray-400 relative z-10">Smart issue categorization, automated summaries, and intelligent volunteer matching.</p>
              <div className="flex-1 min-h-[120px] mt-8 bg-black/40 border border-white/10 rounded-xl relative z-10 flex flex-col justify-end p-4 group-hover:-translate-y-2 transition-transform duration-500">
                <div className="w-3/4 h-2 bg-white/10 rounded-full mb-3"></div>
                <div className="w-1/2 h-2 bg-purple-500/40 rounded-full mb-3"></div>
                <div className="w-full h-2 bg-white/10 rounded-full"></div>
              </div>
            </motion.div>
            
            {/* Standard Feature (now col-span-2 to fill the gap) */}
            <motion.div whileHover={{ scale: 0.98 }} transition={{ duration: 0.4 }} className="md:col-span-2 rounded-[2rem] bg-white/5 border border-white/10 p-10 relative overflow-hidden group backdrop-blur-sm cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                <ShieldCheck className="h-7 w-7 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Verified Trust</h3>
              <p className="text-gray-400 relative z-10 max-w-md">Government-grade identity verification and secure reputation systems ensure every interaction on the platform is authentic and reliable.</p>
            </motion.div>

            {/* Community Feed Feature (now col-span-3 full width) */}
            <motion.div whileHover={{ scale: 0.99 }} transition={{ duration: 0.4 }} className="md:col-span-3 rounded-[2rem] bg-white/5 border border-white/10 p-10 relative overflow-hidden group backdrop-blur-sm">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                   <MessageSquare className="h-7 w-7 text-orange-400" />
                 </div>
                 <h3 className="text-3xl font-bold text-white">Live Community Feed</h3>
               </div>
               <div className="flex gap-6 overflow-hidden pb-4" style={{ maskImage: 'linear-gradient(to right, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%)' }}>
                {publicPosts.map(post => (
                  <div key={post.id} className="min-w-[340px] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                    <PostCard {...post} />
                  </div>
                ))}
               </div>
            </motion.div>
          </div>
        </SectionContainer>

        {/* Footer */}
        <footer className="pt-16 pb-8 border-t border-white/10 bg-black/50 relative overflow-hidden mt-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <SectionContainer className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <img src="/src/assets/logo.png" alt="CivicHub Logo" className="h-10 w-10 rounded-full shadow-lg ring-2 ring-white/10 group-hover:ring-primary/50 transition-all duration-300" />
                  <span className="font-bold text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300">CivicHub</span>
                </div>
                <p className="text-gray-400 text-sm max-w-sm text-center md:text-left">
                  The modern operating system for civic life. Building stronger, more connected communities together.
                </p>
              </div>
              
              <div className="flex flex-col items-center md:items-end gap-6">
                <div className="flex flex-wrap justify-center md:justify-end gap-6">
                  <Link to="/about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">About</Link>
                  <Link to="/privacy" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Privacy</Link>
                  <Link to="/terms" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Terms</Link>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  &copy; {new Date().getFullYear()} CivicHub. All rights reserved.
                </div>
              </div>
            </div>
          </SectionContainer>
        </footer>
      </div>
    </PageShell>
  );
}

