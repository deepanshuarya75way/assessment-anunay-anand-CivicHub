import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCampaign, useCampaignTasks, useJoinCampaign, useDeleteCampaign, useUpdateCampaignStatus, useDeleteTask, useAssignTask } from '../../features/volunteer/api';
import { PageShell } from '@civichub/ui';
import { AddTaskModal } from '../../features/volunteer/components/AddTaskModal';
import { EditCampaignModal } from '../../features/volunteer/components/EditCampaignModal';
import { useUiStore } from '../../stores/ui.store';
import { useAuthStore } from '../../stores/auth.store';
import { Share2, Trash2, Edit } from 'lucide-react';

export default function CampaignDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading: loadingCampaign } = useCampaign(id!);
  const { data: tasks, isLoading: loadingTasks } = useCampaignTasks(id!);
  const navigate = useNavigate();
  const joinMutation = useJoinCampaign(id!);
  const deleteCampaignMutation = useDeleteCampaign();
  const updateStatusMutation = useUpdateCampaignStatus(id!);
  const deleteTaskMutation = useDeleteTask(id!);
  const assignTaskMutation = useAssignTask(id!);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const showToast = useUiStore(s => s.showToast);
  const user = useAuthStore(s => s.user);

  const isOrganizer = user?.id === campaign?.organizerId;

  const shareCampaign = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: campaign?.title,
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      showToast({
        title: 'Link Copied',
        description: 'Campaign link copied to clipboard.',
        variant: 'success'
      });
    }
  };

  if (loadingCampaign || loadingTasks) return <div className="p-8">Loading...</div>;
  if (!campaign) return <div className="p-8">Campaign not found</div>;

  const handleDeleteCampaign = async () => {
    if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      await deleteCampaignMutation.mutateAsync(id!);
      navigate('/volunteer');
      showToast({ title: 'Campaign Deleted', variant: 'success' });
    }
  };

  const handlePublish = async () => {
    await updateStatusMutation.mutateAsync('PUBLISHED');
    showToast({ title: 'Campaign Published', description: 'Your campaign is now public.', variant: 'success' });
  };

  return (
    <PageShell>
      {campaign.bannerUrl && (
        <div className="w-full h-64 md:h-96 relative">
          <img 
            src={campaign.bannerUrl} 
            alt={campaign.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] to-transparent" />
        </div>
      )}
      <div className={`max-w-7xl mx-auto p-8 space-y-8 ${campaign.bannerUrl ? '-mt-32 relative z-10' : ''}`}>
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{campaign.title}</h1>
            <span className={`px-3 py-1 text-sm rounded-full ${
              campaign.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {campaign.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {isOrganizer && (
              <>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 font-semibold flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={handleDeleteCampaign}
                  disabled={deleteCampaignMutation.isPending}
                  className="px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/30 font-semibold flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                {campaign.status === 'DRAFT' && (
                  <button
                    onClick={handlePublish}
                    disabled={updateStatusMutation.isPending}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold"
                  >
                    {updateStatusMutation.isPending ? 'Publishing...' : 'Publish'}
                  </button>
                )}
              </>
            )}
            
            {(!isOrganizer && campaign.status === 'PUBLISHED') && (
              <button
                onClick={shareCampaign}
                className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 font-semibold flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            )}

            {(!isOrganizer && campaign.status === 'PUBLISHED') && (
              <button
                onClick={() => joinMutation.mutate()}
                disabled={joinMutation.isPending}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                {joinMutation.isPending ? 'Joining...' : 'Join Campaign'}
              </button>
            )}
          </div>
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
            <p className="font-semibold">{campaign.organizerName || campaign.organizerId}</p>
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
          {isOrganizer && (
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 text-sm"
            >
              Add Task
            </button>
          )}
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
              <div className="flex items-center gap-3">
                {isOrganizer ? (
                  <button 
                    onClick={() => deleteTaskMutation.mutate(task.id)}
                    className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => assignTaskMutation.mutate(task.id)}
                    disabled={assignTaskMutation.isPending || task.assignees.includes(user?.id || '')}
                    className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {task.assignees.includes(user?.id || '') ? 'Claimed' : 'Claim Task'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {(!tasks || tasks.length === 0) && (
            <p className="text-gray-400 italic">No tasks available yet.</p>
          )}
        </div>
      </div>
    </div>
    <AddTaskModal 
      campaignId={id!} 
      open={isTaskModalOpen} 
      onOpenChange={setIsTaskModalOpen} 
    />
    <EditCampaignModal
      campaign={campaign}
      open={isEditModalOpen}
      onOpenChange={setIsEditModalOpen}
    />
    </PageShell>
  );
}
