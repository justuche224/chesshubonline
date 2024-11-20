"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontalIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { pusherClient } from "@/lib/pusher";
import axios from "axios";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  sender: {
    id: string;
    username: string;
    image: string | null;
  };
}

interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  image: string | null;
}

interface Conversation {
  id: string;
  messages: Message[];
}

interface ChatPageProps {
  otherUser: User;
  conversation: Conversation;
  user: any;
}

const ChatPage: React.FC<ChatPageProps> = ({
  otherUser,
  conversation: initialConversation,
  user,
}) => {
  const [conversation, setConversation] =
    useState<Conversation>(initialConversation);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Real-time message updates via Pusher
  useEffect(() => {
    if (!conversation?.id) return;

    const channel = pusherClient.subscribe(conversation.id);

    const handleNewMessage = (newMessage: Message) => {
      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));
    };

    channel.bind("message:new", handleNewMessage);

    return () => {
      channel.unbind("message:new", handleNewMessage);
      pusherClient.unsubscribe(conversation.id);
    };
  }, [conversation?.id]);

  // Send message handler
  const sendMessage = useCallback(async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/inbox/${conversation.id}/messages`,
        {
          message: message.trim(),
        }
      );

      if (response.data.success) {
        setMessage(""); // Clear input after sending
      }
    } catch (error) {
      console.error("Failed to send message", error);
      // Optionally show error toast
    } finally {
      setIsLoading(false);
    }
  }, [message, conversation.id]);

  // Handle input key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-52px)] max-w-2xl mx-auto">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b">
        <Avatar className="w-10 h-10 mr-3">
          <AvatarImage
            src={otherUser.image || undefined}
            alt={`${otherUser.username}'s avatar`}
          />
          <AvatarFallback>
            {otherUser.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">
            {otherUser.firstname} {otherUser.lastname}
          </h2>
          <p className="text-sm text-gray-500">@{otherUser.username}</p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === user.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.senderId === user.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t flex items-center space-x-2">
        <Input
          placeholder="Type a message..."
          className="flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button
          size="icon"
          onClick={sendMessage}
          disabled={isLoading || !message.trim()}
        >
          <SendHorizontalIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
