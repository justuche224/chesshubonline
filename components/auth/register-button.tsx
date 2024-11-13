"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

type RegisterButtonProps = {
  children: ReactNode;
  mode?: "redirect" | string;
  asChild?: boolean;
};
const RegisterButton = ({ children }: RegisterButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/auth/register");
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

export default RegisterButton;
