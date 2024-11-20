"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Chessgame from "./Chessgame";
import Chat from "./Chat";

export default function GamePage({
  whitePlayer,
  blackPlayer,
  currentPlayer,
  initialGame,
}) {
  const [status, setStatus] = useState({});
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
      <div className="md:hidden">
        <div className="w-full mt-2 flex justify-between">
          <div className="bg-destructive text-destructive-foreground text-sm px-2 py-1 rounded">
            if the game or chat looks out of place or frozen please refresh the
            page
          </div>
        </div>
        <Separator className="my-3" />
      </div>
      <section className="flex flex-col lg:flex-row w-full">
        {/* Game info and board coloumn */}
        <div className="w-full lg:w-[55%] px-4">
          {/* Names and status */}
          <div className="flex justify-between mt-3">
            <div
              id="player1"
              className="flex flex-col justify-center items-center"
            >
              <div
                className="w-10 h-10 rounded-full "
                style={{
                  backgroundImage: `url(${
                    whitePlayer?.image ?? "/images/user-placeholder.png"
                  })`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              ></div>
              <div className="">{whitePlayer.username}</div>
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
              <div
                className="w-10 h-10 rounded-full"
                style={{
                  backgroundImage: `url(${
                    blackPlayer?.image ?? "/images/user-placeholder.png"
                  })`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              ></div>
              <div className="">{blackPlayer.username}</div>
            </div>
          </div>
          {/* Game board */}
          <div className="mt-3 grid place-content-center">
            <div style={{ width: boardWidth, maxWidth: "100%" }}>
              <Chessgame
                onStatusChange={setStatus}
                whitePlayer={whitePlayer}
                blackPlayer={blackPlayer}
                initialGame={initialGame}
                currentPlayer={currentPlayer}
              />
            </div>
          </div>
        </div>
        {/* Moves and chats coloumn */}
        <div className="w-full lg:w-[45%] mt-3 flex flex-col space-y-3 px-3">
          {/* Chat */}
          <div className="flex justify-center flex-col gap-2">
            <h2 className="text-center">Game Chat</h2>
            <h3 className="text-center">Lets be civil and respectful.</h3>
            <Chat initialGame={initialGame} currentPlayer={currentPlayer} />
          </div>
        </div>
      </section>
    </section>
  );
}
