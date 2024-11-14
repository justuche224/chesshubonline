import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import GamesPage from "./GamesPage";

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

  return <GamesPage userGames={userGames} userGamesWithAi={userGamesWithAi} />;
};

export default page;
