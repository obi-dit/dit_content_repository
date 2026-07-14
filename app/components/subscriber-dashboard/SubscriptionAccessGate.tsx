"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser, logout } from "@/utils/auth";
import { UserType } from "@/typings/auth";
import type { SubscriptionStatus } from "@/typings/podcast";
import { subscriptionService } from "@/services/subscriptionService";
import ExpiredSubscriptionOverlay from "./ExpiredSubscriptionOverlay";

interface SubscriptionAccessContextValue {
  subscription: SubscriptionStatus | null;
  isLoading: boolean;
  isExpired: boolean;
  isActive: boolean;
  refreshSubscription: () => Promise<SubscriptionStatus | null>;
  startRenewal: () => Promise<void>;
  renewing: boolean;
  renewError: string;
}

const SubscriptionAccessContext =
  createContext<SubscriptionAccessContextValue | null>(null);

export function useSubscriptionAccess() {
  const ctx = useContext(SubscriptionAccessContext);
  if (!ctx) {
    throw new Error(
      "useSubscriptionAccess must be used within SubscriptionAccessGate",
    );
  }
  return ctx;
}

const POLL_INTERVAL_MS = 15_000;

function normalizeStatus(data: SubscriptionStatus): SubscriptionStatus {
  if (data.status) {
    return data;
  }
  return {
    ...data,
    status: data.isActive ? "active" : "none",
  };
}

export default function SubscriptionAccessGate({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [renewing, setRenewing] = useState(false);
  const [renewError, setRenewError] = useState("");
  const [dismissed, setDismissed] = useState(false);

  const refreshSubscription = useCallback(async () => {
    const data = normalizeStatus(await subscriptionService.getStatus());
    setSubscription(data);
    if (data.status === "active" || data.isActive) {
      setDismissed(false);
      setRenewError("");
    }
    return data;
  }, []);

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (!token || !user || user.userType !== UserType.SUBSCRIBER) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const boot = async () => {
      setIsLoading(true);
      try {
        const data = await refreshSubscription();
        if (cancelled) return;
        setSubscription(data);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void boot();

    return () => {
      cancelled = true;
    };
  }, [refreshSubscription]);

  // Poll while expired so access restores after Stripe webhook without re-login.
  useEffect(() => {
    if (subscription?.status !== "expired") {
      return;
    }

    const id = window.setInterval(() => {
      void refreshSubscription();
    }, POLL_INTERVAL_MS);

    const onFocus = () => {
      void refreshSubscription();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshSubscription();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [subscription?.status, refreshSubscription]);

  // After returning from Stripe (?renewal=success), poll until access is active.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const renewal = params.get("renewal");
    const fromStripe =
      renewal === "success" ||
      (params.has("session_id") && renewal !== "cancelled");

    if (renewal === "cancelled") {
      const url = new URL(window.location.href);
      url.searchParams.delete("renewal");
      window.history.replaceState({}, "", url.pathname + url.search);
      return;
    }

    if (!fromStripe) return;

    let attempts = 0;
    const maxAttempts = 8;
    const clearQuery = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("renewal");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.pathname + url.search);
    };

    void refreshSubscription();
    const tick = window.setInterval(async () => {
      attempts += 1;
      const data = await refreshSubscription();
      if (data?.isActive || data?.status === "active" || attempts >= maxAttempts) {
        window.clearInterval(tick);
        clearQuery();
      }
    }, 2500);

    return () => window.clearInterval(tick);
  }, [refreshSubscription]);

  const startRenewal = useCallback(async () => {
    setRenewError("");
    setRenewing(true);
    try {
      const res = await subscriptionService.renew();
      if (!res.checkoutUrl) {
        throw new Error("No checkout URL returned. Please try again.");
      }
      window.location.assign(res.checkoutUrl);
    } catch (err) {
      setRenewError(
        err instanceof Error
          ? err.message
          : "Could not start renewal. Please try again.",
      );
      setRenewing(false);
    }
  }, []);

  const handleSignOut = useCallback(() => {
    logout();
    router.replace("/subscribe/login");
  }, [router]);

  const isExpired = subscription?.status === "expired";
  const isActive = Boolean(
    subscription?.isActive || subscription?.status === "active",
  );

  // Entire subscriber dashboard is premium — overlay is persistent while expired.
  const dismissible = false;
  const showOverlay = isExpired && !dismissed;

  const value = useMemo<SubscriptionAccessContextValue>(
    () => ({
      subscription,
      isLoading,
      isExpired,
      isActive,
      refreshSubscription,
      startRenewal,
      renewing,
      renewError,
    }),
    [
      subscription,
      isLoading,
      isExpired,
      isActive,
      refreshSubscription,
      startRenewal,
      renewing,
      renewError,
    ],
  );

  return (
    <SubscriptionAccessContext.Provider value={value}>
      {children}
      <ExpiredSubscriptionOverlay
        open={showOverlay}
        dismissible={dismissible}
        plan={subscription?.plan}
        expiresAt={subscription?.expiresAt}
        renewing={renewing}
        error={renewError}
        onRenew={startRenewal}
        onDismiss={dismissible ? () => setDismissed(true) : undefined}
        onSignOut={handleSignOut}
      />
    </SubscriptionAccessContext.Provider>
  );
}
