"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "HOME", icon: "home", path: "/" },
    { name: "FOCUS", icon: "timer", path: "/focus" },
    { name: "PLAN", icon: "calendar_month", path: "/dashboard" },
    { name: "WELLNESS", icon: "self_improvement", path: "#" },
    { name: "PROFILE", icon: "person", path: "#" },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-[#e5ead5]/90 backdrop-blur-md rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center px-6 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path} className="flex flex-col items-center gap-1 group">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[#2D4739] text-white"
                    : "text-[#56423e] group-hover:bg-[#d8e0c8]"
                }`}
              >
                <span className="material-symbols-outlined text-[1.5rem]">
                  {item.icon}
                </span>
              </div>
              <span
                className={`text-[0.6rem] font-bold tracking-widest ${
                  isActive ? "text-[#2D4739]" : "text-[#56423e]/70"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
