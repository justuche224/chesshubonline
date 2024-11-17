"use client";

import { useEffect, useState } from "react";
import { CircleArrowLeft, MessagesSquare } from "lucide-react";
// import MovesDisplay from "./MovesDisplay";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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

  // const player1Moves = [
  //   "e4",
  //   "Nf3",
  //   "Bb5",
  //   "Ba4",
  //   "O-O",
  //   "Re1",
  //   "Bb3",
  //   "c3",
  //   "h3",
  //   "d4",
  //   "Nbd2",
  //   "Bc2",
  //   "a4",
  //   "b4",
  //   "d5",
  //   "Nf1",
  // ];

  // const player2Moves = [
  //   "e4",
  //   "Nf3",
  //   "Bb5",
  //   "Ba4",
  //   "O-O",
  //   "Re1",
  //   "Bb3",
  //   "c3",
  //   "h3",
  //   "d4",
  //   "Nbd2",
  //   "Bc2",
  //   "a4",
  //   "b4",
  //   "d5",
  //   "Nf1",
  // ];

  const router = useRouter();

  return (
    <section className="w-full px-2">
      <div className="md:hidden">
        <div className="w-full mt-2 flex justify-between">
          <div className="">
            <CircleArrowLeft
              className="h-7 w-7"
              onClick={() => router.back()}
            />
          </div>
          <div className="md:hidden">
            <Drawer>
              <DrawerTrigger>
                <MessagesSquare className="h-7 w-7" />
              </DrawerTrigger>
              <DrawerContent className="md:hidden">
                <DrawerHeader>
                  <DrawerTitle>Game Chat</DrawerTitle>
                  <DrawerDescription>
                    Lets be civil and respectful.
                  </DrawerDescription>
                  <div className="w-full rounded-md border h-[300px] bg-muted text-center">
                    <h1>All the chat will show up here</h1>
                  </div>
                </DrawerHeader>
                <DrawerFooter>
                  {/* <Button>Submit</Button> */}
                  <DrawerClose>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <Separator className="my-2" />
      </div>
      <section className="flex flex-col lg:flex-row lg:w-[55%]">
        {/* Game info and board coloumn */}
        <div className="w-full lg:w-[55%] px-4">
          {/* Names and status */}
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
              Jane is playing
            </div>
            <div
              id="player2"
              className="flex flex-col justify-center items-center"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 border-2 border-green-500"></div>
              <div className="">{aiType}</div>
            </div>
          </div>
          {/* Game board */}
          <div className="mt-3">
            {/* <Image
              src="/43v9ub2h.bmp"
              alt="Photo by Drew Beamer"
              width={300}
              height={300}
              className="h-auto w-5/6 rounded-md object-cover mx-auto"
            /> */}
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
        {/* Moves and chats coloumn */}
        <div className="w-full lg:w-[45%] mt-3 flex flex-col space-y-3 px-3">
          {/* Moves */}
          {/* <MovesDisplay
            player1Moves={player1Moves}
            player2Moves={player2Moves}
            player1Name={player.username}
            player2Name={aiType}
          /> */}
          {/* Chat */}
          <div className="hidden md:block">
            <div className="w-full rounded-md border h-[300px] bg-muted text-center">
              <h1>All the chat will show up here</h1>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
