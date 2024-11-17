"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { RequestStatus } from "@prisma/client";

export const addFriend = async (friendId: string) => {
  try {
    // Get current user
    const user = await currentUser();

    if (!user) {
      return {
        error: "Unauthorized - Please login first",
      };
    }

    // Check if trying to add self
    if (user.id === friendId) {
      return {
        error: "You cannot add yourself as a friend",
      };
    }

    // Check if friend exists
    const friendExists = await db.user.findUnique({
      where: {
        id: friendId,
      },
    });

    if (!friendExists) {
      return {
        error: "User not found",
      };
    }

    // Check if they are already friends
    const existingFriendship = await db.friendship.findFirst({
      where: {
        OR: [
          {
            AND: [{ user1Id: user.id }, { user2Id: friendId }],
          },
          {
            AND: [{ user1Id: friendId }, { user2Id: user.id }],
          },
        ],
      },
    });

    if (existingFriendship) {
      return {
        error: "You are already friends with this user",
      };
    }

    // Check if there's a pending friend request
    const existingRequest = await db.friendRequest.findFirst({
      where: {
        OR: [
          {
            AND: [{ senderId: user.id }, { receiverId: friendId }],
          },
          {
            AND: [{ senderId: friendId }, { receiverId: user.id }],
          },
        ],
      },
    });

    if (existingRequest) {
      if (existingRequest.status === RequestStatus.PENDING) {
        return {
          error: "A friend request already exists between you and this user",
        };
      } else if (existingRequest.status === RequestStatus.REJECTED) {
        // If there's a rejected request, delete it and create a new one
        await db.friendRequest.delete({
          where: {
            id: existingRequest.id,
          },
        });
      }
    }

    // Create new friend request
    const newFriendRequest = await db.friendRequest.create({
      data: {
        senderId: user.id,
        receiverId: friendId,
        status: RequestStatus.PENDING,
      },
    });

    return {
      success: "Friend request sent successfully",
      request: newFriendRequest,
    };
  } catch (error) {
    console.error("Error in addFriend:", error);
    return {
      error: "Something went wrong while sending the friend request",
    };
  }
};
