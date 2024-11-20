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
import { useRouter } from "next/navigation";
import Chat from "./Chat";
import { pusherClient } from "@/lib/pusher";

export default function GamePage({
  whitePlayer,
  blackPlayer,
  currentPlayer,
  initialGame,
}) {
  const [status, setStatus] = useState({});
  const [boardWidth, setBoardWidth] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate optimal board size based on viewport
  useEffect(() => {
    const calculateBoardSize = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const maxHeight = vh - 160;
      const maxWidth = vw > 768 ? vw - 400 : vw - 32;
      const optimalSize = Math.min(maxHeight, maxWidth);
      setBoardWidth(optimalSize);
    };

    calculateBoardSize();
    window.addEventListener("resize", calculateBoardSize);
    return () => window.removeEventListener("resize", calculateBoardSize);
  }, []);

  // Handle message notifications
  useEffect(() => {
    const channel = pusherClient.subscribe(`game-${initialGame.id}`);

    channel.bind("message", (newMessage) => {
      if (!isDrawerOpen && newMessage.senderId !== currentPlayer.id) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      channel.unbind("message");
      pusherClient.unsubscribe(`game-${initialGame.id}`);
    };
  }, [initialGame.id, currentPlayer.id, isDrawerOpen]);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    setUnreadCount(0);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

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
            <Drawer
              open={isDrawerOpen}
              onOpenChange={(open) => {
                if (open) {
                  handleDrawerOpen();
                } else {
                  handleDrawerClose();
                }
              }}
            >
              <DrawerTrigger className="relative">
                <MessagesSquare className="h-7 w-7" />
                {unreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </div>
                )}
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
          {/* Chat */}
          <div className="hidden md:block">
            <Chat initialGame={initialGame} currentPlayer={currentPlayer} />
          </div>
          <div className="bg-destructive text-destructive-foreground px-2 py-1 rounded">
            if the gane or chat looks out of place then refresh the page
          </div>
        </div>
      </section>
    </section>
  );
}
