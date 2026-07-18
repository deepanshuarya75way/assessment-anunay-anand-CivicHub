import { useQuery } from '@tanstack/react-query';
import { apiClient as api } from '../../../api/client';
import { ISearchResult, SearchResultType } from '@civichub/shared';

export const getSearch = async (query: string, type: SearchResultType | 'all' = 'all'): Promise<ISearchResult[]> => {
  if (!query) return [];
  const { data } = await api.get(`/discovery/search?q=${encodeURIComponent(query)}&type=${type}`);
  return data.data;
};

export const getTrending = async () => {
  const { data } = await api.get('/discovery/trending');
  return data.data;
};

export const getHashtag = async (tag: string) => {
  const { data } = await api.get(`/discovery/hashtags/${tag}`);
  return data.data;
};

// React Query Hooks
export const useSearch = (query: string, type: SearchResultType | 'all' = 'all') => {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: () => getSearch(query, type),
    enabled: !!query,
  });
};

export const useTrending = () => {
  return useQuery({
    queryKey: ['trending'],
    queryFn: getTrending,
  });
};

export const useHashtag = (tag: string) => {
  return useQuery({
    queryKey: ['hashtag', tag],
    queryFn: () => getHashtag(tag),
    enabled: !!tag,
  });
};
