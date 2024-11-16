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
  Gamepad,
} from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/theme-button";
import Link from "next/link";

const LandingPage = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              width={40}
              height={40}
              src="/images/chesshub.png"
              alt="ChessHub Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              CHESSHUB
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link title="Start Playing" href="/games">
              <Button>
                <Gamepad className="h-6 w-6" />
                <span className="sm:hidden">Start</span>
                <span className="hidden sm:inline-block">Start Playing</span>
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-50 dark:opacity-30" />

        <div className="relative pt-32 pb-20 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Badge variant="outline" className="mb-8 animate-fade-in">
              <Sparkles className="h-3 w-3 mr-1" />
              New: AI Opponents with Adaptive Learning
            </Badge>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-fade-in-up">
                  Master Chess in the
                  <span className="text-primary"> Digital Age</span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-12 animate-fade-in-up delay-100">
                  Join the next generation of chess players. Challenge real
                  opponents, train with AI, and track your progress with
                  advanced analytics.
                </p>

                <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
                  <Link title="Start Playing" href="/games/new#player">
                    <Button size="lg" className="group">
                      Start Playing For Free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline">
                    Watch Demo
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex justify-center">
                <Image
                  width={200}
                  height={200}
                  src="/images/chesshub.png"
                  alt="Chess Visualization"
                  className="w-full max-w-md rounded-lg shadow-2xl animate-float"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <StatCard icon={<Users />} value="100K+" label="Active Players" />
              <StatCard icon={<Zap />} value="1M+" label="Games Played" />
              <StatCard
                icon={<Crown />}
                value="5K+"
                label="Tournament Players"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            Why Choose CHESSHUB
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Swords />}
              title="Real-time Matches"
              description="Challenge players worldwide with our smooth, lag-free gaming experience."
            />
            <FeatureCard
              icon={<Bot />}
              title="AI Training"
              description="Practice with our adaptive AI that grows stronger as you improve."
            />
            <FeatureCard
              icon={<Brain />}
              title="Advanced Analytics"
              description="Track your progress with detailed game analysis and performance metrics."
            />
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Games
                  </h3>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentGames.map((game) => (
                  <GameRow key={game.id} game={game} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to improve your game?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
                Join thousands of players and start your journey to chess
                mastery today.
              </p>
              <Link title="Create Free Account" href={"/auth/register"}>
                <Button size="lg" className="group">
                  Create Free Account
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="flex items-center gap-4">
    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
      {React.cloneElement(icon, { className: "h-6 w-6 text-primary" })}
    </div>
    <div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
    <CardContent className="pt-6">
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        {React.cloneElement(icon, { className: "h-6 w-6 text-primary" })}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </CardContent>
  </Card>
);

const GameRow = ({ game }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
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
      <span className="text-gray-900 dark:text-white">{game.opponent}</span>
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
      <span className="text-gray-600 dark:text-gray-400">{game.date}</span>
    </div>
  </div>
);

export default LandingPage;
