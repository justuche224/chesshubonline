import { useMemo } from "react";
import { useSession } from "next-auth/react";

export const useOthetUser = (conversation) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;

    const otherUser = conversation.users.find(
      (user) => user.email !== currentUserEmail
    );

    return otherUser || { firstname: "", lastname: "" }; // Return a default user object
  }, [session?.data?.user?.email, conversation.users]);

  return otherUser; // Make sure to return otherUser from the hook
};
