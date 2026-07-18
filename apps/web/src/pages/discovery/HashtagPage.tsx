import { useParams } from 'react-router-dom';
import { useHashtag, useSearch } from '../../features/discovery/api/discovery.api';
import { Spinner } from '@civichub/ui';

export default function HashtagPage() {
  const { tag } = useParams<{ tag: string }>();
  const { data: hashtag, isLoading: isTagLoading, error } = useHashtag(tag || '');
  const { data: results, isLoading: isSearchLoading } = useSearch(`#${tag}`, 'post');

  if (isTagLoading) {
    return <div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (error || !hashtag) {
    return <div className="flex h-screen items-center justify-center text-red-500">Hashtag not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-4xl font-bold mb-2">#{hashtag.tag}</h1>
        <div className="flex gap-6 text-primary-100 mt-4 text-sm font-medium">
          <div>
            <span className="block text-2xl font-bold text-white">{hashtag.postCount}</span>
            Total Posts
          </div>
          <div>
            <span className="block text-2xl font-bold text-white">{hashtag.usageCount}</span>
            Usage
          </div>
          <div>
            <span className="block text-xl font-bold text-white mt-1">🔥 {hashtag.trendingScore}</span>
            Trending Score
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Recent Posts</h2>
      
      {isSearchLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : results?.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-500">
          No posts found with this hashtag.
        </div>
      ) : (
        <div className="space-y-4">
          {results?.map((res, idx) => (
            <div key={idx} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <h4 className="font-medium">{res.title}</h4>
              <p className="text-sm text-slate-500">{res.subtitle}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
