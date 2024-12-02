import React from "react";

const MovesDisplay = ({
  player1Moves,
  player2Moves,
  player1Name,
  player2Name,
}) => {
  // const groupMovesByPairs = (moves) => {
  //   return moves.reduce((acc, move, index) => {
  //     if (index % 2 === 0) {
  //       acc.push([move]);
  //     } else {
  //       acc[acc.length - 1].push(move);
  //     }
  //     return acc;
  //   }, []);
  // };

  return (
    <div className="w-full space-y-4">
      {/* Player 1 Moves */}
      <div>
        <h2 className="font-medium mb-2">{player1Name}&apos;s Moves</h2>
        <div className="w-full rounded-md border p-2 bg-background">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {player1Moves.map((move, index) => (
              <div
                key={index}
                className="text-sm px-2 py-1 bg-muted rounded flex items-center justify-center"
              >
                <span className="text-muted-foreground mr-1">{index + 1}.</span>
                {move}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Player 2 Moves */}
      <div>
        <h2 className="font-medium mb-2">{player2Name}&apos;s Moves</h2>
        <div className="w-full rounded-md border p-2 bg-background">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {player2Moves.map((move, index) => (
              <div
                key={index}
                className="text-sm px-2 py-1 bg-muted rounded flex items-center justify-center"
              >
                <span className="text-muted-foreground mr-1">{index + 1}.</span>
                {move}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovesDisplay;
