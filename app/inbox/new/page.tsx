import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import NewChat from "./NewChat";

const page = async () => {
  const user = await currentUser();
  if (!user) return <div>Please login</div>;
  const friends = await db.user.findUnique({
    where: { id: user.id },
    include: {
      friends1: {
        include: {
          user2: true,
        },
      },
      friends2: {
        include: {
          user1: true,
        },
      },
    },
  });
  // Combine friends1 and friends2 into a single list
  const allFriends = [
    ...friends.friends1.map((f) => f.user2), // Friends where user is user1
    ...friends.friends2.map((f) => f.user1), // Friends where user is user2
  ];
  return <NewChat friends={allFriends} />;
};

export default page;
