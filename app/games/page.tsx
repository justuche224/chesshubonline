import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import PvPGames from "./PvPGames";
import PvPAiGames from "./PvAIGames";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = async () => {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-medium text-gray-700">
          Please log in to view your games.
        </p>
      </div>
    );
  }

  const userGames = await db.game.findMany({
    where: {
      OR: [{ whitePlayerId: user.id }, { blackPlayerId: user.id }],
    },
    include: {
      whitePlayer: true,
      blackPlayer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const userGamesWithAi = await db.gameWithAi.findMany({
    where: {
      playerId: user.id,
    },
    include: {
      player: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <Tabs defaultValue="player" className="w-full text-center">
        <TabsList>
          <TabsTrigger value="player">Games with Players</TabsTrigger>
          <TabsTrigger value="ai">Games with AI</TabsTrigger>
        </TabsList>
        <TabsContent value="player">
          <PvPGames userGames={userGames} />
        </TabsContent>
        <TabsContent value="ai">
          <PvPAiGames userGamesWithAi={userGamesWithAi} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
