import { useCampaigns } from '../../features/volunteer/api';
import { Link } from 'react-router-dom';
import { PageShell, GlassCard, GlassButton, Spinner, CivicIcon } from '@civichub/ui';
import { motion } from 'framer-motion';

export default function CampaignDirectoryPage() {
  const { data: campaigns, isLoading } = useCampaigns();

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 py-12 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Volunteer Campaigns
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Join local initiatives and make a difference in your community. Find campaigns that match your skills and passions.
            </p>
          </motion.div>
          {campaigns && campaigns.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Link to="/campaigns/create">
                <GlassButton variant="primary" className="gap-2 group">
                  <CivicIcon name="Plus" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Create Campaign
                </GlassButton>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <Spinner size="lg" className="text-primary" />
            <p className="text-slate-400 animate-pulse font-medium">Discovering opportunities...</p>
          </div>
        ) : (!campaigns || campaigns.length === 0) ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20">
                <CivicIcon name="HeartHandshake" className="w-10 h-10 text-white/70" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No active campaigns</h3>
              <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                There are currently no volunteer campaigns available. Be the first to start an initiative in your community!
              </p>
              <Link to="/campaigns/create">
                <GlassButton variant="primary" className="gap-2">
                  <CivicIcon name="Rocket" className="w-4 h-4" />
                  Start a Campaign
                </GlassButton>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {campaigns.map((campaign, i) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/campaigns/${campaign.id}`} className="block h-full outline-none group">
                  <GlassCard className="h-full flex flex-col hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/20 hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                    
                    <div className="p-6 flex flex-col h-full relative z-10">
                      <div className="flex justify-between items-start mb-5 gap-4">
                        <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {campaign.title}
                        </h2>
                        <span className={`shrink-0 px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${
                          campaign.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          campaign.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      
                      <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                        {campaign.description}
                      </p>
                      
                      <div className="mt-auto space-y-4">
                        <div className="h-px w-full bg-white/10" />
                        <div className="flex justify-between items-center text-sm font-medium">
                          <div className="flex items-center text-slate-300 gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
                            <CivicIcon name="Calendar" className="w-4 h-4 text-primary" />
                            {new Date(campaign.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center text-slate-300 gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
                            <CivicIcon name="Users" className="w-4 h-4 text-accent" />
                            {campaign.capacity} spots
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
