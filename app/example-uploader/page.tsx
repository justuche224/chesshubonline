import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Swords,
  Bot,
  Brain,
  Users,
  Sparkles,
  ChevronRight,
  Zap,
  Crown,
  ArrowRight,
} from "lucide-react";

const LandingPage = async () => {
  return <UnauthenticatedLanding />;
};

const UnauthenticatedLanding = () => {
  const recentGames = [
    {
      id: 1,
      opponent: "Magnus A.",
      result: "Win",
      rating: "+8",
      date: "2h ago",
    },
    {
      id: 2,
      opponent: "Anna K.",
      result: "Loss",
      rating: "-5",
      date: "5h ago",
    },
    {
      id: 3,
      opponent: "SmartAI",
      result: "Draw",
      rating: "+0",
      date: "1d ago",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="relative pt-24 pb-20 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Badge variant="outline" className="mb-8 animate-fade-in">
              <Sparkles className="h-3 w-3 mr-1" />
              New: AI Opponents with Adaptive Learning
            </Badge>

            <h1 className="text-6xl font-bold tracking-tight text-white mb-6 animate-fade-in-up">
              Master Chess in the
              <span className="text-primary"> Digital Age</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mb-12 animate-fade-in-up delay-100">
              Join the next generation of chess players. Challenge real
              opponents, train with AI, and track your progress with advanced
              analytics.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
              <Button size="lg" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">100K+</p>
                  <p className="text-gray-400">Active Players</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">1M+</p>
                  <p className="text-gray-400">Games Played</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">5K+</p>
                  <p className="text-gray-400">Tournament Players</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-white mb-12">
            Why Choose CHESSHUB
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Swords className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Real-time Matches
                </h3>
                <p className="text-gray-400">
                  Challenge players worldwide with our smooth, lag-free gaming
                  experience.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  AI Training
                </h3>
                <p className="text-gray-400">
                  Practice with our adaptive AI that grows stronger as you
                  improve.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Advanced Analytics
                </h3>
                <p className="text-gray-400">
                  Track your progress with detailed game analysis and
                  performance metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
            <div className="relative p-12 lg:p-16">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to improve your game?
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mb-8">
                Join thousands of players and start your journey to chess
                mastery today.
              </p>
              <Button size="lg" className="group">
                Create Free Account
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Games */}
      <Card className="lg:col-span-2 bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white">Recent Games</h3>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentGames.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`text-sm font-medium px-2 py-1 rounded ${
                      game.result === "Win"
                        ? "bg-green-500/10 text-green-500"
                        : game.result === "Loss"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {game.result}
                  </div>
                  <span className="text-white">{game.opponent}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm font-medium ${
                      game.rating.startsWith("+")
                        ? "text-green-500"
                        : game.rating.startsWith("-")
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {game.rating}
                  </span>
                  <span className="text-gray-400">{game.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPage;
