"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import { ToastContainer } from "react-toastify";
import { PermissionProvider } from "@/contexts/PermissionContext";

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const router = useRouter();
  const shouldShowAuth = process.env.NEXT_PUBLIC_SHOW_AUTH === "true";

  useEffect(() => {
    const token = getToken();
    const isUnauthenticatedRoute = [
      "/login",
      "/signup",
      "/",
      "/subscribe",
      "/subscribe/login",
      "/subscribe/checkout",
      "/subscribe/checkout/success",
      "/subscriber-dashboard",
    ];
    if (
      !shouldShowAuth &&
      isUnauthenticatedRoute.includes(window.location.pathname)
    ) {
      router.replace("/");
    }
    const currentPath = window.location.pathname;
    const isAllowed =
      isUnauthenticatedRoute.includes(currentPath) ||
      currentPath.startsWith("/subscriber-dashboard/");
    if (!token && !isAllowed) {
      router.replace("/login");
    }
  }, [router, shouldShowAuth]);

  return (
    <PermissionProvider>
      {children}
      <ToastContainer />
    </PermissionProvider>
  );
};

export default ProtectedRoute;
