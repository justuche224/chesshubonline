"use client";

import { logout } from "@/actions/logout";
import { ReactNode } from "react";

const LogoutButton = ({ children }: { children: ReactNode }) => {
  const onClick = () => {
    logout();
  };
  return (
    <span
      onClick={onClick}
      className="cursor-pointer flex justify-center items-center"
    >
      {children}
    </span>
  );
};

export default LogoutButton;
