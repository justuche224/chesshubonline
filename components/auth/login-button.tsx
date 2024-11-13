"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type LoginButtonProps = {
  children: ReactNode;
  mode?: "redirect" | string;
  asChild?: boolean;
};

const LoginButton = ({ children }: LoginButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/auth/login");
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

export default LoginButton;
