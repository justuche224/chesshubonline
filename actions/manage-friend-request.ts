"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { RequestStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Accepts a friend request and creates a friendship between users
 */
export async function acceptFriendRequest(requestId: string) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // Find the request and verify the current user is the receiver
    const request = await db.friendRequest.findFirst({
      where: {
        id: requestId,
        receiverId: user.id,
        status: RequestStatus.PENDING,
      },
    });

    if (!request) {
      throw new Error("Friend request not found");
    }

    // Use a transaction to ensure both operations succeed or fail together
    await db.$transaction([
      // Update request status to ACCEPTED
      db.friendRequest.update({
        where: { id: requestId },
        data: { status: RequestStatus.ACCEPTED },
      }),
      // Create friendship record
      db.friendship.create({
        data: {
          user1Id: request.senderId,
          user2Id: request.receiverId,
        },
      }),
    ]);

    revalidatePath("friends/requests");
    return { success: true };
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw new Error("Failed to accept friend request");
  }
}

/**
 * Rejects a friend request
 */
export async function rejectFriendRequest(requestId: string) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const request = await db.friendRequest.findFirst({
      where: {
        id: requestId,
        receiverId: user.id,
        status: RequestStatus.PENDING,
      },
    });

    if (!request) {
      throw new Error("Friend request not found");
    }

    await db.friendRequest.update({
      where: { id: requestId },
      data: { status: RequestStatus.REJECTED },
    });

    revalidatePath("friends/requests");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    throw new Error("Failed to reject friend request");
  }
}

/**
 * Cancels a sent friend request
 */
export async function cancelSentFriendRequest(requestId: string) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const request = await db.friendRequest.findFirst({
      where: {
        id: requestId,
        senderId: user.id,
        status: RequestStatus.PENDING,
      },
    });

    if (!request) {
      throw new Error("Friend request not found");
    }

    await db.friendRequest.delete({
      where: { id: requestId },
    });

    revalidatePath("friends/requests");
    return { success: true };
  } catch (error) {
    console.error("Error canceling friend request:", error);
    throw new Error("Failed to cancel friend request");
  }
}
