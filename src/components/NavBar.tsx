import Link from "next/link";
import React from "react";

export default function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fbf9f5]/80 backdrop-blur-md dark:bg-stone-900/80">
      <div className="flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
        <Link href="/">
          <div className="text-2xl font-serif italic text-[#9d3d2e] dark:text-orange-400">
            Rise Again
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            className="text-[#9d3d2e] dark:text-orange-300 font-bold border-b-2 border-[#9d3d2e] pb-1 hover:text-[#496455] dark:hover:text-emerald-400 transition-colors duration-300"
            href="/"
          >
            Reflect
          </Link>
          <Link
            className="text-stone-600 dark:text-stone-400 font-medium hover:text-[#496455] dark:hover:text-emerald-400 transition-colors duration-300"
            href="/reframe"
          >
            Tools
          </Link>
          <Link
            className="text-stone-600 dark:text-stone-400 font-medium hover:text-[#496455] dark:hover:text-emerald-400 transition-colors duration-300"
            href="/dashboard"
          >
            Library
          </Link>
          <Link
            className="text-stone-600 dark:text-stone-400 font-medium hover:text-[#496455] dark:hover:text-emerald-400 transition-colors duration-300"
            href="/quiz"
          >
            Community
          </Link>
        </div>
        <button className="uppercase tracking-wider text-[0.75rem] font-label text-stone-600 border border-outline-variant/30 px-5 py-2 rounded-full hover:bg-surface-container-high transition-colors">
          Help
        </button>
      </div>
    </nav>
  );
}
