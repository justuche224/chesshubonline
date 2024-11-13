import { Chess, Move } from "chess.js";
import { AIType } from "@prisma/client";

// Piece-Square Tables for positional evaluation
const pawnTable = [
  0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30,
  20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10,
  0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0,
];

const knightTable = [
  -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30,
  0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20,
  15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
];

const bishopTable = [
  -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5,
  10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0,
  -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10,
  -10, -10, -10, -10, -10, -20,
];

const rookTable = [
  0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0,
  -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0,
  -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
];

const queenTable = [
  -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5,
  5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5,
  5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10,
  -20,
];

const kingMiddleGameTable = [
  -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40,
  -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40,
  -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20,
  -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20,
];

export const computerMove = async ({ difficulty, fen }) => {
  const chess = new Chess(fen);

  if (difficulty === AIType.BasicAI) {
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * moves.length);
    const randomMove = moves[randomIndex];
    chess.move(randomMove);
    // console.log("AI's move:", randomMove);
    return randomMove;
  }

  if (difficulty === AIType.SmartAI) {
    const moves = chess.moves({ verbose: true });
    const captureMoves = moves.filter((move) => move.captured);

    if (captureMoves.length > 0) {
      const randomCapture =
        captureMoves[Math.floor(Math.random() * captureMoves.length)];
      chess.move(randomCapture);
      console.log("AI captures:", randomCapture);
      return randomCapture;
    }

    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    chess.move(randomMove);
    // console.log("AI's move:", randomMove);
    return randomMove;
  }

  if (difficulty === AIType.SmarterAI) {
    // Evaluate board based on material count
    const evaluateBoard = () => {
      const piecesValue = {
        p: 1, // Pawn
        n: 3, // Knight
        b: 3, // Bishop
        r: 5, // Rook
        q: 9, // Queen
        k: 1000, // King (checkmate should be prioritized)
      };

      let evaluation = 0;
      // Traverse the board and calculate value
      const board = chess.board();
      board.forEach((row) => {
        row.forEach((piece) => {
          if (piece) {
            const value = piecesValue[piece.type] || 0;
            evaluation += piece.color === "w" ? value : -value;
          }
        });
      });
      return evaluation;
    };

    // AI selects move based on evaluation
    const moves = chess.moves({ verbose: true });
    let bestMove = null;
    let bestEvaluation = -Infinity;

    moves.forEach((move) => {
      chess.move(move);
      const boardEvaluation = evaluateBoard();
      chess.undo(); // Revert the move

      if (boardEvaluation > bestEvaluation) {
        bestEvaluation = boardEvaluation;
        bestMove = move;
      }
    });

    if (bestMove) {
      chess.move(bestMove);
      // console.log("AI's smart move:", bestMove);
      return bestMove;
    }
  }

  if (difficulty === AIType.SmartestAI) {
    const getPositionValue = (piece, square, isEndgame) => {
      if (!piece) return 0;

      const x = Math.floor(square / 8);
      const y = square % 8;
      const index = piece.color === "w" ? square : 63 - square;

      let positionalValue = 0;
      switch (piece.type) {
        case "p":
          positionalValue = pawnTable[index];
          break;
        case "n":
          positionalValue = knightTable[index];
          break;
        case "b":
          positionalValue = bishopTable[index];
          break;
        case "r":
          positionalValue = rookTable[index];
          break;
        case "q":
          positionalValue = queenTable[index];
          break;
        case "k":
          positionalValue = kingMiddleGameTable[index];
          break;
      }

      return positionalValue * (piece.color === "w" ? 1 : -1);
    };

    const evaluatePosition = (chess) => {
      const piecesValue = {
        p: 100, // Pawn
        n: 320, // Knight
        b: 330, // Bishop
        r: 500, // Rook
        q: 900, // Queen
        k: 20000, // King
      };

      let evaluation = 0;
      let square = 0;
      const board = chess.board();
      const isEndgame = isEndGamePhase(board);

      // Material and position evaluation
      board.forEach((row, x) => {
        row.forEach((piece, y) => {
          if (piece) {
            const materialValue = piecesValue[piece.type] || 0;
            evaluation += (piece.color === "w" ? 1 : -1) * materialValue;
            evaluation += getPositionValue(piece, square, isEndgame);
          }
          square++;
        });
      });

      // Mobility evaluation
      const mobilityScore = chess.moves().length * 10;
      evaluation += chess.turn() === "w" ? mobilityScore : -mobilityScore;

      // Check bonus
      if (chess.inCheck()) {
        evaluation += chess.turn() === "w" ? -50 : 50;
      }

      // Checkmate detection
      if (chess.isCheckmate()) {
        return chess.turn() === "w" ? -100000 : 100000;
      }

      // Stalemate penalty
      if (chess.isStalemate()) {
        return 0;
      }

      return evaluation;
    };

    const isEndGamePhase = (board) => {
      let queens = 0;
      let minors = 0;

      board.forEach((row) => {
        row.forEach((piece) => {
          if (!piece) return;
          if (piece.type === "q") queens++;
          if (piece.type === "n" || piece.type === "b") minors++;
        });
      });

      return queens === 0 || (queens === 2 && minors <= 2);
    };

    const minimax = (
      chess,
      depth,
      alpha,
      beta,
      isMaximizing,
      originalDepth
    ) => {
      if (depth === 0) {
        return { evaluation: evaluatePosition(chess), move: null };
      }

      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) {
        if (chess.isCheckmate()) {
          return { evaluation: isMaximizing ? -100000 : 100000, move: null };
        }
        return { evaluation: 0, move: null }; // Stalemate
      }

      let bestMove = null;
      let bestEval = isMaximizing ? -Infinity : Infinity;

      // Move ordering - evaluate captures first
      moves.sort((a, b) => {
        const aCapture = a.captured ? 1 : 0;
        const bCapture = b.captured ? 1 : 0;
        return bCapture - aCapture;
      });

      for (const move of moves) {
        chess.move(move);
        const evaluation = minimax(
          chess,
          depth - 1,
          alpha,
          beta,
          !isMaximizing,
          originalDepth
        ).evaluation;
        chess.undo();

        if (isMaximizing) {
          if (evaluation > bestEval) {
            bestEval = evaluation;
            bestMove = move;
          }
          alpha = Math.max(alpha, evaluation);
        } else {
          if (evaluation < bestEval) {
            bestEval = evaluation;
            bestMove = move;
          }
          beta = Math.min(beta, evaluation);
        }

        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }

      return { evaluation: bestEval, move: bestMove };
    };

    // Calculate appropriate search depth based on game phase
    const calculateSearchDepth = (chess) => {
      const moves = chess.moves().length;
      const board = chess.board();
      const isEndGame = isEndGamePhase(board);

      if (isEndGame) {
        return moves < 20 ? 5 : 4; // Deeper search in endgame with fewer moves
      }
      return moves < 30 ? 4 : 3; // Adjust depth based on number of possible moves
    };

    const depth = calculateSearchDepth(chess);
    const result = minimax(chess, depth, -Infinity, Infinity, true, depth);

    if (result.move) {
      chess.move(result.move);
      return result.move;
    }
  }

  return null;
};
