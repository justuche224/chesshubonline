"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createConversation = async (friend: string) => {
  console.log(friend);

  if (!friend) return { error: "No friend" };

  const user = await currentUser();
  console.log(user);

  if (!user) return { error: "Unauthorised" };

  if (user.id == friend) {
    return { error: "You cannot start a chat with yourself" };
  }
  console.log("about to check friendship");

  try {
    const usersAreFriends = await db.friendship.findFirst({
      where: {
        OR: [
          { user1Id: user.id, user2Id: friend },
          { user1Id: friend, user2Id: user.id },
        ],
      },
    });

    if (!usersAreFriends) {
      return { error: "You must be friends to start a chat" };
    }
    console.log("found friendship");

    const existingConversation = await db.conversation.findFirst({
      where: {
        OR: [
          { user1Id: user.id, user2Id: friend },
          { user1Id: friend, user2Id: user.id },
        ],
      },
    });
    console.log(existingConversation);
    if (existingConversation) return existingConversation;
    console.log("creating new conversation");
    const conversation = await db.conversation.create({
      data: {
        user1Id: user.id,
        user2Id: friend,
      },
    });
    console.log(conversation);
    revalidatePath("/inbox");
    return { success: "Chat created", conversation };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
};
