import React, { useState } from 'react';
import { Avatar, Spinner } from '@civichub/ui';
import { useComments } from '../hooks/useInteractions';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { data, isLoading, fetchNextPage, hasNextPage } = useComments(postId);
  const [newComment, setNewComment] = useState('');

  if (isLoading) return <Spinner size="sm" />;

  const comments = data?.pages.flatMap(page => page.data.comments) || [];

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
      <div className="flex gap-3 mb-6">
        <Avatar src="" alt="You" />
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Write a comment..." 
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-full text-sm transition-colors outline-none"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newComment.trim()) {
                // Future: invoke create comment mutation
                setNewComment('');
              }
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment._id} className="flex gap-3">
            <Avatar src={comment.author.avatarUrl} alt={comment.author.firstName} />
            <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl rounded-tl-none">
              <div className="font-semibold text-sm mb-1">{comment.author.firstName} {comment.author.lastName}</div>
              <p className="text-sm text-gray-800 dark:text-gray-200">{comment.content.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} className="mt-4 text-sm text-blue-500 hover:underline">
          View more comments
        </button>
      )}
    </div>
  );
};
