"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#fbf9f5] via-[#e5efdf] to-[#99c9a6]">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <span className="material-symbols-outlined text-[#2D4739] text-4xl">spa</span>
          <span className="font-serif italic text-3xl tracking-tight text-[#2D4739]">Rise Again</span>
        </div>

        {/* Card */}
        <div className="bg-[#f0f4ea]/90 rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(45,71,57,0.12)] border border-white/60 backdrop-blur-md">
          <h1 className="font-serif font-bold text-2xl text-[#1b1c1a] mb-1">Welcome back</h1>
          <p className="text-sm text-[#56423e]/70 mb-8">Sign in to continue your journey.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#56423e]/60 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#fbf9f5] text-[#1b1c1a] border border-white/60 focus:ring-2 focus:ring-[#648f76]/40 focus:outline-none rounded-xl p-4 text-sm shadow-inner placeholder:text-[#56423e]/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#56423e]/60 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#fbf9f5] text-[#1b1c1a] border border-white/60 focus:ring-2 focus:ring-[#648f76]/40 focus:outline-none rounded-xl p-4 pr-12 text-sm shadow-inner placeholder:text-[#56423e]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#56423e]/40 hover:text-[#56423e] transition-colors"
                >
                  <span className="material-symbols-outlined text-[1.1rem]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-[#ff6b57]/10 border border-[#ff6b57]/20 text-[#c02a1b] text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[1rem]">error</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2d4739] text-white py-4 rounded-xl text-sm font-bold tracking-wide shadow-sm hover:translate-y-[-2px] hover:shadow-md disabled:opacity-60 disabled:hover:translate-y-0 transition-all mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#56423e]/70 mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#2d4739] font-bold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
