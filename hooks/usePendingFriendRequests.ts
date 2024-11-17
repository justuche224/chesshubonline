// hooks/usePendingFriendRequests.ts
import { getPendingIncomingRequests } from "@/actions/getPendingIncomingRequests";
import { useState, useEffect } from "react";
import { useCurrentUser } from "./useCurrentUser";

export function usePendingFriendRequests() {
  const user = useCurrentUser();
  const userId = user?.id;
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPendingRequests = async () => {
      try {
        const count = await getPendingIncomingRequests(userId);
        setPendingCount(count);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    checkPendingRequests();

    //Optional: Set up polling to check for new requests periodically
    const interval = setInterval(checkPendingRequests, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [userId]);
  return { pendingCount, isLoading };
}
