import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import HomePage from "./HomePage";

export default async function Home() {
  const user = await currentUser();
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      gamesAsWhitePlayer: true,
      gamesAsBlackPlayer: true,
      gamesWithAi: true,
    },
  });
  return <HomePage dbUser={dbUser} />;
}
