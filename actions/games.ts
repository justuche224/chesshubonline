"use server";

import { db } from "@/lib/db";
import logger from "@/utils/logger";
import { CompleteGameData } from "@/types";
import { currentUser } from "@/lib/auth";

export type GetUserGamesResult =
  | { success: true; games: CompleteGameData[] }
  | { success: false; error: string };

export async function getUserGames(
  otherUserId: string
): Promise<GetUserGamesResult> {
  const user = await currentUser();
  try {
    const userGames: CompleteGameData[] = await db.game.findMany({
      where: {
        OR: [
          {
            whitePlayerId: user.id,
            blackPlayerId: otherUserId,
          },
          {
            whitePlayerId: otherUserId,
            blackPlayerId: user.id,
          },
        ],
      },
      include: {
        whitePlayer: true,
        blackPlayer: true,
        moves: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return { success: true, games: userGames };
  } catch (error) {
    logger.error(error);
    return { success: false, error: "Failed to get user games" };
  }
}
