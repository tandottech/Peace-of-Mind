"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
}

export default function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setUser(data); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { name: "Home Dashboard", icon: "home", path: "/" },
    { name: "Focus Room", icon: "timer", path: "/focus" },
    { name: "Smart Planner", icon: "calendar_month", path: "/dashboard" },
    { name: "Wellness Exercises", icon: "self_improvement", path: "/wellness" },
  ];

  const displayName = user?.name || user?.email?.split("@")[0] || "You";
  const avatarSeed = encodeURIComponent(displayName);

  return (
    <aside className="w-[280px] h-screen bg-[#f4f7f2] border-r border-[#dce6d5] flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* Branding */}
      <div className="flex items-center gap-3 px-8 pt-10 pb-8">
        <span className="material-symbols-outlined text-[#2D4739] text-3xl">spa</span>
        <span className="font-serif italic text-2xl tracking-tight text-[#2D4739]">
          Rise Again
        </span>
      </div>

      {/* User Profile */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-4 bg-[#e5ead5]/40 p-4 rounded-3xl border border-[#dce6d5]/50">
          <div className="w-12 h-12 rounded-full bg-[#1b1c1a] border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[#1b1c1a] font-serif font-bold text-lg leading-none truncate">{displayName}</span>
            <span className="text-[#56423e] text-xs font-medium truncate">{user?.email || "Loading..."}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-[#2D4739] text-white shadow-md shadow-[#2d4739]/20 font-bold"
                  : "text-[#56423e] hover:bg-[#e5ead5]/60 font-medium"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Nav */}
      <div className="p-6 mt-auto border-t border-[#dce6d5]/50">
        <Link href="#" className="flex items-center gap-3 text-[#56423e]/70 hover:text-[#56423e] px-2 py-2 text-sm font-medium transition-colors">
          <span className="material-symbols-outlined text-[1.1rem]">settings</span>
          Settings & Preferences
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-[#56423e]/70 hover:text-[#c02a1b] px-2 py-2 text-sm font-medium transition-colors w-full text-left"
        >
          <span className="material-symbols-outlined text-[1.1rem]">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
