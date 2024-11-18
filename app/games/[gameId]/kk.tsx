"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import { ClipLoader } from "react-spinners";

const Chat = ({ initialGame, currentPlayer }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialGame.messages || []);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const formatTimestamp = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now - 86400000).toDateString() === date.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
    
    if (isYesterday) {
      return `Yesterday ${date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      })}`;
    }
    
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`game-${initialGame.id}`);

    channel.bind("message", (newMessage) => {
      setMessages((current) => [...current, newMessage]);
    });

    return () => {
      channel.unbind("message");
      pusherClient.unsubscribe(`game-${initialGame.id}`);
    };
  }, [initialGame.id]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      setSending(true);
      const response = await fetch(`/api/games/${initialGame.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.createdAt);
      const dateKey = date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    
    return groups;
  };

  const getDateDividerText = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date(now - 86400000);

    if (date.toDateString() === now.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString([], { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="w-full rounded-md border bg-background flex flex-col h-[400px]">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(messageGroups).map(([dateStr, msgs]) => (
          <div key={dateStr} className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {getDateDividerText(dateStr)}
              </div>
            </div>
            {msgs.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2 max-w-[80%]",
                  msg.senderId === currentPlayer.id ? "ml-auto" : ""
                )}
              >
                {msg.senderId !== currentPlayer.id && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={msg.sender.image || "/images/user-placeholder.png"}
                      alt={msg.sender.username}
                      width={32}
                      height={32}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div
                    className={cn(
                      "rounded-md px-3 py-2 break-words",
                      msg.senderId === currentPlayer.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span 
                    className={cn(
                      "text-xs text-muted-foreground",
                      msg.senderId === currentPlayer.id ? "text-right" : "text-left"
                    )}
                  >
                    {formatTimestamp(msg.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Input area */}
      <form onSubmit={onSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={sending}>
          {sending ? "Sending..." : "Send"}
          {sending && <ClipLoader size={16} color="yellow" />}
        </Button>
      </form>
    </div>
  );
};

export default Chat;