"use client";
import React, { useState, useEffect } from "react";

export default function FocusRoom() {
  const [activeTab, setActiveTab] = useState("Deep Work");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isActive, setIsActive] = useState(false);
  const tabs = ["Deep Work", "Revision", "Quick Tasks"];
  
  // Spotify Data
  const [playlistId, setPlaylistId] = useState("37i9dQZF1DWZeKCadgRdKQ"); // default
  const [ambientType, setAmbientType] = useState("AI Recommended");

  // Custom Timer Data
  const [isCustomMenuOpen, setIsCustomMenuOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [timerNote, setTimerNote] = useState("");
  const [activeNote, setActiveNote] = useState("");

  // Timer side effects
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Save completed session to localStorage
      const durationMinutes = activeTab === "Deep Work" ? 45 : activeTab === "Revision" ? 25 : 15;
      const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
      sessions.push({ date: new Date().toDateString(), mode: activeTab, durationMinutes });
      localStorage.setItem('focusSessions', JSON.stringify(sessions));
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Tab change side effect - Fetch AI music recommendation
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await fetch('/api/focus-music', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ focusMode: activeTab })
        });
        const data = await response.json();
        if (data.playlistId) {
          setPlaylistId(data.playlistId);
          setAmbientType(data.ambientType);
        }
        // Reset timer logic
        if (activeTab === "Deep Work") setTimeLeft(45 * 60);
        else if (activeTab === "Revision") setTimeLeft(25 * 60);
        else setTimeLeft(15 * 60);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMusic();
  }, [activeTab]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(activeTab === "Deep Work" ? 45 * 60 : activeTab === "Revision" ? 25 * 60 : 15 * 60);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <main className="flex flex-col pb-32 px-12 pt-16 min-h-screen max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-16 w-full relative z-10">
        <h1 className="font-serif text-[2.5rem] text-[#1b1c1a] tracking-tight">
          Focus Room
        </h1>
        <button className="bg-[#e4e1d7]/50 hover:bg-[#e4e1d7] backdrop-blur-md rounded-full px-5 py-2.5 border border-white/20 text-[#56423e] text-xs uppercase tracking-widest font-bold flex items-center shadow-sm transition-colors">
          <span className="material-symbols-outlined text-[1.1rem] mr-2">
            visibility_off
          </span>
          Zen Mode
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column - Main Timer */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Tabs */}
          <section className="mb-14 relative z-10 w-full max-w-md">
            <div className="flex bg-[#fbf9f5]/70 backdrop-blur-sm rounded-full p-1.5 border border-white/30 shadow-sm w-full gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3.5 px-3 rounded-full text-sm transition-all ${
                    activeTab === tab
                      ? "bg-[#a6bea9] text-[#1b1c1a] font-bold shadow-md shadow-black/5 scale-[1.02] border border-white/20"
                      : "text-[#56423e]/70 font-medium hover:bg-white/40"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <button 
                onClick={() => setIsCustomMenuOpen(true)} 
                className={`flex-none p-3 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center ${
                  activeTab === "" 
                    ? "bg-[#a6bea9] text-[#1b1c1a] font-bold shadow-md shadow-black/5 scale-[1.02] border border-white/20" 
                    : "text-[#56423e]/70 hover:bg-white/40"
                }`}
              >
                 <span className="material-symbols-outlined text-[1.1rem]">tune</span>
              </button>
            </div>
          </section>

          {/* Timer Circle */}
          <section className="flex flex-col items-center justify-center relative">
            <div className="w-[420px] h-[420px] rounded-full border border-[#fbf9f5]/50 flex flex-col items-center justify-center relative shadow-[0_0_80px_rgba(251,249,245,0.4)] backdrop-blur-sm bg-gradient-to-t from-transparent to-[#fbf9f5]/30">
              <h2 className="font-serif text-[8rem] text-[#1b1c1a] tracking-tighter tabular-nums leading-none mb-6 font-light">
                {minutes}:{seconds}
              </h2>
              
              {/* Controls overlapping circle bottom */}
              <div className="absolute -bottom-10 flex items-center justify-center gap-6">
                <button onClick={resetTimer} className="w-14 h-14 bg-[#fbf9f5] rounded-full shadow-lg shadow-black/5 flex items-center justify-center text-[#56423e] border border-white/50 hover:scale-105 transition-transform hover:bg-white">
                  <span className="material-symbols-outlined text-xl">stop</span>
                </button>
                <button onClick={toggleTimer} className="w-24 h-24 bg-[#fbf9f5] rounded-full shadow-xl shadow-[#2d4739]/10 flex items-center justify-center text-[#2d4739] border border-white flex-shrink-0 hover:scale-105 transition-transform z-10 hover:bg-white">
                  <span className="material-symbols-outlined text-5xl ml-2">
                    {isActive ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <button className="w-14 h-14 bg-[#fbf9f5] rounded-full shadow-lg shadow-black/5 flex items-center justify-center text-[#56423e] border border-white/50 hover:scale-105 transition-transform opacity-50 cursor-not-allowed">
                  <span className="material-symbols-outlined text-xl">skip_next</span>
                </button>
              </div>
            </div>
          </section>

          {/* Note Panel (Only Visible if Intention is Set) */}
          {activeNote && (
            <div className="mt-20 bg-[#e4e1d7]/40 backdrop-blur-md rounded-2xl p-4 px-6 border border-white/30 max-w-sm text-center shadow-sm w-full animate-in slide-in-from-bottom-4 duration-300">
               <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-[#56423e]/50 mb-1">Focus Intention</span>
               <p className="text-[#56423e] font-serif italic text-lg leading-snug opacity-90">
                 "{activeNote}"
               </p>
            </div>
          )}
        </div>

        {/* Right Column - Secondary Actions (Spotify & Quote) */}
        <div className="lg:col-span-5 flex flex-col gap-12 mt-10">
          
          {/* Quote */}
          <section className="px-6 relative z-10 w-full mb-4 group">
            <span className="material-symbols-outlined text-6xl text-[#1b1c1a]/5 absolute -top-8 -left-2 -z-10 font-serif group-hover:scale-110 transition-transform">
              format_quote
            </span>
            <h3 className="font-serif italic text-3xl text-[#1b1c1a] mb-5 opacity-90 tracking-tight leading-snug">
              Focus is the art of <span className="text-[#649175] border-b-2 border-[#649175]/30 pb-1">letting go</span> of everything else.
            </h3>
            <p className="font-body text-[#1b1c1a]/70 text-sm leading-relaxed">
              In your Focus Room, time isn't a constraint, but a companion. Take a breath and commit to this session.
            </p>
          </section>

          {/* AI Spotify Embed */}
          <section className="w-full relative z-10">
            <div className="bg-[#f0f4ea]/80 rounded-[2rem] p-6 border border-white/50 backdrop-blur-md shadow-[0_8px_32px_rgba(45,71,57,0.05)]">
               <h3 className="text-xs uppercase tracking-widest text-[#56423e]/80 font-bold mb-4 flex items-center gap-1.5">
                 <span className="material-symbols-outlined text-[1.1rem]">auto_awesome</span>
                 Environment • {ambientType} 
               </h3>
               <div className="w-full h-[152px] rounded-2xl overflow-hidden shadow-sm border border-white/40 opacity-90 hover:opacity-100 transition-opacity">
                 <iframe 
                   src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`} 
                   width="100%" 
                   height="152" 
                   frameBorder="0" 
                   allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                   loading="lazy"
                   className="rounded-xl"
                 ></iframe>
               </div>
            </div>
          </section>

        </div>
      </div>

      {/* Custom Timer Overlay */}
      {isCustomMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1b1c1a]/40 backdrop-blur-sm" onClick={() => setIsCustomMenuOpen(false)}></div>
          <div className="bg-[#fbfcfa] relative z-10 w-full max-w-xl rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/80 animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#648f76]/10 text-[#2d4739] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[1.2rem]">tune</span>
                 </div>
                 <h3 className="font-serif font-bold text-3xl text-[#1b1c1a] tracking-tight">Configure Focus</h3>
              </div>
              <button onClick={() => setIsCustomMenuOpen(false)} className="text-[#56423e]/40 hover:text-[#1b1c1a] transition-colors p-2 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            <div className="space-y-6 mb-10">
              {/* Duration Field */}
              <div className="bg-[#f0f4ea]/60 p-6 rounded-3xl border border-white/60 shadow-inner">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#56423e]/70 mb-4">
                   <span className="material-symbols-outlined text-[1.1rem]">schedule</span>
                   Session Duration
                </label>
                <div className="relative">
                  <input 
                    autoFocus
                    type="number" 
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    placeholder="60"
                    className="w-full bg-[#fbf9f5] text-[#1b1c1a] border border-white focus:ring-4 focus:ring-[#648f76]/20 focus:border-[#648f76]/30 outline-none rounded-2xl p-5 pl-6 pr-24 text-2xl font-bold shadow-sm placeholder:text-[#56423e]/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[0.7rem] font-bold text-[#56423e]/40 uppercase tracking-widest pointer-events-none">Minutes</span>
                </div>
              </div>

              {/* Note Field */}
              <div className="bg-[#f0f4ea]/60 p-6 rounded-3xl border border-white/60 shadow-inner">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#56423e]/70 mb-4">
                   <span className="material-symbols-outlined text-[1.1rem]">edit_note</span>
                   Focus Intention <span className="opacity-50 lowercase tracking-normal font-medium ml-1">(Optional)</span>
                </label>
                <textarea 
                  value={timerNote}
                  onChange={(e) => setTimerNote(e.target.value)}
                  placeholder="What is your primary goal for this session?"
                  rows={2}
                  className="w-full bg-[#fbf9f5] text-[#1b1c1a] border border-white focus:ring-4 focus:ring-[#648f76]/20 focus:border-[#648f76]/30 outline-none rounded-2xl p-5 text-base shadow-sm placeholder:text-[#56423e]/30 transition-all resize-none leading-relaxed"
                />
              </div>
            </div>

            <button 
              disabled={!customMinutes || isNaN(parseInt(customMinutes))}
              onClick={() => {
                 const m = parseInt(customMinutes);
                 if (m > 0) {
                    setIsActive(false);
                    setActiveTab(""); 
                    setTimeLeft(m * 60);
                 }
                 setActiveNote(timerNote.trim());
                 setIsCustomMenuOpen(false);
              }}
              className="w-full relative group overflow-hidden bg-[#2d4739] text-white px-8 py-5 rounded-2xl text-[0.95rem] font-bold shadow-[0_8px_20px_rgba(45,71,57,0.2)] hover:shadow-[0_12px_25px_rgba(45,71,57,0.3)] disabled:opacity-50 disabled:hover:shadow-none transition-all tracking-wide flex justify-center items-center gap-3 hover:-translate-y-[2px]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-2xl"></div>
              <span className="material-symbols-outlined relative z-10 text-[1.3rem]">play_circle</span> 
              <span className="relative z-10">Commence Focus Session</span>
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
