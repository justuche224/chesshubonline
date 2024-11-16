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
    },
  });
  // console.log(dbUser);

  return <HomePage dbUser={dbUser} />;
}
