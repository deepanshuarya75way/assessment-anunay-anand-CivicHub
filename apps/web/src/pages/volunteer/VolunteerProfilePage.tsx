import { useState } from 'react';
import { useVolunteerProfile, useUpdateVolunteerProfile } from '../../features/volunteer/api';
import { useAuthStore } from '../../stores/auth.store';

export default function VolunteerProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { data: profile, isLoading } = useVolunteerProfile(user?.id || '');
  const updateMutation = useUpdateVolunteerProfile(user?.id || '');

  const [skillsStr, setSkillsStr] = useState(profile?.skills?.join(', ') || '');
  const [interestsStr, setInterestsStr] = useState(profile?.interests?.join(', ') || '');

  const handleSave = () => {
    updateMutation.mutate({
      skills: skillsStr.split(',').map(s => s.trim()).filter(Boolean),
      interests: interestsStr.split(',').map(s => s.trim()).filter(Boolean),
    });
  };

  if (isLoading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Volunteer Profile</h1>
        <button 
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Skills (comma separated)</label>
          <input
            type="text"
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            placeholder="e.g. First Aid, Event Planning, Gardening"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Interests (comma separated)</label>
          <input
            type="text"
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            value={interestsStr}
            onChange={(e) => setInterestsStr(e.target.value)}
            placeholder="e.g. Environment, Education, Elderly Care"
          />
        </div>
      </div>
    </div>
  );
}
