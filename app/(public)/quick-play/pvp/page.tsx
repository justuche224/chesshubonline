"use client";

import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, Crown, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import logger from "@/utils/logger";

interface GameState {
  fen: string;
  moveHistory: string[];
  currentPlayer: "white" | "black";
  lastMove: { from: string; to: string } | null;
  rightClickedSquares: Record<string, any>;
}

const ChessGame = () => {
  // Initialize state with null values first
  const [game, setGame] = useState<Chess | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white"
  );
  const [moveFrom, setMoveFrom] = useState("");
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [lastMove, setLastMove] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const router = useRouter();

  // Initialize or load saved game state
  useEffect(() => {
    const savedState = localStorage.getItem("chess-game-state");
    if (savedState) {
      try {
        const {
          fen,
          moveHistory,
          currentPlayer,
          lastMove,
          rightClickedSquares,
        } = JSON.parse(savedState);
        const loadedGame = new Chess(fen);
        setGame(loadedGame);
        setMoveHistory(moveHistory);
        setCurrentPlayer(currentPlayer);
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

  // Initialize a new game
  const initializeNewGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setCurrentPlayer("white");
    setLastMove(null);
    setRightClickedSquares({});
  };

  // Save game state after each change
  useEffect(() => {
    if (game) {
      const gameState: GameState = {
        fen: game.fen(),
        moveHistory,
        currentPlayer,
        lastMove,
        rightClickedSquares,
      };
      localStorage.setItem("chess-game-state", JSON.stringify(gameState));
    }
  }, [game, moveHistory, currentPlayer, lastMove, rightClickedSquares]);

  // Get valid moves for a square
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

  function makeMove(sourceSquare, targetSquare) {
    if (!game) return false;
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) return false;

      const newGame = new Chess(game.fen());
      const newMoveHistory = [...moveHistory, `${currentPlayer}: ${move.san}`];
      const newCurrentPlayer = currentPlayer === "white" ? "black" : "white";
      const newLastMove = { from: sourceSquare, to: targetSquare };

      setGame(newGame);
      setMoveHistory(newMoveHistory);
      setCurrentPlayer(newCurrentPlayer);
      setLastMove(newLastMove);
      setMoveSquares({});

      if (game.isGameOver()) {
        let status = "";
        if (game.isCheckmate()) status = `Checkmate! ${currentPlayer} wins!`;
        else if (game.isDraw()) status = "Game Over - Draw!";
        else if (game.isStalemate()) status = "Game Over - Stalemate!";
        else if (game.isThreefoldRepetition())
          status = "Game Over - Draw by repetition!";
        alert(status);
        localStorage.removeItem("chess-game-state");
        initializeNewGame();
      }

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  function onSquareClick(square) {
    if (!game) return;
    const hasMoveOptions = game.moves({ square, verbose: true }).length > 0;

    if (
      !moveFrom &&
      hasMoveOptions &&
      game.get(square)?.color === currentPlayer[0]
    ) {
      setMoveFrom(square);
      getMoveOptions(square);
      return;
    }

    if (moveFrom) {
      const moveSuccess = makeMove(moveFrom, square);
      if (!moveSuccess) {
        if (hasMoveOptions && game.get(square)?.color === currentPlayer[0]) {
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
    const newRightClickedSquares = {
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    };
    setRightClickedSquares(newRightClickedSquares);
  }

  function resetGame() {
    initializeNewGame();
    localStorage.removeItem("chess-game-state");
  }

  const customSquareStyles = {
    ...moveSquares,
    ...rightClickedSquares,
    ...(lastMove && {
      [lastMove.from]: { backgroundColor: "rgba(255, 255, 0, 0.2)" },
      [lastMove.to]: { backgroundColor: "rgba(255, 255, 0, 0.2)" },
    }),
  };

  // Don't render until game is initialized
  if (!game) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-6xl mx-auto">
      <Card className="flex-grow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Chess Game</CardTitle>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/quick-play")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                <Home size={16} />
                Menu
              </button>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <RotateCcw size={16} />
                Reset Game
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-square max-w-2xl mx-auto">
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
              {currentPlayer}&apos;s turn
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Status</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-gray-100 rounded">
                In Check: {game.isCheck() ? "Yes" : "No"}
              </div>
              <div className="p-2 bg-gray-100 rounded">
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
