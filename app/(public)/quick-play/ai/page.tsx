"use client";
import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, Crown, Home, Cpu } from "lucide-react";
import { useRouter } from "next/navigation";
import logger from "@/utils/logger";

// Piece values for AI evaluation
const PIECE_VALUES = {
  p: 1, // pawn
  n: 3, // knight
  b: 3, // bishop
  r: 5, // rook
  q: 9, // queen
  k: 100, // king
};

function findBestMove(game) {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Evaluate each move
  const moveScores = moves.map((move) => {
    const testGame = new Chess(game.fen());
    testGame.move(move);

    let score = 0;

    // If move is a capture, add captured piece value
    if (move.captured) {
      score += PIECE_VALUES[move.captured] * 10;
    }

    // If move puts opponent in check
    if (testGame.isCheck()) {
      score += 5;
    }

    // If move is checkmate
    if (testGame.isCheckmate()) {
      score += 1000;
    }

    // Basic positional scoring - prefer center control
    const centerSquares = ["d4", "d5", "e4", "e5"];
    if (centerSquares.includes(move.to)) {
      score += 2;
    }

    // Avoid moving into capture
    const opponentMoves = testGame.moves({ verbose: true });
    for (const oppMove of opponentMoves) {
      if (oppMove.to === move.to) {
        score -= PIECE_VALUES[move.piece];
      }
    }

    return { move, score };
  });

  // Sort moves by score and add some randomness to top moves
  moveScores.sort((a, b) => b.score - a.score);
  const topMoves = moveScores.slice(0, 3); // Consider top 3 moves
  const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];

  return selectedMove.move;
}

interface GameState {
  fen: string;
  moveHistory: string[];
  lastMove: { from: string; to: string } | null;
  rightClickedSquares: Record<string, any>;
}

const ChessGame = () => {
  const [game, setGame] = useState<Chess | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [moveFrom, setMoveFrom] = useState("");
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [isThinking, setIsThinking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedState = localStorage.getItem("chess-ai-game-state");
    if (savedState) {
      try {
        const { fen, moveHistory, lastMove, rightClickedSquares } =
          JSON.parse(savedState);
        const loadedGame = new Chess(fen);
        setGame(loadedGame);
        setMoveHistory(moveHistory);
        setLastMove(lastMove);
        setRightClickedSquares(rightClickedSquares);
      } catch (error) {
        console.error("Error loading saved game:", error);
        initializeNewGame();
      }
    } else {
      initializeNewGame();
    }
  }, []);

  const initializeNewGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setLastMove(null);
    setRightClickedSquares({});
  };

  useEffect(() => {
    if (game) {
      const gameState: GameState = {
        fen: game.fen(),
        moveHistory,
        lastMove,
        rightClickedSquares,
      };
      localStorage.setItem("chess-ai-game-state", JSON.stringify(gameState));
    }
  }, [game, moveHistory, lastMove, rightClickedSquares]);

  const makeAIMove = async () => {
    if (!game || game.isGameOver()) return;

    setIsThinking(true);
    // Add a small delay to show the "thinking" state
    await new Promise((resolve) => setTimeout(resolve, 500));

    const bestMove = findBestMove(game);
    if (bestMove) {
      const newGame = new Chess(game.fen());
      newGame.move(bestMove);

      setGame(newGame);
      setMoveHistory([...moveHistory, `Black: ${bestMove.san}`]);
      setLastMove({ from: bestMove.from, to: bestMove.to });

      if (newGame.isGameOver()) {
        handleGameOver(newGame);
      }
    }
    setIsThinking(false);
  };

  function getMoveOptions(square) {
    if (!game) return;
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) return;

    const newSquares = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)",
        borderRadius: "50%",
      };
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setMoveSquares(newSquares);
  }

  const handleGameOver = (currentGame) => {
    let status = "";
    if (currentGame.isCheckmate()) {
      status = `Checkmate! ${
        currentGame.turn() === "w" ? "Black" : "White"
      } wins!`;
    } else if (currentGame.isDraw()) {
      status = "Game Over - Draw!";
    } else if (currentGame.isStalemate()) {
      status = "Game Over - Stalemate!";
    } else if (currentGame.isThreefoldRepetition()) {
      status = "Game Over - Draw by repetition!";
    }
    alert(status);
    localStorage.removeItem("chess-ai-game-state");
    initializeNewGame();
  };

  function makeMove(sourceSquare, targetSquare) {
    if (!game || game.turn() !== "w") return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) return false;

      const newGame = new Chess(game.fen());
      setGame(newGame);
      setMoveHistory([...moveHistory, `White: ${move.san}`]);
      setLastMove({ from: sourceSquare, to: targetSquare });
      setMoveSquares({});

      if (!newGame.isGameOver()) {
        // Make AI move after a short delay
        makeAIMove();
      } else {
        handleGameOver(newGame);
      }

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  function onSquareClick(square) {
    if (!game || game.turn() !== "w" || isThinking) return;

    const hasMoveOptions = game.moves({ square, verbose: true }).length > 0;

    if (!moveFrom && hasMoveOptions && game.get(square)?.color === "w") {
      setMoveFrom(square);
      getMoveOptions(square);
      return;
    }

    if (moveFrom) {
      const moveSuccess = makeMove(moveFrom, square);
      if (!moveSuccess) {
        if (hasMoveOptions && game.get(square)?.color === "w") {
          setMoveFrom(square);
          getMoveOptions(square);
        } else {
          setMoveFrom("");
          setMoveSquares({});
        }
      } else {
        setMoveFrom("");
        setMoveSquares({});
      }
    }
  }

  function onSquareRightClick(square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square]?.backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  function resetGame() {
    initializeNewGame();
    localStorage.removeItem("chess-ai-game-state");
  }

  const customSquareStyles = {
    ...moveSquares,
    ...rightClickedSquares,
    ...(lastMove && {
      [lastMove.from]: { backgroundColor: "rgba(255, 255, 0, 0.2)" },
      [lastMove.to]: { backgroundColor: "rgba(255, 255, 0, 0.2)" },
    }),
  };

  if (!game) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-6xl mx-auto">
      <Card className="flex-grow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              Chess Game vs AI <Cpu className="h-5 w-5" />
            </CardTitle>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/quick-play")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                <Home size={16} />
                <span className="hidden sm:inline-block">Menu</span>
              </button>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline-block">Reset Game</span>
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-square max-w-lg mx-auto">
            <Chessboard
              position={game.fen()}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              onPieceDrop={makeMove}
              customSquareStyles={customSquareStyles}
              customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full lg:w-80">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Game Info
            <Badge variant="outline" className="flex items-center gap-1">
              <Crown size={14} />
              {isThinking
                ? "AI thinking..."
                : game.turn() === "w"
                ? "Your turn"
                : "AI's turn"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Status</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                In Check: {game.isCheck() ? "Yes" : "No"}
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                Moves: {Math.floor(moveHistory.length / 2) + 1}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Move History</h3>
            <ScrollArea className="h-[200px] w-full rounded-md border p-2">
              {moveHistory.map((move, index) => (
                <div
                  key={index}
                  className="py-1 text-sm border-b last:border-0"
                >
                  {move}
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChessGame;
