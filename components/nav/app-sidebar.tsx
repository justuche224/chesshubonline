"use client";
import { usePathname } from "next/navigation";

import {
  ChevronDown,
  Home,
  MessageSquare,
  Search,
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
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";

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
    url: "/",
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
    title: "Messages",
    url: "#",
    icon: MessageSquare,
    description: "Chat & Notifications",
  },
  {
    title: "Explore",
    url: "#",
    icon: Search,
    description: "Find Players & Games",
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    description: "Preferences & Account",
  },
];

export function AppSidebar() {
  const currentPath = usePathname();
  const router = useRouter();
  const isAuthPage = currentPath.startsWith("/auth/");

  const user: User | null = useCurrentUser();
  // console.log(user);

  if (isAuthPage) {
    return;
  }

  return (
    <Sidebar>
      <SidebarSeparator className="mt-12 md:hidden" />
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex" size="lg">
                  <div
                    style={{
                      backgroundImage: `url(${
                        user?.image ?? "/images/user-placeholder.png"
                      })`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                    className="w-12 h-12 rounded-full"
                  ></div>
                  <div className="flex justify-between w-full">
                    <div>
                      <h1 className="font-bold">{user?.username}</h1>
                      <h2>{user?.role}</h2>
                    </div>
                    <ChevronDown className="ml-auto" />
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
                {/* <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => logout()}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarSeparator />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
