import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import NewGamePage from "./NewGamePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Game | ChessHub Online",
  description:
    "Challenge your skills in ChessHub Online, the ultimate platform for real-time player-vs-player and player-vs-AI chess matches. Enjoy intuitive gameplay, seamless moves tracking, and personalized AI opponents.",
};

const page = async () => {
  const user = await currentUser();

  if (!user) {
    return (
      <div>
        <h1>Please login!</h1>
      </div>
    );
  }

  // Fetch all users and their relationships
  const allUsers = await db.user.findMany({
    include: {
      gamesAsWhitePlayer: true,
      gamesAsBlackPlayer: true,
      gamesWithAi: true,
    },
  });

  // Fetch user's friendships
  const friendships = await db.friendship.findMany({
    where: {
      OR: [{ user1Id: user.id }, { user2Id: user.id }],
    },
    include: {
      user1: true,
      user2: true,
    },
  });

  // Extract friends from friendships
  const friends = friendships.map((friendship) =>
    friendship.user1Id === user.id ? friendship.user2 : friendship.user1
  );

  // Filter out the current user
  const otherUsers = allUsers.filter((u) => u.id !== user?.id);

  return <NewGamePage otherUsers={otherUsers} user={user} friends={friends} />;
};

export default page;
