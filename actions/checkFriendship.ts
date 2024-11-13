"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const checkFriendship = async (otherUser) => {
  //   console.log(otherUser);
  try {
    const user = await currentUser();

    if (!user.email || !user.id) {
      return { error: "Unauthorized!" };
    }

    // Check if the visitor is friends with the profile owner
    const friendship = await db.friendship.findFirst({
      where: {
        OR: [
          { requesterId: user.id, addresseeId: otherUser },
          { requesterId: otherUser, addresseeId: user.id },
        ],
      },
    });

    if (friendship) {
      return true;
    }
  } catch (error) {
    console.error(error);
    return {
      error: "Error checking friends.",
    };
  }
};
