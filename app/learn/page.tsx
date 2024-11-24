import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BookOpen, Trophy, Flag } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Chess Learning Paths - Basics, Advanced, and Openings | Chesshub Online",
  description:
    "Explore chess learning paths for all skill levels. From mastering the basics to advanced strategies and opening principles, start your chess journey today.",
  openGraph: {
    title:
      "Chess Learning Paths - Master Chess Fundamentals, Strategies, and Openings",
    description:
      "Discover tailored chess learning paths at Chesshub Online. Learn the basics, advanced tactics, and essential openings to take your chess game to the next level.",
    url: "https://chesshubonline.vercel.app/learn",
    siteName: "Chesshub Online",
    images: [
      {
        url: "/images/chesshub.png",
        width: 1200,
        height: 630,
        alt: "Chess Learning Paths Overview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chess Learning Paths - Basics, Advanced, and Openings",
    description:
      "Enhance your chess skills with dedicated learning paths. Master the basics, explore advanced tactics, and understand key openings with Chesshub Online.",
    images: ["/images/chesshub.png"],
  },
  keywords: [
    "chess learning paths",
    "chess basics",
    "chess tactics",
    "basic chess moves",
    "advanced chess strategies",
    "chess openings",
    "learn chess online",
    "chess for beginners",
    "chess tutorials",
    "chess tactics",
    "chess training",
    "chesshub online",
    "how to play chess",
  ],
};

const ChessLearningPage = () => {
  const learningPaths = [
    {
      title: "Basics",
      description:
        "Master the fundamentals of chess including piece movements, basic rules, and essential concepts. Perfect for beginners starting their chess journey.",
      icon: <BookOpen className="w-12 h-12 mb-4 text-primary" />,
      url: "/learn/basics",
      topics: [
        "Piece Movements",
        "Basic Rules",
        "Check and Checkmate",
        "Special Moves",
        "Board Setup",
        "Point Values",
      ],
      backgroundColor:
        "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800",
      borderColor: "border-blue-200",
    },
    {
      title: "Advanced",
      description:
        "Dive deep into advanced chess strategies, tactical patterns, and positional play. Designed for players ready to elevate their game.",
      icon: <Trophy className="w-12 h-12 mb-4 text-primary" />,
      url: "/learn/advanced",
      topics: [
        "Tactical Patterns",
        "Strategic Planning",
        "Endgame Techniques",
        "Piece Coordination",
        "Pawn Structures",
        "Attack Methods",
      ],
      backgroundColor:
        "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800",
      borderColor: "border-purple-200",
    },
    {
      title: "Openings",
      description:
        "Build a strong foundation with essential chess openings. Learn popular opening moves, principles, and variations for both white and black pieces.",
      icon: <Flag className="w-12 h-12 mb-4 text-primary" />,
      url: "/learn/startings",
      topics: [
        "Opening Principles",
        "Popular Openings",
        "Common Variations",
        "Opening Traps",
        "Move Orders",
        "Theory Basics",
      ],
      backgroundColor:
        "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800",
      borderColor: "border-green-200",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Chess Learning Paths</h1>
        <p className="text-xl text-gray-600">
          Choose your path and start mastering chess
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {learningPaths.map((path, index) => (
          <Card
            key={index}
            className={`hover:shadow-xl transition-all duration-300 border-2 ${path.borderColor} ${path.backgroundColor}`}
          >
            <CardHeader className="text-center pt-8">
              <div className="flex justify-center">{path.icon}</div>
              <CardTitle className="text-2xl mb-2">{path.title}</CardTitle>
              <CardDescription className="text-sm line-clamp-5">
                {path.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">What you&apos;ll learn:</h3>
                <ul className="space-y-2">
                  {path.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={path.url}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full"
              >
                Start Learning
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChessLearningPage;
