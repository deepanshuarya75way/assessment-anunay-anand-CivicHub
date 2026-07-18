import { useTrending } from '../../features/discovery/api/discovery.api';
import { Spinner } from '@civichub/ui';

export default function ExplorePage() {
  const { data: trending, isLoading } = useTrending();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold mb-8">Explore CivicHub</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Trending Posts */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>🔥</span> Trending Posts
          </h2>
          <div className="space-y-4">
            {trending?.posts?.map((post: any, idx: number) => (
              <div key={idx} className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                  <div>
                    <p className="text-sm font-semibold">{post.author?.firstName} {post.author?.lastName}</p>
                    <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-slate-800 dark:text-slate-200 line-clamp-3">{post.content?.text}</p>
              </div>
            ))}
            {(!trending?.posts || trending.posts.length === 0) && (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-500">
                No trending posts right now.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Communities & Hashtags */}
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📈</span> Popular Hashtags
            </h2>
            <div className="space-y-3">
              {trending?.hashtags?.map((tag: any, idx: number) => (
                <a href={`/hashtags/${tag.tag}`} key={idx} className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <p className="font-semibold text-primary-600 dark:text-primary-400">#{tag.tag}</p>
                  <p className="text-xs text-slate-500 mt-1">{tag.usageCount} posts</p>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>👥</span> Active Communities
            </h2>
            <div className="space-y-3">
              {trending?.communities?.map((comm: any, idx: number) => (
                <a href={`/c/${comm.slug}`} key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" style={{ backgroundImage: comm.avatarUrl ? `url(${comm.avatarUrl})` : 'none', backgroundSize: 'cover' }}></div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{comm.name}</p>
                    <p className="text-xs text-slate-500">{comm.memberCount} members</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
