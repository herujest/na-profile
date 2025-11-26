"use client";

export const dynamic = 'error';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
// Metadata is handled by layout.tsx in App Router for client components

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated) {
          router.push("/admin/dashboard");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-100 dark:bg-gray-900">
      <AnimatedBackground />
      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-[#353857] rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.35)] p-12">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <img
                src="/images/logo.svg"
                alt="nisaaulia.com logo"
                className="h-12 w-auto"
              />
            </div>
            <h1 className="text-white text-2xl font-semibold">nisaaulia.com</h1>
            <p className="text-gray-300 text-sm mt-1">Admin Panel</p>
          </div>

          {/* Welcome */}
          <h2 className="text-center text-white text-xl font-medium mb-8">
            Welcome Back!
          </h2>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8 max-w-md mx-auto">
            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">Email</label>
              <div className="relative">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-500 focus:border-cyan-400 text-white py-2 outline-none transition"
                  type="text"
                  placeholder="yourname@mail.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-500 focus:border-cyan-400 text-white py-2 outline-none transition"
                  type="password"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-300 bg-red-900/30 border border-red-700 text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-medium py-3 rounded-lg transition mt-4 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {/* <div className="text-center mt-3">
              <button
                type="button"
                className="text-gray-300 text-sm hover:text-white"
              >
                Forgot My Password
              </button>
            </div> */}
          </form>

          {/* Footer */}
          <div className="text-center text-gray-400 text-xs mt-10">
            <a href="#" className="hover:text-white">
              Made With ❤ by{" "}
            </a>{" "}
            ·{" "}
            <a href="#" className="hover:text-white">
              heruu.js
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metadata is handled by layout.tsx in App Router for client components
