import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Users,
  Target,
  Heart,
  Globe,
  Star,
  ChevronRight,
  Gamepad as Chess,
  GraduationCap,
  UserCheck,
  Handshake,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <PublicNav />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden pt-32"
        aria-label="About Hero"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-50 dark:opacity-30" />

        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Badge variant="outline" className="mb-8 animate-fade-in">
              <Star className="h-3 w-3 mr-1" />
              Trusted by 100K+ Chess Players Worldwide
            </Badge>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-fade-in-up">
                  About <span className="text-primary">ChessHub</span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8 animate-fade-in-up delay-100">
                  Founded in 2024, ChessHub is revolutionizing online chess by
                  combining cutting-edge technology with passionate community
                  building. Our mission is to make chess accessible, engaging,
                  and enjoyable for players of all skill levels.
                </p>

                <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
                  <Link href="/team">
                    <Button size="lg">
                      Meet Our Team
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex-1 flex justify-center">
                <Image
                  width={500}
                  height={500}
                  src="/images/chesshub.png"
                  alt="ChessHub Team"
                  className="w-full max-w-md rounded-lg shadow-2xl animate-float"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 px-6" aria-label="Vision and Mission">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <VisionCard
              icon={<Target />}
              title="Our Vision"
              description="To create the world's most comprehensive and accessible online chess platform, fostering a global community of chess enthusiasts and champions."
            />
            <VisionCard
              icon={<Heart />}
              title="Our Mission"
              description="To democratize chess education and competition through innovative technology, making the royal game accessible to players of all backgrounds and skill levels."
            />
          </div>
        </div>
      </section>

      {/* Achievement Stats */}
      <section
        className="py-16 px-6 bg-gray-50 dark:bg-gray-900"
        aria-label="Achievements"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Our Impact on the Chess Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard icon={<Users />} value="100K+" label="Active Players" />
            <StatCard icon={<Globe />} value="150+" label="Countries" />
            <StatCard icon={<Trophy />} value="1000+" label="Tournaments" />
            <StatCard icon={<GraduationCap />} value="50K+" label="Students" />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-6" aria-label="Core Values">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Chess />}
              title="Excellence"
              description="We strive for excellence in every aspect of our platform, from game mechanics to user experience."
            />
            <ValueCard
              icon={<UserCheck />}
              title="Inclusivity"
              description="Chess is for everyone. We create a welcoming environment for players of all backgrounds and skill levels."
            />
            <ValueCard
              icon={<Handshake />}
              title="Community"
              description="We foster a supportive global community where players can learn, compete, and grow together."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-6 mb-12" aria-label="Join ChessHub">
        <div className="mx-auto max-w-7xl">
          <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Be Part of Our Chess Community
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                Join ChessHub today and experience the future of online chess.
                Connect with players worldwide, learn from the best, and take
                your game to the next level.
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="group">
                  Join ChessHub Today
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

const VisionCard = ({ icon, title, description }) => (
  <Card className="bg-white dark:bg-gray-800/50">
    <CardContent className="p-8">
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
        {React.cloneElement(icon, { className: "h-6 w-6 text-primary" })}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-lg">{description}</p>
    </CardContent>
  </Card>
);

const StatCard = ({ icon, value, label }) => (
  <div className="flex flex-col items-center text-center gap-4">
    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
      {React.cloneElement(icon, { className: "h-8 w-8 text-primary" })}
    </div>
    <div>
      <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {value}
      </p>
      <p className="text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const ValueCard = ({ icon, title, description }) => (
  <Card className="bg-white dark:bg-gray-800/50">
    <CardContent className="p-6">
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        {React.cloneElement(icon, { className: "h-6 w-6 text-primary" })}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </CardContent>
  </Card>
);

export default AboutPage;
