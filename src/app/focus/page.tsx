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

  // Timer side effects
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
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
    <main className="flex flex-col pb-32 px-6 pt-16 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-10 w-full relative z-10">
        <h1 className="font-serif text-3xl text-[#1b1c1a] tracking-tight">
          Jamie's Focus Room
        </h1>
        <button className="bg-[#e4e1d7]/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 text-[#56423e] text-[0.7rem] uppercase tracking-widest font-bold flex items-center shadow-sm">
          <span className="material-symbols-outlined text-[1rem] mr-1">
            visibility_off
          </span>
          Hide All
        </button>
      </header>

      {/* Tabs */}
      <section className="mb-14 relative z-10">
        <div className="flex bg-[#fbf9f5]/70 backdrop-blur-sm rounded-full p-1 border border-white/30 shadow-sm w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-2 rounded-full text-xs transition-all ${
                activeTab === tab
                  ? "bg-[#a6bea9] text-[#1b1c1a] font-bold shadow-md shadow-black/5 scale-[1.02] border border-white/20"
                  : "text-[#56423e]/70 font-medium hover:bg-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Timer Circle */}
      <section className="flex flex-col items-center justify-center mb-12 relative">
        <div className="w-[300px] h-[300px] rounded-full border border-[#fbf9f5]/50 flex flex-col items-center justify-center relative shadow-[0_0_80px_rgba(251,249,245,0.4)] backdrop-blur-sm bg-gradient-to-t from-transparent to-[#fbf9f5]/20">
          <h2 className="font-serif text-[6rem] text-[#1b1c1a] tracking-tighter tabular-nums leading-none mb-4 font-light">
            {minutes}:{seconds}
          </h2>
          
          {/* Controls overlapping circle bottom */}
          <div className="absolute -bottom-8 flex items-center justify-center gap-4">
            <button onClick={resetTimer} className="w-12 h-12 bg-[#fbf9f5] rounded-full shadow-lg shadow-black/5 flex items-center justify-center text-[#56423e] border border-white/50 hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">stop</span>
            </button>
            <button onClick={toggleTimer} className="w-20 h-20 bg-[#fbf9f5] rounded-full shadow-xl shadow-[#2d4739]/10 flex items-center justify-center text-[#2d4739] border border-white flex-shrink-0 hover:scale-105 transition-transform z-10">
              <span className="material-symbols-outlined text-4xl ml-2">
                {isActive ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button className="w-12 h-12 bg-[#fbf9f5] rounded-full shadow-lg shadow-black/5 flex items-center justify-center text-[#56423e] border border-white/50 hover:scale-105 transition-transform opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined">skip_next</span>
            </button>
          </div>
        </div>
      </section>

      {/* AI Spotify Embed */}
      <section className="mt-8 mb-4 w-full max-w-sm mx-auto relative z-10">
        <h3 className="text-xs uppercase tracking-widest text-[#56423e]/80 font-bold mb-3 flex items-center gap-1">
          <span className="material-symbols-outlined text-[1rem]">graphic_eq</span>
          AI Suggested • {ambientType} 
        </h3>
        <div className="w-full h-[152px] rounded-3xl overflow-hidden shadow-sm border border-white/40 opacity-90 hover:opacity-100 transition-opacity">
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
      </section>

      {/* Quote */}
      <section className="text-center px-4 relative z-10 w-full mb-8 mt-6">
        <span className="material-symbols-outlined text-4xl text-[#1b1c1a]/10 absolute -top-4 left-4 -z-10 font-serif">
          format_quote
        </span>
        <h3 className="font-serif italic text-xl text-[#1b1c1a] mb-3 opacity-90 tracking-tight">
          Focus is the art of <span className="text-[#649175] border-b border-[#649175]/30">letting go</span> of everything else.
        </h3>
      </section>

    </main>
  );
}
