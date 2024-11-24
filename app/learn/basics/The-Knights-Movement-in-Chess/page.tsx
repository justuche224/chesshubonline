"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ChessKnightTutorial = () => {
    // Initial position with a white knight in the center, kings, and some pieces to show jumping
    const initialFen = "4k3/8/3p4/3pN3/3p4/8/8/4K3 w - - 0 1";

    const getValidKnightMoves = chess => {
        const knightSquare = chess
            .board()
            .flat()
            .find(
                piece => piece && piece.type === "n" && piece.color === "w"
            ).square;
        return chess
            .moves({ square: knightSquare, verbose: true })
            .filter(move => move.piece === "n")
            .map(move => ({ from: move.from, to: move.to }));
    };

    const [chess] = useState(() => new Chess(initialFen));
    const [validMoves, setValidMoves] = useState(() =>
        getValidKnightMoves(chess)
    );
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [isMovingForward, setIsMovingForward] = useState(true);

    // Function to move the knight
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
        setValidMoves(getValidKnightMoves(chess));
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
                        <path d="M17 6h3l2 2v3l-2 2-3-3-2 2 3 3-2 2h-3l-2-2 3-3-8-8H4L2 2v3l2 2h3l8 8-3 3 2 2h3l2-2-3-3 2-2 3 3 2-2V9l-2-2-3 3-2-2 3-3z" />
                    </svg>
                    The Knight's Movement in Chess
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
                        The knight is a unique piece in chess with a special way of moving.
                        It moves in an L-shape pattern: two squares in one direction
                        (horizontally or vertically) and then one square perpendicular
                        to that direction.
                    </p>
                    <p className="text-left">
                        Watch as the white knight demonstrates its movement pattern. Notice
                        how it can jump over other pieces - this is the only piece in chess
                        with this ability! In this position, the black pawns don't block
                        the knight's movement, making it especially valuable in crowded
                        positions.
                    </p>
                    <p className="text-left">
                        A knight on any square can reach exactly eight different squares
                        (fewer if it's near the edge of the board). This predictable pattern
                        makes knights excellent tactical pieces, often used for forks
                        (attacking two valuable pieces at once) and surprise attacks. Unlike
                        bishops, knights can reach any square on the board, regardless of
                        its color.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ChessKnightTutorial;