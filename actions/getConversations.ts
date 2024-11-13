"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const getConversations = async () => {
  const user = await currentUser();
  if (!user) {
    return [];
  }

  try {
    const conversations = await db.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: user.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return conversations;
  } catch (error) {
    console.log(error);
    return [];
  }
};
