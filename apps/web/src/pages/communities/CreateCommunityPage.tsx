import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCommunity } from '../../features/communities/api/communities.api';
import { GlassButton, GlassInput, GlassTextarea } from '@civichub/ui';
import { CommunityVisibility } from '@civichub/shared';

export default function CreateCommunityPage() {
  const navigate = useNavigate();
  const createMutation = useCreateCommunity();
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<CommunityVisibility>(CommunityVisibility.PUBLIC);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const comm = await createMutation.mutateAsync({
        name,
        slug,
        description,
        visibility,
        categories: []
      });
      navigate(`/c/${comm.slug}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-2">Create a Community</h1>
      <p className="text-slate-500 mb-8">Build a space for discussions, sharing, and organizing around civic issues.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Community Name</label>
          <GlassInput 
            placeholder="e.g. Green Tech Enthusiasts"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">URL Slug</label>
          <GlassInput 
            placeholder="e.g. green-tech"
            value={slug}
            onChange={(e: any) => setSlug(e.target.value)}
            pattern="^[a-z0-9-]+$"
            title="Only lowercase letters, numbers, and hyphens"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <GlassTextarea 
            placeholder="What is this community about?"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            maxLength={500}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Visibility</label>
          <select 
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
            value={visibility}
            onChange={(e: any) => setVisibility(e.target.value as CommunityVisibility)}
          >
            <option value={CommunityVisibility.PUBLIC}>Public - Anyone can view and join</option>
            <option value={CommunityVisibility.PRIVATE}>Private - Only approved members can view</option>
            <option value={CommunityVisibility.RESTRICTED}>Restricted - Anyone can view, only approved members can post</option>
          </select>
        </div>

        <div className="pt-6">
          <GlassButton type="submit" loading={createMutation.isPending} className="w-full">
            Create Community
          </GlassButton>
        </div>
      </form>
    </div>
  );
}
