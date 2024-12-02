"use client";

import { useEffect, useState } from "react";
// import MovesDisplay from "./MovesDisplay";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Chessgame from "./Chessgame";
import { UserWithColor } from "@/types";
import { AIType, GameWithAi } from "@prisma/client";

type GamePageProps = {
  player: UserWithColor;
  aiType: AIType;
  currentPlayer: UserWithColor;
  initialGame: GameWithAi;
};

export default function GamePage({
  player,
  aiType,
  currentPlayer,
  initialGame,
}: GamePageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, setStatus] = useState("");
  const [boardWidth, setBoardWidth] = useState(0);

  // Calculate optimal board size based on viewport
  useEffect(() => {
    const calculateBoardSize = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      // Calculate maximum available height (accounting for padding and other elements)
      const maxHeight = vh - 160; // Reserve space for headers and captured pieces
      // Calculate maximum available width (accounting for sidebars on larger screens)
      const maxWidth = vw > 768 ? vw - 400 : vw - 32; // Adjust for MD breakpoint

      // Use the smaller of the two dimensions to ensure board fits
      const optimalSize = Math.min(maxHeight, maxWidth);
      setBoardWidth(optimalSize);
    };

    calculateBoardSize();
    window.addEventListener("resize", calculateBoardSize);
    return () => window.removeEventListener("resize", calculateBoardSize);
  }, []);

  return (
    <section className="w-full px-2">
      <div className="">
        <div className="bg-destructive text-destructive-foreground text-sm px-2 py-1 rounded">
          if the game or chat looks out of place or frozen please refresh the
          page
        </div>
        <Separator className="my-2" />
      </div>
      <div className="w-full px-4">
        <div className="mt-3 grid place-content-center">
          <div className="flex justify-between mt-1">
            <div
              id="player"
              className="flex flex-col justify-center items-center"
            >
              <div
                className="w-10 h-10 rounded-full"
                style={{
                  backgroundImage: `url(${
                    player?.image ?? "/images/user-placeholder.png"
                  })`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              ></div>
              <div className="">{player.username}</div>
            </div>
            <div
              id="status"
              className="text-center flex justify-center items-center"
            >
              {status.message}
            </div>
            <div
              id="player2"
              className="flex flex-col justify-center items-center"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 border-2 border-green-500"></div>
              <div className="">{aiType}</div>
            </div>
          </div>
          <div style={{ width: boardWidth, maxWidth: "100%" }}>
            <Chessgame
              onStatusChange={setStatus}
              player={player}
              aiType={aiType}
              initialGame={initialGame}
              currentPlayer={currentPlayer}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
