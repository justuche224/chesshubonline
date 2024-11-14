import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import NewGamePage from "./NewGamePage";

const page = async () => {
  const user = await currentUser();

  if (!user) {
    return (
      <div>
        <h1>Please login</h1>
      </div>
    );
  }
  const allUsers = await db.user.findMany({
    include: {
      gamesAsWhitePlayer: true,
      gamesAsBlackPlayer: true,
      gamesWithAi: true,
    },
  });

  // Filter out the current user
  const otherUsers = allUsers.filter((u) => u.id !== user?.id);

  return <NewGamePage otherUsers={otherUsers} user={user} />;
};

export default page;
