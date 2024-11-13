"use client";

import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
      className="w-full border-b flex justify-start items-center px-2 py-2 text-xl bg-sidebar sticky top-0 z-[9999]"
    >
      <div className="">
        <SidebarTrigger className="md:hidden" />
      </div>
      <div className="" onClick={() => router.push("/")}>
        CHESSHUB
      </div>
    </div>
  );
}
