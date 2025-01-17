import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import HomePage from "./HomePage";

export default async function Home() {
  const user = await currentUser();
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      gamesAsWhitePlayer: {
        include: {
          whitePlayer: true,
          blackPlayer: true,
        },
      },
      gamesAsBlackPlayer: {
        include: {
          whitePlayer: true,
          blackPlayer: true,
        },
      },
      gamesWithAi: true,
      friends1: true,
      friends2: true,
    },
  });

  return <HomePage dbUser={dbUser} />;
}
