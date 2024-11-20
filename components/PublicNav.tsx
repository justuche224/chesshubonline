import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/theme-button";
import { Gamepad } from "lucide-react";
const PublicNav = () => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            width={40}
            height={40}
            src="/images/chesshub.png"
            alt="ChessHub Logo"
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            CHESSHUB
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link title="Start Playing Chess Online" href="/games">
            <Button>
              <Gamepad className="h-6 w-6" />
              <span className="sr-only sm:not-sr-only">Start Playing</span>
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default PublicNav;