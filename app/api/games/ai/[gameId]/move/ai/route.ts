import { Chess } from "chess.js";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherSever } from "@/lib/pusher";
import { computerMove } from "@/lib/computerMove";

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const user = await currentUser();
    const { gameId } = await params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { aiType } = body;

    const game = await db.gameWithAi.findUnique({
      where: { id: params.gameId },
      include: { moves: { orderBy: { createdAt: "asc" } } },
    });

    if (!game) {
      return new NextResponse("Game not found", { status: 404 });
    }

    if (game.currentPlayer !== "AI") {
      return new NextResponse("Not your turn", { status: 400 });
    }

    const chessInstance = new Chess(game.fen);

    const aiMove = await computerMove({
      difficulty: aiType,
      fen: chessInstance.fen(),
    });

    if (aiMove) {
      const result = chessInstance.move(aiMove);
      if (!result) {
        return new NextResponse("Invalid move", { status: 400 });
      }

      const isGameOver = chessInstance.isGameOver();
      const updatedFEN = chessInstance.fen();

      const updatedGame = await db.$transaction([
        db.gameWithAi.update({
          where: { id: gameId },
          data: {
            fen: updatedFEN,
            status: isGameOver ? "finished" : "active",
            currentPlayer: "HUMAN",
            playerId: game.playerId,
          },
        }),
        db.move.create({
          data: {
            playerId: null,
            aiGameId: gameId,
            san: result.san,
            from: result.from,
            to: result.to,
            piece: result.piece,
            color: result.color,
            flags: result.flags,
            before: game.fen,
            after: updatedFEN,
          },
        }),
      ]);

      await pusherSever.trigger(`game-${gameId}`, "ai-move", {
        gameId,
        move: result,
        fen: updatedFEN,
        isGameOver,
      });

      return NextResponse.json({
        fen: updatedFEN,
        status: isGameOver ? "finished" : "active",
        currentPlayer: "HUMAN",
      });
    }

    return new NextResponse("Invalid move", { status: 400 });
  } catch (error) {
    console.error("Error processing move:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
