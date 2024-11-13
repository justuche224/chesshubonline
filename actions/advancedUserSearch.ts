"use server";

import { db } from "@/lib/db";

export const advancedSearchUsers = async (search, currentUserId) => {
  try {
    const users = await db.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } }, // Exclude the current user
          {
            OR: [
              { firstname: { contains: search, mode: "insensitive" } },
              { lastname: { contains: search, mode: "insensitive" } },
              { username: { contains: search, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        image: true,
        sentRequests: {
          // Include sentRequests and receivedRequests
          select: {
            status: true,
            addresseeId: true,
          },
        },
        receivedRequests: {
          select: {
            status: true,
            requesterId: true,
          },
        },
      },
    });

    // Separate users based on friendship status
    const friends = [];
    const pending = [];
    const noFriendship = [];

    users.forEach((user) => {
      let isFriend = false;
      let isPending = false;

      // Check sent requests
      user.sentRequests.forEach((request) => {
        if (request.addresseeId === currentUserId) {
          if (request.status === "ACCEPTED") {
            isFriend = true;
          } else if (request.status === "PENDING") {
            isPending = true;
          }
        }
      });

      // Check received requests
      user.receivedRequests.forEach((request) => {
        if (request.requesterId === currentUserId) {
          if (request.status === "ACCEPTED") {
            isFriend = true;
          } else if (request.status === "PENDING") {
            isPending = true;
          }
        }
      });

      if (isFriend) {
        friends.push(user);
      } else if (isPending) {
        pending.push(user);
      } else {
        noFriendship.push(user);
      }
    });

    // console.log(pending);

    return { friends, pending, noFriendship };
  } catch (error) {
    console.log(error);
    return null;
  }
};
