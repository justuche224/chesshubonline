import { db } from "@/lib/db";
import GamePage from "./Test";
import { currentUser } from "@/lib/auth";

const page = async ({ params }) => {
  const player = await currentUser();

  if (!player) {
    return (
      <div>
        <h1>Login mate!</h1>
      </div>
    );
  }

  const gameId = await params.gameId;

  const game = await db.game.findUnique({
    where: { id: gameId },
    include: { moves: { orderBy: { createdAt: "asc" } } },
  });

  if (!game) {
    return (
      <div>
        <h1>Game not found!</h1>
      </div>
    );
  }

  if (game.blackPlayerId !== player.id && game.whitePlayerId !== player.id) {
    return (
      <div>
        <h1>You dont have access to this match!</h1>
      </div>
    );
  }

  const whitePlayer = await db.user.findUnique({
    where: { id: game.whitePlayerId },
    select: { id: true, username: true },
  });
  const blackPlayer = await db.user.findUnique({
    where: { id: game.blackPlayerId },
    select: { id: true, username: true },
  });

  whitePlayer.color = "w";
  blackPlayer.color = "b";

  return (
    <GamePage
      whitePlayer={whitePlayer}
      blackPlayer={blackPlayer}
      currentPlayer={player.id == whitePlayer.id ? whitePlayer : blackPlayer}
      initialGame={game}
    />
  );
};

export default page;
