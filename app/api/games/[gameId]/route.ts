import { Chess } from "chess.js";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherSever } from "@/lib/pusher";

export async function POST(request: NextRequest, { params }) {
    try {
        console.log("fired move route");

        const user = await currentUser();
        const { gameId } = params;
        const body = await request.json();
        const { move, playerId } = body; // `move` is an object containing all move details.

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (user.id !== playerId) {
            return new NextResponse("Unauthorized: Incorrect player", {
                status: 401
            });
        }

        const game = await db.game.findUnique({
            where: { id: gameId },
            include: { moves: { orderBy: { createdAt: "asc" } } }
        });

        if (!game) {
            return new NextResponse("Game not found", { status: 404 });
        }

        if (game.currentPlayer !== playerId) {
            return new NextResponse("Not your turn", { status: 400 });
        }

        const chessInstance = new Chess(game.fen);

        const result = chessInstance.move(move); // Execute the move.
        if (!result) {
            return new NextResponse("Invalid move", { status: 400 });
        }

        const isGameOver = chessInstance.isGameOver();
        const updatedFEN = chessInstance.fen();
        const nextPlayer =
            chessInstance.turn() === "w"
                ? game.whitePlayerId
                : game.blackPlayerId;

        try {
            // Begin transaction to update the game and create a move.
            await db.$transaction([
                db.game.update({
                    where: { id: gameId },
                    data: {
                        fen: updatedFEN,
                        status: isGameOver ? "finished" : "active",
                        currentPlayer: nextPlayer
                    }
                }),
                db.move.create({
                    data: {
                        playerId,
                        gameId,
                        san: result.san,
                        from: result.from,
                        to: result.to,
                        piece: result.piece,
                        color: result.color,
                        flags: result.flags,
                        before: game.fen,
                        after: updatedFEN
                    }
                })
            ]);

            // Notify clients via Pusher.
            await pusherSever.trigger(`game-${gameId}`, "move", {
                gameId,
                move: result,
                playerId,
                fen: updatedFEN,
                isGameOver
            });

            return NextResponse.json({
                fen: updatedFEN,
                status: isGameOver ? "finished" : "active",
                currentPlayer: nextPlayer,
                moves: [...game.moves, result]
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
