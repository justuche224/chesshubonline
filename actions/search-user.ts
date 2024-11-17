"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function searchUsers(query: string) {
  try {
    const user = await currentUser();

    if (!query) {
      return { users: [] };
    }

    const users = await db.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: query, mode: "insensitive" } },
              { firstname: { contains: query, mode: "insensitive" } },
              { lastname: { contains: query, mode: "insensitive" } },
            ],
          },
          // Exclude current user from results
          { id: { not: user.id } },
          // Exclude users who are already friends
          {
            AND: [
              {
                friends1: {
                  none: {
                    user2Id: user.id,
                  },
                },
              },
              {
                friends2: {
                  none: {
                    user1Id: user.id,
                  },
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        image: true,
        // Include pending friend requests
        receivedRequests: {
          where: {
            senderId: user.id,
          },
        },
      },
      take: 10, // Limit results
    });

    return {
      users: users.map((user) => ({
        ...user,
        hasPendingRequest: user.receivedRequests.length > 0,
      })),
    };
  } catch (error) {
    console.log(error);

    return { error: "Failed to search users" };
  }
}

/*
OR: [
    { username: { contains: query, mode: 'insensitive' } },
    { firstname: { contains: query, mode: 'insensitive' } },
    { lastname: { contains: query, mode: 'insensitive' } },
    { email: { contains: query, mode: 'insensitive' } },
  ],*/
