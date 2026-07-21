import { useState } from 'react';
import { Event } from '@civichub/shared';
import { Link } from 'react-router-dom';

interface EventCalendarProps {
  events: Event[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-light text-white">
          <span className="font-bold">{monthNames[currentDate.getMonth()]}</span> {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-4">
          <button onClick={prevMonth} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={nextMonth} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-slate-400 font-medium text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="aspect-square rounded-2xl bg-transparent" />
        ))}
        
        {days.map(day => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayEvents = events.filter(e => {
            const eDate = new Date(e.startTime);
            return eDate.getDate() === day && eDate.getMonth() === currentDate.getMonth() && eDate.getFullYear() === currentDate.getFullYear();
          });
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div 
              key={day} 
              className={`aspect-square rounded-2xl border transition-all duration-300 p-3 overflow-hidden flex flex-col ${
                isToday 
                  ? 'border-primary/30 bg-primary/5 relative' 
                  : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {isToday && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none" />
              )}
              
              <div className="mb-3 relative z-10">
                <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full ${
                  isToday 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'text-slate-300'
                }`}>
                  {day}
                </span>
              </div>
              
              <div className="space-y-2 flex-1 overflow-y-auto relative z-10">
                {dayEvents.slice(0, 3).map(event => (
                  <Link 
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="flex items-center gap-2 text-[11px] sm:text-xs bg-background/50 hover:bg-primary/10 border border-white/5 hover:border-primary/20 text-slate-300 hover:text-primary-300 px-2.5 py-1.5 rounded-lg transition-all group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary group-hover:scale-125 transition-all shrink-0" />
                    <span className="truncate font-medium">{event.title}</span>
                  </Link>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-slate-400 px-2 py-1.5 font-medium bg-white/5 rounded-lg text-center mt-1 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    +{dayEvents.length - 3} more events
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
