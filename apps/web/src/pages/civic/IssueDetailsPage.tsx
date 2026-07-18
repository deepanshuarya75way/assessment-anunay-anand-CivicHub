import { useParams } from 'react-router-dom';
import { useIssueDetails, useIssueFeed, useWatchIssue, useSupportIssue } from '../../features/civic/api/civic.api';
import MapView from '../../features/civic/components/MapView';
import StatusBadge from '../../features/civic/components/StatusBadge';
import CitizenUpdateComposer from '../../features/civic/components/CitizenUpdateComposer';
import { useAuthStore } from '../../stores/auth.store';
import { MapPin, AlertCircle, Heart, Bell } from 'lucide-react';

export default function IssueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: issue, isLoading, error } = useIssueDetails(id!);
  const { data: feed } = useIssueFeed(id!);
  
  const { mutate: watchIssue } = useWatchIssue();
  const { mutate: supportIssue } = useSupportIssue();
  
  const currentUser = useAuthStore(state => state.user);

  if (isLoading) return <div className="p-8 text-center text-text-secondary">Loading issue details...</div>;
  if (error || !issue) return <div className="p-8 text-center text-red-400">Failed to load issue.</div>;

  const handleWatch = () => watchIssue(issue.id);
  const handleSupport = () => supportIssue(issue.id);

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Details & Timeline */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={issue.currentStatus} />
              <span className="text-sm text-text-muted">Reported on {new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-4">{issue.title}</h1>
            <p className="text-lg text-text-secondary whitespace-pre-wrap">{issue.description}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-glass rounded-xl border border-glass-border">
            <button
              onClick={handleSupport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
            >
              <Heart className="w-4 h-4" />
              Support Issue
            </button>
            <button
              onClick={handleWatch}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-background border border-glass-border text-text-secondary hover:bg-background/80"
            >
              <Bell className="w-4 h-4" />
              Watch for Updates
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Activity Feed
            </h2>
            
            {currentUser && currentUser.id === issue.reporterId && (
              <CitizenUpdateComposer issueId={issue.id} />
            )}

            <div className="space-y-4">
              {feed?.map((item, idx) => (
                <div key={idx} className="p-4 bg-glass border border-glass-border rounded-xl">
                  <div className="text-sm text-text-muted mb-2">
                    {new Date(item.timestamp).toLocaleString()} - <span className="uppercase text-primary font-semibold">{item.type.replace('_', ' ')}</span>
                  </div>
                  {item.type === 'update' && (
                    <p className="text-text-primary">{item.data.text}</p>
                  )}
                  {item.type === 'workflow' && (
                    <p className="text-text-primary">Status changed to {item.data.status}</p>
                  )}
                  {(item.type === 'comment' || item.type === 'official_response') && (
                    <div className="flex gap-3">
                      {item.data.author.avatarUrl && <img src={item.data.author.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />}
                      <div>
                        <span className="font-semibold text-text-primary block">{item.data.author.firstName}</span>
                        <p className="text-text-secondary">{item.data.content.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Location & Meta */}
        <div className="w-full md:w-[350px] space-y-6">
          <div className="bg-glass rounded-2xl border border-glass-border overflow-hidden">
            <div className="p-4 border-b border-glass-border/50 bg-background/30">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Location
              </h3>
            </div>
            <div className="p-4 bg-background/20">
              <MapView location={issue.location} readOnly className="h-48 mb-3" />
              <p className="text-sm text-text-secondary">{issue.address || 'Coordinates provided'}</p>
            </div>
          </div>

          <div className="bg-glass rounded-2xl border border-glass-border p-5">
            <h3 className="font-semibold text-text-primary mb-4">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-muted">Issue ID</dt>
                <dd className="font-mono text-text-secondary">{issue.id.slice(-6).toUpperCase()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Reporter</dt>
                <dd className="text-text-primary">User {issue.reporterId.slice(-4)}</dd>
              </div>
              {issue.assignedDepartmentId && (
                <div className="flex justify-between">
                  <dt className="text-text-muted">Department</dt>
                  <dd className="text-primary hover:underline cursor-pointer">Assigned Dept</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

      </div>
    </div>
  );
}
