"use client";

import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "../theme-button";

export function AppTopbar() {
  const currentPath = usePathname();
  const isAuthPage = currentPath.startsWith("/auth/");
  const router = useRouter();

  if (isAuthPage) {
    return;
  }

  return (
    <div
      id="top-bar"
      className="w-full border-b flex justify-between items-center px-2 py-2 text-xl bg-sidebar/20 backdrop-blur-lg sticky top-0 z-[9998]"
    >
      <div className="flex items-center gap-2">
        <div className="">
          <SidebarTrigger className="md:hidden" />
        </div>
        <div className="" onClick={() => router.push("/")}>
          CHESSHUB
        </div>
      </div>
      <div className="z-[9999]">
        <ModeToggle />
      </div>
    </div>
  );
}
