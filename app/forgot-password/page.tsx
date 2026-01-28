"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMail, HiArrowLeft, HiCheckCircle } from "react-icons/hi";
import authService from "@/services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(
        err.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl shadow-2xl border border-zinc-800/50 p-8 sm:p-10">
            {/* Success Icon */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
                <HiCheckCircle className="text-4xl text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-50 mb-2">
                Check Your Email
              </h1>
              <p className="text-zinc-400 leading-relaxed">
                If an account exists with <span className="text-zinc-200 font-medium">{email}</span>, 
                you will receive a password reset link shortly.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-zinc-300 mb-2">What's next?</h3>
              <ul className="text-sm text-zinc-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">1.</span>
                  Check your email inbox (and spam folder)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">2.</span>
                  Click the password reset link in the email
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">3.</span>
                  Create a new secure password
                </li>
              </ul>
            </div>

            {/* Back to Login */}
            <div className="text-center space-y-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <HiArrowLeft />
                Back to Login
              </Link>
              
              <p className="text-sm text-zinc-500">
                Didn't receive the email?{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl shadow-2xl border border-zinc-800/50 p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <HiMail className="text-2xl text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-50 mb-2">
              Forgot Password?
            </h1>
            <p className="text-zinc-400">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-900/20 border border-red-800 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-400">⚠️</span>
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className={`block text-sm font-medium transition-colors ${
                  isFocused ? "text-blue-400" : "text-zinc-300"
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMail className="text-zinc-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 bg-zinc-800 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFocused
                      ? "border-blue-500 shadow-lg shadow-blue-500/20"
                      : "border-zinc-700"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <HiArrowLeft />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
