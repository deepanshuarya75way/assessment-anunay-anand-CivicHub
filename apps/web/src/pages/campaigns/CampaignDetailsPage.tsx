import { useParams } from 'react-router-dom';
import { useCampaign, useCampaignTasks, useJoinCampaign } from '../../features/volunteer/api';

export default function CampaignDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading: loadingCampaign } = useCampaign(id!);
  const { data: tasks, isLoading: loadingTasks } = useCampaignTasks(id!);
  const joinMutation = useJoinCampaign(id!);

  if (loadingCampaign || loadingTasks) return <div className="p-8">Loading...</div>;
  if (!campaign) return <div className="p-8">Campaign not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{campaign.title}</h1>
            <span className={`px-3 py-1 text-sm rounded-full ${
              campaign.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {campaign.status}
            </span>
          </div>
          <button
            onClick={() => joinMutation.mutate()}
            disabled={joinMutation.isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {joinMutation.isPending ? 'Joining...' : 'Join Campaign'}
          </button>
        </div>

        <div className="prose prose-invert max-w-none mb-8">
          <p className="text-lg text-gray-300">{campaign.description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border-t border-white/10 pt-8">
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Start Date</h3>
            <p className="font-semibold">{new Date(campaign.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400 mb-1">End Date</h3>
            <p className="font-semibold">{new Date(campaign.endDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Capacity</h3>
            <p className="font-semibold">{campaign.capacity} Volunteers</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Organizer</h3>
            <p className="font-semibold">{campaign.organizerId}</p>
          </div>
        </div>

        {campaign.objectives?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Objectives</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {campaign.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tasks</h2>
          {/* For organizer only in real app */}
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 text-sm">
            Add Task
          </button>
        </div>

        <div className="space-y-4">
          {tasks?.map(task => (
            <div key={task.id} className="p-4 border border-white/10 rounded-xl bg-black/20 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-gray-400 text-sm">{task.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-md ${
                    task.priority === 'HIGH' || task.priority === 'URGENT' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="text-xs px-2 py-1 bg-white/10 rounded-md text-gray-300">
                    {task.assignees.length} / {task.maxVolunteers} Assigned
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 text-sm font-medium">
                Claim Task
              </button>
            </div>
          ))}
          {(!tasks || tasks.length === 0) && (
            <p className="text-gray-400 italic">No tasks available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
