import { CircleArrowLeft, MessagesSquare } from "lucide-react";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
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

export default function Games() {
  const player1Moves = [
    "e4",
    "Nf3",
    "Bb5",
    "Ba4",
    "O-O",
    "Re1",
    "Bb3",
    "c3",
    "h3",
    "d4",
    "Nbd2",
    "Bc2",
    "a4",
    "b4",
    "d5",
    "Nf1",
  ];

  const player2Moves = [
    "e4",
    "Nf3",
    "Bb5",
    "Ba4",
    "O-O",
    "Re1",
    "Bb3",
    "c3",
    "h3",
    "d4",
    "Nbd2",
    "Bc2",
    "a4",
    "b4",
    "d5",
    "Nf1",
  ];

  return (
    <section className="w-full px-2">
      <div className="w-full mt-2 flex justify-between">
        <div className="">
          <CircleArrowLeft className="h-7 w-7" />
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
      <Separator className="my-3" />
      <section className="flex flex-col lg:flex-row">
        {/* Game info and board coloumn */}
        <div className="w-full lg:w-3/5 px-4">
          {/* Names and status */}
          <div className="flex justify-between mt-3">
            <div
              id="player1"
              className="flex flex-col justify-center items-center"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500"></div>
              <div className="">John Doe</div>
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
              <div className="">Jane Doe</div>
            </div>
          </div>
          {/* Game board */}
          <div className="mt-3">
            <Image
              src="/43v9ub2h.bmp"
              alt="Photo by Drew Beamer"
              width={300}
              height={300}
              className="h-auto w-5/6 rounded-md object-cover mx-auto"
            />
          </div>
        </div>
        {/* Moves and chats coloumn */}
        <div className="w-full lg:w-2/5 mt-3 flex flex-col space-y-3 px-3">
          {/* Moves */}
          <div>
            {/* Player 1 Moves */}
            <div>
              <h2>Johns Moves</h2>
              <div className="w-full whitespace-nowrap rounded-md border overflow-scroll">
                <div className="p-2 flex w-max space-x-4">
                  {player1Moves.map((move, index) => (
                    <>
                      <div key={index} className="text-sm">
                        &quot;{move}&quot;
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
            {/* Player 2 moves */}
            <div>
              <h2>Janes Moves</h2>
              <div className="w-full whitespace-nowrap rounded-md border overflow-scroll">
                <div className="p-2 flex w-max space-x-4">
                  {player2Moves.map((move, index) => (
                    <>
                      <div key={index} className="text-sm">
                        &quot;{move}&quot;
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
