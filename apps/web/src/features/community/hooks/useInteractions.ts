import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient as api } from '../../../api/client';

export const useComments = (postId: string) => {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam = undefined }) => {
      const params = new URLSearchParams({ limit: '20' });
      if (pageParam) params.append('cursor', pageParam as string);
      const { data } = await api.get(`/community/posts/${postId}/comments?${params.toString()}`);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.data.pageInfo.hasNextPage ? lastPage.data.pageInfo.nextCursor : undefined,
    initialPageParam: undefined,
  });
};

export const useToggleReaction = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: string) => {
      const { data } = await api.post(`/community/posts/${postId}/reactions`, { type });
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previousFeed = queryClient.getQueryData(['feed']);

      // Simple optimistic update strategy (in reality, update specific post reaction counts)
      
      return { previousFeed };
    },
    onError: (_err, _newReaction, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
    },
    onSettled: () => {
      // Invalidate specific post or rely on realtime updates
      // queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

export const useToggleBookmark = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/community/posts/${postId}/bookmarks`);
      return data;
    },
    onMutate: async () => {
      // Optimistic update for bookmark
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    }
  });
}
