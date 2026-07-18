import React from 'react';
import { clsx } from 'clsx';
import { MessageSquare, Heart, Share2 } from 'lucide-react';
import { cn } from '../Skeleton';
import { motion } from 'framer-motion';

export interface PostCardProps {
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  image?: string;
  className?: string;
}

export function PostCard({
  author,
  content,
  timestamp,
  likes,
  comments,
  image,
  className,
}: PostCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: 'var(--ch-shadow-lg)' }}
      className={cn("rounded-2xl bg-card border shadow-sm p-6 transition-colors", className)}
    >
      <div className="flex items-center gap-4 mb-5">
        <img
          src={author.avatar}
          alt={author.name}
          className="h-12 w-12 rounded-full object-cover border border-border"
        />
        <div>
          <h4 className="text-body font-bold text-foreground">
            {author.name}
          </h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
            {author.role && <span>{author.role} •</span>}
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
      
      <p className="text-body text-foreground whitespace-pre-wrap mb-5 leading-relaxed">
        {content}
      </p>
      
      {image && (
        <div className="mb-5 overflow-hidden rounded-xl border border-border">
          <img src={image} alt="Post content" className="w-full object-cover max-h-96" />
        </div>
      )}
      
      <div className="flex items-center gap-6 text-muted-foreground border-t border-border pt-4 mt-2">
        <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
          <Heart className="h-4 w-4" />
          <span>{likes}</span>
        </button>
        <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
          <MessageSquare className="h-4 w-4" />
          <span>{comments}</span>
        </button>
        <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors ml-auto">
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
