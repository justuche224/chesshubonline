import { Chess, Move as ChessMoveVerbose } from "chess.js";

interface Move {
  from: string;
  to: string;
  piece: string;
  color: string;
  captured?: string;
  promotion?: string;
}

interface GameHistory {
  history: ChessMoveVerbose[];
  capturedPieces: { [color: string]: string[] }; // E.g., { w: ["p", "n"], b: ["q"] }
}

export function reconstructGameHistory(
  fen: string,
  moves: Move[]
): GameHistory {
  console.log(moves);

  const chess = new Chess(fen);

  const capturedPieces: { [color: string]: string[] } = { w: [], b: [] };

  // Replay all moves from the provided history
  moves.forEach((move) => {
    const result = chess.move(move);
    if (result?.captured) {
      const oppositeColor = result.color === "w" ? "b" : "w";
      capturedPieces[oppositeColor].push(result.captured);
    }
  });

  return {
    history: chess.history({ verbose: true }),
    capturedPieces,
  };
}
