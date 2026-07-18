import { useParams } from 'react-router-dom';
import { useCommunity, useJoinCommunity } from '../../features/communities/api/communities.api';
import { GlassButton as Button, Avatar, Tabs, TabsList, TabsTrigger as Tab, TabsContent as TabPanel, Spinner } from '@civichub/ui';

export default function CommunityPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: community, isLoading, error } = useCommunity(slug || '');
  const joinMutation = useJoinCommunity();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Community not found
      </div>
    );
  }

  const handleJoin = () => {
    if (community.id) {
      joinMutation.mutate(community.id);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      {/* Cover Photo */}
      <div 
        className="h-48 md:h-64 w-full bg-slate-800 rounded-b-2xl relative bg-cover bg-center"
        style={{ backgroundImage: community.coverUrl ? `url(${community.coverUrl})` : 'none' }}
      ></div>

      {/* Header Info */}
      <div className="px-6 relative flex flex-col md:flex-row md:items-end justify-between -mt-16 md:-mt-12 mb-8">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <Avatar 
            src={community.avatarUrl} 
            alt={community.name} 
            size="xl" 
            className="border-4 border-background w-32 h-32 rounded-xl"
          />
          <div className="pb-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {community.name}
              {community.verified && <span className="text-primary-500" title="Verified">✓</span>}
            </h1>
            <p className="text-slate-500 font-medium">c/{community.slug} • {community.memberCount} members</p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 md:pb-4 flex gap-3">
          <Button 
            variant="primary" 
            onClick={handleJoin}
            loading={joinMutation.isPending}
          >
            Join Community
          </Button>
        </div>
      </div>

      <div className="px-6 mb-8 flex flex-col md:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-[3]">
          <Tabs defaultValue="posts">
            <TabsList className="mb-6 w-full overflow-x-auto border-b border-slate-200 dark:border-slate-800 flex gap-8">
              <Tab value="posts" className="pb-4 border-b-2 font-medium">Posts</Tab>
              <Tab value="about" className="pb-4 border-b-2 font-medium">About</Tab>
              <Tab value="rules" className="pb-4 border-b-2 font-medium">Rules</Tab>
            </TabsList>

              <TabPanel value="posts">
                <div className="space-y-6">
                  {/* TODO: Integrate Community Feed */}
                  <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    Loading posts for {community.name}...
                  </div>
                </div>
              </TabPanel>
              
              <TabPanel value="about">
                <div className="prose dark:prose-invert">
                  <p className="whitespace-pre-wrap">{community.description}</p>
                  
                  <h3 className="mt-6">Tags</h3>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {community.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TabPanel>

              <TabPanel value="rules">
                <div className="space-y-4">
                  {community.rules?.length ? community.rules.map((rule, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <p className="font-medium">{idx + 1}. {rule}</p>
                    </div>
                  )) : (
                    <p className="text-slate-500">No rules have been set for this community.</p>
                  )}
                </div>
              </TabPanel>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="flex-1 space-y-6">
          <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl">
            <h3 className="font-bold mb-3">About Community</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{community.description}</p>
            <div className="text-sm flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-slate-500">Created</span>
              <span className="font-medium">{new Date(community.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-sm flex justify-between pt-2">
              <span className="text-slate-500">Visibility</span>
              <span className="font-medium">{community.visibility}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
