"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

type Category = "All" | "Breathing" | "Grounding" | "Meditation" | "Movement" | "Sleep";

interface Step { title: string; body: string }
interface BreathPhase { label: string; duration: number; color: string }

interface Exercise {
  id: string;
  title: string;
  category: Exclude<Category, "All">;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Intense";
  tagline: string;
  description: string;
  icon: string;
  type: "breathing" | "steps";
  breathCycle?: BreathPhase[];
  breathRounds?: number;
  steps?: Step[];
}

const EXERCISES: Exercise[] = [
  {
    id: "478",
    title: "4-7-8 Breathing",
    category: "Breathing",
    duration: "3 min",
    difficulty: "Easy",
    tagline: "Calm your nervous system fast",
    description: "A natural tranquilizer for the nervous system. Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 cycles.",
    icon: "air",
    type: "breathing",
    breathRounds: 4,
    breathCycle: [
      { label: "Inhale", duration: 4, color: "#648f76" },
      { label: "Hold", duration: 7, color: "#2d4739" },
      { label: "Exhale", duration: 8, color: "#a3b8aa" },
    ],
  },
  {
    id: "box",
    title: "Box Breathing",
    category: "Breathing",
    duration: "5 min",
    difficulty: "Easy",
    tagline: "Used by Navy SEALs to stay calm under pressure",
    description: "Equal-count breathing in four parts creates a mental 'box'. Ideal before exams or high-stress moments.",
    icon: "square",
    type: "breathing",
    breathRounds: 5,
    breathCycle: [
      { label: "Inhale", duration: 4, color: "#648f76" },
      { label: "Hold", duration: 4, color: "#2d4739" },
      { label: "Exhale", duration: 4, color: "#a3b8aa" },
      { label: "Hold", duration: 4, color: "#56423e" },
    ],
  },
  {
    id: "54321",
    title: "5-4-3-2-1 Grounding",
    category: "Grounding",
    duration: "5 min",
    difficulty: "Easy",
    tagline: "Anchor yourself in the present moment",
    description: "Use your five senses to defuse anxiety and pull your mind out of a spiral and back into the room.",
    icon: "sensors",
    type: "steps",
    steps: [
      { title: "5 things you can see", body: "Look around slowly. Name 5 objects you can actually see right now — a chair, a window, your hands. Say each one aloud or in your mind." },
      { title: "4 things you can touch", body: "Notice 4 textures. Reach out and feel the desk, your clothes, the floor beneath your feet. Be deliberate and slow." },
      { title: "3 things you can hear", body: "Close your eyes. Listen past the obvious. 3 sounds — distant traffic, a fan, your own breath. Let each one register." },
      { title: "2 things you can smell", body: "Draw a slow breath. What can you smell? Coffee, the air, a book, your own skin. Find 2 scents, however faint." },
      { title: "1 thing you can taste", body: "Notice the taste in your mouth right now. That is enough. You are here. You are grounded." },
    ],
  },
  {
    id: "bodyscan",
    title: "Body Scan",
    category: "Meditation",
    duration: "8 min",
    difficulty: "Moderate",
    tagline: "Release tension you didn't know you were holding",
    description: "A guided journey through your body, releasing stored tension. Especially effective after long study sessions.",
    icon: "self_improvement",
    type: "steps",
    steps: [
      { title: "Find a comfortable position", body: "Lie down or sit with your back straight. Close your eyes. Take three slow, deep breaths to settle in. Let your body soften." },
      { title: "Start at your feet", body: "Bring awareness to your feet. Notice any warmth, tingling, or tension. Without trying to change anything — just observe. Breathe into that space." },
      { title: "Move through your legs", body: "Slowly move your attention up through your calves, knees, and thighs. If you find tension, imagine your breath flowing into that area, softening it on the exhale." },
      { title: "Scan your core & back", body: "Notice your lower back, belly, chest. Is your jaw clenched? Are your shoulders raised? With each exhale, let them drop a little more." },
      { title: "Arms, neck, and face", body: "Move through your hands, arms, shoulders, neck, and finally your face. Release the small muscles around your eyes and mouth. Let your tongue rest." },
      { title: "Rest in wholeness", body: "Hold awareness of your entire body at once. You are fully here. Breathe steadily for a minute. When ready, slowly open your eyes." },
    ],
  },
  {
    id: "pmr",
    title: "Progressive Muscle Relaxation",
    category: "Movement",
    duration: "10 min",
    difficulty: "Moderate",
    tagline: "Physically release the weight you carry",
    description: "Tense and release each muscle group to train your body to recognize and dissolve physical stress.",
    icon: "fitness_center",
    type: "steps",
    steps: [
      { title: "Hands & Forearms", body: "Clench both fists as tight as you can. Hold for 5 seconds. Feel the tension. Then release completely — let your hands go limp. Notice the contrast." },
      { title: "Upper Arms", body: "Curl both arms up, flexing your biceps hard. Hold 5 seconds. Release and let your arms fall. Breathe." },
      { title: "Shoulders", body: "Raise both shoulders up toward your ears. Hold hard for 5 seconds. Drop them suddenly. Feel the release travel down your back." },
      { title: "Face", body: "Squeeze your whole face — scrunch your forehead, eyes, nose, and mouth together. Hold. Then let it all go. Feel the softness spread." },
      { title: "Legs & Feet", body: "Flex both feet upward, tightening your calves and thighs. Hold 5 seconds. Release. Then curl your toes hard. Hold. Release." },
      { title: "Full body rest", body: "You've done it. Lie still and feel the warmth in your muscles. Your whole body is heavier, softer. Rest here for 2 minutes before getting up." },
    ],
  },
  {
    id: "powerpose",
    title: "Power Pose Reset",
    category: "Movement",
    duration: "2 min",
    difficulty: "Easy",
    tagline: "Change your posture, change your chemistry",
    description: "Research shows that expansive postures raise confidence and lower cortisol. Use before a presentation or difficult moment.",
    icon: "accessibility_new",
    type: "steps",
    steps: [
      { title: "Stand tall", body: "Find space to stand. Roll your shoulders back. Lift your chin slightly. Plant your feet shoulder-width apart. Feel the ground beneath you." },
      { title: "Expand outward", body: "Place your hands on your hips — the classic 'Wonder Woman' pose. Or raise your arms in a V above your head. Either works. Hold for 1 minute." },
      { title: "Breathe with intention", body: "While holding the pose, take 5 slow, deep breaths. Inhale through your nose, exhale through your mouth. Feel your chest open." },
      { title: "Carry it with you", body: "Release the pose but keep the feeling. Walk to your next challenge with the same open chest and grounded feet. You've just shifted your state." },
    ],
  },
  {
    id: "mindfulbreath",
    title: "Mindful Breathing",
    category: "Meditation",
    duration: "5 min",
    difficulty: "Easy",
    tagline: "The simplest meditation that actually works",
    description: "Anchor attention to the breath, returning gently each time the mind wanders. The foundation of all meditation practice.",
    icon: "cool_to_dry",
    type: "breathing",
    breathRounds: 10,
    breathCycle: [
      { label: "Breathe In", duration: 4, color: "#648f76" },
      { label: "Breathe Out", duration: 6, color: "#a3b8aa" },
    ],
  },
  {
    id: "sleep",
    title: "Sleep Wind-Down",
    category: "Sleep",
    duration: "7 min",
    difficulty: "Easy",
    tagline: "Signal to your brain that the day is done",
    description: "A short ritual of breathing, body scanning, and cognitive offloading to prepare your mind for deep sleep.",
    icon: "bedtime",
    type: "steps",
    steps: [
      { title: "Dim everything down", body: "Reduce light in your space. Put your phone face-down. This cues your brain that the stimulation phase is over. Lie down." },
      { title: "Brain dump", body: "Spend 2 minutes writing (or mentally listing) everything still circling in your head — tasks, worries, ideas. Acknowledge each. Then set it aside until morning." },
      { title: "4-4-8 breath", body: "Inhale slowly for 4 counts. Hold for 4. Exhale for 8, longer than the inhale. Repeat 5 times. This activates your parasympathetic system." },
      { title: "Warm body scan", body: "Starting from your feet, imagine warmth spreading upward through your body — like lying in sunlight. Each area you visit, consciously relax it." },
      { title: "Let thoughts pass", body: "Thoughts will come. Don't chase them. Imagine them as clouds drifting through a dark sky. You're the sky — not the cloud. Return to the breath." },
    ],
  },
];

const CATEGORIES: Category[] = ["All", "Breathing", "Grounding", "Meditation", "Movement", "Sleep"];

const CATEGORY_COLORS: Record<Exclude<Category, "All">, { bg: string; text: string; dot: string }> = {
  Breathing:  { bg: "bg-[#e4f0ea]", text: "text-[#2d6045]", dot: "bg-[#648f76]" },
  Grounding:  { bg: "bg-[#f0ede5]", text: "text-[#7a5c35]", dot: "bg-[#c4974a]" },
  Meditation: { bg: "bg-[#eae8f0]", text: "text-[#4a3f7a]", dot: "bg-[#8a7fc4]" },
  Movement:   { bg: "bg-[#f0e8e4]", text: "text-[#7a3f35]", dot: "bg-[#c47a6a]" },
  Sleep:      { bg: "bg-[#e4e8f4]", text: "text-[#2d3f6e]", dot: "bg-[#5a78c4]" },
};

// ─── Breathing Player ─────────────────────────────────────────────────────────

function BreathingPlayer({ exercise, onClose, onComplete }: { exercise: Exercise; onClose: () => void; onComplete?: () => void }) {
  const cycle = exercise.breathCycle!;
  const totalRounds = exercise.breathRounds!;

  const [phase, setPhase] = useState(0);
  const [countdown, setCountdown] = useState(cycle[0].duration);
  const [round, setRound] = useState(1);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => { if (done) onComplete?.(); }, [done]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef(0);
  const countdownRef = useRef(cycle[0].duration);
  const roundRef = useRef(1);

  const clearTimer = () => { if (intervalRef.current) clearInterval(intervalRef.current); };

  const tick = useCallback(() => {
    countdownRef.current -= 1;
    if (countdownRef.current <= 0) {
      const nextPhase = (phaseRef.current + 1) % cycle.length;
      if (nextPhase === 0) {
        if (roundRef.current >= totalRounds) {
          setDone(true);
          setRunning(false);
          return;
        }
        roundRef.current += 1;
        setRound(roundRef.current);
      }
      phaseRef.current = nextPhase;
      countdownRef.current = cycle[nextPhase].duration;
      setPhase(nextPhase);
      setScale(cycle[nextPhase].label.toLowerCase().includes("inhale") || cycle[nextPhase].label.toLowerCase().includes("in") ? 1.35 : 1);
    }
    setCountdown(countdownRef.current);
  }, [cycle, totalRounds]);

  useEffect(() => {
    if (running) {
      setScale(cycle[phase].label.toLowerCase().includes("inhale") || cycle[phase].label.toLowerCase().includes("in") ? 1.35 : 1);
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [running]);

  const start = () => {
    phaseRef.current = 0; countdownRef.current = cycle[0].duration; roundRef.current = 1;
    setPhase(0); setCountdown(cycle[0].duration); setRound(1); setDone(false);
    setRunning(true);
  };

  const currentPhase = cycle[phase];
  const progressFraction = 1 - (countdown / currentPhase.duration);
  const circleCirc = 2 * Math.PI * 70;

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      {/* Circle */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#dce6d5" strokeWidth="6" />
          {running && (
            <circle
              cx="80" cy="80" r="70" fill="none"
              stroke={currentPhase.color} strokeWidth="6"
              strokeDasharray={circleCirc}
              strokeDashoffset={circleCirc * (1 - progressFraction)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          )}
        </svg>
        <div
          className="w-36 h-36 rounded-full flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out"
          style={{ backgroundColor: `${currentPhase.color}20`, transform: `scale(${running ? scale : 1})` }}
        >
          {done ? (
            <span className="material-symbols-outlined text-5xl text-[#648f76]">check_circle</span>
          ) : (
            <>
              <span className="font-serif text-4xl text-[#1b1c1a] leading-none">{running ? countdown : "–"}</span>
              <span className="text-[0.6rem] uppercase tracking-widest font-bold mt-1" style={{ color: currentPhase.color }}>
                {running ? currentPhase.label : "Ready"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Round counter */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <span key={i} className={`w-2 h-2 rounded-full transition-colors ${i < round - 1 || done ? "bg-[#648f76]" : i === round - 1 && running ? "bg-[#2d4739]" : "bg-[#dce6d5]"}`}></span>
        ))}
        <span className="text-xs text-[#56423e]/50 font-medium ml-2">
          {done ? "Complete" : `Round ${round} of ${totalRounds}`}
        </span>
      </div>

      {/* Cycle legend */}
      <div className="flex gap-4 flex-wrap justify-center">
        {cycle.map((p, i) => (
          <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${running && phase === i ? "bg-[#2d4739]/10 scale-105" : "opacity-40"}`}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
            <span style={{ color: p.color }}>{p.label}</span>
            <span className="text-[#56423e]/60">{p.duration}s</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 w-full">
        {done ? (
          <>
            <button onClick={start} className="flex-1 bg-[#2d4739] text-white py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[1.1rem]">replay</span> Repeat
            </button>
            <button onClick={onClose} className="flex-1 bg-[#ebeee6] text-[#2d4739] py-3.5 rounded-xl text-sm font-bold tracking-wide hover:-translate-y-0.5 transition-transform">
              Done
            </button>
          </>
        ) : running ? (
          <button onClick={() => setRunning(false)} className="w-full bg-[#ebeee6] text-[#56423e] py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform">
            <span className="material-symbols-outlined text-[1.1rem]">pause</span> Pause
          </button>
        ) : (
          <button onClick={start} className="w-full bg-[#2d4739] text-white py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform shadow-sm">
            <span className="material-symbols-outlined text-[1.1rem]">play_arrow</span> {phase === 0 && countdown === cycle[0].duration ? "Begin" : "Resume"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Steps Player ─────────────────────────────────────────────────────────────

function StepsPlayer({ exercise, onClose, onComplete }: { exercise: Exercise; onClose: () => void; onComplete?: () => void }) {
  const steps = exercise.steps!;
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => { if (done) onComplete?.(); }, [done]);

  const next = () => { if (step < steps.length - 1) setStep(step + 1); else setDone(true); };
  const prev = () => { if (done) { setDone(false); } else if (step > 0) setStep(step - 1); };

  return (
    <div className="flex flex-col gap-6">
      {/* Step progress */}
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${done || i < step ? "bg-[#648f76]" : i === step ? "bg-[#2d4739]" : "bg-[#dce6d5]"}`}></div>
        ))}
      </div>

      {done ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="w-20 h-20 rounded-full bg-[#e4f0ea] flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-[#648f76]">check_circle</span>
          </div>
          <h4 className="font-serif font-bold text-2xl text-[#1b1c1a]">Exercise Complete</h4>
          <p className="text-sm text-[#56423e]/70 max-w-xs">Take a moment to notice how you feel. Your nervous system thanks you.</p>
          <div className="flex gap-3 w-full mt-4">
            <button onClick={() => { setStep(0); setDone(false); }} className="flex-1 bg-[#ebeee6] text-[#2d4739] py-3.5 rounded-xl text-sm font-bold tracking-wide hover:-translate-y-0.5 transition-transform">
              Restart
            </button>
            <button onClick={onClose} className="flex-1 bg-[#2d4739] text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:-translate-y-0.5 transition-transform shadow-sm">
              Done
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Step number */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#2d4739] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step + 1}</span>
            <span className="text-xs uppercase tracking-widest text-[#56423e]/50 font-bold">Step {step + 1} of {steps.length}</span>
          </div>

          {/* Content */}
          <div className="bg-[#fbf9f5] rounded-2xl p-6 border border-white/60 min-h-[140px]">
            <h4 className="font-serif font-bold text-xl text-[#1b1c1a] mb-3">{steps[step].title}</h4>
            <p className="text-[#56423e]/80 leading-relaxed text-sm">{steps[step].body}</p>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button onClick={prev} disabled={step === 0} className="flex-none w-12 h-12 bg-[#ebeee6] text-[#56423e] rounded-xl flex items-center justify-center disabled:opacity-30 hover:-translate-y-0.5 transition-transform">
              <span className="material-symbols-outlined text-[1.1rem]">arrow_back</span>
            </button>
            <button onClick={next} className="flex-1 bg-[#2d4739] text-white py-3 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform shadow-sm">
              {step === steps.length - 1 ? "Finish" : "Next"}
              <span className="material-symbols-outlined text-[1.1rem]">{step === steps.length - 1 ? "check" : "arrow_forward"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Exercise Modal ───────────────────────────────────────────────────────────

function ExerciseModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const cat = CATEGORY_COLORS[exercise.category];

  const handleComplete = () => {
    const completions = JSON.parse(localStorage.getItem('wellnessCompletions') || '[]');
    completions.push({ date: new Date().toDateString(), exerciseTitle: exercise.title, category: exercise.category });
    localStorage.setItem('wellnessCompletions', JSON.stringify(completions));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1b1c1a]/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-[#f0f4ea] relative z-10 w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-white/50 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            <div className={`inline-flex items-center gap-1.5 ${cat.bg} ${cat.text} text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`}></span>
              {exercise.category}
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#1b1c1a] leading-tight">{exercise.title}</h2>
            <p className="text-sm text-[#56423e]/70 mt-1.5 leading-relaxed">{exercise.description}</p>
          </div>
          <button onClick={onClose} className="text-[#56423e]/50 hover:text-[#1b1c1a] transition-colors rounded-full p-1 bg-black/5 hover:bg-black/10 flex-shrink-0">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <span className="flex items-center gap-1.5 text-xs text-[#56423e]/60 font-medium bg-white/60 px-3 py-1.5 rounded-full border border-white/40">
            <span className="material-symbols-outlined text-[0.9rem]">schedule</span>{exercise.duration}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#56423e]/60 font-medium bg-white/60 px-3 py-1.5 rounded-full border border-white/40">
            <span className="material-symbols-outlined text-[0.9rem]">signal_cellular_alt</span>{exercise.difficulty}
          </span>
        </div>

        <div className="border-t border-[#2d4739]/10 pt-6">
          {exercise.type === "breathing"
            ? <BreathingPlayer exercise={exercise} onClose={onClose} onComplete={handleComplete} />
            : <StepsPlayer exercise={exercise} onClose={onClose} onComplete={handleComplete} />
          }
        </div>
      </div>
    </div>
  );
}

// ─── Exercise Card ────────────────────────────────────────────────────────────

function ExerciseCard({ exercise, onStart }: { exercise: Exercise; onStart: () => void }) {
  const cat = CATEGORY_COLORS[exercise.category];
  return (
    <div className="bg-[#f0f4ea]/80 rounded-[1.75rem] p-6 border border-white/50 shadow-sm flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cat.bg} flex-shrink-0`}>
          <span className={`material-symbols-outlined text-xl ${cat.text}`}>{exercise.icon}</span>
        </div>
        <span className={`flex items-center gap-1 ${cat.bg} ${cat.text} text-[0.55rem] font-bold uppercase tracking-widest px-2 py-1 rounded-full`}>
          <span className={`w-1 h-1 rounded-full ${cat.dot}`}></span>
          {exercise.category}
        </span>
      </div>

      {/* Title & tagline */}
      <div>
        <h3 className="font-serif font-bold text-lg text-[#1b1c1a] leading-snug mb-1">{exercise.title}</h3>
        <p className="text-xs text-[#56423e]/70 leading-relaxed line-clamp-2">{exercise.tagline}</p>
      </div>

      {/* Meta */}
      <div className="flex gap-3 mt-auto">
        <span className="text-[0.65rem] text-[#56423e]/50 font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-[0.85rem]">schedule</span>{exercise.duration}
        </span>
        <span className="text-[0.65rem] text-[#56423e]/50 font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-[0.85rem]">signal_cellular_alt</span>{exercise.difficulty}
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="w-full bg-[#2d4739] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 hover:-translate-y-0.5 transition-all shadow-sm"
      >
        <span className="material-symbols-outlined text-[1rem]">play_arrow</span> Start Exercise
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WellnessPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const filtered = activeCategory === "All"
    ? EXERCISES
    : EXERCISES.filter(e => e.category === activeCategory);

  const featuredExercise = EXERCISES[0]; // 4-7-8 breathing

  return (
    <main className="flex flex-col pb-24 px-12 pt-16 min-h-screen max-w-7xl mx-auto">
      <style jsx global>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      {/* Header */}
      <header className="mb-12">
        <h1 className="font-serif font-bold text-[3rem] text-[#1b1c1a] leading-none mb-2">Wellness Exercises</h1>
        <p className="text-[#56423e]/70 text-base font-medium max-w-lg">
          Science-backed techniques to regulate your nervous system, sharpen focus, and restore calm — in minutes.
        </p>
      </header>

      {/* Featured Card */}
      <section className="mb-12">
        <div className="bg-[#2d4739] rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-lg border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="w-96 h-96 rounded-full bg-white absolute -top-20 -right-20"></div>
            <div className="w-64 h-64 rounded-full bg-white absolute bottom-0 left-1/3"></div>
          </div>
          <div className="flex-1 relative z-10">
            <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#a3b8aa] mb-3 block">Featured · Quickest Relief</span>
            <h2 className="font-serif font-bold text-3xl text-white leading-tight mb-3">4-7-8 Breathing</h2>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
              One of the most researched breathwork techniques for acute anxiety. Four rounds takes under 4 minutes and can halt a stress response in its tracks.
            </p>
            <button
              onClick={() => setActiveExercise(featuredExercise)}
              className="bg-white text-[#2d4739] px-6 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-md transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[1.1rem]">play_circle</span> Begin Now
            </button>
          </div>
          <div className="flex-shrink-0 w-40 h-40 rounded-full bg-white/10 border border-white/20 flex items-center justify-center relative">
            <div className="w-28 h-28 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-white/80">air</span>
            </div>
            <span className="absolute top-3 right-3 text-[0.55rem] font-bold uppercase tracking-widest text-white/50">3 min</span>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
              activeCategory === cat
                ? "bg-[#2d4739] text-white border-[#2d4739] shadow-sm"
                : "bg-[#f0f4ea]/80 text-[#56423e]/70 border-white/50 hover:bg-[#e4ebd8]"
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#56423e]/40 font-medium self-center">
          {filtered.length} exercise{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onStart={() => setActiveExercise(exercise)}
          />
        ))}
      </div>

      {/* Info Footer */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: "science", title: "Evidence-Based", body: "Every exercise is drawn from peer-reviewed research in cognitive behavioural therapy, neuroscience, and somatic psychology." },
          { icon: "timer", title: "Built for Students", body: "All exercises are under 10 minutes. Designed to fit between lectures, before exams, or after a difficult day." },
          { icon: "favorite", title: "No App Required", body: "No tracking, no streaks, no guilt. Just tools that work — available whenever you need them." },
        ].map(item => (
          <div key={item.icon} className="bg-[#f0f4ea]/80 rounded-[1.5rem] p-6 border border-white/50">
            <span className="material-symbols-outlined text-[#648f76] text-2xl mb-3 block">{item.icon}</span>
            <h4 className="font-serif font-bold text-lg text-[#1b1c1a] mb-2">{item.title}</h4>
            <p className="text-sm text-[#56423e]/70 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </section>

      {/* Exercise Modal */}
      {activeExercise && (
        <ExerciseModal exercise={activeExercise} onClose={() => setActiveExercise(null)} />
      )}
    </main>
  );
}
