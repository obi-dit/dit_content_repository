import { Role, UserType } from "@/typings/auth";
import { getUser } from "@/utils/auth";
import React from "react";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getUser();
  if (user?.userType != UserType.USER) {
    return <div>Not authorized</div>;
  }
  return <div>{children}</div>;
}
