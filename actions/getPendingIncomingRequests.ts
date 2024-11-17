"use server";

import { db } from "@/lib/db";
import { RequestStatus } from "@prisma/client";

export async function getPendingIncomingRequests(userId: string) {
  try {
    const count = await db.friendRequest.count({
      where: {
        receiverId: userId,
        status: RequestStatus.PENDING,
      },
    });
    return count;
  } catch (error) {
    console.error("Error checking pending requests:", error);
    throw new Error("Failed to check pending requests");
  }
}
