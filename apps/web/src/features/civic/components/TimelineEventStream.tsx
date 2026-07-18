import { WorkflowHistory } from '@civichub/shared';
import StatusBadge from './StatusBadge';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export default function TimelineEventStream({ history }: { history: WorkflowHistory[] }) {
  // Sort by oldest first
  const sortedHistory = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-glass-border before:to-transparent">
      {sortedHistory.map((event, index) => {
        const isLast = index === sortedHistory.length - 1;
        return (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-3 h-3 rounded-full border-4 border-background bg-accent text-accent-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              {isLast ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Circle className="w-2 h-2 fill-current" />}
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow-glass border border-glass-border bg-glass backdrop-blur-sm transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <StatusBadge status={event.status} />
                <time className="text-xs text-text-secondary flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(event.timestamp).toLocaleDateString()}
                </time>
              </div>
              {event.note && (
                <p className="text-sm text-text-primary mt-2">{event.note}</p>
              )}
              <div className="text-xs text-text-secondary mt-3 pt-3 border-t border-glass-border/50">
                Updated by: {event.changedBy}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
