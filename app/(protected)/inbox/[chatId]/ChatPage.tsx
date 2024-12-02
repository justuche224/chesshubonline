"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher";
import axios from "axios";
import logger from "@/utils/logger";
import ChatHeader from "./ChatHeader";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string | Date;
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
  user: User;
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Timestamp formatting function
  const formatTimestamp = (createdAt: string | Date) => {
    const date = new Date(createdAt);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
      new Date(now.getTime() - 86400000).toDateString() === date.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (isYesterday) {
      return `Yesterday ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((msg) => {
      const date = new Date(msg.createdAt);
      const dateKey = date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });

    return groups;
  };

  // Get date divider text
  const getDateDividerText = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);

    if (date.toDateString() === now.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // Effect for scrolling
  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

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
      logger.error("Failed to send message", error);
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

  // Group messages
  const messageGroups = groupMessagesByDate(conversation.messages);

  return (
    <div className="flex flex-col h-[calc(100vh-52px)] max-w-2xl mx-auto">
      {/* Chat Header */}
      <ChatHeader otherUser={otherUser} user={user} />

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(messageGroups).map(([dateStr, msgs]) => (
          <div key={dateStr} className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                {getDateDividerText(dateStr)}
              </div>
            </div>
            {msgs.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-2",
                  message.senderId === user.id ? "justify-end" : ""
                )}
              >
                <div
                  className={cn(
                    "flex flex-col gap-1 max-w-[70%]",
                    message.senderId === user.id ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 break-words w-fit",
                      message.senderId === user.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(message.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

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
