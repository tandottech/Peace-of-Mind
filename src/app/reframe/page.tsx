"use client";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import React, { useState } from "react";

export default function Reframe() {
  const [prompt, setPrompt] = useState("");
  const [reframeResult, setReframeResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReframe = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/reframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setReframeResult(data);
    } catch (error) {
      console.error("Failed to fetch reframe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <main className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        <header className="mb-16 text-center md:text-left">
          <p className="text-[0.75rem] uppercase tracking-widest text-on-surface-variant font-bold mb-4 opacity-70">
            Cognitive Reframe
          </p>
          <h1 className="font-headline text-5xl md:text-6xl text-on-surface leading-tight tracking-tight mb-6">
            Shift Your Perspective
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-xl leading-relaxed">
            Sometimes the narrative we tell ourselves is a weight. Use our AI tool
            to find the hidden resilience in your current challenges.
          </p>
        </header>

        <div className="space-y-12">
          <section className="relative">
            <div className="bg-surface-container-low p-8 md:p-12 rounded-xl botanical-shadow">
              <label className="block text-[0.75rem] font-label font-bold uppercase tracking-wider text-on-surface-variant mb-4">
                Tell us what happened...
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-48 bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 rounded-lg p-6 font-body text-on-surface text-lg placeholder:text-on-surface-variant/40 resize-none"
                placeholder="I didn't get the internship I worked so hard for. It feels like all my effort was for nothing and I'm falling behind my peers..."
              ></textarea>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleReframe}
                  disabled={isLoading}
                  className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all flex items-center gap-3 botanical-shadow disabled:opacity-50"
                >
                  <span>{isLoading ? "Reframing..." : "Reframe"}</span>
                  <span className="material-symbols-outlined">auto_awesome</span>
                </button>
              </div>
            </div>
          </section>

          <div className="hidden md:flex justify-end pr-12">
            <div className="w-1 h-24 bg-primary/20 rounded-full"></div>
          </div>

          {reframeResult && (
            <section className="md:pl-12">
              <div className="relative bg-secondary-container rounded-xl p-8 md:p-12 border-l-8 border-secondary">
                <div className="absolute -top-4 left-10 bg-secondary text-on-secondary px-4 py-1 rounded-full text-[0.7rem] uppercase tracking-tighter font-bold">
                  A New Lens
                </div>
                <div className="flex flex-col gap-6">
                  <span className="material-symbols-outlined text-secondary text-4xl">
                    format_quote
                  </span>
                  <div className="space-y-6">
                    <p className="font-headline text-2xl text-on-secondary-container leading-snug italic">
                      "{reframeResult.aiResponse}"
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {reframeResult.tags.split(",").map((tag: string, i: number) => (
                        <span key={i} className="bg-surface/50 text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold font-label uppercase tracking-wide">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-secondary/10 flex items-center justify-between">
                    <button className="text-secondary font-bold text-sm flex items-center gap-2 hover:underline">
                      <span className="material-symbols-outlined text-lg">
                        bookmark
                      </span>
                      Save to Journal
                    </button>
                    <button className="text-on-secondary-variant font-bold text-sm flex items-center gap-2 hover:opacity-70">
                      <span className="material-symbols-outlined text-lg">
                        share
                      </span>
                      Share Reflection
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-surface-container p-8 rounded-xl flex flex-col justify-between">
            <div>
              <h3 className="font-headline text-2xl mb-4">
                The Science of Reframing
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Cognitive reframing is a psychological technique that identifies
                and then disputes irrational or maladaptive thoughts. It's not
                about ignoring the truth, but finding a more constructive one.
              </p>
            </div>
            <div className="mt-8">
              <img
                className="w-full h-40 object-cover rounded-lg opacity-80"
                alt="science of reframing abstract"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdog6vEhBOfUeYGLlSylFknpdZnYWJBIRfTHKGrUTGBpUeFPx0-n_Gz-MsoHiXAriOqGaHbOdyqRGXBsJxsDbYNoccuiQjEkBoq0rXb9dhKTZcHx421HFfeyGjrRNDz8_DTAwNUIH9TfcecjB6Hf4F3Y0QXSYPgW6s7PkG5dvlqo5ePjBSav6cRysOxHHATdQQxuZD1hLO5eChABU84213sm-RZVcVOVf1sCGFr7fnX5j9oQQrQ0c65tOjCYL8dqrpfrF9uAYKq-I"
              />
            </div>
          </div>
          <div className="bg-primary/5 p-8 rounded-xl flex flex-col items-center text-center justify-center border border-primary/10">
            <span className="material-symbols-outlined text-primary text-5xl mb-4">
              history_edu
            </span>
            <h4 className="font-bold mb-2">Review Archive</h4>
            <p className="text-sm text-on-surface-variant mb-6">
              You have reframed situations this semester. Track your growth
              progress.
            </p>
            <button className="w-full py-3 border border-primary text-primary rounded-full font-bold text-sm hover:bg-primary hover:text-on-primary transition-colors">
              View All
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
