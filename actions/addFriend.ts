"use server";

import { getUserByUsername } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const addFriend = async (requesterId, addresseeUsername) => {
  try {
    const user = await currentUser();

    if (!user.email || !user.id) {
      return { error: "Unauthorized!" };
    }

    const addressee = await getUserByUsername(addresseeUsername);

    // Check if friendship already exists
    const existingFriendship = await db.friendship.findFirst({
      where: {
        AND: [{ requesterId: requesterId }, { addresseeId: addressee.id }],
      },
    });

    if (existingFriendship) {
      // console.log("Request sent already!");
      return { success: "Request sent already!" };
    }

    await db.friendship.create({
      data: {
        requesterId: requesterId,
        addresseeId: addressee.id,
      },
    });
    // console.log("Request sent!");
    return { success: "Request sent!" };
  } catch (error) {
    // console.log("Request failed!");
    return { error: "Failed to send request!" };
  }
};
