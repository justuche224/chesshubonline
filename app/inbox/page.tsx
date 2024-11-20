import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircleIcon, UserPlusIcon } from "lucide-react";
import { currentUser as getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";

const ConversationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return redirect("/login");
  }

  // Fetch conversations for the current user
  const conversations = await db.conversation.findMany({
    where: {
      OR: [{ user1Id: currentUser.id }, { user2Id: currentUser.id }],
    },
    include: {
      user1: true,
      user2: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Fallback UI for no conversations
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center p-6">
        <MessageCircleIcon
          className="w-24 h-24 text-gray-300 mb-6"
          strokeWidth={1}
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          No Conversations Yet
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Start connecting with friends by sending friend requests or joining
          game chats.
        </p>
        <div className="flex space-x-4">
          <Link href={"/friends/new"}>
            <Button variant="outline" className="flex items-center space-x-2">
              <UserPlusIcon className="w-5 h-5" />
              <span>Add Friends</span>
            </Button>
          </Link>
          <Link href={"/inbox/new"}>
            <Button>Start a New Conversation</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Conversations</h1>
      <ScrollArea className="h-[calc(100vh-100px)] w-full">
        <div className="space-y-3">
          {conversations.map((conversation) => {
            // Determine the other user in the conversation
            const otherUser =
              conversation.user1Id === currentUser.id
                ? conversation.user2
                : conversation.user1;
            // Generate fallback text from username
            const fallbackText = otherUser.username.slice(0, 2).toUpperCase();
            // Get the latest message (if any)
            const latestMessage =
              conversation.messages[0]?.content || "No messages yet";
            return (
              <Link
                key={conversation.id}
                href={`/inbox/${conversation.id}`}
                title={otherUser.username}
              >
                <Card className="hover:bg-sidebar cursor-pointer transition-colors">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={otherUser.image || undefined}
                        alt={`${otherUser.username}'s avatar`}
                      />
                      <AvatarFallback>{fallbackText}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-semibold text-lg">
                            {otherUser.firstname} {otherUser.lastname}
                          </h2>
                          <p className="text-gray-500 text-sm">
                            @{otherUser.username}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(conversation.updatedAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1 truncate">
                        {latestMessage}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationsPage;
