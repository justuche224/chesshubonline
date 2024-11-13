"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type UserListProps = {
  otherUsers: User[];
  userId: string;
};

const UserList = ({ otherUsers, userId }: UserListProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleStartMatch = async (opponentId: string) => {
    setLoading(opponentId);
    try {
      // Call API to create a new game with the opponent
      const res = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player1Id: userId,
          player2Id: opponentId,
          gameType: "HUMAN",
        }),
      });
      if (!res.ok) {
        const error = await res.text();
        console.error(error);
        toast.error(`create failed`);
      }
      if (res.ok) {
        toast.success("Game created! redirecting..");
        const game = await res.json();
        window.location.href = `/games/${game.id}`; // Redirect to the game page
      } else {
        console.error("Failed to create a game");
      }
    } catch (error) {
      console.error("Error starting a match:", error);
    } finally {
      setLoading(null); // Reset loading state
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Start a New Match</h1>

      {otherUsers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {otherUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 bg-slate-800 shadow rounded-lg border border-slate-900"
            >
              <p className="text-lg font-semibold">{user.username}</p>

              <Button
                variant="secondary"
                onClick={() => handleStartMatch(user.id)}
                disabled={loading === user.id}
              >
                {loading === user.id ? "Starting..." : "Start Match"}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No other users found to start a match with.
        </p>
      )}
    </section>
  );
};

export default UserList;
