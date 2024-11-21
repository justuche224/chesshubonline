import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, GamepadIcon, Clock, CircleDot } from "lucide-react";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { CompleteGameData } from "@/types";
import logger from "@/utils/logger";
import { toast } from "sonner";
import { getUserGames } from "@/actions/games";

const ChatHeader = ({ otherUser, user }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [games, setGames] = useState<CompleteGameData[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);

  const fetchGames = async () => {
    setIsLoadingGames(true);
    try {
      const response = await getUserGames(otherUser.id);

      if (response.success) {
        setGames(response.games);
      } else {
        toast.error("Failed to fetch games");
      }
    } catch (error) {
      logger.error("Failed to fetch games:", error);
      toast.error("Unexpected error occurred while fetching games");
    } finally {
      setIsLoadingGames(false);
    }
  };

  const handleNewGame = () => {
    console.log("Starting new game with:", otherUser.username);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - new Date(date).getTime()) / 1000
    );

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const getPlayerColor = (game: CompleteGameData, playerId: string) => {
    if (game.whitePlayerId === playerId) return "white";
    if (game.blackPlayerId === playerId) return "black";
    return null;
  };

  const getGameStatusText = (game: CompleteGameData, userId: string) => {
    if (game.status === "active") {
      const isUserTurn = game.currentPlayer === userId;
      return isUserTurn ? "Your turn" : `${otherUser.username}'s turn`;
    }
    if (game.winner === userId) return "Won";
    if (game.winner === null && game.status === "draw") return "Draw";
    return "Lost";
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <Link href={`/profile/${otherUser.username}`}>
        <div className="flex items-center">
          <Avatar className="w-10 h-10 mr-3">
            <AvatarImage
              src={otherUser.image || undefined}
              alt={`${otherUser.username}'s avatar`}
            />
            <AvatarFallback>
              {otherUser.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">
              {otherUser.firstname} {otherUser.lastname}
            </h2>
            <p className="text-sm text-gray-500">@{otherUser.username}</p>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <Sheet
          open={isSheetOpen}
          onOpenChange={(open) => {
            setIsSheetOpen(open);
            if (open) fetchGames();
          }}
        >
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="z-[9999] flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>User Information</SheetTitle>
            </SheetHeader>

            <div className="flex-1 mt-6 space-y-6 overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {otherUser.firstname} {otherUser.lastname}
                    </p>
                    <p>
                      <span className="font-medium">Username:</span> @
                      {otherUser.username}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Game History</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleNewGame}>
                    <GamepadIcon className="w-4 h-4 mr-2" />
                    New Game
                  </Button>
                </CardHeader>
                <CardContent className="flex-1">
                  {isLoadingGames ? (
                    <div className="flex justify-center py-4">
                      <ClipLoader size={24} color="#6b7280" />
                    </div>
                  ) : (
                    <div className="space-y-3 flex flex-col gap-2 max-h-96 overflow-y-auto">
                      {games.map((game) => {
                        const userColor = getPlayerColor(game, user.id);
                        const statusText = getGameStatusText(game, user.id);
                        const isActive = game.status === "active";

                        return (
                          <Link key={game.id} href={`/games/${game.id}`}>
                            <div className="flex flex-col p-3 bg-sidebar rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">
                                    {userColor === "white" ? "⚪" : "⚫"}{" "}
                                    Playing as {userColor}
                                  </span>
                                </div>
                                <span
                                  className={`text-sm px-2 py-1 rounded ${
                                    isActive
                                      ? "bg-blue-100 text-blue-700"
                                      : statusText === "Won"
                                      ? "bg-green-100 text-green-700"
                                      : statusText === "Lost"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {statusText}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {formatTimeAgo(game.updatedAt)}
                                </div>
                                <div className="flex items-center">
                                  <CircleDot className="w-4 h-4 mr-1" />
                                  {game.moves?.length || 0} moves
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                      {!isLoadingGames && games.length === 0 && (
                        <p className="text-gray-500 text-center py-2">
                          No games found
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ChatHeader;
