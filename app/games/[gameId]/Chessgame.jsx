"use client";

import React, { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { pusherClient } from "@/lib/pusher";

import {
  mergeStyles,
  grayedOutStyles,
  highlightedStyles,
  highlightedCapturedStyles,
  markedStyles,
  selectedStyles,
  historyStyles,
  checkStyles,
  staleStyles,
} from "./square-styles";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// white, black and current player should be an object with properties: id, username and color
const Chessgame = ({
  onStatusChange,
  initialGame,
  whitePlayer,
  blackPlayer,
  currentPlayer,
}) => {
  const [game, setGame] = useState(new Chess(initialGame.fen));
  const [gameStatus, setGameStatus] = useState({});
  const [availableMoves, setAvailableMoves] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState("");
  const [rightClickedSquares, setRightClickedSquares] = useState([]);
  const [promotionMoves, setPromotionMoves] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [gameWinner, setGameWinner] = useState("b");

  const lastMove = useRef(null);

  const router = useRouter();

  const sendMoveToServer = async (move) => {
    try {
      const response = await fetch(`/api/games/${initialGame.id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ move, playerId: currentPlayer.id }),
      });

      if (!response.ok) {
        const error = await response.text();
        toast.error(`Move failed: ${error}`);
        return;
      }
      toast.success("move success");
    } catch (error) {
      console.error("Failed to send move:", error);
      toast.error("Network error. Please try again.");
    }
  };

  useEffect(() => {
    if (!whitePlayer.id || !blackPlayer.id) return;

    toast.info(`You are ${currentPlayer.color === "w" ? "White" : "Black"}`);
  }, [currentPlayer, whitePlayer, blackPlayer]);

  useEffect(() => {
    const isCheckmate = game.isCheckmate();
    const isDraw = game.isDraw();

    if (isCheckmate || isDraw) {
      if (isDraw) {
        setGameOverMessage("Draw!");
      } else if (isCheckmate) {
        setGameWinner(game.turn() === "w" ? "b" : "w");
        setGameOverMessage("Checkmate!");
      }
      setIsGameOver(true);
    }
  }, [game]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`game-${initialGame.id}`);

    channel.bind("move", (data) => {
      const { move, fen } = data;

      // Ignore the move if it's the same as the last move made by the current player
      if (lastMove.current?.san === move.san) return;

      game.move(move);
      setGame(new Chess(fen));
      handleGameStatusUpdate();
    });

    return () => {
      pusherClient.unsubscribe(`game-${initialGame.id}`);
    };
  }, [initialGame.id, game]);

  function onSquareClick(square) {
    if (gameStatus.gameOver) return;

    if (game.turn() !== currentPlayer.color) {
      toast.error("It's not your turn!");
      return;
    }

    // Toggle and highlight possible moves. quit and return the function if setting toggle state to true
    if (highlightAvailableMoves(square)) {
      return;
    }

    const nextMoves = game
      .moves({ selectedSquare, verbose: true })
      .filter((move) => move.from == selectedSquare && move.to == square);

    // Check for promotion
    if (nextMoves.some((move) => move.promotion)) {
      setPromotionMoves(nextMoves);
      handleGameStatusUpdate();
      return;
    }

    movePiece(nextMoves[0]);
  }

  function movePiece(move) {
    if (!move) return;

    game.move(move);
    setAvailableMoves([]);
    setSelectedSquare("");
    // Save the last move made by the current player
    lastMove.current = move;
    sendMoveToServer(move);
  }

  function onPromotionPieceSelect(piece) {
    const promoteTo = piece[1].toLowerCase() ?? "q";
    const nextMove = promotionMoves.find((move) => move.promotion == promoteTo);

    movePiece(nextMove);
    setPromotionMoves([]);
  }

  function onSquareRightClick(square) {
    setRightClickedSquares((rcs) => {
      const newrcs = rcs.filter((s) => s != square);
      if (newrcs.length == rcs.length) newrcs.push(square);
      return newrcs;
    });
  }

  function highlightAvailableMoves(square) {
    setRightClickedSquares([]);

    const isPieceHighlightable =
      game.get(square)?.color == game.turn() && square != selectedSquare;

    setSelectedSquare(isPieceHighlightable ? square : "");
    setAvailableMoves(
      isPieceHighlightable ? game.moves({ square, verbose: true }) : []
    );

    return isPieceHighlightable;
  }

  function handleGameStatusUpdate() {
    const isCheckmate = game.isCheckmate();
    const isInCheck = game.inCheck();
    const hasLegalMoves = game.moves().length > 0;

    let status = {
      gameOver: isCheckmate || !hasLegalMoves,
      history: game.history({ verbose: true }),
      gameState: isCheckmate
        ? "checkmate"
        : isInCheck
        ? "in check"
        : game.isStalemate()
        ? "stalemate"
        : game.isInsufficientMaterial()
        ? "insufficient material"
        : game.isThreefoldRepetition()
        ? "threefold repetition"
        : game.isDraw()
        ? "50-move rule"
        : promotionMoves.length > 0
        ? `promote`
        : "normal",
    };

    switch (status.gameState) {
      case "checkmate":
        status.message = `${
          game.turn() === "w" ? "Black" : "White"
        } wins by Checkmate`;
        status.winner = game.turn() === "w" ? "b" : "w";
        break;
      case "in check":
        status.message = `${
          game.turn() === "w" ? "White" : "Black"
        } is in check.`;
        break;
      case "stalemate":
        status.message = "The game is a draw by stalemate.";
        break;
      default:
        status.message = `${game.turn() === "w" ? "White" : "Black"}'s move.`;
        break;
    }

    // Set the game status and notify the parent component if needed
    setGameStatus(status);
    onStatusChange?.(status);
  }

  const gameBoard = game.board().flat();
  const currentPlayerKing = gameBoard.find(
    (square) => square?.type == "k" && square?.color == game.turn()
  );
  return (
    <>
      {isGameOver && (
        <div className="z-[9999] fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white">
          <div className="max-w-md w-[90%] p-8 bg-gray-800 rounded-lg shadow-lg text-center space-y-4">
            <h2 className="text-3xl font-bold">Game Over!</h2>
            <p className="text-lg">
              {gameWinner === "w" ? whitePlayer.username : blackPlayer.username}{" "}
              wins by {gameStatus.gameState}
            </p>
            <p>{gameOverMessage}</p>
            <button
              className="mt-4 px-6 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded-md"
              onClick={() => {
                router.push("/games");
              }}
            >
              Back to Games
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto">
        <Chessboard
          id="chessboard"
          position={game.fen()}
          arePiecesDraggable={false}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          getPositionObject={handleGameStatusUpdate}
          boardOrientation={currentPlayer.color == "w" ? "white" : "black"}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
          customSquareStyles={{
            ...mergeStyles(
              gameBoard
                .filter((square) => square && square.color != game.turn())
                .map((square) => square.square),
              grayedOutStyles
            ),
            [currentPlayerKing.square]:
              gameStatus.gameState == "checkmate" ||
              gameStatus.gameState == "in check"
                ? checkStyles
                : gameStatus.gameState == "stalemate"
                ? staleStyles
                : {},
            ...mergeStyles(
              [
                gameStatus.history?.at(-1)?.from,
                gameStatus.history?.at(-1)?.to,
              ],
              historyStyles
            ),
            ...mergeStyles([...rightClickedSquares.values()], markedStyles),
            [selectedSquare]: selectedStyles,
            ...mergeStyles(
              availableMoves.map((move) => move.to),
              highlightedStyles
            ),
            ...mergeStyles(
              availableMoves
                .filter((move) => move.captured)
                .map((move) => move.to),
              highlightedCapturedStyles
            ),
            ...mergeStyles(
              gameStatus.gameOver
                ? gameBoard.map((square) => square?.square)
                : [],
              grayedOutStyles
            ),
          }}
          onPromotionPieceSelect={onPromotionPieceSelect}
          promotionToSquare="d5"
          promotionDialogVariant="modal"
          showPromotionDialog={promotionMoves.length > 0}
        />
      </div>
    </>
  );
};

export default Chessgame;
