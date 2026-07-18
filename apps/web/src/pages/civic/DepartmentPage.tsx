import { useParams } from 'react-router-dom';
import { useIssues, useDepartments } from '../../features/civic/api/civic.api';
import IssueCard from '../../features/civic/components/IssueCard';
import { Building2 } from 'lucide-react';

export default function DepartmentPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: departments, isLoading: isLoadingDepts } = useDepartments();
  const { data: issues, isLoading: isLoadingIssues } = useIssues();

  if (isLoadingDepts || isLoadingIssues) {
    return <div className="p-8 text-center text-text-secondary">Loading department data...</div>;
  }

  const department = departments?.find(d => d.id === id);
  const departmentIssues = issues?.filter(i => i.assignedDepartmentId === id) || [];

  if (!department) {
    return <div className="p-8 text-center text-red-400">Department not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      
      {/* Header */}
      <div className="bg-glass rounded-3xl p-8 border border-glass-border shadow-glass mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Building2 className="w-48 h-48 text-primary" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/30">
              Department
            </span>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-3">{department.name}</h1>
          {department.description && (
            <p className="text-lg text-text-secondary max-w-2xl">{department.description}</p>
          )}
          
          <div className="mt-8 flex gap-6 text-sm">
            <div className="bg-background/40 px-4 py-2 rounded-xl border border-glass-border">
              <span className="text-text-muted block mb-1">Active Issues</span>
              <span className="font-bold text-text-primary text-xl">{departmentIssues.filter(i => i.currentStatus !== 'closed' && i.currentStatus !== 'resolved').length}</span>
            </div>
            <div className="bg-background/40 px-4 py-2 rounded-xl border border-glass-border">
              <span className="text-text-muted block mb-1">Total Issues</span>
              <span className="font-bold text-text-primary text-xl">{departmentIssues.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <h2 className="text-2xl font-bold text-text-primary mb-6">Assigned Issues</h2>
      
      {departmentIssues.length === 0 ? (
        <div className="text-center p-12 bg-glass rounded-2xl border border-glass-border border-dashed">
          <p className="text-text-secondary">No issues assigned to this department yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentIssues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}

    </div>
  );
}
