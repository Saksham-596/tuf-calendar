'use client';

import { useState, useEffect } from 'react';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, format, isSameMonth, isSameDay, 
  isWithinInterval, addMonths, subMonths, isBefore 
} from 'date-fns';

export default function CalendarApp() {
  // ALL the state needed for this calendar is written here.
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [currentNoteText, setCurrentNoteText] = useState("");

  // Local Storage Sync
  useEffect(() => {
    const savedNotes = localStorage.getItem('tuf-calendar-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNoteToStorage = (newNotes: Record<string, string>) => {
    setNotes(newNotes);
    localStorage.setItem('tuf-calendar-notes', JSON.stringify(newNotes));
  };

  // DERIVE CURRENT NOTE KEY
  // here it get the key for note based on what is the selected range. it can be single date or range.
  const getNoteKey = () => {
    if (startDate && endDate) return `${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`;
    if (startDate) return format(startDate, 'yyyy-MM-dd');
    return 'default';
  };

  // Update textarea when selection changes
  useEffect(() => {
    setCurrentNoteText(notes[getNoteKey()] || "");
  }, [startDate, endDate, notes]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCurrentNoteText(text);
    if (startDate) {
      saveNoteToStorage({ ...notes, [getNoteKey()]: text });
    }
  };
  // Whole Calendar Logic is Here
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Start a new range
      setStartDate(day);
      setEndDate(null);
    } else if (isBefore(day, startDate)) {
      // Clicked before start date, reset start
      setStartDate(day);
    } else {
      // Valid end date
      setEndDate(day);
    }
  };

  const getDayClasses = (day: Date) => {
    let baseClass = "h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-colors ";
    
    // Not in current month
    if (!isSameMonth(day, monthStart)) baseClass += "text-gray-300 hover:bg-gray-100 ";
    else baseClass += "text-gray-700 hover:bg-gray-200 ";

    // Selection Logic
    const isStart = startDate && isSameDay(day, startDate);
    const isEnd = endDate && isSameDay(day, endDate);
    const isBetween = startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate });

    if (isStart || isEnd) return baseClass + "bg-blue-600 text-white hover:bg-blue-700 shadow-md";
    if (isBetween) return baseClass.replace("rounded-full", "rounded-none") + "bg-blue-100 text-blue-800 hover:bg-blue-200";

    return baseClass;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 md:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        
        {/* LEFT SIDE: Hero Image & Grid */}
        <div className="w-full md:w-2/3 flex flex-col">
          
          {/* Hero Section */}
          <div className="relative h-64 bg-blue-600 flex items-end justify-between p-6 text-white overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516912481808-3406841bd33c?q=80&w=1000")' }}></div>
            <div className="absolute inset-0 bg-black/20"></div> {/* Dark overlay for text readability */}
            
            <div className="relative z-10 flex gap-4 items-center mb-auto pt-4">
               <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm transition-all">&larr;</button>
               <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm transition-all">&rarr;</button>
            </div>

            <div className="relative z-10 text-right">
              <h2 className="text-4xl md:text-5xl font-bold tracking-wider uppercase">{format(currentMonth, 'MMMM')}</h2>
              <p className="text-xl md:text-2xl font-light">{format(currentMonth, 'yyyy')}</p>
            </div>
          </div>

          {/* Grid Section */}
          <div className="p-6 md:p-8 bg-white">
            <div className="grid grid-cols-7 gap-y-4 gap-x-1 md:gap-x-2 text-center mb-4">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                <div key={d} className="text-xs font-bold text-gray-400 tracking-widest">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-4 gap-x-1 md:gap-x-2 place-items-center">
              {calendarDays.map((day) => (
                <div 
                  key={day.toString()} 
                  onClick={() => handleDateClick(day)}
                  className={getDayClasses(day)}
                >
                  {format(day, 'd')}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDE: Notes Panel */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">Notes</h3>
          <p className="text-xs text-gray-500 mb-4">
            {startDate && endDate ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}` : 
             startDate ? format(startDate, 'MMMM d, yyyy') : 
             "Select a date to attach a note"}
          </p>
          
          <textarea 
            value={currentNoteText}
            onChange={handleNoteChange}
            disabled={!startDate}
            className="grow w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-700 bg-white shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            placeholder={startDate ? "Start typing to auto-save..." : "Awaiting date selection..."}
          ></textarea>
          
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
             <span>{startDate ? "Auto-saving to localStorage" : ""}</span>
             {startDate && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>}
          </div>
        </div>

      </div>
    </main>
  );
}