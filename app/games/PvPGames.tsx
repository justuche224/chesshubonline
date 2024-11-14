"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Game, User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Shield, User as UserIcon } from "lucide-react";

type GameWithPlayers = Game & {
  whitePlayer: User;
  blackPlayer: User;
};

type GameHomeProps = {
  userGames: GameWithPlayers[];
};

const GameHome = ({ userGames }: GameHomeProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "bg-green-500";
      case "checkmate":
        return "bg-red-500";
      case "draw":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">My Games</h1>
          <p className="text-muted-foreground">
            Manage and track your ongoing and completed chess matches
          </p>
        </div>
        <Link href="/games/new#player">
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            New Game
          </Button>
        </Link>
      </div>

      {userGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userGames.map((game) => (
            <Card
              key={game.id}
              className="hover:shadow-lg transition-shadow bg-sidebar"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Game #{game.id.slice(-6)}
                  </CardTitle>
                  <Badge className={getStatusColor(game.status)}>
                    {game.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-white" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        White Player
                      </p>
                      <p className="font-medium">{game.whitePlayer.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-black" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Black Player
                      </p>
                      <p className="font-medium">{game.blackPlayer.username}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Created: {new Date(game.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Last Move: {new Date(game.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/game/${game.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Go to Game
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-semibold">No Games Found</h3>
            <p className="text-muted-foreground">
              You haven&apos;t started any games yet. Create a new game to begin
              playing!
            </p>
            <Link href="/new-game">
              <Button className="mt-4">Start Your First Game</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameHome;
