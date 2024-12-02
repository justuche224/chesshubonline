"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ChessRookTutorial = () => {
    // Initial position with a white rook in the center, kings, and some blocking pawns
    const initialFen = "4k3/8/3p4/3R4/3p4/8/8/4K3 w - - 0 1";

    const getValidRookMoves = chess => {
        const rookSquare = chess
            .board()
            .flat()
            .find(
                piece => piece && piece.type === "r" && piece.color === "w"
            ).square;
        return chess
            .moves({ square: rookSquare, verbose: true })
            .filter(move => move.piece === "r")
            .map(move => ({ from: move.from, to: move.to }));
    };

    const [chess] = useState(() => new Chess(initialFen));
    const [validMoves, setValidMoves] = useState(() =>
        getValidRookMoves(chess)
    );
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [isMovingForward, setIsMovingForward] = useState(true);

    // Function to move the rook
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
        setValidMoves(getValidRookMoves(chess));
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
                        <path d="M6 20v-2h2v-2H6v-2h2v-2H6V8h2V6H6V4h12v2h-2v2h2v4h-2v2h2v2h-2v2h2v2H6z" />
                    </svg>
                    The Rook's Movement in Chess
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
                        The rook is a major piece in chess, moving any number of squares
                        horizontally or vertically. It's considered one of the most powerful
                        pieces due to its ability to control long files and ranks, making
                        it particularly strong in open positions.
                    </p>
                    <p className="text-left">
                        Watch as the white rook demonstrates its movement pattern. Notice
                        how it can move along ranks (horizontal rows) and files (vertical columns),
                        but cannot jump over other pieces. In this position, the black pawns
                        block the rook's path, showing how pieces can limit a rook's mobility.
                    </p>
                    <p className="text-left">
                        Rooks become especially powerful in the endgame, where they can
                        control entire ranks to cut off enemy kings or support passed pawns.
                        They're also unique in chess as the only piece that can perform
                        a special move called "castling" with the king - a crucial move
                        for king safety and rook activation in the opening phase of the game.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ChessRookTutorial;