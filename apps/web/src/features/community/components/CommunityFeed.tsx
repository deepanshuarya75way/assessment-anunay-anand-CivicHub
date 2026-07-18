import React, { useEffect, useRef } from 'react';
import { useFeed } from '../hooks/useCommunity';
import { PostCard } from './PostCard';
import { Spinner } from '@civichub/ui';

export const CommunityFeed: React.FC = () => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">
        Failed to load feed. Please try again.
      </div>
    );
  }

  const posts = data?.pages.flatMap(page => page.data.posts) || [];

  if (posts.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No posts yet. Be the first to share something!
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      
      <div ref={observerTarget} className="py-4 flex justify-center">
        {isFetchingNextPage && <Spinner size="md" />}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-gray-500 text-sm">You have caught up!</p>
        )}
      </div>
    </div>
  );
};
