import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvent, useRegisterForEvent } from '../../features/events/api/events.api';
import EventTimeline from '../../features/events/components/EventTimeline';
import { useAuthStore } from '../../stores/auth.store';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useEvent(id!);
  const user = useAuthStore(state => state.user);
  const [activeTab, setActiveTab] = useState<'about' | 'schedule' | 'announcements'>('about');

  const { mutate: register, isPending: isRegistering } = useRegisterForEvent();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-accent animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
        <p className="text-slate-400 mb-6">The event you are looking for does not exist or has been removed.</p>
        <Link to="/events" className="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl transition-colors">
          Back to Events
        </Link>
      </div>
    );
  }

  const isOrganizer = user?.id === event.organizerId;
  const isPast = new Date(event.endTime) < new Date();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Banner */}
      <div className="h-64 md:h-96 w-full bg-slate-900 relative">
        <img 
          src={`https://picsum.photos/seed/${event.id}/1600/900`}
          alt={event.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto md:left-1/2 md:-translate-x-1/2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium uppercase tracking-wider">
                  {event.eventType}
                </span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-medium">
                  {event.status}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
              <p className="text-xl text-slate-300">
                {new Date(event.startTime).toLocaleDateString()}
              </p>
            </div>

            {!isOrganizer && !isPast && (
              <button 
                onClick={() => register(event.id)}
                disabled={isRegistering || event.status !== 'REGISTRATION_OPEN'}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  event.status === 'REGISTRATION_OPEN'
                    ? 'bg-accent hover:bg-accent/90 text-white hover:scale-105'
                    : 'bg-white/10 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isRegistering ? 'Registering...' : event.status === 'REGISTRATION_OPEN' ? 'Register Now' : 'Registration Closed'}
              </button>
            )}

            {isOrganizer && (
              <Link 
                to={`/events/${event.id}/dashboard`}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20"
              >
                Organizer Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/10 mb-8 overflow-x-auto pb-1">
          {['about', 'schedule', 'announcements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-2 text-sm font-medium transition-colors relative uppercase tracking-wider ${
                activeTab === tab ? 'text-accent' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-t-full shadow-[0_-2px_10px_rgba(var(--accent-rgb),0.5)]" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'about' && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-slate-300 leading-relaxed whitespace-pre-line">
                <h3 className="text-2xl font-bold text-white mb-6">About this event</h3>
                {event.description}
              </div>
            )}

            {activeTab === 'schedule' && (
              <EventTimeline schedules={event.schedules} />
            )}

            {activeTab === 'announcements' && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Announcements</h3>
                {event.announcements.length === 0 ? (
                  <p className="text-slate-400">No announcements have been posted yet.</p>
                ) : (
                  <div className="space-y-4">
                    {event.announcements.map(announcement => (
                      <div 
                        key={announcement.id} 
                        className={`p-4 rounded-xl border ${
                          announcement.priority === 'EMERGENCY' ? 'border-red-500/50 bg-red-500/10' :
                          announcement.priority === 'IMPORTANT' ? 'border-amber-500/50 bg-amber-500/10' :
                          'border-white/10 bg-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white">{announcement.title}</h4>
                          <span className="text-xs text-slate-400">{new Date(announcement.postedAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-300 text-sm">{announcement.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Details</h4>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <div>
                    <div className="text-white font-medium">Date & Time</div>
                    <div className="text-slate-400 text-sm">
                      {new Date(event.startTime).toLocaleDateString()} - {new Date(event.endTime).toLocaleDateString()}<br/>
                      {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <div className="w-full">
                    <div className="text-white font-medium">Location</div>
                    <div className="text-slate-400 text-sm mb-2">{event.address || 'Location TBA'}</div>
                    {event.location?.coordinates?.length === 2 && (
                      <div className="h-48 w-full rounded-xl overflow-hidden border border-white/10 relative z-0 mt-3">
                        <MapContainer 
                          center={[event.location.coordinates[1] as number, event.location.coordinates[0] as number]} 
                          zoom={15} 
                          style={{ height: '100%', width: '100%' }}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                          />
                          <Marker position={[event.location.coordinates[1] as number, event.location.coordinates[0] as number]} />
                        </MapContainer>
                      </div>
                    )}
                  </div>
                </div>

                {event.capacity && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-accent mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <div>
                      <div className="text-white font-medium">Capacity</div>
                      <div className="text-slate-400 text-sm">{event.capacity} people max</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
