"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Crown } from "lucide-react";

const ChessKingTutorial = () => {
    const initialFen = "4k3/3p4/8/3K4/8/8/3p4/8 w - - 0 1";

    const getValidKingMoves = chess => {
        const kingSquare = chess
            .board()
            .flat()
            .find(
                piece => piece && piece.type === "k" && piece.color === "w"
            ).square;
        return chess
            .moves({ square: kingSquare, verbose: true })
            .filter(move => move.piece === "k")
            .map(move => ({ from: move.from, to: move.to }));
    };

    const [chess] = useState(() => new Chess(initialFen));
    const [validMoves, setValidMoves] = useState(() =>
        getValidKingMoves(chess)
    );
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [isMovingForward, setIsMovingForward] = useState(true);

    // Function to move the king
    const makeMove = useCallback(() => {
        const move = validMoves[currentMoveIndex];
        if (move) {
            chess.move(move);
        }
    }, [chess, validMoves, currentMoveIndex]);

    // Function to undo the last move
    const undoMove = useCallback(() => {
        chess.undo();
    }, [chess]);

    // Effect to handle the movement logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (isMovingForward) {
                makeMove();
                setIsMovingForward(false);
            } else {
                undoMove();
                setIsMovingForward(true);
                setCurrentMoveIndex(
                    prevIndex => (prevIndex + 1) % validMoves.length
                );
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [makeMove, undoMove, validMoves.length, isMovingForward]);

    // Update valid moves whenever the board changes
    useEffect(() => {
        setValidMoves(getValidKingMoves(chess));
    }, [chess]);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6" />
                    The King's Movement in Chess
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-4">
                {/* Chessboard Section */}
                <div className="w-[300px] h-[300px] mb-4">
                    <Chessboard
                        position={chess.fen()}
                        boardWidth={300}
                        arePiecesDraggable={false}
                        customBoardStyle={{
                            borderRadius: "4px",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)"
                        }}
                    />
                </div>

                {/* Write-Up Section */}
                <div className="text-lg space-y-4">
                    <p className="text-left">
                        The king is the most important piece in chess - if it's
                        captured, the game is lost! While not the most powerful
                        piece, the king can move one square in any direction:
                        horizontally, vertically, or diagonally.
                    </p>
                    <p className="text-left">
                        Watch as the white king demonstrates all its possible
                        moves. Notice how it can move in all eight directions,
                        but only one square at a time.
                    </p>
                    <p className="text-left">
                        However, the king cannot move to squares where it would
                        be in check. For example, in this scenario, the black
                        pawns and the black king restrict the white king's
                        movement. The pawns can attack diagonally, and the black
                        king ensures that the white king cannot enter adjacent
                        squares, as kings must maintain at least one square of
                        distance from each other at all times. This rule ensures
                        that the king remains safe while playing.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ChessKingTutorial;