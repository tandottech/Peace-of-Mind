"use client";
import React, { useState, useEffect } from "react";

export default function SmartPlanner() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
         if (data && Array.isArray(data)) {
            setTasks(data);
         }
      })
      .catch(console.error);
  }, []);

  const handleAddTask = async () => {
     try {
       const userTitle = prompt("Enter a new task:");
       if (!userTitle) return;

       const res = await fetch('/api/tasks', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({ title: userTitle, isUrgent: false, duration: "30 min" })
       });
       const newTask = await res.json();
       setTasks([newTask, ...tasks]);
     } catch (err) {
       console.error(err);
     }
  };

  const days = [
    { day: "MON", date: "23" },
    { day: "TUE", date: "24" },
    { day: "WED", date: "25", active: true },
    { day: "THU", date: "26" },
    { day: "FRI", date: "27" },
  ];

  const urgentTasks = tasks.filter(t => t.isUrgent);
  const importantTasks = tasks.filter(t => !t.isUrgent);

  return (
    <main className="flex flex-col pb-32 px-6 pt-12 min-h-screen relative">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 w-full pt-4">
        <div className="w-10 h-10 rounded-full bg-[#1b1c1a] border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Jamie"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-serif italic text-2xl tracking-tight text-[#2D4739]">
          Rise Again
        </span>
        <button className="text-[#2D4739] hover:opacity-70 transition-opacity">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      {/* Month & Year */}
      <div className="flex justify-between items-end mb-6">
        <h2 className="font-serif font-bold text-3xl text-[#1b1c1a]">
          September
        </h2>
        <span className="text-[#56423e]/60 font-medium tracking-widest text-sm mb-1">
          2024
        </span>
      </div>

      {/* Days Slider */}
      <section className="mb-8 w-full">
        <div className="flex justify-between items-center px-2">
          {days.map((item) => (
            <div
              key={item.date}
              className={`flex flex-col items-center justify-center p-3 rounded-full transition-all ${
                item.active
                  ? "bg-[#4B6253] text-[#fbf9f5] shadow-lg shadow-black/10 scale-110"
                  : "text-[#56423e]/70"
              }`}
            >
              <span className={`text-[0.6rem] font-bold tracking-widest mb-1 ${item.active ? "opacity-80" : "opacity-60"}`}>
                {item.day}
              </span>
              <span className={`font-serif text-xl leading-none ${item.active ? "" : "opacity-90"}`}>
                {item.date}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Energy Card */}
      <section className="mb-8 w-full">
        <div className="bg-[#f0f4ea]/80 rounded-[2rem] p-8 border border-white/50 backdrop-blur-md shadow-[0_8px_32px_rgba(45,71,57,0.05)] flex flex-col items-center text-center">
          
          <div className="relative w-32 h-32 mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#dce6d5" strokeWidth="10" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#648f76" strokeWidth="10" strokeDasharray="276" strokeDashoffset="33" className="transition-all duration-1000 ease-in-out" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-3xl text-[#2D4739] leading-none mb-1">88</span>
              <span className="text-[0.55rem] uppercase font-bold tracking-widest text-[#56423e]/60">Excellent</span>
            </div>
          </div>

          <h3 className="font-serif font-bold text-xl text-[#1b1c1a] leading-tight mb-3">
            You have 4 high-energy hours today
          </h3>
          <p className="text-[#56423e]/80 text-xs leading-relaxed max-w-[260px] mb-6">
            Based on your sleep cycles and calendar, 2 PM to 6 PM is your optimal deep-work window.
          </p>

          <button className="bg-[#648f76] text-white px-6 py-3 rounded-full text-sm font-bold shadow-sm hover:opacity-90 transition-opacity tracking-wide border border-white/20">
            Schedule My Day
          </button>
        </div>
      </section>

      {/* Dynamic Urgent Section */}
      {urgentTasks.length > 0 && (
        <section className="mb-8 w-full">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-serif font-bold text-xl text-[#1b1c1a]">Urgent</h3>
            <span className="bg-[#ff6b57] text-white px-3 py-1 rounded-md text-[0.6rem] font-bold uppercase tracking-widest">
              High Stakes
            </span>
          </div>

          {urgentTasks.map((t) => (
             <div key={t.id} className="bg-[#e4ebdd]/90 rounded-2xl p-5 border border-white/50 shadow-sm relative overflow-hidden mb-3">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff6b57]"></div>
               <div className="flex justify-between items-start mb-4">
                 <div className="flex gap-3 items-center">
                   <span className="text-[#ff6b57] text-xl font-bold">!</span>
                   <h4 className="font-medium text-[#1b1c1a] tracking-tight">{t.title}</h4>
                 </div>
               </div>
               <div className="w-full bg-[#fbf9f5] h-1.5 rounded-full overflow-hidden mb-3">
                 <div className="bg-[#ff6b57] w-4/5 h-full rounded-full"></div>
               </div>
             </div>
          ))}
        </section>
      )}

      {/* Dynamic Important Section */}
      <section className="w-full relative z-10 pb-4">
        <h3 className="font-serif font-bold text-xl text-[#1b1c1a] mb-4 flex items-center px-1">Important</h3>

        {importantTasks.length === 0 && <p className="text-sm text-[#56423e]/60 px-1 italic">No standard tasks planned yet. Add one!</p>}

        {importantTasks.map((t) => (
           <div key={t.id} className="bg-[#ebeee6]/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm flex flex-col mb-4">
             <div className="flex gap-3 items-center mb-2">
               <div className="w-5 h-5 rounded-full border-2 border-[#a3b8aa] flex overflow-hidden"></div>
               <h4 className="font-medium text-[#1b1c1a] tracking-tight">{t.title}</h4>
             </div>
             {t.duration && (
                <div className="pl-8 flex gap-4 text-[0.7rem] text-[#56423e] font-medium opacity-80 mt-1">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[0.9rem]">schedule</span> {t.duration}</span>
                </div>
             )}
           </div>
        ))}
      </section>

      {/* Floating Action Button */}
      <button onClick={handleAddTask} className="fixed bottom-24 right-6 w-14 h-14 bg-[#4B6253] text-[#fbf9f5] rounded-full shadow-lg shadow-[#4B6253]/30 flex items-center justify-center hover:scale-105 transition-transform z-40 border border-white/20">
        <span className="material-symbols-outlined text-[2rem]">add</span>
      </button>

    </main>
  );
}
