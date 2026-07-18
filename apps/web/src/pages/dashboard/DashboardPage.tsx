import React from 'react';
import { PageShell, SectionContainer, PageHeader, AnalyticCard, EventCard, PostCard } from '@civichub/ui';
import { useAuthStore } from '../../stores/auth.store';
import { motion } from 'framer-motion';
import { Sun, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const user = useAuthStore(state => state.user);
  const firstName = user?.firstName || 'Citizen';

  // Greeting logic
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  return (
    <PageShell>
      <SectionContainer>
        <div className="mb-8 flex items-center gap-3 text-accent-gold">
          <Sun className="h-6 w-6" />
          <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
        
        <PageHeader 
          title={`${greeting}, ${firstName}.`}
          description="Here is your personalized daily briefing on what's happening in your neighborhood."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <AnalyticCard 
            title="Local Issues Resolved" 
            value="142" 
            trend={{ value: 12, isPositive: true }} 
            icon={<CheckCircle2 className="h-5 w-5" />} 
          />
          <AnalyticCard 
            title="Upcoming Events" 
            value="3" 
            description="2 require your RSVP"
            icon={<TrendingUp className="h-5 w-5" />} 
          />
          <AnalyticCard 
            title="Active Alerts" 
            value="1" 
            trend={{ value: 1, isPositive: false }} 
            icon={<AlertCircle className="h-5 w-5" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Action Items */}
          <section>
            <h2 className="text-h3 font-bold mb-6">Action Items</h2>
            <div className="space-y-4">
              <motion.div whileHover={{ x: 4 }} className="p-4 rounded-xl border border-border bg-card flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Sign the new transit petition</h4>
                  <p className="text-sm text-muted-foreground mt-1">Your local representative is reviewing the downtown transit expansion. 452 neighbors have already signed.</p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Recommended Events */}
          <section>
            <h2 className="text-h3 font-bold mb-6">Recommended for You</h2>
            <div className="space-y-6">
              <EventCard 
                title="Downtown Cleanup & Coffee"
                date="This Saturday, 9:00 AM"
                location="Central Park Plaza"
                attendees={42}
                image="https://picsum.photos/seed/dashboard/600/400"
              />
            </div>
          </section>
        </div>
      </SectionContainer>
    </PageShell>
  );
}
