import React, { useState } from 'react';
import { GlassDialog, GlassDialogContent, GlassDialogHeader, GlassDialogTitle, GlassDialogFooter, GlassButton, GlassInput, GlassTextarea } from '@civichub/ui';
import { useCreateCampaignTask } from '../api';

interface AddTaskModalProps {
  campaignId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTaskModal({ campaignId, open, onOpenChange }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [maxVolunteers, setMaxVolunteers] = useState<number | ''>(1);
  
  const createMutation = useCreateCampaignTask(campaignId);

  const handleSubmit = async () => {
    await createMutation.mutateAsync({
      campaignId,
      title,
      description,
      priority: priority as any,
      maxVolunteers: Number(maxVolunteers),
      status: 'OPEN',
      assignees: []
    });
    
    // Reset and close
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setMaxVolunteers(1);
    onOpenChange(false);
  };

  return (
    <GlassDialog open={open} onOpenChange={onOpenChange}>
      <GlassDialogContent className="sm:max-w-lg">
        <GlassDialogHeader>
          <GlassDialogTitle>Add New Task</GlassDialogTitle>
        </GlassDialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Title</label>
            <GlassInput
              placeholder="e.g. Set up registration desk"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <GlassTextarea
              placeholder="Detailed description of what needs to be done..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Priority</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW" className="bg-slate-900">Low</option>
                <option value="MEDIUM" className="bg-slate-900">Medium</option>
                <option value="HIGH" className="bg-slate-900">High</option>
                <option value="URGENT" className="bg-slate-900">Urgent</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Max Volunteers</label>
              <GlassInput
                type="number"
                min={1}
                value={maxVolunteers}
                onChange={(e) => setMaxVolunteers(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
          </div>
        </div>
        
        <GlassDialogFooter>
          <GlassButton variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </GlassButton>
          <GlassButton 
            onClick={handleSubmit} 
            disabled={!title || !description || !maxVolunteers || createMutation.isPending}
          >
            {createMutation.isPending ? 'Saving...' : 'Add Task'}
          </GlassButton>
        </GlassDialogFooter>
      </GlassDialogContent>
    </GlassDialog>
  );
}
