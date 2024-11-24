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
  title: "Chess Tutorials - Learn How Chess Pieces Move | Chesshub Onlie",
  description:
    "Discover comprehensive chess tutorials that teach you how each chess piece moves. Perfect for beginners and those looking to improve their skills.",
  openGraph: {
    title: "Chess Tutorials - Learn Chess Piece Movements",
    description:
      "Learn how chess pieces move with our easy-to-follow tutorials. Detailed lessons on King, Queen, Bishop, Knight, Rook, and Pawn movements.",
    url: "https://chesshubonline.vercel.app/learn/basics",
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
    title: "Chess Tutorials - Learn Chess Piece Movements",
    description:
      "Get in-depth tutorials on how each chess piece moves. Start your chess journey with confidence.",
    images: ["/images/chesshub.png"],
  },
  keywords: [
    "chess tutorials",
    "how chess pieces move",
    "chess basics",
    "chess rules for beginners",
    "learn chess movements",
    "King chess movement",
    "Queen chess movement",
    "Rook chess movement",
    "Knight chess movement",
    "Bishop chess movement",
    "Pawn chess movement",
  ],
};

const ChessTutorialsPage = () => {
  const BasicTutorials = [
    {
      title: "The King's Movement in Chess",
      image: "/images/The-Kings-Movement-in-Chess.jpg",
      url: "/learn/basics/The-Kings-Movement-in-Chess",

      description:
        "Learn how the King moves one square at a time in any direction. Despite being the most important piece, the King's movement is limited, making it crucial to protect.",
    },
    {
      title: "The Queen's Movement in Chess",
      image: "/images/The-Queens-Movement-in-Chess.jpg",
      url: "/learn/basics/The-Queens-Movement-in-Chess",

      description:
        "Discover the Queen's powerful movements combining both Rook and Bishop abilities, allowing her to move any number of squares horizontally, vertically, or diagonally.",
    },
    {
      title: "The Bishop's Movement in Chess",
      image: "/images/The-Bishops-Movement-in-Chess.jpg",
      url: "/learn/basics/The-Bishops-Movement-in-Chess",

      description:
        "Master the Bishop's diagonal movements across the board. Each Bishop stays on its original color squares throughout the game.",
    },
    {
      title: "The Knight's Movement in Chess",
      image: "/images/The-Knights-Movement-in-Chess.jpg",
      url: "/learn/basics/The-Knights-Movement-in-Chess",

      description:
        "Explore the unique L-shaped movement of the Knight, the only piece that can jump over others. Knights move two squares in one direction and one square perpendicular.",
    },
    {
      title: "The Rook's Movement in Chess",
      image: "/images/The-Rooks-Movement-in-Chess.jpg",
      url: "/learn/basics/The-Rooks-Movement-in-Chess",

      description:
        "Learn how Rooks move horizontally and vertically across the board. These powerful pieces are especially effective in the endgame and during castling.",
    },
    {
      title: "The Pawn's Movement in Chess",
      image: "/images/The-Pawns-Movement-in-Chess.jpg",
      url: "/learn/basics/The-Pawns-Movement-in-Chess",

      description:
        "Understand Pawn movement including their initial two-square advance, one-square forward progress, diagonal captures, and special rules like en passant and promotion.",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Chess Piece Movement Basics</h1>
        <p className="text-xl text-gray-600">
          Master the fundamentals of chess including piece movements, basic
          rules, and essential concepts.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BasicTutorials.map((tutorial, index) => (
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
