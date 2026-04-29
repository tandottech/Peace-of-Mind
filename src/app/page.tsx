"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [reflectionText, setReflectionText] = useState("");
  const [selectedMood, setSelectedMood] = useState("CALM");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const moods = [
    { icon: "sentiment_satisfied", label: "CALM" },
    { icon: "psychology", label: "FOCUSED" },
    { icon: "dark_mode", label: "TIRED" },
    { icon: "bolt", label: "ANXIOUS" },
    { icon: "lightbulb", label: "INSPIRED" },
  ];

  // State
  const [localEntries, setLocalEntries] = useState<any[]>([]);

  // LocalStorage generic initializer
  useEffect(() => {
    const draft = localStorage.getItem("draftReflection");
    if (draft) setReflectionText(draft);

    const saved = localStorage.getItem("journalEntries");
    if (saved) {
      try {
        setLocalEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Could not parse local journal entries", e);
      }
    }
  }, []);

  // Live draft synchronization
  useEffect(() => {
     if (reflectionText.trim() !== "") {
        localStorage.setItem("draftReflection", reflectionText);
     } else {
        localStorage.removeItem("draftReflection");
     }
  }, [reflectionText]);

  const handleSaveReflection = async () => {
    if (!reflectionText.trim()) return;
    setIsSaving(true);
    try {
      // Background Sync to API
      fetch('/api/reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reflectionText, mood: selectedMood })
      }).catch(console.error);
      
      // Foreground Sync to LocalStorage (Instant UI update)
      const newEntry = { 
         id: Date.now().toString(), 
         text: reflectionText, 
         mood: selectedMood, 
         date: new Date().toISOString() 
      };
      
      const updatedEntries = [newEntry, ...localEntries];
      setLocalEntries(updatedEntries);
      localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
      localStorage.removeItem("draftReflection");

      setSaved(true);
      setTimeout(() => {
        setReflectionText("");
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
    setIsSaving(false);
  };

  const getPromptForMood = (mood: string) => {
    switch (mood) {
      case "CALM": return "What's one small thing that went well today?";
      case "FOCUSED": return "What are you currently channeling your energy into?";
      case "TIRED": return "It's okay to rest. What do you need to recharge right now?";
      case "ANXIOUS": return "What is weighing on your mind? Let's write it down and release it.";
      case "INSPIRED": return "What new idea or realization sparked your creativity today?";
      default: return "What's on your mind?";
    }
  };

  const getPlaceholderForMood = (mood: string) => {
    switch (mood) {
      case "CALM": return "I felt at peace when...";
      case "FOCUSED": return "I am making progress on...";
      case "TIRED": return "Honestly, today drained me because...";
      case "ANXIOUS": return "I'm feeling overwhelmed by...";
      case "INSPIRED": return "I suddenly realized that...";
      default: return "Write your thought here...";
    }
  };

  return (
    <main className="flex flex-col pb-24 px-12 pt-16 min-h-screen max-w-7xl mx-auto">
      {/* Top Bar Dashboard */}
      <header className="flex justify-end items-center mb-16 w-full">
         <button className="text-[#2D4739] hover:bg-[#e5ead5]/40 p-2 rounded-full transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">notifications</span>
         </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column - Core Input & Feed */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Greeting Title */}
          <section className="mb-10">
            <h1 className="font-serif text-[3.5rem] mb-3 text-[#2D4739] leading-tight">
              How are you feeling, <br /> Tanish?
            </h1>
            <p className="text-[#56423e] text-lg opacity-90 font-medium">
              Take a moment to check in with yourself.
            </p>
          </section>

          {/* Mood Selector Pill */}
          <section className="mb-10 w-full max-w-lg">
            <div className="flex bg-[#e5ead5]/60 backdrop-blur-md rounded-full p-2.5 justify-between items-center border border-white/30 shadow-[0_4px_24px_rgba(45,71,57,0.05)]">
              {moods.map((mood, idx) => {
                const isActive = selectedMood === mood.label;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 px-2">
                    <button
                      onClick={() => setSelectedMood(mood.label)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-[#bcdcb5] shadow-sm transform scale-105"
                          : "bg-transparent text-[#56423e]/60 hover:bg-white/40"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-2xl ${
                          isActive ? "text-[#2D4739]" : "text-[#56423e]"
                        }`}
                      >
                        {mood.icon}
                      </span>
                    </button>
                    <span
                      className={`text-[0.6rem] uppercase tracking-widest font-bold ${
                        isActive ? "text-[#2D4739]" : "text-[#56423e]/60"
                      }`}
                    >
                      {mood.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Reflection Input Card */}
          <section className="mb-12 w-full max-w-xl">
            <div className="bg-[#f0f4ea]/80 rounded-[2rem] p-8 border border-white/50 backdrop-blur-md shadow-[0_8px_32px_rgba(45,71,57,0.05)] relative overflow-hidden transition-colors duration-300">
              <h2 className="font-serif italic text-2xl text-[#2D4739] leading-snug mb-6 max-w-[400px]">
                {getPromptForMood(selectedMood)}
              </h2>
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder={getPlaceholderForMood(selectedMood)}
                className="w-full bg-[#fbf9f5]/80 text-[#56423e] border border-white/60 focus:ring-0 focus:outline-none rounded-2xl p-5 text-base resize-none h-36 shadow-inner placeholder:text-[#56423e]/40 transition-colors hover:bg-white/90 focus:bg-white"
              ></textarea>
              <div className="flex justify-between items-center mt-6">
                <span className="text-xs uppercase tracking-widest font-bold text-[#56423e]/40 flex items-center gap-1">
                   {reflectionText.trim() ? <><span className="w-1.5 h-1.5 bg-[#648f76] rounded-full animate-pulse"></span> Auto-saving Draft</> : ''}
                </span>
                <button 
                  onClick={handleSaveReflection}
                  disabled={isSaving || saved || !reflectionText.trim()}
                  className="bg-[#789684] text-white px-8 py-3.5 rounded-full text-[0.85rem] font-bold shadow-sm hover:opacity-90 hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50 transition-all tracking-wide flex items-center gap-2"
                >
                  {saved ? "Saved to Journal ✓" : isSaving ? "Saving..." : "Save reflection"}
                </button>
              </div>
            </div>
          </section>

          {/* Local Journal Feed render */}
          {localEntries.length > 0 && (
             <section className="w-full max-w-xl">
               <h3 className="text-sm uppercase tracking-widest font-bold text-[#56423e]/60 mb-6 flex items-center gap-2">
                 <span className="material-symbols-outlined text-[1.1rem]">history</span> Recent Offline Entries
               </h3>
               <div className="flex flex-col gap-4">
                 {localEntries.map(entry => {
                   const moodObj = moods.find(m => m.label === entry.mood);
                   return (
                     <div key={entry.id} className="bg-[#fbf9f5]/60 p-6 rounded-[1.5rem] border border-white/40 shadow-sm relative group overflow-hidden">
                       <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-2 opacity-70">
                            <span className="material-symbols-outlined text-[#2D4739] text-base">{moodObj?.icon}</span>
                            <span className="text-[0.65rem] uppercase tracking-widest font-bold text-[#2D4739]">{entry.mood}</span>
                         </div>
                         <span className="text-xs font-medium text-[#56423e]/40 uppercase tracking-wide">
                            {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                         </span>
                       </div>
                       <p className="text-[#56423e] whitespace-pre-wrap leading-relaxed text-[0.95rem] opacity-90">
                         {entry.text}
                       </p>
                     </div>
                   )
                 })}
               </div>
             </section>
          )}
        </div>

        {/* Right Column - Secondary Actions */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          
          {/* Talk it Out Card */}
          <section>
            <div className="bg-[#e2ebe4]/90 rounded-[2rem] p-8 border border-white/50 backdrop-blur-md shadow-[0_8px_32px_rgba(45,71,57,0.05)] flex items-center justify-between hover:shadow-[0_12px_40px_rgba(45,71,57,0.08)] transition-shadow cursor-pointer group">
              <div className="pr-6">
                <h3 className="font-serif font-bold text-2xl text-[#2D4739] mb-3">
                  Talk it Out
                </h3>
                <p className="text-[#56423e]/80 text-sm leading-relaxed mb-6">
                  Need a safe space? Chat with our resilience guide for immediate
                  support and mindfulness exercises.
                </p>
                <div className="text-[#2D4739] text-sm font-bold flex items-center gap-1">
                  Start conversation{" "}
                  <span className="material-symbols-outlined text-[1.2rem] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
              <div className="w-20 h-20 bg-[#fbf9f5] rounded-3xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[2.5rem] text-[#2d4739]">
                  forum
                </span>
              </div>
            </div>
          </section>

          {/* Guided Exercises Section */}
          <section className="flex-1">
            <div className="flex justify-between items-end mb-6 px-2">
              <h3 className="font-serif font-bold text-2xl text-[#2D4739]">
                Library
              </h3>
              <button className="text-[#56423e] text-[0.7rem] uppercase tracking-widest font-bold opacity-70 hover:opacity-100 flex items-center gap-1">
                VIEW EXERCISES <span className="material-symbols-outlined text-[1rem]">arrow_right_alt</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              {/* Card 1 */}
              <div className="bg-[#ebf1e8]/80 cursor-pointer hover:bg-[#e4ebd8] transition-colors rounded-3xl p-5 border border-white/40 shadow-sm flex flex-col justify-between h-56">
                <div className="w-full bg-[#3d4c53] h-32 rounded-2xl overflow-hidden flex items-end justify-center pb-3 shadow-inner">
                  <span className="material-symbols-outlined text-5xl text-[#71d8c1]">
                    self_improvement
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="font-serif font-bold text-[#2D4739] text-base mb-1">
                    4-7-8 Breathing
                  </h4>
                  <p className="flex items-center text-[0.7rem] text-[#56423e] font-medium opacity-80">
                    <span className="material-symbols-outlined text-[0.9rem] mr-1">
                      schedule
                    </span>{" "}
                    3 Mins • Nervous System
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#ebf1e8]/80 cursor-pointer hover:bg-[#e4ebd8] transition-colors rounded-3xl p-5 border border-white/40 shadow-sm flex flex-col justify-between h-56">
                <div className="w-full bg-[#202020] h-32 rounded-2xl overflow-hidden flex items-end justify-center pb-4 shadow-inner">
                  <span className="material-symbols-outlined text-5xl text-gray-400">
                    waves
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="font-serif font-bold text-[#2D4739] text-base mb-1">
                    Grounding Scan
                  </h4>
                  <p className="flex items-center text-[0.7rem] text-[#56423e] font-medium opacity-80">
                    <span className="material-symbols-outlined text-[0.9rem] mr-1">
                      schedule
                    </span>{" "}
                    5 Mins • Anxiety Reset
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Feature Cards Row */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="font-serif font-bold text-2xl text-[#2D4739]">Explore</h3>
          <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#56423e]/40">All Features</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard" className="group bg-[#2d4739] text-white rounded-3xl p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl transition-all border border-white/10">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <span className="material-symbols-outlined text-xl">calendar_today</span>
            </div>
            <div>
              <p className="font-bold text-base leading-tight">Smart Planner</p>
              <p className="text-[0.7rem] text-white/55 mt-1 leading-relaxed">Plan and track your daily tasks</p>
            </div>
          </Link>
          <Link href="/focus" className="group bg-[#f0f4ea] rounded-3xl p-6 flex flex-col gap-4 border border-white/50 hover:-translate-y-1 hover:shadow-xl transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#2d4739]/10 flex items-center justify-center group-hover:bg-[#2d4739]/20 transition-colors">
              <span className="material-symbols-outlined text-xl text-[#2d4739]">timer</span>
            </div>
            <div>
              <p className="font-bold text-base text-[#1b1c1a] leading-tight">Focus Room</p>
              <p className="text-[0.7rem] text-[#56423e]/55 mt-1 leading-relaxed">Deep work with ambient sound</p>
            </div>
          </Link>
          <Link href="/wellness" className="group bg-[#f0f4ea] rounded-3xl p-6 flex flex-col gap-4 border border-white/50 hover:-translate-y-1 hover:shadow-xl transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#648f76]/15 flex items-center justify-center group-hover:bg-[#648f76]/25 transition-colors">
              <span className="material-symbols-outlined text-xl text-[#648f76]">self_improvement</span>
            </div>
            <div>
              <p className="font-bold text-base text-[#1b1c1a] leading-tight">Wellness</p>
              <p className="text-[0.7rem] text-[#56423e]/55 mt-1 leading-relaxed">Breathing & grounding exercises</p>
            </div>
          </Link>
          <Link href="/reframe" className="group bg-[#f0f4ea] rounded-3xl p-6 flex flex-col gap-4 border border-white/50 hover:-translate-y-1 hover:shadow-xl transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#56423e]/10 flex items-center justify-center group-hover:bg-[#56423e]/20 transition-colors">
              <span className="material-symbols-outlined text-xl text-[#56423e]">auto_awesome</span>
            </div>
            <div>
              <p className="font-bold text-base text-[#1b1c1a] leading-tight">Reframe</p>
              <p className="text-[0.7rem] text-[#56423e]/55 mt-1 leading-relaxed">AI cognitive reframing tool</p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
