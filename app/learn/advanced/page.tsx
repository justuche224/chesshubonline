import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Advanced Chess Tutorials - Learn Castling and En Passant | Chesshub Online",
  description:
    "Enhance your chess skills with advanced tutorials. Master castling, en passant, and more with Chesshub Online's step-by-step guides.",
  openGraph: {
    title: "Advanced Chess Tutorials - Chesshub Online",
    description:
      "Explore advanced chess tutorials like castling and en passant. Improve your chess tactics and strategies with Chesshub Online.",
    url: "https://chesshubonline.vercel.app/learn/advanced",
    siteName: "Chesshub Online",
    images: [
      {
        url: "/images/chesshub.png",
        width: 1200,
        height: 630,
        alt: "Chess Tutorials",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advanced Chess Tutorials - Chesshub Online",
    description:
      "Learn advanced chess moves like castling and en passant. Boost your chess strategy skills with Chesshub Online.",
    images: ["/images/chesshub.png"],
  },
  keywords: [
    "chess tutorials",
    "advanced chess strategies",
    "castling in chess",
    "en passant",
    "chess tactics",
    "chesshub online",
    "learn chess",
  ],
};

const ChessTutorialsPage = () => {
  const AdvancedTutorials = [
    {
      title: "Castling in Chess",
      image: "/images/Castling.jpg",
      url: "/learn/advanced/Castling",

      description:
        "Learn how to castle in chess, the process of moving a King and Rook to different positions on the board. This move is essential in the opening phase of the game.",
    },
    {
      title: "En Passant in Chess",
      image: "/images/Castling.jpg",
      url: "/learn/advanced/EnPassant",

      description:
        "Discover how to use en passant in chess, a strategic move that allows you to capture an opponent's pawn when it moves two squares forward.",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-5">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Advanced Chess Tutorials</h1>
        <p className="text-xl text-gray-600">
          Dive deeper into advanced chess strategies, tactical patterns, and
          positional play.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AdvancedTutorials.map((tutorial, index) => (
          <Link key={index} href={tutorial.url}>
            <Card
              key={index}
              className="hover:shadow-lg transition-all cursor-pointer duration-300 hover:bg-sidebar"
            >
              <CardHeader>
                <div className="aspect-square relative w-full mb-4">
                  <Image
                    width={200}
                    height={200}
                    src={tutorial.image}
                    alt={tutorial.title}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
                <CardTitle className="text-xl">{tutorial.title}</CardTitle>
                <CardDescription className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {tutorial.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChessTutorialsPage;
