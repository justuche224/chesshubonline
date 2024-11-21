"use client";

import React, { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

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
import { pusherClient } from "@/lib/pusher";
import { useRouter } from "next/navigation";

// white, black and current player should be an object with properties: id, username and color
const AiChessGame = ({
  onStatusChange,
  initialGame,
  player,
  currentPlayer,
  aiType,
}) => {
  const [game, setGame] = useState(new Chess(initialGame.fen));
  const [gameStatus, setGameStatus] = useState({
    gameOver: initialGame.gameOver,
  });
  const [availableMoves, setAvailableMoves] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState("");
  const [rightClickedSquares, setRightClickedSquares] = useState([]);
  const [promotionMoves, setPromotionMoves] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isMoveInProgress, setIsMoveInProgress] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [gameWinner, setGameWinner] = useState("b");
  const router = useRouter();

  const lastMove = useRef(null);

  useEffect(() => {
    if (game.isGameOver()) {
      checkGameStatus(game);
    }
  }, [game]);

  useEffect(() => {
    if (!player.id) return;

    toast.info(`You are ${currentPlayer.color === "w" ? "White" : "Black"}`);
  }, [currentPlayer.color, player]);

  useEffect(() => {
    if (
      game.turn() !== player.color &&
      !initialGame.gameOver &&
      !isMoveInProgress
    ) {
      makeAIMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.turn(), isMoveInProgress]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`game-${initialGame.id}`);

    channel.bind("ai-move", (data) => {
      const { move, fen } = data;

      // Ignore the move if it's the same as the last move made by the current player
      if (lastMove.current?.san === move.san) return;

      game.move(move);
      setGame(new Chess(fen));
      checkGameStatus(game);
      handleGameStatusUpdate();
    });

    return () => {
      pusherClient.unsubscribe(`game-${initialGame.id}`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialGame.id, game]);

  const makeAIMove = async () => {
    if (gameStatus.gameOver) return;
    setIsAIThinking(true);

    try {
      const response = await fetch(`/api/games/ai/${initialGame.id}/move/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiType }),
      });

      if (!response.ok) {
        const error = await response.text();
        toast.error(`AI Move failed: ${error}`);
        return;
      }
      toast.success("ai move success");
    } catch (error) {
      console.error("AI move error:", error);
      toast.error("AI failed to make a move");
    } finally {
      setIsAIThinking(false);
    }
  };

  const sendMoveToServer = async (move) => {
    setIsMoveInProgress(true); // Start move-in-progress tracking
    try {
      const response = await fetch(`/api/games/ai/${initialGame.id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ move, playerId: currentPlayer.id }),
      });

      if (!response.ok) {
        const error = await response.text();
        toast.error(`Move failed: ${error}`);
        return;
      }
      toast.success("Move success");
    } catch (error) {
      console.error("Failed to send move:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsMoveInProgress(false); // Reset move-in-progress tracking
    }
  };

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
    checkGameStatus(game);
    handleGameStatusUpdate();
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

  const checkGameStatus = (currentGame) => {
    const isCheckmate = currentGame.isCheckmate();
    const isDraw = currentGame.isDraw();
    const isStalemate = currentGame.isStalemate();
    const isInsufficientMaterial = currentGame.isInsufficientMaterial();
    const isThreefoldRepetition = currentGame.isThreefoldRepetition();

    if (isCheckmate) {
      // The winner is the opposite of the current turn
      // (since checkmate means the current player has lost)
      const winner = currentGame.turn() === "w" ? "b" : "w";
      setGameWinner(winner);
      setGameOverMessage("Checkmate!");
      setIsGameOver(true);
    } else if (isDraw) {
      // More detailed draw messages
      let drawReason = "Draw!";
      if (isStalemate) {
        drawReason = "Draw by Stalemate!";
      } else if (isInsufficientMaterial) {
        drawReason = "Draw by Insufficient Material!";
      } else if (isThreefoldRepetition) {
        drawReason = "Draw by Threefold Repetition!";
      }

      setGameOverMessage(drawReason);
      setIsGameOver(true);
    }
  };

  function handleGameStatusUpdate() {
    const gameToCheck = game;
    const isCheckmate = gameToCheck.isCheckmate();
    const isInCheck = gameToCheck.inCheck();
    const hasLegalMoves = gameToCheck.moves().length > 0;

    const status = {
      gameOver: isCheckmate || !hasLegalMoves,
      history: gameToCheck.history({ verbose: true }),
      gameState: isCheckmate
        ? "checkmate"
        : isInCheck
        ? "in check"
        : gameToCheck.isStalemate()
        ? "stalemate"
        : gameToCheck.isInsufficientMaterial()
        ? "insufficient material"
        : gameToCheck.isThreefoldRepetition()
        ? "threefold repetition"
        : gameToCheck.isDraw()
        ? "50-move rule"
        : promotionMoves.length > 0
        ? "promote"
        : "normal",
    };

    switch (status.gameState) {
      case "checkmate":
        status.message = `${
          gameToCheck.turn() === "w" ? "Black" : "White"
        } wins by Checkmate`;
        status.winner = gameToCheck.turn() === "w" ? "b" : "w";
        break;
      case "in check":
        status.message = `${
          gameToCheck.turn() === "w" ? "White" : "Black"
        } is in check.`;
        break;
      case "stalemate":
        status.message = "The game is a draw by stalemate.";
        break;
      case "insufficient material":
        status.message = "The game is a draw due to insufficient material.";
        break;
      case "threefold repetition":
        status.message = "The game is a draw by threefold repetition.";
        break;
      case "50-move rule":
        status.message = "The game is a draw by the 50-move rule.";
        break;
      default:
        status.message = `${
          gameToCheck.turn() === "w" ? "White" : "Black"
        }'s move.`;
        break;
    }

    setGameStatus(status);
    onStatusChange?.(status);
    return status;
  }

  const gameBoard = game.board().flat();
  const currentPlayerKing = gameBoard.find(
    (square) => square?.type == "k" && square?.color == game.turn()
  );
  return (
    <>
      {isGameOver && (
        <div className="z-[9999] fixed top-0 left-0 w-screen h-[100svh] bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <div className="bg-sidebar w-full max-w-md p-4 rounded-md grid place-content-center h-[200px] text-center">
            <h2> Game Over!</h2>
            <p>{gameWinner == player.color ? player.username : aiType} wins</p>
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

export default AiChessGame;
