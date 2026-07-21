import { useTrending } from '../../features/discovery/api/discovery.api';
import { Spinner, PageShell, SectionContainer, PageHeader, GlassCard } from '@civichub/ui';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Users, ArrowRight, Hash, MessageSquare } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function ExplorePage() {
  const { data: trending, isLoading } = useTrending();

  console.log("ExplorePage Rendering. Trending data:", trending, "isLoading:", isLoading);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Ensure arrays to prevent .map is not a function crashes
  const posts = Array.isArray(trending?.posts) ? trending.posts : [];
  const hashtags = Array.isArray(trending?.hashtags) ? trending.hashtags : [];
  const communities = Array.isArray(trending?.communities) ? trending.communities : [];

  return (
    <PageShell>
      <SectionContainer>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <PageHeader 
            title="Explore CivicHub"
            description="Discover trending discussions, popular tags, and active communities in your area."
          />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-12">
          
          {/* Main Content - Trending Posts */}
          <div className="xl:col-span-8 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl text-orange-500 border border-orange-500/20">
                <Flame className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Trending Posts</h2>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {posts.map((post: any, idx: number) => (
                <motion.div variants={itemVariants} key={idx}>
                  <GlassCard className="p-6 md:p-8 hover:shadow-glass-lg transition-all duration-300 group cursor-pointer border border-border/50 hover:border-primary/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/10 transition-colors" />
                    <div className="flex items-start gap-5 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0 shadow-sm text-primary font-bold text-xl">
                         {post.author?.firstName?.[0] || 'A'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                          <div>
                            <p className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                              {post.author?.firstName} {post.author?.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}</span>
                              <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                              <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {Math.floor(Math.random() * 50) + 1}</span>
                            </p>
                          </div>
                        </div>
                        <p className="text-foreground/80 leading-relaxed line-clamp-3 text-base">
                          {post.content?.text}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
              
              {posts.length === 0 && (
                <motion.div variants={itemVariants}>
                  <GlassCard className="p-16 text-center flex flex-col items-center justify-center border-dashed border-2 border-border/50">
                    <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                      <Flame className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No trending posts</h3>
                    <p className="text-muted-foreground max-w-sm">It's quiet around here. Be the first to start a discussion and get it trending!</p>
                  </GlassCard>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-4 space-y-10">
            
            {/* Popular Hashtags */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Popular Hashtags</h2>
              </div>
              
              <GlassCard className="p-6 relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-wrap gap-2.5 relative z-10">
                  {hashtags.map((tag: any, idx: number) => (
                    <a 
                      href={`/hashtags/${tag.tag}`} 
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-background/50 hover:bg-indigo-500/10 border border-border/50 hover:border-indigo-500/30 text-sm font-medium transition-all group"
                    >
                      <Hash className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-foreground group-hover:text-indigo-400 transition-colors">{tag.tag}</span>
                      <span className="text-xs text-muted-foreground ml-1 bg-muted px-1.5 py-0.5 rounded-md">{tag.usageCount}</span>
                    </a>
                  ))}
                  {hashtags.length === 0 && (
                    <p className="text-sm text-muted-foreground py-4 text-center w-full">No active hashtags</p>
                  )}
                </div>
              </GlassCard>
            </motion.section>

            {/* Active Communities */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Active Communities</h2>
              </div>

              <div className="space-y-4">
                {communities.map((comm: any, idx: number) => (
                  <a href={`/c/${comm.slug}`} key={idx} className="block group">
                    <GlassCard className="p-4 flex items-center gap-4 border border-border/50 hover:border-emerald-500/30 hover:shadow-glass-sm transition-all duration-300 relative overflow-hidden bg-gradient-to-r hover:from-emerald-500/5 hover:to-transparent">
                      
                      <div className="relative z-10 w-14 h-14 rounded-2xl bg-muted shrink-0 overflow-hidden shadow-sm ring-1 ring-border">
                        {comm.avatarUrl ? (
                          <img src={comm.avatarUrl} alt={comm.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center text-emerald-500 font-bold text-xl group-hover:scale-110 transition-transform duration-500">
                            {comm.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      
                      <div className="relative z-10 flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate group-hover:text-emerald-400 transition-colors text-base">
                          {comm.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 opacity-70" />
                          {comm.memberCount} members
                        </p>
                      </div>
                      
                      <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </GlassCard>
                  </a>
                ))}
                
                {communities.length === 0 && (
                  <GlassCard className="p-8 text-center border border-border/50">
                    <p className="text-sm text-muted-foreground">No active communities found</p>
                  </GlassCard>
                )}
              </div>
            </motion.section>

          </div>
        </div>
      </SectionContainer>
    </PageShell>
  );
}
