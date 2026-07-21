import { useEffect, useState } from 'react';
import { useEvents } from '../../features/events/api/events.api';
import EventCard from '../../features/events/components/EventCard';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { PageShell } from '@civichub/ui';

function MapUpdater({ events }: { events: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (events && events.length > 0) {
      const bounds = L.latLngBounds(events.map(e => [e.location.coordinates[1], e.location.coordinates[0]]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [events, map]);
  return null;
}

// Fix Leaflet's default icon path issues with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function EventDirectoryPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'past'>('upcoming');
  const { data: events, isLoading } = useEvents();

  const filteredEvents = events?.filter(event => {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    
    if (activeTab === 'upcoming') return start > now;
    if (activeTab === 'live') return start <= now && end >= now;
    if (activeTab === 'past') return end < now;
    return true;
  });

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Events Directory</h1>
            <p className="text-slate-400">Discover and join civic activities in your community.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/events/calendar"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium border border-white/10"
            >
              Calendar View
            </Link>
            
            <div className="bg-white/5 p-1 rounded-xl flex border border-white/10">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'list' ? 'bg-accent text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                List
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'map' ? 'bg-accent text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/10 mb-8 overflow-x-auto pb-1">
          {['upcoming', 'live', 'past'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-2 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-accent' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-t-full shadow-[0_-2px_10px_rgba(var(--accent-rgb),0.5)]" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-accent animate-spin" />
          </div>
        ) : filteredEvents?.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <h3 className="text-xl text-white font-medium mb-2">No events found</h3>
            <p className="text-slate-400">There are no {activeTab} events to display.</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents?.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="h-[600px] rounded-3xl overflow-hidden border border-white/10 relative z-0">
            <MapContainer 
              center={[37.7749, -122.4194]} // Fallback center
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <MapUpdater events={filteredEvents?.filter(e => e.location?.coordinates?.length === 2) || []} />
              {filteredEvents?.filter(e => e.location?.coordinates?.length === 2).map(event => (
                <Marker 
                  key={event.id} 
                  position={[event.location!.coordinates[1], event.location!.coordinates[0]]}
                >
                  <Popup className="rounded-xl overflow-hidden custom-popup">
                    <div className="p-1">
                      <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{event.startTime ? new Date(event.startTime).toLocaleDateString() : 'TBD'}</p>
                      <Link 
                        to={`/events/${event.id}`}
                        className="text-accent text-sm font-medium hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            
            <style>{`
              .custom-popup .leaflet-popup-content-wrapper {
                border-radius: 0.75rem;
                overflow: hidden;
              }
            `}</style>
          </div>
        )}
        
      </div>
    </PageShell>
  );
}
