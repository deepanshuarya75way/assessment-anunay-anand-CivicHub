const statusConfig: Record<string, { label: string, colorClass: string }> = {
  reported: { label: 'Reported', colorClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  verified: { label: 'Verified', colorClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  assigned: { label: 'Assigned', colorClass: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  in_progress: { label: 'In Progress', colorClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  resolved: { label: 'Resolved', colorClass: 'bg-green-500/20 text-green-400 border-green-500/30' },
  closed: { label: 'Closed', colorClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.reported;
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.colorClass}`}>
      {config.label}
    </span>
  );
}
