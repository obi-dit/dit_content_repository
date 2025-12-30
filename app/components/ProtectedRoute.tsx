"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import { ToastContainer, toast } from "react-toastify";

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const router = useRouter();
  const shouldShowAuth = process.env.NEXT_PUBLIC_SHOW_AUTH === "true";
  useEffect(() => {
    const token = getToken();
    const isUnauthenticatedRoute = ["/login", "/signup", "/"];
    if (
      !shouldShowAuth &&
      isUnauthenticatedRoute.includes(window.location.pathname)
    ) {
      router.replace("/");
    }
    if (!token && !isUnauthenticatedRoute.includes(window.location.pathname)) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <>
      {children} <ToastContainer />
    </>
  );
};

export default ProtectedRoute;
