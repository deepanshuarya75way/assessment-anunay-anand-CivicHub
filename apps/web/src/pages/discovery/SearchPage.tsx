import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../../features/discovery/api/discovery.api';
import { Spinner, Tabs, TabsList, TabsTrigger as Tab, TabsContent as TabPanel } from '@civichub/ui';
import { SearchResultType } from '@civichub/shared';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  // Tab state can be handled here or through URL. For simplicity, we just fetch 'all' and filter locally, 
  // or fetch specific types. Fetching 'all' is fine for MVP.
  const { data: results, isLoading } = useSearch(query, 'all');

  const filterByType = (type: SearchResultType) => results?.filter(r => r.type === type) || [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-slate-500 mb-8">Showing results for "{query}"</p>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !results?.length ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-4xl mb-4 block">🔍</span>
          <h3 className="text-lg font-medium">No results found</h3>
          <p className="text-slate-500">Try adjusting your search terms.</p>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6 border-b border-slate-200 dark:border-slate-800 flex gap-6 overflow-x-auto">
            <Tab value="all" className="pb-3 border-b-2 font-medium">All Results</Tab>
            <Tab value="post" className="pb-3 border-b-2 font-medium">Posts ({filterByType('post').length})</Tab>
            <Tab value="community" className="pb-3 border-b-2 font-medium">Communities ({filterByType('community').length})</Tab>
            <Tab value="user" className="pb-3 border-b-2 font-medium">People ({filterByType('user').length})</Tab>
            <Tab value="organization" className="pb-3 border-b-2 font-medium">Organizations ({filterByType('organization').length})</Tab>
          </TabsList>

            <TabPanel value="all">
              <div className="space-y-4">
                {results.map((res, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex gap-4">
                    {/* Simplified render, same as overlay */}
                    {res.image ? (
                      <img src={res.image} alt={res.title} className="w-12 h-12 rounded-xl object-cover bg-slate-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                        {res.type === 'hashtag' ? '#' : res.type === 'community' ? '👥' : res.type === 'user' ? '👤' : res.type === 'organization' ? '🏢' : '📝'}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-lg">{res.title}</h4>
                        <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {res.type}
                        </span>
                      </div>
                      {res.subtitle && <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">{res.subtitle}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>
            
            {/* Other TabPanels would render similarly but filtered */}
            {['post', 'community', 'user', 'organization'].map((type) => (
              <TabPanel key={type} value={type}>
                <div className="space-y-4">
                  {filterByType(type as SearchResultType).map((res, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex gap-4">
                      {res.title}
                    </div>
                  ))}
                  {filterByType(type as SearchResultType).length === 0 && (
                    <p className="text-slate-500 py-8 text-center">No {type}s found.</p>
                  )}
                </div>
              </TabPanel>
            ))}
        </Tabs>
      )}
    </div>
  );
}
