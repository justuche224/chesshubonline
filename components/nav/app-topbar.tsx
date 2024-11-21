"use client";

import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "../theme-button";
import { ArrowLeft, Users2 } from "lucide-react";
import { Button } from "../ui/button";
import { usePendingFriendRequests } from "@/hooks/usePendingFriendRequests";
import { authRoutes, publicRoutes } from "@/routes";

// interface AppTopbarProps {
//   userId: string;
// }

export function AppTopbar() {
  const currentPath = usePathname();
  const isPublicRoute = publicRoutes.includes(currentPath);
  const isAuthPage = authRoutes.includes(currentPath);
  const router = useRouter();
  const { pendingCount } = usePendingFriendRequests();

  if (isAuthPage || isPublicRoute) {
    return null;
  }

  return (
    <div
      id="top-bar"
      className="w-full border-b flex justify-between items-center px-2 py-2 text-xl bg-sidebar sticky top-0 z-[9998]"
    >
      <div className="flex items-center gap-2">
        <Button className="h-9 w-10" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <div className="cursor-pointer" onClick={() => router.push("/")}>
          CHESSHUB
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="z-[9999]">
          <ModeToggle />
        </div>
        <div className="relative">
          <Button className="h-9 w-10" onClick={() => router.push("/friends")}>
            <Users2 />
          </Button>
          {pendingCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingCount}
            </div>
          )}
        </div>
        <div className="">
          <SidebarTrigger className="md:hidden" />
        </div>
      </div>
    </div>
  );
}
