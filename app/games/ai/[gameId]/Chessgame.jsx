"use client";

import React, { useState, useEffect, useRef } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import pieces from "./pieces";

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
import { AIType, GameWithAi } from "@prisma/client";
import { UserWithColor } from "@/types";
import { pusherClient } from "@/lib/pusher";

// white, black and current player should be an object with properties: id, username and color
const ChessGame = ({
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
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isMoveInProgress, setIsMoveInProgress] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [gameWinner, setGameWinner] = useState("b");

  const lastMove = useRef(null);

  useEffect(() => {
    console.log(game.isGameOver());

    if (game.isGameOver()) {
      if (game.isDraw()) {
        setGameOverMessage("Draw!");
      }

      if (game.isCheckmate()) {
        setGameWinner(game.turn() === "w" ? "b" : "w");
        setGameOverMessage("Checkmate!");
      }
      setIsGameOver(true);
    }
  }, [game]);

  useEffect(() => {
    if (!player.id) return;

    toast.info(`You are ${currentPlayer.color === "w" ? "White" : "Black"}`);
  }, [player]);

  useEffect(() => {
    if (
      game.turn() !== player.color &&
      !initialGame.gameOver &&
      !isMoveInProgress
    ) {
      makeAIMove();
    }
  }, [game.turn(), isMoveInProgress]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`game-${initialGame.id}`);

    channel.bind("ai-move", (data) => {
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

  function handleGameStatusUpdate() {
    const previousPlayer = game.turn() === "w" ? "Black" : "White";
    const currentPlayer = game.turn() === "w" ? "White" : "Black";

    let status = {
      gameOver: false,
      history: game.history({ verbose: true }),
      gameState: game.isCheckmate()
        ? "checkmate"
        : game.inCheck()
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
        ? "promote"
        : "normal",
    };

    switch (status.gameState) {
      case "checkmate":
        status.message = `${previousPlayer} wins by Checkmate`;
        status.gameOver = true;
        status.winner = game.turn();
        break;
      case "in check":
        status.message = `${currentPlayer} is in check. ${currentPlayer}'s move`;
        break;
      case "stalemate":
        status.message =
          "The game is a draw by Stalemate. Neither player can make a valid move.";
        status.gameOver = true;
        break;
      case "insufficient material":
        status.message =
          "The game is a draw due to Insufficient Material. Neither side can force a checkmate.";
        status.gameOver = true;
        break;
      case "threefold repetition":
        status.message =
          "The game is a draw by threefold repetition. The same position has occurred three times, leading to an automatic draw.";
        status.gameOver = true;
        break;
      case "50-move rule":
        status.message =
          "The game is a draw by the 50-Move Rule. 50 moves passed without a pawn move or capture.";
        status.gameOver = true;
        break;
      case "promote":
        status.message = `${currentPlayer}'s pawn has reached the last rank! Promote to continue.`;
        break;
      default:
        status.gameOver = false;
        status.message = `${currentPlayer}'s move`;
    }

    // Set game status state whenever we request for the game status
    setGameStatus(status);
    // Call onStatusChange prop function with the status if it exists
    onStatusChange?.(status);
    return status;
  }

  function renderPieceCapturedBy(color) {
    const capturedPieces = game
      .history({ verbose: true })
      ?.filter((move) => move.captured && move.color == color);

    return (
      <div className="captured-container w-full bg-slate-500/70 rounded shadow-lg my-2 mx-auto flex flex-wrap justify-center items-center">
        {capturedPieces.map(
          (move) => pieces[(color == "w" ? "b" : "w") + move.captured]
        )}

        {capturedPieces.length == 0 && (
          <p className="text-sm p-2">
            Captured {color == "w" ? "black" : "white"} pieces will appear here.
          </p>
        )}
      </div>
    );
  }

  const gameBoard = game.board().flat();
  const currentPlayerKing = gameBoard.find(
    (square) => square?.type == "k" && square?.color == game.turn()
  );
  return (
    <>
      {isGameOver && (
        <div className="z-[9999] fixed top-0 left-0 w-screen h-[100svh] bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <h2> Game Over!</h2>
          <p>{gameWinner == player.color ? player.username : aiType} wins</p>
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

export default ChessGame;
