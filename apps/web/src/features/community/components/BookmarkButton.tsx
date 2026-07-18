import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useToggleBookmark } from '../hooks/useInteractions';

interface BookmarkButtonProps {
  postId: string;
  initialIsBookmarked?: boolean;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ postId, initialIsBookmarked = false }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const toggleBookmark = useToggleBookmark(postId);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic local update
    setIsBookmarked(!isBookmarked);
    toggleBookmark.mutate(undefined, {
      onError: () => {
        // Rollback on error
        setIsBookmarked(isBookmarked);
      }
    });
  };

  return (
    <button 
      onClick={handleToggle}
      className={`flex items-center justify-center p-2 rounded-full transition-colors ${
        isBookmarked 
          ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
          : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
      }`}
      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
    >
      <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
    </button>
  );
};
