"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const uploadProfilePicture = async (imageUrl) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Not authenticated" };
    }

    // Update user's image in the database
    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        image: imageUrl,
      },
    });

    if (!updatedUser) {
      return { error: "Failed to update profile picture" };
    }
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return { error: "Something went wrong" };
  }
};
