"use client";

import { useState } from "react";

interface AgeGateProps {
  onVerified: () => void;
}

export default function AgeGate({ onVerified }: AgeGateProps) {
  const [birthYear, setBirthYear] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    const year = parseInt(birthYear, 10);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (isNaN(year) || birthYear.length !== 4) {
      setError("Please enter a valid 4-digit birth year.");
      return;
    }

    if (age < 18) {
      setError("You must be 18 or older to access this content.");
      return;
    }

    setError("");
    onVerified();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="max-w-md w-full mx-4 p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
        <div className="text-5xl mb-4">🔞</div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Age Verification Required
        </h2>

        <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
          This content is intended for adults aged 18 and over. Please confirm
          your age to continue.
        </p>

        <div className="mb-4">
          <label
            htmlFor="birthYear"
            className="block text-sm font-medium text-zinc-400 mb-2 text-left"
          >
            Enter your birth year
          </label>

          <input
            id="birthYear"
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleVerify();
              }
            }}
            placeholder="e.g. 1985"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleVerify}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-lg hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-[1.02]"
        >
          Verify &amp; Enter
        </button>

        <p className="text-zinc-600 text-xs mt-4">
          By entering, you confirm you are at least 18 years old and agree to
          our Terms of Service.
        </p>
      </div>
    </div>
  );
}
