// app/auth/login/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-playfair text-white text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-white/50 font-inter text-center mb-8">
            Sign in to your account
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 focus:border-cyan/50 focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 focus:border-cyan/50 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan to-neon-purple text-white font-inter text-sm mt-4 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}