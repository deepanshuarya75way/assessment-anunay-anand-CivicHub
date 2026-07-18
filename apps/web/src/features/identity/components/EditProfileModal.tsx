import React, { useState } from 'react';
import { IProfile } from '@civichub/shared';
import { useUpdateProfile } from '../api/identity.api';
import { GlassButton, GlassDialog, GlassDialogContent, GlassDialogHeader, GlassDialogTitle, GlassInput, GlassTextarea } from '@civichub/ui';
import ImageUploader from './ImageUploader';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: IProfile;
}

export default function EditProfileModal({ isOpen, onClose, profile }: EditProfileModalProps) {
  const updateProfile = useUpdateProfile();
  
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || '');
  const [website, setWebsite] = useState(profile.website || '');
  // const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  // const [coverUrl, setCoverUrl] = useState(profile.coverUrl || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        bio,
        location,
        website,
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GlassDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <GlassDialogContent>
        <GlassDialogHeader>
          <GlassDialogTitle>Edit Profile</GlassDialogTitle>
        </GlassDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="flex gap-4 mb-4">
            <ImageUploader 
              label="Upload Avatar" 
              onUpload={async (file) => {
                console.log('Avatar file:', file);
              }} 
            />
            <ImageUploader 
              label="Upload Cover" 
              onUpload={async (file) => {
                console.log('Cover file:', file);
              }} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
            <GlassTextarea 
              value={bio} 
              onChange={(e: any) => setBio(e.target.value)} 
              placeholder="Tell us about yourself..." 
              maxLength={500}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
            <GlassInput 
              value={location} 
              onChange={(e: any) => setLocation(e.target.value)} 
              placeholder="City, Country" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Website</label>
            <GlassInput 
              type="url"
              value={website} 
              onChange={(e: any) => setWebsite(e.target.value)} 
              placeholder="https://yourwebsite.com" 
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <GlassButton type="button" variant="ghost" onClick={onClose}>Cancel</GlassButton>
            <GlassButton type="submit" loading={updateProfile.isPending}>Save Changes</GlassButton>
          </div>
        </form>
      </GlassDialogContent>
    </GlassDialog>
  );
}
