import { Event } from '@civichub/shared';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {


  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300">
      {event.media.bannerId && (
        <div className="h-48 w-full bg-slate-800 relative">
          {/* Real implementation would use the media URL */}
          <img 
            src={`https://picsum.photos/seed/${event.id}/800/600`}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium">
            {event.status}
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-accent text-sm font-medium mb-1 uppercase tracking-wider">
              {event.eventType}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
          </div>
        </div>

        <p className="text-slate-300 text-sm mb-6 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-slate-400 text-sm">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {new Date(event.startTime).toLocaleDateString()} at {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="flex items-center text-slate-400 text-sm">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.address || 'Virtual / TBA'}</span>
          </div>
        </div>

        <Link 
          to={`/events/${event.id}`}
          className="block w-full py-3 px-4 bg-accent/20 hover:bg-accent/30 text-accent text-center font-medium rounded-xl transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
