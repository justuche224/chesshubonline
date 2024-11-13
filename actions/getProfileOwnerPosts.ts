"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { User } from "@prisma/client";

export const getProfileOwnerPosts = async (profileOwnerDetails: User) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized!" };
    }

    // Check if the visitor is friends with the profile owner
    const isFriend = await db.friendship.findFirst({
      where: {
        OR: [
          {
            requesterId: user.id,
            addresseeId: profileOwnerDetails.id,
            status: "ACCEPTED",
          },
          {
            requesterId: profileOwnerDetails.id,
            addresseeId: user.id,
            status: "ACCEPTED",
          },
        ],
      },
    });

    if (!isFriend) {
      return {
        message:
          "You are not friends with this user. You can't view their posts.",
        notFriends: true,
      };
    }

    // Fetch posts from the profile owner
    const profileOwnerPosts = await db.post.findMany({
      where: {
        userId: profileOwnerDetails.id,
      },
      include: {
        user: {
          select: {
            id: true,
            image: true,
            firstname: true,
            lastname: true,
            username: true,
            email: true,
          },
        },
        likes: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return profileOwnerPosts;
  } catch (error) {
    console.error(error);
    return {
      message: "Error getting users post!.",
    };
  }
};
