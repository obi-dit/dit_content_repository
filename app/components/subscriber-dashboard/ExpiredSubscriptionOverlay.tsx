"use client";

import { useEffect, useId, useRef } from "react";

interface ExpiredSubscriptionOverlayProps {
  open: boolean;
  /** When false, the overlay cannot be dismissed (no non-premium lounge access). */
  dismissible?: boolean;
  plan?: string;
  expiresAt?: string;
  renewing?: boolean;
  error?: string;
  onRenew: () => void;
  onDismiss?: () => void;
  onSignOut?: () => void;
}

function formatExpiry(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ExpiredSubscriptionOverlay({
  open,
  dismissible = false,
  plan,
  expiresAt,
  renewing = false,
  error,
  onRenew,
  onDismiss,
  onSignOut,
}: ExpiredSubscriptionOverlayProps) {
  const titleId = useId();
  const descriptionId = useId();
  const renewButtonRef = useRef<HTMLButtonElement>(null);
  const expiryLabel = formatExpiry(expiresAt);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    renewButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissible && onDismiss) {
        onDismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, dismissible, onDismiss]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-700/60 bg-zinc-900/95 p-6 shadow-2xl sm:p-8">
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-800/40 bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-3xl"
          aria-hidden
        >
          🔒
        </div>

        <h2
          id={titleId}
          className="text-center text-2xl font-bold text-zinc-50 sm:text-3xl"
        >
          Subscription expired
        </h2>

        <p
          id={descriptionId}
          className="mt-3 text-center text-sm leading-relaxed text-zinc-400 sm:text-base"
        >
          Your lounge pass has ended
          {expiryLabel ? ` on ${expiryLabel}` : ""}. Premium shows, live
          episodes, and the podcast library are locked until you renew.
        </p>

        {(plan || expiryLabel) && (
          <div className="mt-5 rounded-xl border border-zinc-700/70 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-400">
            {plan && (
              <p>
                Plan:{" "}
                <span className="font-medium text-zinc-200">{plan}</span>
              </p>
            )}
            {expiryLabel && (
              <p className={plan ? "mt-1" : undefined}>
                Expired:{" "}
                <span className="font-medium text-zinc-200">{expiryLabel}</span>
              </p>
            )}
          </div>
        )}

        <p className="mt-4 text-center text-sm text-zinc-500">
          Renew now to restore full access to premium content right away — no
          new signup required.
        </p>

        {error && (
          <div
            className="mt-4 rounded-lg border border-red-800/60 bg-red-950/40 px-3 py-2 text-sm text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        <button
          ref={renewButtonRef}
          type="button"
          onClick={onRenew}
          disabled={renewing}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 text-base font-semibold text-white shadow-lg transition enabled:hover:from-amber-600 enabled:hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          {renewing ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Starting checkout…
            </>
          ) : (
            "Renew Subscription"
          )}
        </button>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {dismissible && onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="w-full rounded-xl border border-zinc-700 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
            >
              Continue browsing
            </button>
          )}
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="w-full rounded-xl border border-zinc-700 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
            >
              Sign out
            </button>
          )}
        </div>

        {!dismissible && (
          <p className="mt-4 text-center text-xs text-zinc-600">
            This notice stays until your subscription is renewed.
          </p>
        )}
      </div>
    </div>
  );
}
