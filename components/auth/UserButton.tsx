"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LogoutButton from "./logout-button";
import { ExitIcon, EnterIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import {
  FaCaretDown,
  FaCog,
  FaExclamation,
  FaQuestion,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import LoginButton from "./login-button";
import RegisterButton from "./register-button";
import Link from "next/link";

export const UserButton = () => {
  const user = useCurrentUser();
  const getFirstTwoLetters = () => {
    return user?.username.slice(0, 2).toUpperCase();
  };

  function shortenString(str: string) {
    if (str.length > 11) {
      return str.slice(0, 8) + "...";
    } else {
      return str;
    }
  }

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback>
              <span className="bg-destructive flex justify-center items-center p-2 rounded-full">
                <FaUser size={17} className="text-secondary-foreground" />
              </span>
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <LoginButton>
            <DropdownMenuItem>
              <EnterIcon className="w-4 h-4 mr-2" />
              {""}Login
            </DropdownMenuItem>
          </LoginButton>
          <RegisterButton>
            <DropdownMenuItem>
              <FaUserPlus className="w-4 h-4 mr-2" />
              {""}Join
            </DropdownMenuItem>
          </RegisterButton>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user?.image}
            className="w-[40px] h-[40px] object-cover rounded-full"
          />
          <AvatarFallback>
            <span className="bg-destructive relative flex justify-center items-center p-1 rounded-full">
              <span className="font-bold">{getFirstTwoLetters()}</span>
              <FaCaretDown className="absolute -bottom-2 -right-2" size={20} />
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem>
          {user.image ? (
            <Link href="/profile" className="mx-auto">
              <Image
                src={user.image}
                alt="Profile"
                width={100}
                height={100}
                className="w-[100px] h-[100px] object-cover rounded-full"
              />
            </Link>
          ) : (
            <div className=" font-extrabold text-[4rem] w-full grid place-content-center bg-primary-500 rounded-full text-center hover:bg-primary-600">
              <Link href="/profile">
                <span className="w-[100px] h-[100px] bg-secondary text-center flex justify-center items-center p-2 rounded-full">
                  {getFirstTwoLetters()}
                </span>
              </Link>
            </div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/profile">
            <h2 className="text-center font-bold text-xl underline">
              {shortenString(user?.username)}
            </h2>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <FaCog className="w-4 h-4 mr-2" />
          {""}Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FaQuestion className="w-4 h-4 mr-2" />
          {""}Help & Support
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FaExclamation className="w-4 h-4 mr-2" />
          {""}Privacy
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton>
          <DropdownMenuItem>
            <ExitIcon className="w-4 h-4 mr-2" />
            {""}Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
