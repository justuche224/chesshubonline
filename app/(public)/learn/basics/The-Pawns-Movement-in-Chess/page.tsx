"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ChessPawnTutorial = () => {
    // Initial position with:
    // - White pawn on starting square (e2)
    // - Black pawns on d3 and f3 to show diagonal captures
    // - Kings for valid position
    const initialFen = "4k3/8/8/8/8/3p1p2/4P3/4K3 w - - 0 1";

    const getValidPawnMoves = chess => {
        const pawnSquare = chess
            .board()
            .flat()
            .find(
                piece => piece && piece.type === "p" && piece.color === "w"
            ).square;
        return chess
            .moves({ square: pawnSquare, verbose: true })
            .filter(move => move.piece === "p")
            .map(move => ({ from: move.from, to: move.to }));
    };

    const [chess] = useState(() => new Chess(initialFen));
    const [validMoves, setValidMoves] = useState(() =>
        getValidPawnMoves(chess)
    );
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [isMovingForward, setIsMovingForward] = useState(true);

    // Function to move the pawn
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
        setValidMoves(getValidPawnMoves(chess));
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
                        <path d="M12 4c-1.1 0-2 .9-2 2 0 .7.4 1.4 1 1.7V9h2V7.7c.6-.3 1-1 1-1.7 0-1.1-.9-2-2-2zm-3 6v2h6v-2H9zm-3 4v2h12v-2H6zm-2 4v2h16v-2H4z" />
                    </svg>
                    The Pawn's Movement in Chess
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
                        Pawns are unique in chess as they're the only pieces that move
                        differently when capturing. From their starting position, pawns
                        can move either one or two squares forward. After their first
                        move, they can only advance one square at a time.
                    </p>
                    <p className="text-left">
                        Watch as the white pawn demonstrates its movement patterns. While
                        pawns can only move straight forward, they capture diagonally!
                        In this position, you can see how the pawn can either advance
                        one or two squares forward (since it hasn't moved yet), or
                        capture the black pawns on either diagonal.
                    </p>
                    <p className="text-left">
                        Pawns also have two special abilities: en passant captures
                        (a special capture when an enemy pawn uses its two-square advance
                        to avoid capture) and promotion (when a pawn reaches the opposite
                        end of the board, it can be converted into any other piece except
                        a king, usually becoming a queen).
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ChessPawnTutorial;