import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full mt-auto py-12 px-8 bg-stone-100 dark:bg-stone-950">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-t border-stone-200/20 pt-8">
        <div className="font-serif text-lg text-stone-800 dark:text-stone-200">
          Rise Again
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-sans text-sm tracking-tight">
          <Link
            className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:underline decoration-[#9d3d2e]/30 transition-all"
            href="#"
          >
            Crisis Support
          </Link>
          <Link
            className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:underline decoration-[#9d3d2e]/30 transition-all"
            href="#"
          >
            Academic Advocacy
          </Link>
          <Link
            className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:underline decoration-[#9d3d2e]/30 transition-all"
            href="#"
          >
            Privacy Journal
          </Link>
          <Link
            className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:underline decoration-[#9d3d2e]/30 transition-all"
            href="#"
          >
            Contact Mentor
          </Link>
        </div>
        <div className="font-sans text-xs text-stone-500">
          © {new Date().getFullYear()} Rise Again. A Living Archive for Student Resilience.
        </div>
      </div>
    </footer>
  );
}
