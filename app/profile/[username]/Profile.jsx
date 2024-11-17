"use client";

import { useState } from "react";
import { User, Users, Trophy, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addFriend } from "@/actions/add-friend";

const Profile = ({ user, currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Check if users are friends
  const isFriend =
    currentUser.friends1.some((f) => f.user2Id === user.id) ||
    currentUser.friends2.some((f) => f.user1Id === user.id);

  // Check if there's a pending friend request
  const pendingRequest = currentUser.sentRequests.some(
    (r) => r.receiverId === user.id && r.status === "PENDING"
  );

  const handleFriendAction = async () => {
    try {
      setIsLoading(true);
      const result = await addFriend(user.id);

      if (result.error) {
        toast.success(result.error);
      } else if (result.success) {
        toast.success(result.success);
      }
    } catch (error) {
      toast.error("Something went wrong, try again later");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="bg-sidebar shadow-lg">
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl font-bold">
                  {user.firstname} {user.lastname}
                </CardTitle>
                {isFriend && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                          Friend
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You are friends with {user.firstname}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <p className="text-gray-500">@{user.username}</p>
            </div>

            {!isFriend && (
              <Button
                className="ml-4"
                variant={pendingRequest ? "secondary" : "default"}
                disabled={pendingRequest || isLoading}
                onClick={handleFriendAction}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : pendingRequest ? (
                  "Request Pending"
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Add Friend
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Profile Image Section */}
          <div className="relative w-32 h-32 mx-auto mt-4 mb-6">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                width={128}
                height={128}
                src={user.image || "/images/user-placeholder.png"}
                alt={`${user.firstname}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{user.gender}</p>
                </div>
              </div>

              {/* Game Statistics */}
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Games Played</p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">
                        {user.gamesAsWhitePlayer.length}
                      </span>
                      <span className="text-gray-500"> as White</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">
                        {user.gamesAsBlackPlayer.length}
                      </span>
                      <span className="text-gray-500"> as Black</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">
                        {user.gamesWithAi.length}
                      </span>
                      <span className="text-gray-500"> vs AI</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Game Statistics and Achievements */}
              <div className="flex items-center space-x-3">
                <Trophy className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Statistics</p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">
                        {Math.round(
                          ((user.gamesAsWhitePlayer.filter(
                            (g) => g.winner === user.id
                          ).length +
                            user.gamesAsBlackPlayer.filter(
                              (g) => g.winner === user.id
                            ).length) /
                            (user.gamesAsWhitePlayer.length +
                              user.gamesAsBlackPlayer.length)) *
                            100
                        )}
                        %
                      </span>
                      <span className="text-gray-500"> Win Rate</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">
                        {user.gamesAsWhitePlayer.filter(
                          (g) => g.winner === user.id
                        ).length +
                          user.gamesAsBlackPlayer.filter(
                            (g) => g.winner === user.id
                          ).length}
                      </span>
                      <span className="text-gray-500"> Total Wins</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">
                        {
                          user.gamesWithAi.filter((g) => g.winner === user.id)
                            .length
                        }
                      </span>
                      <span className="text-gray-500"> AI Wins</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Challenge to Game Section */}
          {isFriend && (
            <div className="mt-8 text-center">
              <Button className="w-full md:w-auto">
                <Trophy className="w-4 h-4 mr-2" />
                Challenge to a Game
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
// TODO : Add a game challenge feature
