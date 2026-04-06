"use client";
import React, { useState } from "react";
import Image from "next/image";

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

  const handleSaveReflection = async () => {
    if (!reflectionText.trim()) return;
    setIsSaving(true);
    try {
      await fetch('/api/reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reflectionText, mood: selectedMood })
      });
      setSaved(true);
      setTimeout(() => {
        setReflectionText("");
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
    setIsSaving(false);
  };

  return (
    <main className="flex flex-col pb-24 px-6 pt-12 min-h-screen">
      {/* Top Header */}
      <header className="flex justify-between items-center mb-10 w-full pt-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2D4739]">spa</span>
          <span className="font-serif italic text-xl tracking-tight text-[#2D4739]">
            Peace of Mind
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#1b1c1a] border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Jamie"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Greeting Title */}
      <section className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-[#2D4739] leading-tight">
          How are you feeling, <br /> Jamie?
        </h1>
        <p className="text-[#56423e] text-sm md:text-base opacity-90">
          Take a moment to check in with yourself.
        </p>
      </section>

      {/* Mood Selector Pill */}
      <section className="mb-8 w-full">
        <div className="flex bg-[#e5ead5]/60 backdrop-blur-md rounded-full p-2 justify-between items-center border border-white/30 shadow-[0_4px_24px_rgba(45,71,57,0.05)]">
          {moods.map((mood, idx) => {
            const isActive = selectedMood === mood.label;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 px-1">
                <button
                  onClick={() => setSelectedMood(mood.label)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-[#bcdcb5] shadow-sm transform scale-105"
                      : "bg-transparent text-[#56423e]/60 hover:bg-white/40"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${
                      isActive ? "text-[#2D4739]" : "text-[#56423e]"
                    }`}
                  >
                    {mood.icon}
                  </span>
                </button>
                <span
                  className={`text-[0.55rem] uppercase tracking-widest font-bold ${
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

      {/* Reflection Card */}
      <section className="mb-8">
        <div className="bg-[#f0f4ea]/80 rounded-3xl p-6 border border-white/50 backdrop-blur-md shadow-[0_8px_32px_rgba(45,71,57,0.05)]">
          <h2 className="font-serif italic text-xl text-[#2D4739] leading-snug mb-4 max-w-[200px]">
            What's one small thing that went well today?
          </h2>
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Write your thought here..."
            className="w-full bg-[#fbf9f5]/80 text-[#56423e] border border-white/60 focus:ring-0 focus:outline-none rounded-2xl p-4 text-sm resize-none h-24 shadow-inner placeholder:text-[#56423e]/40"
          ></textarea>
          <div className="flex justify-end mt-4">
            <button 
              onClick={handleSaveReflection}
              disabled={isSaving || saved || !reflectionText.trim()}
              className="bg-[#789684] text-white px-5 py-2.5 rounded-full text-[0.8rem] font-bold shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity tracking-wide"
            >
              {saved ? "Saved ✓" : isSaving ? "Saving..." : "Save reflection"}
            </button>
          </div>
        </div>
      </section>

      {/* Talk it Out Card */}
      <section className="mb-8">
        <div className="bg-[#e2ebe4]/90 rounded-3xl p-6 border border-white/50 backdrop-blur-md shadow-[0_8px_32px_rgba(45,71,57,0.05)] flex items-center justify-between">
          <div className="pr-4">
            <h3 className="font-serif font-bold text-lg text-[#2D4739] mb-2">
              Talk it Out
            </h3>
            <p className="text-[#56423e]/80 text-xs leading-relaxed mb-4">
              Need a safe space? Chat with our resilience guide for immediate
              support and mindfulness exercises.
            </p>
            <button className="text-[#2D4739] text-xs font-bold flex items-center gap-1 group">
              Start conversation{" "}
              <span className="material-symbols-outlined text-[1rem] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
          <div className="w-16 h-16 bg-[#fbf9f5] rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="material-symbols-outlined text-[2rem] text-[#2d4739]">
              forum
            </span>
          </div>
        </div>
      </section>

      {/* Guided Exercises Section */}
      <section>
        <div className="flex justify-between items-end mb-4 px-1">
          <h3 className="font-serif font-bold text-lg text-[#2D4739]">
            Guided Exercises
          </h3>
          <button className="text-[#56423e] text-[0.65rem] uppercase tracking-widest font-bold opacity-70 hover:opacity-100">
            VIEW ALL
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="bg-[#ebf1e8]/80 rounded-2xl p-4 border border-white/40 shadow-sm flex flex-col justify-between h-48">
            <div className="w-full bg-[#3d4c53] h-28 rounded-xl overflow-hidden flex items-end justify-center pb-2">
              <span className="material-symbols-outlined text-4xl text-[#71d8c1]">
                self_improvement
              </span>
            </div>
            <div className="mt-3">
              <h4 className="font-serif font-bold text-[#2D4739] leading-tight mb-1 text-sm">
                4-7-8 Breathing
              </h4>
              <p className="flex items-center text-[0.65rem] text-[#56423e] opacity-70">
                <span className="material-symbols-outlined text-[0.8rem] mr-1">
                  schedule
                </span>{" "}
                3 Mins
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#ebf1e8]/80 rounded-2xl p-4 border border-white/40 shadow-sm flex flex-col justify-between h-48">
            <div className="w-full bg-[#202020] h-28 rounded-xl overflow-hidden flex items-end justify-center pb-4">
              <span className="material-symbols-outlined text-4xl text-gray-400">
                waves
              </span>
            </div>
            <div className="mt-3">
              <h4 className="font-serif font-bold text-[#2D4739] leading-tight mb-1 text-sm">
                Grounding Scan
              </h4>
              <p className="flex items-center text-[0.65rem] text-[#56423e] opacity-70">
                <span className="material-symbols-outlined text-[0.8rem] mr-1">
                  schedule
                </span>{" "}
                5 Mins
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
