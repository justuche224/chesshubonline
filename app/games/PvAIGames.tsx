"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GameWithAi } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Bot, Brain, Shield } from "lucide-react";

type GameAiHomeProps = {
  userGamesWithAi: GameWithAi[];
};

const PvPAiGames = ({ userGamesWithAi }: GameAiHomeProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "checkmate":
        return "bg-red-500";
      case "draw":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAiTypeIcon = (aiType: string) => {
    switch (aiType) {
      case "BasicAI":
        return <Brain className="h-5 w-5" />;
      case "SmartAI":
        return <Brain className="h-5 w-5 text-blue-400" />;
      case "SmarterAI":
        return <Brain className="h-5 w-5 text-purple-400" />;
      case "SmartestAI":
        return <Brain className="h-5 w-5 text-gold-400" />;
      default:
        return <Bot className="h-5 w-5" />;
    }
  };

  const getAiTypeBadge = (aiType: string) => {
    const styles =
      {
        BasicAI: "bg-gray-500",
        SmartAI: "bg-blue-500",
        SmarterAI: "bg-purple-500",
        SmartestAI: "bg-amber-500",
      }[aiType] || "bg-gray-500";

    return (
      <Badge className={`${styles} flex items-center gap-1`}>
        {getAiTypeIcon(aiType)}
        {aiType}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-left">
            AI Games
          </h1>
          <p className="text-muted-foreground">
            Challenge yourself against different AI opponents
          </p>
        </div>
        <Link href="/games/new#ai">
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            New AI Game
          </Button>
        </Link>
      </div>

      {userGamesWithAi.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userGamesWithAi.map((game) => (
            <Card
              key={game.id}
              className="hover:shadow-lg transition-shadow bg-sidebar"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6" />
                    Game #{game.id.slice(-6)}
                  </CardTitle>
                  <Badge className={getStatusColor(game.status)}>
                    {game.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {game.playerColor === "white" ? (
                        <Shield className="h-5 w-5 text-white" />
                      ) : (
                        <Shield className="h-5 w-5 text-black" />
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">
                          You Play As
                        </p>
                        <p className="font-medium capitalize">
                          {game.playerColor}
                        </p>
                      </div>
                    </div>
                    {getAiTypeBadge(game.aiType)}
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
                  {game.winner && (
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className="w-full justify-center"
                      >
                        Winner: {game.winner}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/games/ai/${game.id}`} className="w-full">
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
            <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-semibold">No AI Games Found</h3>
            <p className="text-muted-foreground">
              Challenge yourself against our AI opponents and improve your chess
              skills!
            </p>
            <Link href="/games/new">
              <Button className="mt-4">Start Your First AI Game</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PvPAiGames;
