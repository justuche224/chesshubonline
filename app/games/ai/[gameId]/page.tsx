import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import GamePage from "./GamePage";
import { UserWithColor } from "@/types";

const page = async ({ params }) => {
  const { gameId } = await params;
  const user = await currentUser();
  // console.log(user);

  if (!user) {
    return (
      <div>
        <h1>Login mate!</h1>
      </div>
    );
  }

  const game = await db.gameWithAi.findUnique({
    where: { id: gameId },
    include: { moves: { orderBy: { createdAt: "asc" } }, player: true },
  });

  if (!game) {
    return (
      <div>
        <h1>Game not found!</h1>
      </div>
    );
  }

  const player: UserWithColor = {
    id: user.id,
    username: user.username,
    email: user.email,
    image: user.image,
    color: "",
  };

  if (game.playerId !== player.id) {
    return (
      <div>
        <h1>You dont have access to this match!</h1>
      </div>
    );
  }

  player.color = game.playerColor;

  return (
    <GamePage
      player={player}
      aiType={game.aiType}
      currentPlayer={player}
      initialGame={game}
    />
  );
};

export default page;
