import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommunityService } from '../services/community.service';

export const useFeed = () => {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = undefined }) => CommunityService.getFeed(20, pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.data.pageInfo.hasNextPage ? lastPage.data.pageInfo.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CommunityService.createPost,
    onMutate: async (newPost) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      
      const previousFeed = queryClient.getQueryData(['feed']);
      
      queryClient.setQueryData(['feed'], (old: any) => {
        if (!old || !old.pages || old.pages.length === 0) return old;

        // Create an optimistic post object
        const optimisticPost = {
          _id: `temp-${Date.now()}`,
          author: {
            userId: 'optimistic',
            firstName: 'You',
            lastName: '',
          },
          content: newPost.content,
          attachments: newPost.attachments,
          visibility: newPost.visibility,
          createdAt: new Date().toISOString(),
        };

        const newPages = [...old.pages];
        newPages[0] = {
          ...newPages[0],
          data: {
            ...newPages[0].data,
            posts: [optimisticPost, ...newPages[0].data.posts],
          }
        };

        return {
          ...old,
          pages: newPages,
        };
      });

      return { previousFeed };
    },
    onError: (_err, _newPost, context) => {
      // Rollback on error
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
    },
    onSettled: () => {
      // Background refetch to ensure correctness
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};
