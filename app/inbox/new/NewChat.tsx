"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, MessageSquarePlusIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createConversation } from "@/actions/new-conversation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

const NewChat = ({ friends }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [startingChat, setStartingChat] = React.useState(false);
  const router = useRouter();

  // Filter friends based on search term
  const filteredFriends = friends.filter(
    (friend) =>
      friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${friend.firstname} ${friend.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const startConversation = async (friendId: string) => {
    setStartingChat(true);
    try {
      const res = await createConversation(friendId);
      console.log(res);

      if (res.error) {
        toast.error(res.error);
      }

      if (res.success) {
        toast.success("Chat created, redirecting to Chat page ");
        router.push(`/inbox/${res.conversation.id}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setStartingChat(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">New Conversation</h1>
        <MessageSquarePlusIcon className="text-primary w-6 h-6" />
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search friends"
          className="pl-10 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Friends List */}
      <ScrollArea className="h-[calc(100vh-250px)] pr-4">
        {filteredFriends.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No friends found
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFriends.map((friend) => (
              <Card
                key={friend.id}
                className="hover:bg-sidebar transition-colors cursor-pointer"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={friend.image || undefined}
                        alt={`${friend.username}'s avatar`}
                      />
                      <AvatarFallback>
                        {friend.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">
                        {friend.firstname} {friend.lastname}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        @{friend.username}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => startConversation(friend.id)}
                    disabled={startingChat}
                  >
                    Start Chat {startingChat && <ClipLoader />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NewChat;
