"use server";

import { db } from "@/lib/db";

export const acceptRequest = async (id: string) => {
  const friendship = await db.friendship.findUnique({
    where: {
      id: id,
    },
  });
  if (!friendship) {
    return { error: "Invalid friend request!" };
  }
  try {
    await db.friendship.update({
      where: { id: friendship.id },
      data: { status: "ACCEPTED" },
    });
    console.log("accepted");
    return { success: "Request accepted!" };
  } catch (error) {
    console.log(error);
    return { error: "Unable to accept request. try again later!" };
  }
};
