"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const getPosts = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized!" };
    }

    // Fetch the user's friends
    const userFriends = await db.friendship.findMany({
      where: {
        OR: [
          { requesterId: user.id, status: "ACCEPTED" },
          { addresseeId: user.id, status: "ACCEPTED" },
        ],
      },
      select: {
        requesterId: true,
        addresseeId: true,
      },
    });

    const friendIds = userFriends.map((friendship) => {
      if (friendship.requesterId !== user.id) {
        return friendship.requesterId;
      } else {
        return friendship.addresseeId;
      }
    });

    // Fetch posts by friends excluding the user's own posts
    const posts = await db.post.findMany({
      where: {
        userId: { in: friendIds },
        NOT: { userId: user.id },
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

    return posts;
  } catch (error) {
    console.log(error, "getPosts");
    return null;
  }
};
