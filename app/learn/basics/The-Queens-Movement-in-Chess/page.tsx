"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ChessQueenTutorial = () => {
    // Initial position with:
    // - White queen in the center (d4)
    // - Black pawns blocking some paths
    // - Kings for valid position
    const initialFen = "4k3/8/2p1p1p1/8/3Q4/2p1p1p1/8/4K3 w - - 0 1";

    const getValidQueenMoves = chess => {
        const queenSquare = chess
            .board()
            .flat()
            .find(
                piece => piece && piece.type === "q" && piece.color === "w"
            ).square;
        return chess
            .moves({ square: queenSquare, verbose: true })
            .filter(move => move.piece === "q")
            .map(move => ({ from: move.from, to: move.to }));
    };

    const [chess] = useState(() => new Chess(initialFen));
    const [validMoves, setValidMoves] = useState(() =>
        getValidQueenMoves(chess)
    );
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [isMovingForward, setIsMovingForward] = useState(true);

    // Function to move the queen
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
        setValidMoves(getValidQueenMoves(chess));
    }, [chess]);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                    <svg 
                        className="w-6 h-6" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                    >
                        <path d="M12 3c-1.1 0-2 .9-2 2 0 .7.4 1.4 1 1.7V8l-3 3-3-3V6.7c.6-.3 1-1 1-1.7 0-1.1-.9-2-2-2s-2 .9-2 2c0 .7.4 1.4 1 1.7V9l3 3-3 3v2.3c-.6.3-1 1-1 1.7 0 1.1.9 2 2 2s2-.9 2-2c0-.7-.4-1.4-1-1.7V16l3-3 3 3v1.3c-.6.3-1 1-1 1.7 0 1.1.9 2 2 2s2-.9 2-2c0-.7-.4-1.4-1-1.7V16l3-3 3 3v1.3c-.6.3-1 1-1 1.7 0 1.1.9 2 2 2s2-.9 2-2c0-.7-.4-1.4-1-1.7V15l-3-3 3-3V6.7c.6-.3 1-1 1-1.7 0-1.1-.9-2-2-2s-2 .9-2 2c0 .7.4 1.4 1 1.7V8l-3 3-3-3V6.7c.6-.3 1-1 1-1.7 0-1.1-.9-2-2-2z" />
                    </svg>
                    The Queen's Movement in Chess
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
                        The queen is the most powerful piece in chess, combining the
                        movement patterns of both the rook and bishop. It can move any
                        number of squares in any direction: horizontally, vertically,
                        or diagonally, making it a formidable piece for both attack
                        and defense.
                    </p>
                    <p className="text-left">
                        Watch as the white queen demonstrates its movement pattern. Notice
                        how it can move in eight different directions, but like other pieces
                        (except the knight), it cannot jump over other pieces. The black
                        pawns in this position show how even the mighty queen can be
                        blocked and restricted by careful piece placement.
                    </p>
                    <p className="text-left">
                        Due to its immense power, the queen is often used as the main
                        attacking piece in chess. However, its value also makes it a
                        target - losing your queen puts you at a significant disadvantage.
                        That's why it's crucial to keep your queen protected and use it
                        wisely, often waiting for the right moment to unleash its full
                        attacking potential.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ChessQueenTutorial;