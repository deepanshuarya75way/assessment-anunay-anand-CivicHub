import React, { useState } from 'react';
import { GlassCard, Avatar } from '@civichub/ui';
import { Post } from '../services/community.service';
import { MessageSquare, Share2 } from 'lucide-react';
import { ReactionPicker } from './ReactionPicker';
import { BookmarkButton } from './BookmarkButton';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const { author, content, attachments, createdAt } = post;
  
  return (
    <GlassCard className="mb-6 p-5">
      <div className="flex items-center gap-4 mb-4">
        <Avatar src={author.avatarUrl} alt={`${author.firstName} ${author.lastName}`} size="xl" />
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            {author.firstName} {author.lastName}
          </h4>
          <span className="text-sm text-gray-500">{new Date(createdAt).toLocaleString()}</span>
        </div>
      </div>
      
      <div className="mb-4 text-gray-800 dark:text-gray-200">
        <p className="whitespace-pre-wrap">{content.text}</p>
      </div>

      {attachments && attachments.length > 0 && (
        <div className="mb-4 grid gap-2 grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden">
          {attachments.map((attachment) => (
            attachment.type === 'IMAGE' ? (
              <img 
                key={attachment.id} 
                src={attachment.url} 
                alt="Post attachment" 
                className="w-full h-auto object-cover rounded-xl"
              />
            ) : null // Video/Document rendering can be added later
          ))}
        </div>
      )}

      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
        <ReactionPicker postId={post._id} />
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
        >
          <MessageSquare size={20} />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
          <Share2 size={20} />
        </button>
        <div className="ml-auto">
          <BookmarkButton postId={post._id} />
        </div>
      </div>
      
      {showComments && <CommentSection postId={post._id} />}
    </GlassCard>
  );
};
