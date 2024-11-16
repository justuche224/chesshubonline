import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  Swords,
  Bot,
  Trophy,
  Clock,
  Users,
  User,
} from "lucide-react";
import Link from "next/link";

const HomePage = ({ dbUser }) => {
  // Calculate active games counts
  const activePlayerGames = [
    ...dbUser.gamesAsWhitePlayer.filter((game) => !game.gameOver),
    ...dbUser.gamesAsBlackPlayer.filter((game) => !game.gameOver),
  ];
  // console.log(activePlayerGames);

  const activeAiGames = dbUser.gamesWithAi.filter((game) => !game.gameOver);

  // Calculate completed games for stats
  const completedGames = [
    ...dbUser.gamesAsWhitePlayer.filter((game) => game.gameOver),
    ...dbUser.gamesAsBlackPlayer.filter((game) => game.gameOver),
    ...dbUser.gamesWithAi.filter((game) => game.gameOver),
  ];

  const wins = completedGames.filter(
    (game) => game.winner === dbUser.id
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {dbUser.username}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Ready for your next match?
            </p>
          </div>
          <Link href="/profile">
            <Button variant="outline" className="flex items-center gap-2">
              <User size={20} />
              Profile
            </Button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/games/new#player">
            <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Swords size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">New PvP Game</h3>
                    <p className="text-sm text-gray-500">
                      Challenge another player
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/games/new#ai">
            <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Bot size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">New AI Game</h3>
                    <p className="text-sm text-gray-500">Play against AI</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Wins</CardTitle>
              <Trophy size={20} className="text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wins}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Games
              </CardTitle>
              <Clock size={20} className="text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activePlayerGames.length + activeAiGames.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <Users size={20} className="text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedGames.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Games Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Active Games</CardTitle>
            <CardDescription>Your ongoing matches</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pvp" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pvp">Player Games</TabsTrigger>
                <TabsTrigger value="ai">AI Games</TabsTrigger>
              </TabsList>

              <TabsContent value="pvp">
                <ScrollArea className="h-[300px] w-full">
                  {activePlayerGames.length > 0 ? (
                    <div className="space-y-4">
                      {activePlayerGames.map((game) => (
                        <Link key={game.id} href={`/games#player`}>
                          <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">
                                    {game.whitePlayerId === dbUser.id
                                      ? `Playing as White vs ${game.blackPlayer.username}`
                                      : `Playing as Black vs ${game.whitePlayer.username}`}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(
                                      game.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button variant="outline" size="sm">
                                  Continue
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No active player games
                    </p>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="ai">
                <ScrollArea className="h-[300px] w-full">
                  {activeAiGames.length > 0 ? (
                    <div className="space-y-4">
                      {activeAiGames.map((game) => (
                        <Link key={game.id} href={`/games#ai`}>
                          <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">
                                    vs {game.aiType} ({game.playerColor})
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(
                                      game.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button variant="outline" size="sm">
                                  Continue
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No active AI games
                    </p>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
