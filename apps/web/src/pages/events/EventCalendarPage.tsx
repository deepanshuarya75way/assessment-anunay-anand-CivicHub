import { useEvents } from '../../features/events/api/events.api';
import EventCalendar from '../../features/events/components/EventCalendar';
import { Link } from 'react-router-dom';

export default function EventCalendarPage() {
  const { data: events, isLoading } = useEvents();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Event Calendar</h1>
            <p className="text-slate-400">View upcoming civic events by date.</p>
          </div>
          
          <Link 
            to="/events"
            className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium border border-white/10"
          >
            Back to Directory
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-accent animate-spin" />
          </div>
        ) : (
          <EventCalendar events={events || []} />
        )}
        
      </div>
    </div>
  );
}
