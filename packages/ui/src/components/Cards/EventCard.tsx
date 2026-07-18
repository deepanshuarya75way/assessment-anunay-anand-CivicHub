import React from 'react';
import { clsx } from 'clsx';
import { Calendar, MapPin, Users } from 'lucide-react';
import { cn } from '../Skeleton';
import { motion } from 'framer-motion';

export interface EventCardProps {
  title: string;
  date: string;
  location: string;
  attendees: number;
  image?: string;
  className?: string;
}

export function EventCard({
  title,
  date,
  location,
  attendees,
  image,
  className,
}: EventCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: 'var(--ch-shadow-lg)' }}
      className={cn("group flex flex-col overflow-hidden rounded-xl bg-card border shadow-sm transition-colors", className)}
    >
      {image && (
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-title font-semibold tracking-tight line-clamp-2 mb-3">
          {title}
        </h3>
        <div className="mt-auto flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{attendees} attendees</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
