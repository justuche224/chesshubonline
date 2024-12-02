"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CastlingTutorial = () => {
  // Initial positions for both demonstrations
  const kingsideInitialFen =
    "r3k2r/pppq1ppp/2n1bn2/2b1p3/2B1P3/2N1BN2/PPPQ1PPP/R3K2R w KQkq - 0 1";
  const queensideInitialFen =
    "r3k2r/pppq1ppp/2n1bn2/2b1p3/2B1P3/2N1BN2/PPPQ1PPP/R3K2R w KQkq - 0 1";

  const [kingsideChess] = useState(() => new Chess(kingsideInitialFen));
  const [queensideChess] = useState(() => new Chess(queensideInitialFen));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [kingsideMoveSequence, setKingsideMoveSequence] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [queensideMoveSequence, setQueensideMoveSequence] = useState(0);

  // Reset boards to initial positions
  const resetKingside = useCallback(() => {
    kingsideChess.load(kingsideInitialFen);
  }, [kingsideChess]);

  const resetQueenside = useCallback(() => {
    queensideChess.load(queensideInitialFen);
  }, [queensideChess]);

  // Demonstrate castling moves
  const demonstrateKingsideCastling = useCallback(() => {
    kingsideChess.move("O-O");
  }, [kingsideChess]);

  const demonstrateQueensideCastling = useCallback(() => {
    queensideChess.move("O-O-O");
  }, [queensideChess]);

  // Effects to handle the demonstration sequences
  useEffect(() => {
    const interval = setInterval(() => {
      setKingsideMoveSequence((prev) => {
        const next = (prev + 1) % 2;
        if (next === 0) {
          resetKingside();
        } else {
          demonstrateKingsideCastling();
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [resetKingside, demonstrateKingsideCastling]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueensideMoveSequence((prev) => {
        const next = (prev + 1) % 2;
        if (next === 0) {
          resetQueenside();
        } else {
          demonstrateQueensideCastling();
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [resetQueenside, demonstrateQueensideCastling]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 flex items-center flex-col px-5">
      {/* Kingside Castling */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 5L12 5M19 5L19 3M19 5L19 7M12 8L12 16M9 16L15 16M9 20L15 20" />
            </svg>
            Kingside Castling (O-O)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-4">
          <div className="w-[300px] h-[300px] mb-4">
            <Chessboard
              position={kingsideChess.fen()}
              boardWidth={300}
              arePiecesDraggable={false}
              customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            />
          </div>
          <div className="text-lg space-y-4">
            <p className="text-left">
              Kingside castling is a defensive move that typically happens
              earlier in the game. The king moves two squares towards the h-file
              (to g1), and the kingside rook jumps over to f1.
            </p>
            <p className="text-left">
              This is the more common form of castling because: • It can be
              completed more quickly (fewer pieces to move out of the way) • It
              places the king in a slightly more protected position • The rook
              is well-placed to control the center files
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Queenside Castling */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 5L12 5M5 5L5 3M5 5L5 7M12 8L12 16M9 16L15 16M9 20L15 20" />
            </svg>
            Queenside Castling (O-O-O)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-4">
          <div className="w-[300px] h-[300px] mb-4">
            <Chessboard
              position={queensideChess.fen()}
              boardWidth={300}
              arePiecesDraggable={false}
              customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            />
          </div>
          <div className="text-lg space-y-4">
            <p className="text-left">
              Queenside castling is a more complex maneuver where the king moves
              two squares towards the a-file (to c1), and the queenside rook
              jumps over to d1.
            </p>
            <p className="text-left">
              This form of castling: • Usually takes longer to set up (need to
              move queen and bishop) • Can lead to more dynamic play • Places
              the rook closer to the center • Often used in positions where
              kingside castling is prevented
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Common Rules Section */}
      <Card>
        <CardContent className="p-6">
          <p className="text-lg mb-4 font-medium">
            Requirements for Both Types of Castling:
          </p>
          <div className="text-lg space-y-2">
            <p>
              • The king and the respective rook must not have moved previously
            </p>
            <p>• No pieces can be between the king and the rook</p>
            <p>• The king must not currently be in check</p>
            <p>
              • The king must not pass through a square that is under attack
            </p>
            <p>• The king&apos;s destination square must not be under attack</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CastlingTutorial;
