"use client";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Quiz() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSelect = async (path: string) => {
    setIsLoading(path);
    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      // Route appropriately based on path, just to dashboard for demo
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setIsLoading(null);
    }
  };

  const QuizButton = ({
    path,
    icon,
    title,
    desc,
    bgClass,
    textClass,
  }: {
    path: string;
    icon: string;
    title: string;
    desc: string;
    bgClass: string;
    textClass: string;
  }) => (
    <button
      onClick={() => handleSelect(path)}
      disabled={isLoading !== null}
      className="group relative flex flex-col text-left p-10 bg-surface-container-lowest rounded-xl botanical-shadow transition-all duration-500 hover:-translate-y-2 ring-1 ring-outline-variant/10 hover:ring-primary/20 disabled:opacity-50"
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${bgClass} ${textClass}`}
      >
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 className="text-2xl font-headline font-semibold text-on-surface mb-3">
        {title}
      </h3>
      <p className="text-on-surface-variant font-body leading-relaxed">
        {desc}
      </p>
      <div className="mt-8 flex items-center text-primary font-label text-[0.75rem] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        {isLoading === path ? "Saving..." : "Select Path"}{" "}
        {!isLoading && (
          <span className="material-symbols-outlined ml-2 !text-[1rem]">
            arrow_forward
          </span>
        )}
      </div>
    </button>
  );

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-16 md:mb-24">
          <p className="label-md uppercase tracking-[0.2em] text-on-surface-variant mb-4 font-label text-[0.75rem]">
            Personal Audit
          </p>
          <h1 className="text-5xl md:text-7xl font-headline font-medium text-on-surface leading-tight tracking-tight max-w-3xl">
            What's weighing on you today?
          </h1>
          <div className="mt-8 h-px w-24 bg-primary/20"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <aside className="lg:col-span-3 lg:pt-4 text-on-surface-variant italic font-headline text-lg border-l border-outline-variant/20 pl-6 order-2 lg:order-1">
            Take a breath. Identifying the shape of your struggle is the first
            step toward transforming it into wisdom. Select the path that
            resonates most with your current experience.
          </aside>

          <section className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8 order-1 lg:order-2">
            <QuizButton
              path="Exam Failure"
              icon="menu_book"
              title="Exam Failure"
              desc="The weight of numbers and grades. A temporary setback in a long academic journey."
              bgClass="bg-secondary-container"
              textClass="text-secondary"
            />
            <QuizButton
              path="Project Rejection"
              icon="close_fullscreen"
              title="Project Rejection"
              desc="When your effort didn't find its home. This is where creative resilience begins."
              bgClass="bg-primary-fixed"
              textClass="text-primary"
            />
            <QuizButton
              path="Dropped Course"
              icon="directions_off"
              title="Dropped Course"
              desc="The difficult choice to let go. Pivot points are often the start of better directions."
              bgClass="bg-secondary-container"
              textClass="text-secondary"
            />
            <QuizButton
              path="Lost Motivation"
              icon="filter_drama"
              title="Lost Motivation"
              desc="Finding yourself in the quiet fog. A time for rest and recalibration of purpose."
              bgClass="bg-primary-fixed"
              textClass="text-primary"
            />
          </section>
        </div>

        <div className="mt-24 w-full h-[400px] rounded-xl overflow-hidden relative">
          <img
            className="w-full h-full object-cover grayscale opacity-20 contrast-125"
            alt="Moody journal"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqjhs9LcPSBE4g6iXF_OlzV07boxjs_mtAkmjmaX0ORbwQ5UNDTcb5s26K39lFg9_9egjKKo0EfqtH2K5AfA9LrG54e8QoLSjZ2D2HDx3aA8IEFfqKnKkckJilk3JeJezDHpLvkCNeHo9eBtEHQZOFc5wvDkazM4x9lpo18q5Kw6DImrZw9gqoUsCm9gQoxasvU2HOIxJ-YkeINKejzoj28Odtdhiya_Zyz7eQLrpLNcaTf-kpBUzjlpVIfjldAhqIh8Uk80eKqzQ"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
          <div className="absolute bottom-12 left-12 max-w-md">
            <p className="text-on-surface-variant font-headline italic text-2xl">
              "Failure is the condiment that gives success its flavor."
            </p>
            <p className="font-label text-[0.7rem] uppercase tracking-widest mt-4 text-primary">
              — Truman Capote
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
