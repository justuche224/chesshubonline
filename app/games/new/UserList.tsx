"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Trophy,
  Clock,
  User as UserIcon,
  Calendar,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type UserListProps = {
  otherUsers: User[];
  userId: string;
};

const UserCard = ({
  user,
  onStartMatch,
  isLoading,
}: {
  user: User;
  onStartMatch: () => void;
  isLoading: boolean;
}) => {
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-sidebar">
      <CardContent className="p-4 sm:p-6">
        {/* Mobile Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {/* User Avatar Section */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md">
                <Image
                  width={80}
                  height={80}
                  src={user.image || "/images/user-placeholder.png"}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white
                ${true ? "bg-green-500" : "bg-gray-400"}`}
              />
            </div>

            {/* Username and Role - Mobile Layout */}
            <div className="sm:hidden flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">{user.username}</h3>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    user.role === "USER"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <Button
                variant="secondary"
                className="w-full mt-2 group-hover:bg-sidebar-accent group-hover:text-white transition-colors"
                onClick={onStartMatch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Starting..." : "Challenge"}
              </Button>
            </div>
          </div>

          {/* Desktop User Info */}
          <div className="flex-1 hidden sm:block">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{user.username}</h3>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  user.role === "USER"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">10 Games</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Joined {joinDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600 capitalize">
                  {user.gender}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Stats Grid */}
          <div className="sm:hidden grid grid-cols-3 gap-2 text-center mt-2">
            <div className="flex flex-col items-center">
              <Trophy className="w-4 h-4 text-yellow-500 mb-1" />
              <span className="text-xs text-gray-600">10 Games</span>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="w-4 h-4 text-blue-500 mb-1" />
              <span className="text-xs text-gray-600">{joinDate}</span>
            </div>
            <div className="flex flex-col items-center">
              <UserIcon className="w-4 h-4 text-purple-500 mb-1" />
              <span className="text-xs text-gray-600 capitalize">
                {user.gender}
              </span>
            </div>
          </div>

          {/* Desktop Action Button */}
          <Button
            variant="secondary"
            className="hidden sm:flex ml-auto group-hover:bg-sidebar-accent group-hover:text-white transition-colors"
            onClick={onStartMatch}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Starting..." : "Challenge"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const UserList = ({ otherUsers, userId }: UserListProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleStartMatch = async (opponentId: string) => {
    setLoading(opponentId);
    try {
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
        toast.error("Failed to create game");
        return;
      }

      const game = await res.json();
      toast.success("Game created! Redirecting...");
      window.location.href = `/games/${game.id}`;
    } catch (error) {
      console.error("Error starting a match:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Challenge Players
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Select a player to start a new chess match
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {otherUsers.length} Players Available
          </span>
        </div>
      </div>

      {otherUsers.length > 0 ? (
        <div className="space-y-4">
          {otherUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isLoading={loading === user.id}
              onStartMatch={() => handleStartMatch(user.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-6 sm:p-12 text-center">
          <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Players Available</h3>
          <p className="text-gray-500 text-sm sm:text-base">
            There are no other users available to play with at the moment.
            Please check back later.
          </p>
        </Card>
      )}
    </div>
  );
};

export default UserList;
