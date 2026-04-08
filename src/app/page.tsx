'use client';

import { useState, useEffect, useRef } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay,
  addMonths, subMonths, isBefore
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const MONTH_IMAGES = [
  "https://cdn.mos.cms.futurecdn.net/ScNJcsufWMLEzZK2tdHZXa-1920-80.jpg.webp",
  "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?q=80&w=1000",
  "https://i.pinimg.com/1200x/1f/aa/11/1faa1174d1285c25414c2d0b6e485105.jpg",
  "https://theworldpursuit.com/wp-content/uploads/2023/04/Best-Places-to-Visit-in-the-USA-in-April.jpg",
  "https://i.pinimg.com/1200x/16/7d/26/167d262f42b2699249fa91989e193fb9.jpg",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000",
  "https://images.unsplash.com/photo-1533327325824-76bc4e62d560?q=80&w=1000",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000",
  "https://i.pinimg.com/1200x/16/b7/8c/16b78cb07e58ad155dfbc629324bfafd.jpg",
  "https://i.pinimg.com/736x/57/73/91/577391e43909caa695c6668994a49779.jpg",
  "https://images.unsplash.com/photo-1445510491599-c391e8046a68?q=80&w=1000",
  "https://i.pinimg.com/1200x/8e/1f/6b/8e1f6b28d06887f95165c4fd86d0af4b.jpg"
];
const MONTH_THEMES = [
  "blue", "purple", "green", "pink",
  "emerald", "cyan", "indigo", "yellow",
  "orange", "red", "zinc", "rose"
];

const THEME_CLASSES = {
  blue: {
    bg: "bg-blue-400/90",
    light: "bg-blue-200",
    hover: "hover:bg-blue-50",
    ring: "ring-blue-400/40"
  },
  purple: {
    bg: "bg-purple-400/90",
    light: "bg-purple-200",
    hover: "hover:bg-purple-50",
    ring: "ring-purple-400/40"
  },
  green: {
    bg: "bg-green-400/90",
    light: "bg-green-200",
    hover: "hover:bg-green-50",
    ring: "ring-green-400/40"
  },
  pink: {
    bg: "bg-pink-400/90",
    light: "bg-pink-200",
    hover: "hover:bg-pink-50",
    ring: "ring-pink-400/40"
  },
  emerald: {
    bg: "bg-emerald-400/90",
    light: "bg-emerald-200",
    hover: "hover:bg-emerald-50",
    ring: "ring-emerald-400/40"
  },
  cyan: {
    bg: "bg-cyan-400/90",
    light: "bg-cyan-200",
    hover: "hover:bg-cyan-50",
    ring: "ring-cyan-400/40"
  },
  indigo: {
    bg: "bg-indigo-400/90",
    light: "bg-indigo-200",
    hover: "hover:bg-indigo-50",
    ring: "ring-indigo-400/40"
  },
  yellow: {
    bg: "bg-yellow-400/90",
    light: "bg-yellow-200",
    hover: "hover:bg-yellow-50",
    ring: "ring-yellow-400/40"
  },
  orange: {
    bg: "bg-orange-400/90",
    light: "bg-orange-200",
    hover: "hover:bg-orange-50",
    ring: "ring-orange-400/40"
  },
  red: {
    bg: "bg-red-400/90",
    light: "bg-red-200",
    hover: "hover:bg-red-50",
    ring: "ring-red-400/40"
  },
  zinc: {
    bg: "bg-zinc-400/90",
    light: "bg-zinc-300",
    hover: "hover:bg-zinc-100",
    ring: "ring-zinc-400/40"
  },
  rose: {
    bg: "bg-rose-400/90",
    light: "bg-rose-200",
    hover: "hover:bg-rose-50",
    ring: "ring-rose-400/40"
  }
};

export default function CalendarApp() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [currentNoteText, setCurrentNoteText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const saveTimerRef = useRef<any>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('tuf-calendar-notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  const saveNoteToStorage = (newNotes: Record<string, string>) => {
    setNotes(newNotes);
    localStorage.setItem('tuf-calendar-notes', JSON.stringify(newNotes));
  };

  const getNoteKey = () => {
    if (startDate && endDate) return `${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`;
    if (startDate) return format(startDate, 'yyyy-MM-dd');
    return 'default';
  };

  useEffect(() => {
    setCurrentNoteText(notes[getNoteKey()] || "");
  }, [startDate, endDate, notes]);

  // Timer ref for save debounce (if needed in the future)
  // const saveTimerRef = { current: null as any };
  // If you want to debounce saves, use useRef:
  // const saveTimerRef = useRef<any>(null);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCurrentNoteText(text);

    if (startDate) {
      saveNoteToStorage({ ...notes, [getNoteKey()]: text });

      setIsSaved(true);

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        setIsSaved(false);
      }, 1200);
    }
  };

  const nextMonth = () => {
    setDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const theme = MONTH_THEMES[currentMonth.getMonth()];
  const t = THEME_CLASSES[theme as keyof typeof THEME_CLASSES];

  const getDayClasses = (day: Date) => {
    let base =
      "relative h-8 w-8 md:h-10 md:w-10 flex items-center justify-center text-xs md:text-sm font-medium transition-all duration-150 " + (isDragging ? "cursor-grabbing" : "cursor-pointer");

    const isStart = startDate && isSameDay(day, startDate);
    const isEnd = endDate && isSameDay(day, endDate);
    const isBetween = startDate && endDate && day >= startDate && day <= endDate;
    const isCurrentMonth = isSameMonth(day, monthStart);
    const isToday = isSameDay(day, new Date());

    if (isStart && isEnd)
      return base + ` ${t.bg} text-white rounded-full shadow-lg`;

    if (isStart)
      return base + ` ${isDragging ? t.light : t.bg} text-${isDragging ? 'zinc-900' : 'white'} rounded-l-full shadow-lg`;

    if (isEnd)
      return base + ` ${isDragging ? t.light : t.bg} text-${isDragging ? 'zinc-900' : 'white'} rounded-r-full shadow-lg`;

    if (isBetween)
      return base + ` ${isDragging ? t.light : t.bg} text-zinc-900 shadow-inner transition-all duration-100 ease-out scale-[1.02]`;

    if (!isCurrentMonth)
      return base + " text-zinc-400 opacity-70";

    if (isToday)
      return base + ` ring-2 ${t.ring} text-zinc-900`;

    return base + ` text-zinc-900 ${t.hover}`;
  };

  const handleDateClick = (day: Date) => {
    if (!startDate || endDate) {
      setStartDate(day);
      setEndDate(null);
    } else if (isBefore(day, startDate)) {
      setStartDate(day);
    } else {
      setEndDate(day);
    }
  };

  const handleMouseDown = (day: Date) => {
    setIsDragging(true);
    setStartDate(day);
    setEndDate(null);
  };

  const handleMouseEnter = (day: Date) => {
    if (!isDragging || !startDate) return;

    if (isBefore(day, startDate)) {
      setEndDate(startDate);
      setStartDate(day);
    } else {
      setEndDate(day);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const currentImage = MONTH_IMAGES[currentMonth.getMonth()];

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-zinc-950 p-4 md:p-8 overflow-hidden select-none font-sans">

      {/* 1. DYNAMIC BACKGROUND AURA */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center blur-[120px] scale-125 pointer-events-none"
          style={{ backgroundImage: `url(${currentImage})` }}
        />
      </AnimatePresence>

      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl bg-white/90 backdrop-blur-2xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-[40px] overflow-hidden border border-white/20">

        {/* LEFT: PHOTO & GRID */}
        <div className="w-full md:w-2/3 flex flex-col relative overflow-hidden bg-white min-h-[720px]">

          <div className="absolute top-6 left-8 z-30 flex gap-4">
            <button onClick={prevMonth} className="h-12 w-12 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-xl border border-white/20 transition-all active:scale-90 shadow-xl">&larr;</button>
            <button onClick={nextMonth} className="h-12 w-12 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-xl border border-white/20 transition-all active:scale-90 shadow-xl">&rarr;</button>
          </div>

          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentMonth.toString()}
              custom={direction}
              variants={{
                enter: (d) => ({ y: d > 0 ? 600 : -600, opacity: 0 }),
                center: { y: 0, opacity: 1 },
                exit: (d) => ({ y: d < 0 ? 600 : -600, opacity: 0 })
              }}
              initial="enter" animate="center" exit="exit"
              transition={{ y: { type: "spring", stiffness: 60, damping: 15 }, opacity: { duration: 0.4 } }}
              className="flex flex-col w-full h-full absolute inset-0"
            >

              <div className="relative h-80 bg-zinc-900 flex items-end p-10 text-white overflow-hidden shrink-0">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${currentImage})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="relative z-10 w-full">
                  <h2 className="text-7xl font-serif tracking-tighter uppercase drop-shadow-2xl">{format(currentMonth, 'MMMM')}</h2>
                  <p className="text-2xl font-light opacity-60 tracking-[0.4em] mt-2">{format(currentMonth, 'yyyy')}</p>
                </div>
              </div>

              <div className="p-6 md:p-10 grow flex flex-col justify-start">

                {startDate && (
                  <div className="mb-4 text-xs font-semibold text-zinc-600 tracking-wide">
                    {endDate
                      ? `${format(startDate, 'MMM d')} → ${format(endDate, 'MMM d')}`
                      : `Start: ${format(startDate, 'MMM d')}`}
                  </div>
                )}

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 text-center mb-4">
                  {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(d => (
                    <div key={d} className="text-[10px] font-black text-zinc-400 tracking-[0.3em] uppercase">{d}</div>
                  ))}
                </div>

                {/* The Actual Dates Grid */}
                <div
                  className="grid grid-cols-7 gap-y-1 md:gap-y-2 gap-x-0 place-items-center"
                  onMouseUp={handleMouseUp}
                >
                  {calendarDays.map((day) => (
                    <motion.div
                      key={day.toString()}
                      onClick={() => handleDateClick(day)}
                      onMouseDown={() => handleMouseDown(day)}
                      onMouseEnter={() => handleMouseEnter(day)}
                      className={getDayClasses(day)}
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.08 }}
                    >
                      {format(day, 'd')}
                      {isSameDay(day, new Date()) && (
                        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-zinc-900" />
                      )}
                      {notes[format(day, 'yyyy-MM-dd')] && (
                        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: JOURNAL BOX */}
        <div className="w-full md:w-1/3 bg-zinc-50/50 backdrop-blur-xl p-10 flex flex-col z-40 border-l border-zinc-200">
          <h3 className="text-3xl font-serif font-bold text-zinc-900 mb-2">Journal</h3>
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-10 font-bold">
            {startDate && endDate ? `${format(startDate, 'MMM d')} — ${format(endDate, 'MMM d')}` :
              startDate ? format(startDate, 'MMMM d, yyyy') :
                "Select dates to record thoughts"}
          </p>

          <textarea
            value={currentNoteText}
            onChange={handleNoteChange}
            disabled={!startDate}
            className="grow w-full p-8 rounded-[32px] border border-white/40 focus:ring-2 focus:ring-zinc-900/5 focus:outline-none resize-none text-lg text-zinc-800 bg-white/60 shadow-inner disabled:opacity-50 transition-all leading-relaxed"
            placeholder={startDate ? "Write your memory..." : "Select a date to start writing"}
          ></textarea>
          <div className="mt-3 h-5">
            <AnimatePresence>
              {isSaved && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-green-500 font-semibold tracking-wide"
                >
                  Saved ✓
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-between text-[11px] text-zinc-400 font-black tracking-widest uppercase">
            <span>{startDate ? "Live Sync Active" : "Waiting"}</span>
            {startDate && <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></div>}
          </div>
        </div>

      </div>
    </main>
  );
}