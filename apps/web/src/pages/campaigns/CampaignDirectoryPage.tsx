import { useCampaigns } from '../../features/volunteer/api';
import { Link } from 'react-router-dom';

export default function CampaignDirectoryPage() {
  const { data: campaigns, isLoading } = useCampaigns();

  if (isLoading) return <div className="p-8">Loading campaigns...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Volunteer Campaigns</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns?.map((campaign) => (
          <Link
            key={campaign.id}
            to={`/campaigns/${campaign.id}`}
            className="block bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{campaign.title}</h2>
              <span className={`px-2 py-1 text-xs rounded-full ${
                campaign.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' :
                campaign.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {campaign.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{campaign.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{new Date(campaign.startDate).toLocaleDateString()}</span>
              <span>Capacity: {campaign.capacity}</span>
            </div>
          </Link>
        ))}
        {(!campaigns || campaigns.length === 0) && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10">
            No campaigns found. Check back later or create one!
          </div>
        )}
      </div>
    </div>
  );
}
