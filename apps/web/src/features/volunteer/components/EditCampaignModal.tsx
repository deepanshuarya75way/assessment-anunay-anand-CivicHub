import React, { useState, useEffect } from 'react';
import { GlassDialog, GlassDialogContent, GlassDialogHeader, GlassDialogTitle, GlassDialogFooter, GlassButton, GlassInput, GlassTextarea } from '@civichub/ui';
import { useUpdateCampaign } from '../api';
import { Campaign } from '@civichub/shared';

interface EditCampaignModalProps {
  campaign: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCampaignModal({ campaign, open, onOpenChange }: EditCampaignModalProps) {
  const [title, setTitle] = useState(campaign.title);
  const [description, setDescription] = useState(campaign.description);
  const [bannerUrl, setBannerUrl] = useState(campaign.bannerUrl || '');
  const [capacity, setCapacity] = useState<number | ''>(campaign.capacity);
  
  const updateMutation = useUpdateCampaign(campaign.id);

  useEffect(() => {
    setTitle(campaign.title);
    setDescription(campaign.description);
    setBannerUrl(campaign.bannerUrl || '');
    setCapacity(campaign.capacity);
  }, [campaign]);

  const handleSubmit = async () => {
    await updateMutation.mutateAsync({
      title,
      description,
      bannerUrl,
      capacity: Number(capacity)
    });
    
    onOpenChange(false);
  };

  return (
    <GlassDialog open={open} onOpenChange={onOpenChange}>
      <GlassDialogContent className="sm:max-w-lg">
        <GlassDialogHeader>
          <GlassDialogTitle>Edit Campaign</GlassDialogTitle>
        </GlassDialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Title</label>
            <GlassInput
              placeholder="Campaign Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <GlassTextarea
              placeholder="Detailed description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Banner Image URL (Optional)</label>
            <GlassInput
              placeholder="https://..."
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Volunteer Capacity</label>
            <GlassInput
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : '')}
            />
          </div>
        </div>
        
        <GlassDialogFooter>
          <GlassButton variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </GlassButton>
          <GlassButton 
            onClick={handleSubmit} 
            disabled={!title || !description || !capacity || updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </GlassButton>
        </GlassDialogFooter>
      </GlassDialogContent>
    </GlassDialog>
  );
}
