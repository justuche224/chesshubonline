"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Hand, Flag, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Chessgame from "./Chessgame";
import { UserWithColor } from "@/types";
import { AIType, GameWithAi } from "@prisma/client";

type GamePageProps = {
  player: UserWithColor;
  aiType: AIType;
  currentPlayer: UserWithColor;
  initialGame: GameWithAi;
};

const GamePage = ({
  player,
  aiType,
  currentPlayer,
  initialGame,
}: GamePageProps) => {
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
    <div className="h-[100svh]">
      <div className="container mx-auto px-4 text-white flex flex-col md:flex-row md:items-center md:gap-4 h-[calc(100vh-4rem)]">
        {/* Left sidebar */}
        <div className="md:w-36 lg:w-44 flex flex-row md:flex-col justify-between gap-2 mb-2 md:mb-0">
          <PlayerInfo player={player} currentPlayer={currentPlayer} />
          <div className="text-center md:text-left text-sm">
            {/* <p className="font-semibold">Game Status:</p> */}
            {/*  <p className="opacity-90">{status}</p>*/}
            {/* above code is breaking the game*/}
          </div>
        </div>

        {/* Chess board container */}
        <div className="flex-1 flex justify-center items-center">
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
    </div>
  );
};

type PlayerInfoProps = {
  player: UserWithColor;
  currentPlayer: UserWithColor;
};

const PlayerInfo = ({ player, currentPlayer }: PlayerInfoProps) => {
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
            alt={player.username || `user${player.id}`}
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

export default GamePage;
