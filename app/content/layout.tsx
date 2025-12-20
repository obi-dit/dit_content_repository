import { Role } from "@/typings/auth";
import { getUser } from "@/utils/auth";
import React from "react";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getUser();
  if (user?.role === Role.ADMIN) {
    return <div>Not authorized</div>;
  }
  return <div>{children}</div>;
}
