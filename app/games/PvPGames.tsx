"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Game, User } from "@prisma/client";

// Extend Game type to include related players
type GameWithPlayers = Game & {
  whitePlayer: User;
  blackPlayer: User;
};

type GameHomeProps = {
  userGames: GameWithPlayers[];
};

const GameHome = ({ userGames }: GameHomeProps) => {
  return (
    <section className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Games</h1>
        <Button variant="secondary">
          <Link href={"/game/new"}>New Game</Link>
        </Button>
      </div>
      {userGames.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {userGames.map((game) => (
            <div
              key={game.id}
              className="p-4 bg-slate-800 shadow rounded-lg border border-slate-900"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Game ID: {game.id}</h2>
                <span
                  className={`px-2 py-1 text-sm font-medium rounded ${
                    game.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {game.status}
                </span>
              </div>

              <div className="mt-2 text-gray-200">
                <p>
                  <strong>White Player:</strong> {game.whitePlayer.username}
                </p>
                <p>
                  <strong>Black Player:</strong> {game.blackPlayer.username}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {game.createdAt.toLocaleString("en-US")}
                </p>
                <p>
                  <strong>Last Move At:</strong>{" "}
                  {game.updatedAt.toLocaleString("en-US")}
                </p>
              </div>

              <div className="mt-4">
                <Link href={`/game/${game.id}`}>
                  <Button variant="secondary">Go to Game</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          You have no games. Start a new game to get going!
        </p>
      )}
    </section>
  );
};

export default GameHome;
