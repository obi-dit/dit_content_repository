"use client";

import { useState, FormEvent, useCallback, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import SubscribeNav from "../../components/subscribe/SubscribeNav";
import SubscribeFooter from "../../components/subscribe/SubscribeFooter";
import { subscriptionService } from "@/services/subscriptionService";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
): FieldErrors {
  const e: FieldErrors = {};
  if (!firstName.trim()) {
    e.firstName = "First name is required";
  }
  if (!lastName.trim()) {
    e.lastName = "Last name is required";
  }
  if (!email.trim()) {
    e.email = "Email is required";
  } else if (!EMAIL_RE.test(email.trim())) {
    e.email = "Enter a valid email address";
  }
  if (!password) {
    e.password = "Password is required";
  } else if (password.length < 8) {
    e.password = "Password must be at least 8 characters";
  }
  if (!confirmPassword) {
    e.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    e.confirmPassword = "Passwords do not match";
  }
  return e;
}

export default function SubscribeCheckoutPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("cancelled") === "1") {
      toast.info("Checkout was cancelled. You can try again when you're ready.");
      window.history.replaceState({}, "", "/subscribe/checkout");
    }
  }, []);

  const onSubmit = useCallback(
    async (ev: FormEvent) => {
      ev.preventDefault();
      const next = validate(firstName, lastName, email, password, confirmPassword);
      setErrors(next);
      if (Object.keys(next).length > 0) {
        return;
      }

      setSubmitting(true);
      try {
        const res = await subscriptionService.registerCheckout({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        });
        if (res.checkoutUrl) {
          window.location.assign(res.checkoutUrl);
          return;
        }
        toast.error("No payment URL returned. Please try again.");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Registration failed. Please try again.";
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
    [firstName, lastName, email, password, confirmPassword]
  );

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
            Full Lounge Pass · $50/mo
          </p>
          <h1 className="mb-2 text-center text-3xl font-bold text-zinc-50 sm:text-4xl">
            Create your account
          </h1>
          <p className="mb-8 text-center text-zinc-400">
            Enter your details, then you&apos;ll be redirected to secure Stripe checkout to
            pay.
          </p>

          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-xl"
            noValidate
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="sub-first" className="mb-1.5 block text-sm font-medium text-zinc-300">
                  First name
                </label>
                <input
                  id="sub-first"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25"
                  placeholder="First name"
                  aria-invalid={errors.firstName ? "true" : "false"}
                  aria-describedby={errors.firstName ? "err-first" : undefined}
                />
                {errors.firstName && (
                  <p id="err-first" className="mt-1 text-xs text-red-400" role="alert">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="sub-last" className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Last name
                </label>
                <input
                  id="sub-last"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25"
                  placeholder="Last name"
                  aria-invalid={errors.lastName ? "true" : "false"}
                  aria-describedby={errors.lastName ? "err-last" : undefined}
                />
                {errors.lastName && (
                  <p id="err-last" className="mt-1 text-xs text-red-400" role="alert">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="sub-email" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="sub-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25"
                placeholder="you@example.com"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "err-email" : undefined}
              />
              {errors.email && (
                <p id="err-email" className="mt-1 text-xs text-red-400" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="sub-pass" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="sub-pass"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25"
                placeholder="At least 8 characters"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "err-pass" : undefined}
              />
              {errors.password && (
                <p id="err-pass" className="mt-1 text-xs text-red-400" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="sub-pass2"
                className="mb-1.5 block text-sm font-medium text-zinc-300"
              >
                Confirm password
              </label>
              <input
                id="sub-pass2"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25"
                placeholder="Re-enter password"
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={errors.confirmPassword ? "err-pass2" : undefined}
              />
              {errors.confirmPassword && (
                <p id="err-pass2" className="mt-1 text-xs text-red-400" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 text-lg font-semibold text-white shadow-lg transition enabled:hover:from-amber-600 enabled:hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              {submitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Redirecting…
                </>
              ) : (
                "Pay now"
              )}
            </button>

            <p className="mt-4 text-center text-xs text-zinc-500">
              Already have an account?{" "}
              <Link href="/subscribe/login" className="text-amber-400 hover:text-amber-300">
                Member sign in
              </Link>
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            <Link href="/subscribe" className="text-zinc-400 hover:text-zinc-300">
              ← Back to subscribe
            </Link>
          </p>
        </div>
      </main>

      <SubscribeFooter />
    </div>
  );
}
