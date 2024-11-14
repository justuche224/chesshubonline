import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import UserProfile from "./UserProfile";

const page = async () => {
  const user = await currentUser();
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      gamesAsWhitePlayer: true,
      gamesAsBlackPlayer: true,
      gamesWithAi: true,
    },
  });

  return <UserProfile user={dbUser} />;
};

export default page;
