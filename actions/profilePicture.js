"use server";

import { getUserById } from "@/data/user";
import { db } from "@/lib/db";

export const profilePicture = async (res, user) => {
  if (!res.url) return { error: "No image!" };

  const profile = await getUserById(user.id);

  if (!profile) return { error: "Profile does not exist!" };

  await db.user.update({
    where: { id: profile.id },
    data: { image: res.url },
  });
  return { success: "profile picture updated successfully!" };
};
