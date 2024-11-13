"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import { AIType } from "@prisma/client";

type AIOpponent = {
  type: AIType;
  name: string;
  description: string;
  strategy: string;
};

const AI_OPPONENTS: AIOpponent[] = [
  {
    type: AIType.BasicAI,
    name: "Basic AI",
    description: "A fundamental chess engine perfect for beginners",
    strategy:
      "Makes straightforward moves focusing on basic piece values and simple tactics",
  },
  {
    type: AIType.SmartAI,
    name: "Smart AI",
    description: "An intermediate level opponent with enhanced decision making",
    strategy: "Employs positional understanding and basic strategic concepts",
  },
  {
    type: AIType.SmarterAI,
    name: "Smarter AI",
    description: "Advanced AI with sophisticated chess knowledge",
    strategy: "Uses complex tactical combinations and strategic planning",
  },
  {
    type: AIType.SmartestAI,
    name: "Smartest AI",
    description: "The ultimate chess challenger with master-level play",
    strategy:
      "Implements deep positional understanding and long-term strategic planning",
  },
];

type AIOpponentListProps = {
  userId: string;
};

const AIList = ({ userId }: AIOpponentListProps) => {
  const [loading, setLoading] = useState<AIType | null>(null);

  const handleStartMatch = async (aiType: AIType) => {
    setLoading(aiType);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player1Id: userId,
          aiType: aiType,
          gameType: "AI",
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error(error);
        toast.error("Failed to create AI game");
      }

      if (res.ok) {
        toast.success("Game created! Redirecting...");
        const game = await res.json();
        window.location.href = `/games/ai/${game.id}`;
      }
    } catch (error) {
      console.error("Error starting AI match:", error);
      toast.error("Failed to start AI match");
    } finally {
      setLoading(null);
    }
  };

  const getDifficultyColor = (aiType: AIType) => {
    switch (aiType) {
      case AIType.BasicAI:
        return "bg-green-100 text-green-700";
      case AIType.SmartAI:
        return "bg-blue-100 text-blue-700";
      case AIType.SmarterAI:
        return "bg-purple-100 text-purple-700";
      case AIType.SmartestAI:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Choose Your AI Opponent</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-9">
        {AI_OPPONENTS.map((ai) => (
          <Card key={ai.type} className="shadow-md bg-sidebar text-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {ai.name}
                <span
                  className={`text-sm px-2 py-1 rounded ${getDifficultyColor(
                    ai.type
                  )}`}
                >
                  {ai.type}
                </span>
              </CardTitle>
              <CardDescription className="text-gray-100">
                {ai.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-100">
                Strategy: {ai.strategy}
              </p>
              <Button
                className="w-full"
                onClick={() => handleStartMatch(ai.type)}
                disabled={loading === ai.type}
              >
                {loading === ai.type ? "Starting..." : "Start Match"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIList;
