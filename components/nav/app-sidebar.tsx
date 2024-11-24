"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronDown,
  Home,
  MessageSquare,
  Users,
  Settings,
  Swords,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";
import { authRoutes, publicRoutes } from "@/routes";

type User = {
  email: string;
  image: string | null;
  id: string;
  role: "USER" | "ADMIN";
  username: string;
};

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
    description: "Dashboard & Overview",
  },
  {
    title: "Games",
    url: "/games",
    icon: Swords,
    description: "Active & Past Matches",
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: MessageSquare,
    description: "Chat & Notifications",
    badge: 3,
  },
  {
    title: "Friends",
    url: "/friends",
    icon: Users,
    description: "View and manage Friends",
  },
  {
    title: "Learn",
    url: "/learn",
    icon: BookOpen,
    description: "Learn to play Chess",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "Preferences & Account",
  },
];

export function AppSidebar() {
  const currentPath = usePathname();
  const router = useRouter();
  const isPublicRoute = publicRoutes.includes(currentPath);
  const isAuthPage = authRoutes.includes(currentPath);
  const isLearnRoute = currentPath.startsWith("/learn");

  const user: User | null = useCurrentUser();

  if (isAuthPage || isPublicRoute || isLearnRoute) {
    return null;
  }

  return (
    <TooltipProvider>
      <Sidebar className="border-r border-border bg-card">
        <SidebarSeparator className="mt-12 md:hidden" />
        <SidebarHeader className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    className="flex w-full gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                    size="lg"
                  >
                    <div
                      style={{
                        backgroundImage: `url(${
                          user?.image ?? "/images/user-placeholder.png"
                        })`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                      className="w-12 h-12 rounded-full ring-2 ring-primary/10"
                    />
                    <div className="flex justify-between w-full items-center">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {user?.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user?.role}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()}>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = currentPath === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              "w-full flex items-center gap-3 p-2 rounded-lg transition-colors relative group",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            )}
                          >
                            <a href={item.url}>
                              <item.icon
                                className={cn(
                                  "h-4 w-4",
                                  isActive
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground"
                                )}
                              />
                              <span
                                className={cn(
                                  "font-medium text-sm",
                                  !isActive && "text-foreground"
                                )}
                              >
                                {item.title}
                              </span>
                              {item.badge && (
                                <span
                                  className={cn(
                                    "absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-xs font-medium",
                                    isActive
                                      ? "bg-primary-foreground text-primary"
                                      : "bg-primary/10 text-primary"
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                              {!isActive && (
                                <span className="absolute left-0 right-0 top-0 bottom-0 rounded-lg ring-2 ring-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </a>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[200px]">
                          {item.description}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="rounded-lg bg-accent/50 p-4">
            <p className="text-xs text-center text-muted-foreground">
              Need help? Visit our
              <a href="/support" className="text-primary hover:underline">
                support center
              </a>
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
