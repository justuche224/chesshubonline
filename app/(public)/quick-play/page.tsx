"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import GameStorageAlert from "./GameStorageAlert";
import {
  CircuitBoardIcon as ChessBoard,
  PlayCircle,
  Redo,
  Users,
  Cpu,
} from "lucide-react";

// Define types for better type safety
interface GameState {
  currentPlayer: string;
  moveHistory: string[];
}

interface GameDetails {
  currentPlayer: string;
  moves: number;
}

export default function QuickPlay() {
  const [hasExistingPvPGame, setHasExistingPvPGame] = useState(false);
  const [hasExistingAIGame, setHasExistingAIGame] = useState(false);
  const [pvpGameDetails, setPvpGameDetails] = useState<GameDetails | null>(
    null
  );
  const [aiGameDetails, setAiGameDetails] = useState<GameDetails | null>(null);
  const [showStorageAlert, setShowStorageAlert] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkExistingGames = () => {
      // Check PvP game
      const savedPvPState = localStorage.getItem("chess-game-state");
      if (savedPvPState) {
        try {
          const parsedState = JSON.parse(savedPvPState) as GameState;
          if (
            parsedState.currentPlayer &&
            Array.isArray(parsedState.moveHistory)
          ) {
            setHasExistingPvPGame(true);
            setPvpGameDetails({
              currentPlayer: parsedState.currentPlayer,
              moves: Math.floor(parsedState.moveHistory.length / 2) + 1,
            });
          }
        } catch (error) {
          console.error("Error checking saved PvP game:", error);
          localStorage.removeItem("chess-game-state");
        }
      }

      // Check AI game
      const savedAIState = localStorage.getItem("chess-ai-game-state");
      if (savedAIState) {
        try {
          const parsedState = JSON.parse(savedAIState);
          if (parsedState.fen && Array.isArray(parsedState.moveHistory)) {
            setHasExistingAIGame(true);
            setAiGameDetails({
              currentPlayer: "Your",
              moves: Math.floor(parsedState.moveHistory.length / 2) + 1,
            });
          }
        } catch (error) {
          console.error("Error checking saved AI game:", error);
          localStorage.removeItem("chess-ai-game-state");
        }
      }
    };

    checkExistingGames();
  }, []);

  const startNewPvPGame = () => {
    localStorage.removeItem("chess-game-state");
    router.push("/quick-play/pvp");
  };

  const startNewAIGame = () => {
    localStorage.removeItem("chess-ai-game-state");
    router.push("/quick-play/ai");
  };

  const continuePvPGame = () => {
    router.push("/quick-play/pvp");
  };

  const continueAIGame = () => {
    router.push("/quick-play/ai");
  };

  return (
    <>
      {showStorageAlert && (
        <GameStorageAlert onClose={() => setShowStorageAlert(false)} />
      )}
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <ChessBoard className="h-6 w-6" />
                Quick Play
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* PvP Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <h3 className="font-medium">Player vs Player</h3>
                </div>
                {hasExistingPvPGame ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {pvpGameDetails?.currentPlayer}&apos;s turn • Move{" "}
                        {pvpGameDetails?.moves}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={continuePvPGame}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="h-5 w-5" />
                        Continue
                      </Button>
                      <Button
                        onClick={startNewPvPGame}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Redo className="h-5 w-5" />
                        New Game
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={startNewPvPGame}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="h-5 w-5" />
                    Start PvP Game
                  </Button>
                )}
              </div>

              <div className="border-t dark:border-gray-700" />

              {/* AI Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  <h3 className="font-medium">Player vs Computer</h3>
                </div>
                {hasExistingAIGame ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {aiGameDetails?.currentPlayer} turn • Move{" "}
                        {aiGameDetails?.moves}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={continueAIGame}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="h-5 w-5" />
                        Continue
                      </Button>
                      <Button
                        onClick={startNewAIGame}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Redo className="h-5 w-5" />
                        New Game
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={startNewAIGame}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="h-5 w-5" />
                    Start AI Game
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
