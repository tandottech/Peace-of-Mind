"use client";
import React, { useState, useEffect } from "react";

export default function SmartPlanner() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isUrgentTask, setIsUrgentTask] = useState(false);
  const [newTaskDuration, setNewTaskDuration] = useState("30 min");
  const [isSaving, setIsSaving] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  
  // Calendar
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const calendarDays = React.useMemo(() => {
    const start = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [calendarMonth]);

  const prevMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));

  const selectDate = (d: Date) => {
    setActiveDate(d);
    if (d.getMonth() !== calendarMonth.getMonth()) {
      setCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  };

  useEffect(() => {
    const cacheKey = `kanbanTasks_${activeDate.toDateString()}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
       try { setTasks(JSON.parse(cached)); } catch (e) {}
    }

    fetch('/api/tasks?date=' + encodeURIComponent(activeDate.toISOString()))
      .then(res => res.json())
      .then(data => {
         if (data && Array.isArray(data)) {
            setTasks(data);
            localStorage.setItem(cacheKey, JSON.stringify(data));
         }
      })
      .catch(console.error);
  }, [activeDate]);

  const updateTaskStatus = async (id: string, status: string) => {
     // Optimistic UI update
     const updatedTasks = tasks.map(t => t.id === id ? { ...t, status } : t);
     setTasks(updatedTasks);
     localStorage.setItem(`kanbanTasks_${activeDate.toDateString()}`, JSON.stringify(updatedTasks));

     try {
       await fetch('/api/tasks', {
         method: 'PATCH',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({ id, status })
       });
     } catch (e) {
       console.error("Failed to patch status:", e);
     }
  };

  const openAddModal = () => setIsModalOpen(true);
  const closeAddModal = () => {
    setIsModalOpen(false);
    setNewTaskTitle("");
    setIsUrgentTask(false);
    setNewTaskDuration("30 min");
  };

  const submitNewTask = async () => {
     if (!newTaskTitle.trim()) return;
     setIsSaving(true);
     try {
       const res = await fetch('/api/tasks', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({ 
           title: newTaskTitle, 
           isUrgent: isUrgentTask, 
           duration: newTaskDuration,
           targetDate: activeDate.toISOString(),
           status: "STARTED" // Default Container
         })
       });
       const newTask = await res.json();
       const updatedTasks = [newTask, ...tasks];
       setTasks(updatedTasks);
       localStorage.setItem(`kanbanTasks_${activeDate.toDateString()}`, JSON.stringify(updatedTasks));
       closeAddModal();
     } catch (err) {
       console.error(err);
     } finally {
       setIsSaving(false);
     }
  };

  // Day Activity (from localStorage)
  const [dayActivity, setDayActivity] = useState<{ focusSessions: any[]; wellnessCompletions: any[]; journalEntries: any[] }>
    ({ focusSessions: [], wellnessCompletions: [], journalEntries: [] });

  useEffect(() => {
    const dateStr = activeDate.toDateString();
    const focusSessions = JSON.parse(localStorage.getItem('focusSessions') || '[]').filter((s: any) => s.date === dateStr);
    const wellnessCompletions = JSON.parse(localStorage.getItem('wellnessCompletions') || '[]').filter((s: any) => s.date === dateStr);
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]').filter((e: any) => new Date(e.date).toDateString() === dateStr);
    setDayActivity({ focusSessions, wellnessCompletions, journalEntries });
  }, [activeDate]);

  const totalFocusMinutes = dayActivity.focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  const startedTasks = tasks.filter(t => t.status === "STARTED");
  const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS");
  const completedTasks = tasks.filter(t => t.status === "COMPLETED");

  const totalTasks = tasks.length;
  const completedCount = completedTasks.length;
  const inProgressCount = inProgressTasks.length;
  // urgent completed tasks count double toward score
  const urgentCompleted = completedTasks.filter(t => t.isUrgent).length;
  const urgentTotal = tasks.filter(t => t.isUrgent).length;
  const rawScore = totalTasks === 0 ? 0 : Math.round(
    ((completedCount + urgentCompleted * 0.5 + inProgressCount * 0.3) / (totalTasks + urgentTotal * 0.5)) * 100
  );
  const score = Math.min(100, rawScore);
  const scoreGrade = score === 0 && totalTasks === 0 ? { label: "No Tasks", color: "#a3b8aa", ring: "#dce6d5" }
    : score < 30 ? { label: "Just Starting", color: "#ff6b57", ring: "#ff6b57" }
    : score < 60 ? { label: "Getting There", color: "#fbbc05", ring: "#fbbc05" }
    : score < 85 ? { label: "Great Progress", color: "#648f76", ring: "#648f76" }
    : { label: "Excellent", color: "#2d4739", ring: "#2d4739" };
  const circumference = 2 * Math.PI * 44; // r=44
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <main className="flex flex-col pb-32 px-12 pt-16 min-h-screen max-w-7xl mx-auto relative">
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* Header */}
      <header className="flex justify-between items-center mb-12 w-full">
        <div className="flex flex-col">
           <h1 className="font-serif font-bold text-[3rem] text-[#1b1c1a] leading-none mb-1">
             Smart Planner
           </h1>
           <span className="text-[#56423e]/60 font-medium tracking-widest text-sm uppercase">
             {activeDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
           </span>
        </div>
        <button className="text-[#2D4739] hover:bg-[#e5ead5]/40 p-2 rounded-full transition-colors">
          <span className="material-symbols-outlined text-2xl">settings</span>
        </button>
      </header>

      {/* Daily Progress Strip */}
      <div className="mb-10 bg-[#fbf9f5]/80 rounded-2xl px-6 py-5 border border-white/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#56423e]/50">
              {activeDate.toDateString() === new Date().toDateString() ? "Today's Progress" : "Day Progress"}
            </span>
            <span className="text-xs font-bold tracking-wide" style={{ color: scoreGrade.color }}>{scoreGrade.label}</span>
          </div>
          <div className="h-2 bg-[#e4ebd8] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${score}%`, backgroundColor: scoreGrade.color }}
            />
          </div>
        </div>
        <div className="flex gap-5 sm:border-l border-[#2d4739]/10 sm:pl-6 flex-shrink-0">
          {[
            { label: "Total", value: totalTasks, color: "#1b1c1a" },
            { label: "Active", value: inProgressCount, color: "#fbbc05" },
            { label: "Done", value: completedCount, color: "#648f76" },
            { label: "Score", value: `${score}%`, color: scoreGrade.color },
          ].map(s => (
            <div key={s.label} className="text-center">
              <span className="font-serif font-bold text-2xl leading-none block" style={{ color: s.color }}>{s.value}</span>
              <span className="text-[0.6rem] uppercase tracking-widest text-[#56423e]/50 font-bold mt-0.5 block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column - Main Tasks Feed (Kanban Layout) */}
        <div className="lg:col-span-8 flex flex-col pt-2 gap-10">
          
          {/* CONTAINER 1: STARTED (Checklist) */}
          <section className="w-full relative z-10">
            <div className="flex justify-between items-center mb-5 px-1 border-b border-[#2d4739]/10 pb-3">
               <h3 className="font-serif font-bold text-2xl text-[#1b1c1a] flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-[#ff6b57]"></span>
                 To Start
               </h3>
               <span className="text-sm font-medium text-[#56423e]/60 bg-[#ebeee6] px-2 py-0.5 rounded-md">{startedTasks.length}</span>
            </div>

            {startedTasks.length === 0 && inProgressTasks.length === 0 && completedTasks.length === 0 && (
              <div className="text-center py-10 bg-[#ebeee6]/40 rounded-3xl border border-white/50 border-dashed mb-5">
                <span className="material-symbols-outlined text-4xl text-[#2d4739]/30 block mb-3">edit_note</span>
                <p className="text-sm text-[#56423e]/60 font-medium mb-1">No tasks for this day yet.</p>
                <p className="text-xs text-[#56423e]/40">Hit the button below to add your first task.</p>
              </div>
            )}

            {/* Day Activity Records */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-4 px-1">
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#56423e]/35">
                  {activeDate.toDateString() === new Date().toDateString() ? "Today's Activity" : "Day Activity"}
                </span>
                <div className="flex-1 h-px bg-[#2d4739]/8"></div>
              </div>

              <div className="grid grid-cols-3 gap-3">

                {/* ── Focus Time ── */}
                <div className={`relative rounded-[1.4rem] overflow-hidden flex flex-col justify-between p-5 min-h-[130px] ${totalFocusMinutes > 0 ? 'bg-[#2d4739]' : 'bg-[#f3f6f0] border border-dashed border-[#a3b8aa]/40'}`}>
                  {totalFocusMinutes > 0 && (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#4a7a5e_0%,transparent_65%)] pointer-events-none" />
                  )}
                  <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center ${totalFocusMinutes > 0 ? 'bg-white/10' : 'bg-[#a3b8aa]/15'}`}>
                    <span className={`material-symbols-outlined text-[1.1rem] ${totalFocusMinutes > 0 ? 'text-white/80' : 'text-[#a3b8aa]'}`}>timer</span>
                  </div>
                  <div className="relative">
                    {totalFocusMinutes > 0 ? (
                      <>
                        <p className="font-serif font-bold text-[2.1rem] text-white leading-none">
                          {totalFocusMinutes}
                          <span className="text-[0.7rem] font-sans font-semibold text-white/50 ml-1">min</span>
                        </p>
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/40 mt-1">Focus Time</p>
                        <p className="text-[0.6rem] text-white/35 mt-0.5">{dayActivity.focusSessions.length} session{dayActivity.focusSessions.length !== 1 ? 's' : ''}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-serif font-bold text-[2.1rem] text-[#a3b8aa]/40 leading-none">0</p>
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[#56423e]/30 mt-1">Focus Time</p>
                        <p className="text-[0.6rem] text-[#56423e]/25 mt-0.5">No sessions yet</p>
                      </>
                    )}
                  </div>
                </div>

                {/* ── Wellness ── */}
                <div className={`relative rounded-[1.4rem] overflow-hidden flex flex-col justify-between p-5 min-h-[130px] ${dayActivity.wellnessCompletions.length > 0 ? 'bg-[#e8f2ec]' : 'bg-[#f3f6f0] border border-dashed border-[#a3b8aa]/40'}`}>
                  {dayActivity.wellnessCompletions.length > 0 && (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#c8dfd0_0%,transparent_65%)] pointer-events-none" />
                  )}
                  <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center ${dayActivity.wellnessCompletions.length > 0 ? 'bg-[#648f76]/20' : 'bg-[#a3b8aa]/15'}`}>
                    <span className={`material-symbols-outlined text-[1.1rem] ${dayActivity.wellnessCompletions.length > 0 ? 'text-[#2d4739]' : 'text-[#a3b8aa]'}`}>self_improvement</span>
                  </div>
                  <div className="relative">
                    {dayActivity.wellnessCompletions.length > 0 ? (
                      <>
                        <p className="font-serif font-bold text-[2.1rem] text-[#1b1c1a] leading-none">
                          {dayActivity.wellnessCompletions.length}
                          <span className="text-[0.7rem] font-sans font-semibold text-[#56423e]/40 ml-1">done</span>
                        </p>
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[#56423e]/40 mt-1">Wellness</p>
                        <p className="text-[0.6rem] text-[#56423e]/35 mt-0.5 truncate">{dayActivity.wellnessCompletions[dayActivity.wellnessCompletions.length - 1].exerciseTitle}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-serif font-bold text-[2.1rem] text-[#a3b8aa]/40 leading-none">0</p>
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[#56423e]/30 mt-1">Wellness</p>
                        <p className="text-[0.6rem] text-[#56423e]/25 mt-0.5">No exercises yet</p>
                      </>
                    )}
                  </div>
                </div>

                {/* ── Journal ── */}
                <div className={`relative rounded-[1.4rem] overflow-hidden flex flex-col justify-between p-5 min-h-[130px] ${dayActivity.journalEntries.length > 0 ? 'bg-[#2d4739]' : 'bg-[#f3f6f0] border border-dashed border-[#a3b8aa]/40'}`}>
                  {dayActivity.journalEntries.length > 0 && (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#4a7a5e_0%,transparent_65%)] pointer-events-none" />
                  )}
                  <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center ${dayActivity.journalEntries.length > 0 ? 'bg-white/10' : 'bg-[#a3b8aa]/15'}`}>
                    <span className={`material-symbols-outlined text-[1.1rem] ${dayActivity.journalEntries.length > 0 ? 'text-white/80' : 'text-[#a3b8aa]'}`}>edit_note</span>
                  </div>
                  <div className="relative">
                    {dayActivity.journalEntries.length > 0 ? (
                      <>
                        <p className="font-serif font-bold text-[2.1rem] text-white leading-none">
                          {dayActivity.journalEntries.length}
                          <span className="text-[0.7rem] font-sans font-semibold text-white/50 ml-1">{dayActivity.journalEntries.length === 1 ? 'entry' : 'entries'}</span>
                        </p>
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/40 mt-1">Journal</p>
                        <p className="text-[0.6rem] text-white/35 mt-0.5 truncate italic">"{dayActivity.journalEntries[0].text.slice(0, 22)}…"</p>
                      </>
                    ) : (
                      <>
                        <p className="font-serif font-bold text-[2.1rem] text-[#a3b8aa]/40 leading-none">0</p>
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[#56423e]/30 mt-1">Journal</p>
                        <p className="text-[0.6rem] text-[#56423e]/25 mt-0.5">No entries yet</p>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

            <div className="flex flex-col gap-3">
               {startedTasks.map((t) => (
                  <div key={t.id} className="bg-[#ebeee6]/80 hover:bg-[#e4ebd8] transition-all rounded-[1.2rem] p-4 border border-white/50 shadow-sm flex justify-between items-center group">
                    <div className="flex gap-4 items-center pl-1">
                      <button onClick={() => updateTaskStatus(t.id, "COMPLETED")} className="w-6 h-6 rounded-md border-2 border-[#a3b8aa] group-hover:border-[#648f76] transition-colors flex overflow-hidden flex-shrink-0 hover:bg-[#648f76]/20"></button>
                      <h4 className="font-medium text-[#1b1c1a] text-[1.1rem] tracking-tight">{t.title}</h4>
                      {t.isUrgent && <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#c02a1b] bg-[#ff6b57]/10 px-2 py-0.5 rounded ml-2">Urgent</span>}
                    </div>
                    <button 
                      onClick={() => updateTaskStatus(t.id, "IN_PROGRESS")}
                      className="bg-[#2d4739] text-[#fbf9f5] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm hover:scale-105 transition-transform flex items-center gap-1 opacity-0 group-hover:opacity-100"
                    >
                      <span className="material-symbols-outlined text-[1rem]">play_arrow</span> Start
                    </button>
                  </div>
               ))}
            </div>
          </section>

          {/* CONTAINER 2: IN PROGRESS */}
          {inProgressTasks.length > 0 && (
            <section className="w-full relative z-10">
              <div className="flex justify-between items-center mb-5 px-1 border-b border-[#2d4739]/10 pb-3">
                 <h3 className="font-serif font-bold text-2xl text-[#1b1c1a] flex items-center gap-2">
                   <span className="w-3 h-3 rounded-full bg-[#fbbc05] animate-pulse"></span>
                   In Progress
                 </h3>
                 <span className="text-sm font-medium text-[#56423e]/60 bg-[#ebeee6] px-2 py-0.5 rounded-md">{inProgressTasks.length}</span>
              </div>

              <div className="flex flex-col gap-4">
                 {inProgressTasks.map((t) => (
                   <div key={t.id} className="bg-gradient-to-r from-[#e4ebdd] to-[#f0f4ea] rounded-2xl p-6 border border-[#648f76]/30 shadow-md relative overflow-hidden group">
                     {/* Animated Progress Bar visually */}
                     <div className="absolute top-0 left-0 right-0 h-1 bg-[#648f76]/20 overflow-hidden">
                       <div className="w-1/2 h-full bg-[#648f76] rounded-full animate-pulse"></div>
                     </div>
                     
                     <div className="flex justify-between items-center mt-2">
                       <div className="flex flex-col gap-1">
                         <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#648f76]">Currently Working On</span>
                         <h4 className="font-bold text-[#1b1c1a] text-xl tracking-tight">{t.title}</h4>
                       </div>
                       <button 
                         onClick={() => updateTaskStatus(t.id, "COMPLETED")}
                         className="w-12 h-12 bg-[#648f76] hover:bg-[#2d4739] text-white rounded-full flex items-center justify-center shadow-lg transition-colors flex-shrink-0 ml-4"
                       >
                         <span className="material-symbols-outlined text-[1.4rem]">done</span>
                       </button>
                     </div>
                     {t.duration && (
                        <div className="flex gap-4 text-sm text-[#56423e] font-medium opacity-80 mt-4">
                          <span className="flex items-center gap-1.5 bg-white/40 px-3 py-1 rounded-full border border-white">
                             <span className="material-symbols-outlined text-[1rem]">schedule</span> Time block: {t.duration}
                          </span>
                        </div>
                     )}
                   </div>
                ))}
              </div>
            </section>
          )}

          {/* CONTAINER 3: COMPLETED */}
          {completedTasks.length > 0 && (
            <section className="w-full relative z-10 opacity-70 hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-center mb-5 px-1 pb-2">
                 <h3 className="font-serif font-bold text-xl text-[#56423e] flex items-center gap-2">
                   <span className="w-3 h-3 rounded-full bg-[#648f76]"></span>
                   Completed
                 </h3>
                 <span className="text-sm font-medium text-[#56423e]/60">{completedTasks.length}</span>
              </div>

              <div className="flex flex-col gap-2">
                 {completedTasks.map((t) => (
                    <div key={t.id} className="bg-[#f0f4ea]/40 rounded-xl p-3 px-5 border border-white/20 flex justify-between items-center">
                      <div className="flex gap-3 items-center line-through text-[#56423e]/60">
                        <span className="material-symbols-outlined text-[#648f76] text-[1.2rem]">check_circle</span>
                        <h4 className="font-medium text-[1rem]">{t.title}</h4>
                      </div>
                      <button onClick={() => updateTaskStatus(t.id, "STARTED")} className="text-[0.65rem] font-bold uppercase tracking-widest text-[#56423e]/40 hover:text-[#56423e] transition-colors">
                        Undo
                      </button>
                    </div>
                 ))}
              </div>
            </section>
          )}

          <button onClick={openAddModal} className="mt-8 py-5 border-2 border-dashed border-[#a3b8aa]/50 rounded-2xl text-[#2D4739] font-bold text-sm tracking-wide uppercase hover:bg-[#a3b8aa]/10 hover:border-[#a3b8aa] transition-all flex items-center justify-center gap-2 shadow-sm">
             <span className="material-symbols-outlined">add</span> ADD NEW TASK
          </button>
        </div>

        {/* Right Column - Overview Widgets */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          
          {/* Full Inline Calendar */}
          <section className="w-full bg-[#fbf9f5]/80 rounded-[2rem] p-5 border border-white/50 shadow-sm">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4 px-1">
              <button
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#e4ebd8] text-[#56423e]/60 hover:text-[#2d4739] transition-colors"
              >
                <span className="material-symbols-outlined text-[1.1rem]">chevron_left</span>
              </button>
              <div className="text-center">
                <p className="font-serif font-bold text-[#1b1c1a] text-base leading-none">
                  {calendarMonth.toLocaleDateString('en-US', { month: 'long' })}
                </p>
                <p className="text-[0.65rem] text-[#56423e]/50 font-bold tracking-widest uppercase mt-0.5">
                  {calendarMonth.getFullYear()}
                </p>
              </div>
              <button
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#e4ebd8] text-[#56423e]/60 hover:text-[#2d4739] transition-colors"
              >
                <span className="material-symbols-outlined text-[1.1rem]">chevron_right</span>
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-1">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} className="text-center text-[0.6rem] font-bold tracking-widest text-[#56423e]/35 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Date cells */}
            <div className="grid grid-cols-7 gap-y-1">
              {calendarDays.map((d, i) => {
                const isCurrentMonth = d.getMonth() === calendarMonth.getMonth();
                const isToday = d.toDateString() === new Date().toDateString();
                const isSelected = d.toDateString() === activeDate.toDateString();

                return (
                  <button
                    key={i}
                    onClick={() => selectDate(d)}
                    className={`
                      relative mx-auto flex flex-col items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-[#2d4739] text-white font-bold shadow-md'
                        : isToday
                        ? 'bg-[#e4f0ea] text-[#2d4739] font-bold ring-2 ring-[#648f76]/40'
                        : isCurrentMonth
                        ? 'text-[#1b1c1a] hover:bg-[#e4ebd8]'
                        : 'text-[#56423e]/20'}
                    `}
                  >
                    {d.getDate()}
                    {/* Task dot — shown for today and selected if tasks exist */}
                    {isCurrentMonth && tasks.length > 0 && isSelected && !isToday && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white/70"></span>
                    )}
                    {isCurrentMonth && tasks.length > 0 && isToday && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#648f76]"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Today shortcut */}
            {activeDate.toDateString() !== new Date().toDateString() && (
              <div className="mt-4 pt-4 border-t border-[#2d4739]/8 flex justify-center">
                <button
                  onClick={() => selectDate(new Date())}
                  className="text-[0.65rem] font-bold uppercase tracking-widest text-[#648f76] hover:text-[#2d4739] flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[0.9rem]">today</span> Back to Today
                </button>
              </div>
            )}
          </section>

          {/* Energy Card */}
          <section className="w-full">
            <div className="bg-[#f0f4ea]/80 rounded-[2rem] p-8 border border-white/50 backdrop-blur-md shadow-[0_8px_32px_rgba(45,71,57,0.05)] flex flex-col items-center text-center">
              
              <div className="relative w-40 h-40 mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#dce6d5" strokeWidth="8" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#648f76" strokeWidth="8" strokeDasharray="276" strokeDashoffset="33" className="transition-all duration-1000 ease-in-out drop-shadow-sm" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                  <span className="font-serif text-[2.5rem] text-[#2D4739] leading-none mb-1 shadow-sm">88</span>
                  <span className="text-[0.6rem] uppercase font-bold tracking-widest text-[#56423e]/70">Excellent</span>
                </div>
              </div>

              <h3 className="font-serif font-bold text-2xl text-[#1b1c1a] leading-tight mb-4">
                You have 4 high-energy hours today
              </h3>
              <p className="text-[#56423e]/80 text-sm leading-relaxed max-w-[260px] mb-8">
                Based on your sleep cycles and calendar, 2 PM to 6 PM is your optimal deep-work window.
              </p>

              <button
                onClick={() => setIsScheduleOpen(true)}
                className="w-full bg-[#648f76] text-white px-6 py-4 rounded-xl text-sm font-bold shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all tracking-wide border border-white/20"
              >
                Visualize Schedule
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1b1c1a]/40 backdrop-blur-sm" onClick={closeAddModal}></div>
          <div className="bg-[#f0f4ea] relative z-10 w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-white/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif font-bold text-2xl text-[#1b1c1a]">New Task</h3>
              <button onClick={closeAddModal} className="text-[#56423e]/50 hover:text-[#1b1c1a] transition-colors rounded-full p-1 bg-black/5 hover:bg-black/10">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#56423e]/60 mb-2">Task Title</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Finish Research Paper"
                  className="w-full bg-[#fbf9f5] text-[#1b1c1a] border border-white/60 focus:ring-2 focus:ring-[#648f76]/40 focus:outline-none rounded-xl p-4 text-base shadow-inner placeholder:text-[#56423e]/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#56423e]/60 mb-2">Duration</label>
                  <select 
                    value={newTaskDuration} 
                    onChange={(e) => setNewTaskDuration(e.target.value)}
                    className="w-full bg-[#fbf9f5] text-[#1b1c1a] border border-white/60 focus:ring-0 focus:outline-none rounded-xl p-4 text-sm shadow-inner cursor-pointer"
                  >
                    <option value="15 min">15 min</option>
                    <option value="30 min">30 min</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#56423e]/60 mb-2">Priority</label>
                  <button 
                    onClick={() => setIsUrgentTask(!isUrgentTask)}
                    className={`w-full flex items-center justify-center p-4 rounded-xl border transition-all text-sm font-medium ${isUrgentTask ? 'bg-[#ff6b57]/10 border-[#ff6b57]/30 text-[#c02a1b]' : 'bg-[#fbf9f5] border-white/60 text-[#56423e]/70 hover:bg-white'}`}
                  >
                    <span className="material-symbols-outlined text-[1.1rem] mr-2 flex-shrink-0">
                      {isUrgentTask ? 'priority_high' : 'fiber_manual_record'}
                    </span>
                    {isUrgentTask ? 'Urgent' : 'Normal'}
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={submitNewTask}
              disabled={isSaving || !newTaskTitle.trim()}
              className="w-full bg-[#648f76] text-white px-6 py-4 rounded-xl text-sm font-bold shadow-sm hover:translate-y-[-2px] hover:shadow-md disabled:hover:translate-y-0 disabled:opacity-50 transition-all tracking-wide flex justify-center items-center gap-2"
            >
              {isSaving ? (
                "Adding..."
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">add_task</span> Add to Planner
                </>
              )}
            </button>

          </div>
        </div>
      )}

      {/* Visualize Schedule Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1b1c1a]/40 backdrop-blur-sm" onClick={() => setIsScheduleOpen(false)}></div>
          <div className="bg-[#f0f4ea] relative z-10 w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-white/50 animate-in fade-in zoom-in-95 duration-200">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#1b1c1a]">Schedule Score</h3>
                <p className="text-xs text-[#56423e]/60 font-medium tracking-wide mt-0.5">
                  {activeDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button onClick={() => setIsScheduleOpen(false)} className="text-[#56423e]/50 hover:text-[#1b1c1a] transition-colors rounded-full p-1 bg-black/5 hover:bg-black/10">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Score Ring */}
            <div className="flex flex-col items-center py-6">
              <div className="relative w-44 h-44 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#dce6d5" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke={scoreGrade.color}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-serif text-[3rem] text-[#1b1c1a] leading-none">{score}</span>
                  <span className="text-[0.6rem] uppercase font-bold tracking-widest mt-1" style={{ color: scoreGrade.color }}>{scoreGrade.label}</span>
                </div>
              </div>

              {/* Breakdown */}
              {totalTasks === 0 ? (
                <p className="text-sm text-[#56423e]/60 text-center">No tasks planned for this day. Add tasks to track your progress.</p>
              ) : (
                <div className="w-full grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#fbf9f5] rounded-2xl p-4 flex flex-col items-center gap-1 border border-white/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b57]"></span>
                    <span className="font-serif font-bold text-2xl text-[#1b1c1a]">{startedTasks.length}</span>
                    <span className="text-[0.6rem] uppercase tracking-widest text-[#56423e]/50 font-bold">To Start</span>
                  </div>
                  <div className="bg-[#fbf9f5] rounded-2xl p-4 flex flex-col items-center gap-1 border border-white/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fbbc05]"></span>
                    <span className="font-serif font-bold text-2xl text-[#1b1c1a]">{inProgressCount}</span>
                    <span className="text-[0.6rem] uppercase tracking-widest text-[#56423e]/50 font-bold">In Progress</span>
                  </div>
                  <div className="bg-[#fbf9f5] rounded-2xl p-4 flex flex-col items-center gap-1 border border-white/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#648f76]"></span>
                    <span className="font-serif font-bold text-2xl text-[#1b1c1a]">{completedCount}</span>
                    <span className="text-[0.6rem] uppercase tracking-widest text-[#56423e]/50 font-bold">Done</span>
                  </div>
                </div>
              )}

              {/* Task bars */}
              {totalTasks > 0 && (
                <div className="w-full space-y-2.5">
                  {tasks.map((t) => (
                    <div key={t.id} className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        t.status === "COMPLETED" ? "bg-[#648f76]"
                        : t.status === "IN_PROGRESS" ? "bg-[#fbbc05]"
                        : "bg-[#ff6b57]"
                      }`}></span>
                      <span className={`text-sm flex-1 truncate ${t.status === "COMPLETED" ? "line-through text-[#56423e]/40" : "text-[#1b1c1a]"}`}>
                        {t.title}
                      </span>
                      {t.isUrgent && <span className="text-[0.55rem] font-bold uppercase tracking-widest text-[#c02a1b] bg-[#ff6b57]/10 px-1.5 py-0.5 rounded flex-shrink-0">Urgent</span>}
                      <span className={`text-[0.6rem] font-bold uppercase tracking-widest flex-shrink-0 ${
                        t.status === "COMPLETED" ? "text-[#648f76]"
                        : t.status === "IN_PROGRESS" ? "text-[#b8940a]"
                        : "text-[#56423e]/30"
                      }`}>
                        {t.status === "COMPLETED" ? "Done" : t.status === "IN_PROGRESS" ? "Active" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
