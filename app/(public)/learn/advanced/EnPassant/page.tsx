"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EnPassantTutorial = () => {
  const initialFen = "4k3/8/8/8/3p4/8/4P3/4K3 w - - 0 1";
  const [chess] = useState(() => new Chess(initialFen));
  const [boardPosition, setBoardPosition] = useState(initialFen);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = useMemo(
    () => [
      {
        move: "e2e4",
        description:
          "White moves its pawn two squares forward, setting up the en passant opportunity.",
      },
      {
        move: "d4e3",
        description:
          "Black captures the white pawn en passant. Note how the black pawn moves diagonally to the square the white pawn 'passed'.",
      },
    ],
    []
  );

  const resetPosition = useCallback(() => {
    chess.load(initialFen);
    setBoardPosition(initialFen);
    setCurrentStep(0);
  }, [chess]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length) {
      chess.move(steps[currentStep].move);
      setBoardPosition(chess.fen());
      setCurrentStep(currentStep + 1);
    }
  }, [chess, currentStep, steps]);

  useEffect(() => {
    resetPosition();
  }, [resetPosition]);

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
            <path d="M19 5L5 19M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          En Passant Capture in Chess
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-4">
        <div className="w-[300px] h-[300px] mb-4">
          <Chessboard
            position={boardPosition}
            boardWidth={300}
            arePiecesDraggable={false}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
        <div className="flex gap-4 mb-4">
          <Button onClick={resetPosition}>Reset</Button>
          <Button onClick={nextStep} disabled={currentStep >= steps.length}>
            Next Step
          </Button>
        </div>
        <div className="text-lg space-y-4">
          <p className="text-left font-semibold">
            {currentStep < steps.length
              ? steps[currentStep].description
              : "En passant demonstration complete."}
          </p>
          <p className="text-left">
            En passant is a special pawn capture that can occur immediately
            after a pawn moves two squares forward from its starting position
            and an enemy pawn could have captured it had it moved only one
            square forward.
          </p>
          <p className="text-left">
            The en passant capture must be performed on the very next turn, or
            the right to do so is lost. This rule was introduced in the 15th
            century to counteract the then-new rule that allowed pawns to move
            two squares on their first move.
          </p>
          <p className="text-left">Key points about en passant:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>It can only be performed by a pawn</li>
            <li>
              It can only occur immediately after a pawn moves two squares
            </li>
            <li>The capturing pawn must be on its fifth rank</li>
            <li>
              The captured pawn is removed from the board as if it had only
              moved one square
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnPassantTutorial;
