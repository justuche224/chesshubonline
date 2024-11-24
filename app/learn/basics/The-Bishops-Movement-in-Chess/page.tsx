"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ChessBishopTutorial = () => {
    // Initial position with a white bishop in the center, both kings (required), and some blocking pieces
    const initialFen = "4k3/3p4/8/4B3/8/2p5/8/4K3 w - - 0 1";

    const getValidBishopMoves = chess => {
        const bishopSquare = chess
            .board()
            .flat()
            .find(
                piece => piece && piece.type === "b" && piece.color === "w"
            ).square;
        return chess
            .moves({ square: bishopSquare, verbose: true })
            .filter(move => move.piece === "b")
            .map(move => ({ from: move.from, to: move.to }));
    };

    const [chess] = useState(() => new Chess(initialFen));
    const [validMoves, setValidMoves] = useState(() =>
        getValidBishopMoves(chess)
    );
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [isMovingForward, setIsMovingForward] = useState(true);

    // Function to move the bishop
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
        setValidMoves(getValidBishopMoves(chess));
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
                        <path d="M9 4.5a2.5 2.5 0 015 0V5l2.5 2.5L19 5v2.5l-2.5 2.5L19 12.5V16l-2.5 2.5L14 16v-2.5L11.5 11 9 13.5V16l-2.5 2.5L4 16v-3.5L6.5 10 4 7.5V5l2.5 2.5L9 5V4.5z" />
                    </svg>
                    The Bishop's Movement in Chess
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
                        The bishop is a powerful piece that moves diagonally across the board.
                        It can move any number of squares along these diagonal paths, making
                        it excellent for long-range attacks and controlling large sections of
                        the board.
                    </p>
                    <p className="text-left">
                        Watch as the white bishop demonstrates its movement pattern. Notice
                        how it can move along both light and dark diagonal lines, but
                        cannot jump over other pieces. In this position, some of the
                        bishop's paths are blocked by the black pawns.
                    </p>
                    <p className="text-left">
                        An interesting characteristic of bishops is that they are bound to
                        squares of a single color - a bishop that starts on a light square
                        will always remain on light squares, and vice versa. This is why
                        chess players typically try to keep both of their bishops alive,
                        as they complement each other by controlling different colored squares.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ChessBishopTutorial;