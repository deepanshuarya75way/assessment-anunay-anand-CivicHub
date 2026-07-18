import { useVolunteerProfile } from '../../features/volunteer/api';
import { useAuthStore } from '../../stores/auth.store';
import { Link } from 'react-router-dom';
import { 
  GlassButton, 
  BentoGrid, 
  BentoGridItem, 
  AnalyticCard, 
  Badge,
  EmptyState,
  Skeleton
} from '@civichub/ui';
import { Clock, Briefcase, CheckCircle2, ChevronRight, Activity, Calendar } from 'lucide-react';

export default function VolunteerDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: profile, isLoading } = useVolunteerProfile(user?.id || '');

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-display font-bold tracking-tight text-foreground">Volunteer Dashboard</h1>
          <p className="text-body text-muted-foreground mt-1">Manage your civic contributions and skills.</p>
        </div>
        <Link to="/campaigns">
          <GlassButton variant="primary">
            Find Campaigns
            <ChevronRight className="ml-2 h-4 w-4" />
          </GlassButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticCard 
          title="Total Hours" 
          value="124" 
          trend={{ value: 15, isPositive: true }} 
          icon={<Clock className="h-5 w-5" />} 
        />
        <AnalyticCard 
          title="Active Campaigns" 
          value="2" 
          icon={<Briefcase className="h-5 w-5" />} 
        />
        <AnalyticCard 
          title="Completed Tasks" 
          value="47" 
          trend={{ value: 4, isPositive: true }} 
          icon={<CheckCircle2 className="h-5 w-5" />} 
        />
      </div>

      <BentoGrid className="mt-8">
        <BentoGridItem 
          className="md:col-span-2"
          title="My Skills & Interests"
          description="Your profile helps us match you with the right campaigns."
          icon={<Activity className="h-4 w-4 text-primary" />}
          header={
            <div className="flex flex-col gap-6 p-6 h-full min-h-[12rem] rounded-xl bg-card border">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill) => (
                      <Badge key={skill} variant="primary">{skill}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No skills added</span>
                  )}
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.interests && profile.interests.length > 0 ? (
                    profile.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">{interest}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No interests added</span>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end border-t pt-4">
                <Link to="/volunteer/profile">
                  <GlassButton variant="ghost" size="sm">Edit Profile</GlassButton>
                </Link>
              </div>
            </div>
          }
        />
        
        <BentoGridItem 
          className="md:col-span-1"
          title="Recent Activity"
          description="Your latest contributions."
          icon={<Calendar className="h-4 w-4 text-primary" />}
          header={
            <div className="flex items-center justify-center h-full min-h-[12rem] rounded-xl bg-card border">
              <EmptyState 
                title="No recent activity"
                description="Join a campaign to start making an impact."
                icon={<Briefcase className="h-8 w-8 text-muted-foreground/50" />}
              />
            </div>
          }
        />
      </BentoGrid>
    </div>
  );
}
