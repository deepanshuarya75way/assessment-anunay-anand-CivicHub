import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiscoveryStore } from '../../../stores/discovery.store';
import { useSearch } from '../api/discovery.api';
import { Spinner } from '@civichub/ui';

export default function SearchOverlay() {
  const navigate = useNavigate();
  const { isSearchOverlayOpen, closeSearchOverlay, toggleSearchOverlay } = useDiscoveryStore();
  
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearchOverlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearchOverlay]);

  const { data: results, isLoading } = useSearch(debouncedQuery);

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      closeSearchOverlay();
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleResultClick = (url: string) => {
    closeSearchOverlay();
    navigate(url);
  };

  if (!isSearchOverlayOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-center items-start pt-[10vh]">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        // Close on clicking outside would be handled here, simplified for MVP
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span className="text-xl text-slate-400">🔍</span>
          <input 
            type="text" 
            autoFocus
            className="flex-1 bg-transparent border-none text-lg outline-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400"
            placeholder="Search communities, people, posts, hashtags..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchEnter}
          />
          <button 
            onClick={closeSearchOverlay}
            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 font-medium"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {isLoading ? (
            <div className="py-12 flex justify-center"><Spinner /></div>
          ) : !query ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Type to search...
            </div>
          ) : results?.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {results?.map((res, idx) => (
                <div 
                  key={`${res.type}-${res.id}-${idx}`}
                  onClick={() => handleResultClick(res.url)}
                  className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer flex items-center gap-4 transition-colors"
                >
                  {res.image ? (
                    <img src={res.image} alt={res.title} className="w-10 h-10 rounded-full object-cover bg-slate-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">
                      {res.type === 'hashtag' ? '#' : res.type === 'community' ? '👥' : res.type === 'user' ? '👤' : res.type === 'organization' ? '🏢' : '📝'}
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm">{res.title}</h4>
                    {res.subtitle && <p className="text-xs text-slate-500 line-clamp-1">{res.subtitle}</p>}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                    {res.type}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
          <span>Search powered by CivicHub Discovery</span>
          <span>Press Enter to view all results</span>
        </div>
      </div>
    </div>
  );
}
