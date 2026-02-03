"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/utils/auth";
import { User, UserType } from "@/typings/auth";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user?.userType !== UserType.USER) {
    return <div>Not authorized</div>;
  }

  return <div>{children}</div>;
}