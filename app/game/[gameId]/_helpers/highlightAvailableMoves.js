export function highlightAvailableMoves(square) {
  setRightClickedSquares([]);

  const isPieceHighlightable =
    game.get(square)?.color == game.turn() && square != selectedSquare;

  setSelectedSquare(isPieceHighlightable ? square : "");
  setAvailableMoves(
    isPieceHighlightable ? game.moves({ square, verbose: true }) : []
  );

  return isPieceHighlightable;
}
