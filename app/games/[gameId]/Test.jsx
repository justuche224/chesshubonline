"use client";

import { useEffect, useState } from "react";
import { CircleArrowLeft, MessagesSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Chessgame from "./Chessgame";
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
// import MovesDisplay from "./MovesDisplay";
import { useRouter } from "next/navigation";
import Chat from "./Chat";

export default function GamePage({
  whitePlayer,
  blackPlayer,
  currentPlayer,
  initialGame,
}) {
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
                  <Chat
                    initialGame={initialGame}
                    currentPlayer={currentPlayer}
                  />
                </DrawerHeader>
                <DrawerFooter>
                  {/* <Button>Submit</Button> */}
                  <DrawerClose>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
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
          {/* Moves */}
          {/* <MovesDisplay
            player1Moves={player1Moves}
            player2Moves={player2Moves}
            player1Name={whitePlayer.username}
            player2Name={blackPlayer.username}
          /> */}
          {/* Chat */}
          <div className="hidden md:block">
            <Chat initialGame={initialGame} currentPlayer={currentPlayer} />
          </div>
        </div>
      </section>
    </section>
  );
}
