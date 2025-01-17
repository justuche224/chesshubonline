import { Metadata } from "next";

interface ExtendedMetadata extends Metadata {
  canonical: string;
}

export const metadata: ExtendedMetadata = {
  title: "Quick Play Chess Online - Free Instant Chess Games | ChessHub",
  description:
    "Start playing chess instantly with ChessHub's Quick Play feature. Play against AI, challenge friends, or practice your strategies with no account required. Enjoy seamless chess gameplay with multiple difficulty levels.",
  keywords:
    "quick play chess, online chess game, free chess, instant chess, chess vs AI, chess practice, quick chess match, ChessHub quick play, no account chess, casual chess game",
  canonical: "https://chesshubonline.vercel.app/quick-play",
  openGraph: {
    title: "Play Chess Online Instantly - Quick Play Mode | ChessHub",
    description:
      "Jump into a chess game instantly on ChessHub. Play against AI opponents, practice your moves, or challenge friends - all without creating an account. Start your next chess match in seconds.",
    images: [{ url: "/images/chesshub.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Chess Games Online - Play Instantly | ChessHub",
    description:
      "Ready for a quick chess match? Play instantly against AI or friends on ChessHub. No registration needed - just start playing and enjoy multiple game modes and difficulty levels.",
    images: ["/images/chesshub.png"],
  },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="py-6 pt-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {children}
      </div>
    </>
  );
};

export default Layout;
