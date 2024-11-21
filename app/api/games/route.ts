import { Chess } from "chess.js";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AIType } from "@prisma/client";
import logger from "@/utils/logger";

// Type for the request body
type CreateGameRequest = {
  player1Id: string;
  player2Id?: string; // Optional for AI games
  gameType: "AI" | "HUMAN";
  aiType?: AIType; // Required for AI games
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateGameRequest;
    const { player1Id, player2Id, gameType, aiType } = body;
    logger.log(body);

    // Validate required fields
    if (!player1Id || !gameType) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Initialize new chess game
    const chess = new Chess();
    logger.log("game instance created", chess.fen());

    // Create AI game
    if (gameType === "AI") {
      if (!aiType) {
        return new NextResponse("AI type is required for AI games", {
          status: 400,
        });
      }
      logger.log("about to create new game");

      const newAiGame = await db.gameWithAi.create({
        data: {
          fen: chess.fen(),
          status: "active",
          playerId: player1Id,
          aiType: aiType,
          playerColor: chess.turn() === "w" ? "w" : "b",
          currentPlayer: chess.turn() === "w" ? "HUMAN" : "AI",
          moves: {
            create: [],
          },
        },
        include: {
          moves: true,
          player: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
      });

      return NextResponse.json(newAiGame);
    }

    // Create human vs human game
    if (!player2Id) {
      return new NextResponse("Second player ID is required for human games", {
        status: 400,
      });
    }

    const newGame = await db.game.create({
      data: {
        fen: chess.fen(),
        status: "active",
        whitePlayerId: player1Id,
        blackPlayerId: player2Id,
        currentPlayer: chess.turn() === "w" ? player1Id : player2Id,
        moves: {
          create: [],
        },
      },
      include: {
        moves: true,
        whitePlayer: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        blackPlayer: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(newGame);
  } catch (error) {
    logger.error("Error creating game:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
