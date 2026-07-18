import { Issue } from '@civichub/shared';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { MapPin, Clock } from 'lucide-react';

export default function IssueCard({ issue }: { issue: Issue }) {
  const isResolved = issue.currentStatus === 'resolved' || issue.currentStatus === 'closed';

  return (
    <Link to={`/issues/${issue.id}`} className="block group">
      <div className={`p-5 rounded-2xl border transition-all duration-300 shadow-glass hover:-translate-y-1 hover:shadow-lg backdrop-blur-md
        ${isResolved ? 'bg-glass/50 border-glass-border/50' : 'bg-glass border-glass-border'}
      `}>
        <div className="flex justify-between items-start mb-4">
          <StatusBadge status={issue.currentStatus} />
          <time className="text-xs text-text-secondary flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(issue.createdAt).toLocaleDateString()}
          </time>
        </div>
        
        <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
          {issue.title}
        </h3>
        
        <p className="text-sm text-text-secondary line-clamp-2 mb-4">
          {issue.description}
        </p>

        <div className="flex items-center gap-4 text-xs font-medium text-text-muted">
          <div className="flex items-center gap-1.5 bg-background/50 px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5" />
            <span>{issue.address || 'Location provided'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
