"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SubscribeNav from "../../components/subscribe/SubscribeNav";
import SubscribeFooter from "../../components/subscribe/SubscribeFooter";
import httpService from "@/services/httpService";
import { saveToken, setUser } from "@/utils/auth";
import { AuthResponse, UserType } from "@/typings/auth";

export default function SubscribeLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("subscribeRememberedEmail");
    if (saved) {
      setEmail(saved);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await httpService.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      });

      if (!response.success) {
        setError("Sign-in failed. Please try again.");
        setIsLoading(false);
        return;
      }

      if (response.data.userType !== UserType.SUBSCRIBER) {
        setIsLoading(false);
        setError(
          "This sign-in is for Podcast Lounge members only. Use the main site sign-in for staff or company accounts.",
        );
        return;
      }

      saveToken(response.token);
      setUser(response.data);
      localStorage.setItem("subscribeRememberedEmail", email.trim());
      router.push("/subscriber-dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SubscribeNav />

      <main className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-lg">
          <p className="mb-2 text-center text-sm font-medium uppercase tracking-wide text-amber-500/90">
            Member access
          </p>
          <h1 className="mb-2 text-center text-3xl font-bold text-zinc-50 sm:text-4xl">
            Sign in to the Lounge
          </h1>
          <p className="mb-8 text-center text-zinc-400">
            Use the email and password for your Podcast Lounge account.
          </p>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-xl"
            noValidate
          >
            {error && (
              <div
                className="mb-4 rounded-xl border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-200"
                role="alert"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="sub-login-email" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="sub-login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25"
                placeholder="you@example.com"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="sub-login-pass" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="sub-login-pass"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 pr-12 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 text-lg font-semibold text-white shadow-lg transition enabled:hover:from-amber-600 enabled:hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <p className="mt-4 text-center text-xs text-zinc-500">
              New here?{" "}
              <Link href="/subscribe/checkout" className="text-amber-400 hover:text-amber-300">
                Create account &amp; pay
              </Link>
            </p>
          </form>

          <p className="mt-6 space-y-2 text-center text-sm text-zinc-500">
            <span className="block">
              <Link href="/subscribe" className="text-zinc-400 hover:text-zinc-300">
                ← Back to subscribe
              </Link>
            </span>
            <span className="block text-xs">
              Staff or company?{" "}
              <Link href="/login" className="text-amber-500/80 hover:text-amber-400">
                Main site sign in
              </Link>
            </span>
          </p>
        </div>
      </main>

      <SubscribeFooter />
    </div>
  );
}
