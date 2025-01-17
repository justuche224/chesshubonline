import React from "react";
import { redirect } from "next/navigation";
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
  Trophy,
  Star,
  Book,
  Target,
  Shield,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@/lib/auth";

const LandingPage = async () => {
  const user = await currentUser();
  if (user) {
    return redirect("/home");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden" aria-label="Hero">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-50 dark:opacity-30" />

        <div className="relative pt-32 pb-20 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Badge variant="outline" className="mb-6 animate-fade-in">
              <Sparkles className="h-3 w-3 mr-1" />
              New: AI Chess Opponents
            </Badge>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-fade-in-up">
                  Play Chess Online
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-12 animate-fade-in-up delay-100">
                  Experience the best in online chess at ChessHub. Challenge
                  real players worldwide, train with intelligent AI opponents,
                  and elevate your game with professional analytics.
                </p>

                <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
                  <Link title="Play Chess Online Now" href="/games/new#player">
                    <Button size="lg" className="group">
                      Start Playing For Free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/learn">
                    <Button size="lg" variant="outline">
                      Learn to Play Chess
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex-1 flex justify-center">
                <Image
                  width={500}
                  height={500}
                  src="/images/chesshub.png"
                  alt="Interactive Chess Game Interface"
                  className="w-full max-w-md rounded-lg shadow-2xl animate-float"
                  priority
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <StatCard
                icon={<Users />}
                value="100K+"
                label="Active Chess Players"
              />
              <StatCard icon={<Zap />} value="1M+" label="Online Chess Games" />
              <StatCard
                icon={<Crown />}
                value="5K+"
                label="Tournament Champions"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Rankings & Tournaments - New Section */}
      <section className="py-12 px-6" aria-label="Chess Rankings">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Competitive Chess Rankings & Tournaments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/50 dark:bg-gray-800/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Daily Tournaments</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Blitz Championship</span>
                    <Badge>500+ Players</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Classical Masters</span>
                    <Badge>200+ Players</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white/50 dark:bg-gray-800/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Top Players</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Grandmasters</span>
                    <Badge>50+</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>International Masters</span>
                    <Badge>100+</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Resources - New Section */}
      <section
        className="py-12 px-6 bg-gray-50 dark:bg-gray-900"
        aria-label="Chess Learning"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Comprehensive Chess Learning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LearningCard
              icon={<Book />}
              title="Video Lessons"
              description="Access 1000+ video lessons from chess grandmasters"
              count="1000+"
            />
            <LearningCard
              icon={<Target />}
              title="Practice Puzzles"
              description="Sharpen your tactical skills with daily puzzles"
              count="5000+"
            />
            <LearningCard
              icon={<Shield />}
              title="Opening Database"
              description="Study and master chess openings with our comprehensive database"
              count="10000+"
            />
          </div>
        </div>
      </section>

      {/* Game Modes - New Section */}
      <section className="py-12 px-6" aria-label="Chess Game Modes">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Multiple Chess Formats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GameModeCard
              icon={<Clock />}
              title="Blitz"
              description="3-5 minute games"
            />
            <GameModeCard
              icon={<Zap />}
              title="Bullet"
              description="1 minute lightning rounds"
            />
            <GameModeCard
              icon={<Brain />}
              title="Classical"
              description="30+ minute strategic battles"
            />
            <GameModeCard
              icon={<Bot />}
              title="AI Training"
              description="Custom difficulty matches"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6" aria-label="Chess Features">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            Experience Premier Online Chess at ChessHub
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Swords />}
              title="Real-time Chess Matches"
              description="Challenge chess players worldwide with our smooth, lag-free gaming experience. Play competitive matches anytime."
            />
            <FeatureCard
              icon={<Bot />}
              title="AI Chess Training"
              description="Improve your chess skills with our adaptive AI that learns and grows stronger as you improve. Perfect for beginners and masters alike."
            />
            <FeatureCard
              icon={<Brain />}
              title="Chess Analytics"
              description="Master your chess strategy with detailed game analysis, move tracking, and comprehensive performance metrics."
            />
          </div>
        </div>
      </section>

      {/* CTA Section - More compact */}
      <section className="py-12 px-6" aria-label="Join ChessHub">
        <div className="mx-auto max-w-7xl">
          <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to master online chess?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
                Join thousands of chess enthusiasts and begin your journey to
                becoming a stronger player. Get access to AI training, live
                matches, and advanced analytics.
              </p>
              <Link title="Create Free Chess Account" href="/auth/register">
                <Button size="lg" className="group">
                  Create Free Account
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Footer with Internal Links */}
    </main>
  );
};

const LearningCard = ({ icon, title, description, count }) => (
  <Card className="bg-white dark:bg-gray-800/50">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-3">
        {React.cloneElement(icon, { className: "h-6 w-6 text-primary" })}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-2">{description}</p>
      <Badge variant="outline">{count} Items</Badge>
    </CardContent>
  </Card>
);

const GameModeCard = ({ icon, title, description }) => (
  <Card className="bg-white dark:bg-gray-800/50">
    <CardContent className="p-4">
      {React.cloneElement(icon, { className: "h-6 w-6 text-primary mb-2" })}
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </CardContent>
  </Card>
);

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

export default LandingPage;
