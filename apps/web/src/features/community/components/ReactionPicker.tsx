import React, { useState } from 'react';
import { Heart, ThumbsUp, PartyPopper, Lightbulb } from 'lucide-react';
import { useToggleReaction } from '../hooks/useInteractions';

interface ReactionPickerProps {
  postId: string;
  userReaction?: string;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ postId, userReaction }) => {
  const [activeReaction, setActiveReaction] = useState<string | undefined>(userReaction);
  const [isOpen, setIsOpen] = useState(false);
  const toggleReaction = useToggleReaction(postId);

  const reactions = [
    { type: 'LIKE', icon: ThumbsUp, color: 'text-blue-500' },
    { type: 'APPRECIATE', icon: Heart, color: 'text-red-500' },
    { type: 'CELEBRATE', icon: PartyPopper, color: 'text-yellow-500' },
    { type: 'INSIGHTFUL', icon: Lightbulb, color: 'text-purple-500' },
  ];

  const handleSelect = (type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Optimistic local update
    const previous = activeReaction;
    setActiveReaction(activeReaction === type ? undefined : type);
    setIsOpen(false);
    
    toggleReaction.mutate(type, {
      onError: () => {
        // Rollback
        setActiveReaction(previous);
      }
    });
  };

  const ActiveIcon = activeReaction 
    ? reactions.find(r => r.type === activeReaction)?.icon || Heart
    : Heart;

  const activeColor = activeReaction
    ? reactions.find(r => r.type === activeReaction)?.color
    : 'text-gray-500';

  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <button 
        onMouseEnter={() => setIsOpen(true)}
        onClick={(e) => {
          e.stopPropagation();
          if (activeReaction) handleSelect(activeReaction, e);
          else setIsOpen(true);
        }}
        className={`flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${activeColor}`}
      >
        <ActiveIcon size={20} fill={activeReaction ? 'currentColor' : 'none'} />
        <span>{activeReaction ? activeReaction.charAt(0) + activeReaction.slice(1).toLowerCase() : 'React'}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2">
          {reactions.map(({ type, icon: Icon, color }) => (
            <button
              key={type}
              onClick={(e) => handleSelect(type, e)}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-transform hover:scale-110 ${color}`}
              title={type}
            >
              <Icon size={24} fill={activeReaction === type ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
