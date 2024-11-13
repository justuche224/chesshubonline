import { Chess, Move } from "chess.js";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    console.log("fired ai game move for player route");

    const user = await currentUser();
    const { gameId } = await params;
    const body = await request.json();
    const { move, playerId }: { move: Move; playerId: string } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (user.id !== playerId) {
      return new NextResponse("Unauthorized: Incorrect player", {
        status: 401,
      });
    }

    const game = await db.gameWithAi.findUnique({
      where: { id: gameId },
      include: { moves: { orderBy: { createdAt: "asc" } } },
    });

    if (!game) {
      return new NextResponse("Game not found", { status: 404 });
    }

    if (game.currentPlayer !== "HUMAN") {
      return new NextResponse("Not your turn", { status: 400 });
    }

    const chessInstance = new Chess(game.fen);

    const result = chessInstance.move(move);
    if (!result) {
      return new NextResponse("Invalid move", { status: 400 });
    }

    const isGameOver = chessInstance.isGameOver();
    const updatedFEN = chessInstance.fen();
    const nextPlayer = "AI";

    try {
      await db.$transaction([
        db.gameWithAi.update({
          where: { id: gameId },
          data: {
            fen: updatedFEN,
            status: isGameOver ? "finished" : "active",
            currentPlayer: "AI",
          },
        }),
        db.move.create({
          data: {
            playerId,
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

      return NextResponse.json({
        fen: updatedFEN,
        status: isGameOver ? "finished" : "active",
        currentPlayer: nextPlayer,
        moves: [...game.moves, result],
      });
    } catch (error) {
      console.error("Database transaction failed:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  } catch (error) {
    console.error("Error processing move:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
