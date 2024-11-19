import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";
import { AppTopbar } from "@/components/nav/app-topbar";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

interface ExtendedMetadata extends Metadata {
  canonical: string;
}

export const metadata: ExtendedMetadata = {
  title: "ChessHub - #1 Online Chess Platform | Play, Learn, Compete",
  description:
    "ChessHub is the go-to platform for chess enthusiasts! Play online games, challenge AI, join tournaments, and elevate your chess game with analytics.",
  keywords:
    "play chess online, learn chess, online chess tournaments, AI chess opponents, beginner chess training, chess tutorials",
  canonical: "https://www.chesshub.com",
  openGraph: {
    title: "ChessHub - Play Online Chess & Improve Your Skills",
    description:
      "Master the game of chess! Play online with friends, train with AI, and track your performance with advanced tools.",
    images: [{ url: "/images/chesshub.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChessHub - Play Chess & Learn Chess Strategies",
    description:
      "Play chess online with players worldwide. Join our tournaments and learn to improve with tailored analytics.",
    images: ["/images/chesshub.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader color="yellow" zIndex={9999} />
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full">
                <AppTopbar />
                {children}
              </main>
              <Toaster position="top-center" />
            </SidebarProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
