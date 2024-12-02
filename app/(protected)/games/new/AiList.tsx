"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { AIType } from "@prisma/client";
import {
  Bot,
  Cpu,
  ChevronRight,
  LoaderCircle,
  Brain,
  Target,
} from "lucide-react";

type AIOpponent = {
  type: AIType;
  name: string;
  description: string;
  strategy: string;
  icon: React.ReactNode;
  stats: {
    strength: number;
    speed: number;
    accuracy: number;
  };
};

const AI_OPPONENTS: AIOpponent[] = [
  {
    type: AIType.BasicAI,
    name: "Basic AI",
    description: "A fundamental chess engine perfect for beginners",
    strategy:
      "Makes straightforward moves focusing on basic piece values and simple tactics",
    icon: <Bot className="w-12 h-12 text-green-500" />,
    stats: {
      strength: 25,
      speed: 40,
      accuracy: 60,
    },
  },
  {
    type: AIType.SmartAI,
    name: "Smart AI",
    description: "An intermediate level opponent with enhanced decision making",
    strategy: "Employs positional understanding and basic strategic concepts",
    icon: <Cpu className="w-12 h-12 text-blue-500" />,
    stats: {
      strength: 50,
      speed: 60,
      accuracy: 75,
    },
  },
  {
    type: AIType.SmarterAI,
    name: "Smarter AI",
    description: "Advanced AI with sophisticated chess knowledge",
    strategy: "Uses complex tactical combinations and strategic planning",
    icon: <Brain className="w-12 h-12 text-purple-500" />,
    stats: {
      strength: 75,
      speed: 80,
      accuracy: 85,
    },
  },
  {
    type: AIType.SmartestAI,
    name: "Smartest AI",
    description: "The ultimate chess challenger with master-level play",
    strategy:
      "Implements deep positional understanding and long-term strategic planning",
    icon: <Target className="w-12 h-12 text-red-500" />,
    stats: {
      strength: 95,
      speed: 90,
      accuracy: 95,
    },
  },
];

const AICard = ({
  ai,
  onStartMatch,
  isLoading,
}: {
  ai: AIOpponent;
  onStartMatch: () => void;
  isLoading: boolean;
}) => {
  const getDifficultyColor = (aiType: AIType) => {
    switch (aiType) {
      case AIType.BasicAI:
        return "bg-green-100 text-green-800";
      case AIType.SmartAI:
        return "bg-blue-100 text-blue-800";
      case AIType.SmarterAI:
        return "bg-purple-100 text-purple-800";
      case AIType.SmartestAI:
        return "bg-red-100 text-red-800";
    }
  };

  const getStatBarColor = (value: number) => {
    if (value >= 80) return "bg-red-500";
    if (value >= 60) return "bg-purple-500";
    if (value >= 40) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <Card className=" hover:shadow-lg transition-all duration-300 overflow-hidden bg-sidebar text-gray-100">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* AI Avatar & Basic Info */}
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg bg-gray-800 flex items-center justify-center">
              {ai.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                  {ai.name}
                </h3>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(
                    ai.type
                  )}`}
                >
                  {ai.type}
                </span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-300 mb-2">
                {ai.description}
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex-1">
            <div className="space-y-2">
              {Object.entries(ai.stats).map(([stat, value]) => (
                <div key={stat} className="flex items-center gap-2">
                  <span className="text-sm text-gray-800 dark:text-gray-300 w-20 capitalize">
                    {stat}
                  </span>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatBarColor(
                        value
                      )} transition-all duration-500`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="w-full sm:w-auto hover:bg-sidebar-accent transition-colors"
            onClick={onStartMatch}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Starting..." : "Challenge"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

type AIListProps = {
  userId: string;
};

const AIList = ({ userId }: AIListProps) => {
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

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Challenge AI Opponents
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Select an AI opponent that matches your skill level
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
          <Bot className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {AI_OPPONENTS.length} AI Opponents Available
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {AI_OPPONENTS.map((ai) => (
          <AICard
            key={ai.type}
            ai={ai}
            isLoading={loading === ai.type}
            onStartMatch={() => handleStartMatch(ai.type)}
          />
        ))}
      </div>
    </div>
  );
};

export default AIList;
