import { useSession } from "next-auth/react";

type User = {
  email: string;
  image: string | null;
  id: string;
  role: "USER" | "ADMIN";
  username: string;
};

export const useCurrentUser = (): User | null => {
  const session = useSession();
  return session.data?.user || null;
};
