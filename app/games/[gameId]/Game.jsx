"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import Chessgame from "./Chessgame";
// import { useRouter } from "next/navigation";

const GamePage = ({ whitePlayer, blackPlayer, currentPlayer, initialGame }) => {
  const [status, setStatus] = useState({});
  const [boardWidth, setBoardWidth] = useState(0);

  // const router = useRouter();

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
    <div className="h-[100svh]">
      <div className="container mx-auto px-4 text-white flex flex-col md:flex-row md:items-center md:gap-4 h-[calc(100vh-4rem)]">
        {/* Left sidebar */}
        <div className=" flex flex-row md:flex-col justify-between gap-5 mb-2 md:mb-0">
          <PlayerInfo
            player={currentPlayer === whitePlayer ? blackPlayer : whitePlayer}
            currentPlayer={currentPlayer}
          />
          <div className="text-center md:text-left text-sm">
            <p className="font-semibold">Game Status:</p>
            <p className="opacity-90">{status.message}</p>
          </div>
          <PlayerInfo
            player={currentPlayer === whitePlayer ? whitePlayer : blackPlayer}
            currentPlayer={currentPlayer}
          />
        </div>
        {/* Chess board */}
        <div className="flex-1 flex justify-center items-center">
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
        {/* Chat and moves */}
        <div className="">
          <div>moves</div>
          <div>chats</div>
        </div>
      </div>
    </div>
  );
};

const PlayerInfo = ({ player, currentPlayer }) => {
  const [rand] = useState(() => Math.random());

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg shadow-md",
        currentPlayer.color === player.color
          ? "ring-1 ring-green-500/50 bg-green-500/20"
          : "ring-1 ring-red-500/50 bg-red-500/20"
      )}
    >
      {player.image ? (
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image
            width={32}
            height={32}
            src={player.image}
            alt={player.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `hsl(${rand * 360}, 50%, 40%)` }}
        >
          <User className="w-6 h-6" />
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm">
          @{player.username || `user${player.id}`}
        </span>
        <span className="text-xs opacity-70">
          {player.color === "w" ? "White" : "Black"}
        </span>
      </div>
    </div>
  );
};

// const ActionButton = ({ icon, text }) => (
//   <button className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
//     {icon}
//     <span className="text-xs">{text}</span>
//   </button>
// );

export default GamePage;
