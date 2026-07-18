import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile, useUserActivity } from '../../features/identity/api/identity.api';
import { useAuthStore } from '../../stores/auth.store';
// Assuming basic UI components exist based on Phase 2
import { GlassButton as Button, Avatar, Tabs, TabsList, TabsTrigger as Tab, TabsContent as TabPanel, Spinner } from '@civichub/ui';
import EditProfileModal from '../../features/identity/components/EditProfileModal';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading, error } = useProfile(username || '');
  const { data: activity } = useUserActivity(username || '');
  const authUser = useAuthStore((state) => state.user);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Profile not found
      </div>
    );
  }

  const isOwnProfile = authUser?.id === (profile.userId as any)?._id;

  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      {/* Cover Photo */}
      <div 
        className="h-48 md:h-64 w-full bg-slate-800 rounded-b-2xl relative bg-cover bg-center"
        style={{ backgroundImage: profile.coverUrl ? `url(${profile.coverUrl})` : 'none' }}
      >
        {isOwnProfile && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/30"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Cover
          </Button>
        )}
      </div>

      {/* Header Info */}
      <div className="px-6 relative flex flex-col md:flex-row md:items-end justify-between -mt-16 md:-mt-12 mb-8">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <Avatar 
            src={profile.avatarUrl} 
            alt={profile.username} 
            size="xl" 
            className="border-4 border-background w-32 h-32"
          />
          <div className="pb-2">
            <h1 className="text-3xl font-bold">
              {(profile.userId as any)?.firstName} {(profile.userId as any)?.lastName}
            </h1>
            <p className="text-slate-500 font-medium">@{profile.username}</p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 md:pb-4 flex gap-3">
          {isOwnProfile ? (
            <Button onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
          ) : (
            <Button variant="primary">Follow</Button>
          )}
        </div>
      </div>

      {/* Bio and Stats */}
      <div className="px-6 mb-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <p className="text-lg whitespace-pre-wrap">
            {profile.bio || "This user hasn't written a bio yet."}
          </p>
          
          <div className="flex gap-4 text-sm text-slate-500">
            {profile.location && (
              <div className="flex items-center gap-1">
                <span>📍</span> {profile.location}
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-1">
                <span>🔗</span> 
                <a href={profile.website} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline">
                  {new URL(profile.website).hostname}
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex justify-between text-center">
          <div>
            <div className="text-2xl font-bold">{profile.reputation?.score || 0}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Reputation</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{profile.reputation?.posts || 0}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{profile.reputation?.comments || 0}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Comments</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-12">
        <Tabs defaultValue="posts">
          <TabsList className="mb-6 w-full overflow-x-auto border-b border-slate-200 dark:border-slate-800 flex gap-8">
            <Tab value="posts" className="pb-4 border-b-2 font-medium">Posts</Tab>
            <Tab value="activity" className="pb-4 border-b-2 font-medium">Activity</Tab>
            <Tab value="about" className="pb-4 border-b-2 font-medium">About</Tab>
            <Tab value="media" className="pb-4 border-b-2 font-medium">Media</Tab>
          </TabsList>

            <TabPanel value="posts">
              <div className="space-y-6">
                {activity?.filter(a => a.type === 'POST').length ? (
                  activity?.filter(a => a.type === 'POST').map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      {/* Placeholder for actual PostComponent */}
                      <p className="font-medium mb-2">{item.data.title || item.data.content}</p>
                      <p className="text-sm text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    No posts yet
                  </div>
                )}
              </div>
            </TabPanel>
            
            <TabPanel value="activity">
              <div className="space-y-6">
                {activity?.length ? (
                  activity?.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4">
                      <div className="text-2xl">{item.type === 'POST' ? '📝' : '💬'}</div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">
                          {item.type === 'POST' ? 'Published a post' : 'Commented on a post'} • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        <p className="font-medium">{item.data.content || item.data.title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    No activity yet
                  </div>
                )}
              </div>
            </TabPanel>
            
            <TabPanel value="about">
              <div className="prose dark:prose-invert">
                <h3>Badges & Achievements</h3>
                <p>Coming soon...</p>
                <h3>Volunteer History</h3>
                <p>Coming soon...</p>
              </div>
            </TabPanel>
            
            <TabPanel value="media">
              <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-xl">
                No media yet
              </div>
            </TabPanel>
        </Tabs>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
      />
    </div>
  );
}
