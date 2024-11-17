"use client";

import React, { useState } from "react";
import { Users2, Users, Search, UserPlus2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const FriendsPage = ({ friends }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredFriends = friends.filter(
    (friend) =>
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.lastname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Users2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Friends</h1>
          <span className="text-sm text-muted-foreground ml-2">
            ({friends.length})
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.push("/friends/requests")}
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline-block"> View Requests</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.push("/friends/new")}
          >
            <UserPlus2 className="h-4 w-4" />
            <span className="hidden sm:inline-block"> Add Friend</span>
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search friends..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Friends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFriends.map((friend) => (
          <Card key={friend.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={friend.image} alt={friend.username} />
                  <AvatarFallback className="bg-primary/10">
                    {friend.firstname[0]}
                    {friend.lastname[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {friend.firstname} {friend.lastname}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    @{friend.username}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => router.push(`/profile/${friend.username}`)}
                >
                  Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredFriends.length === 0 && (
        <div className="text-center py-12">
          <Users2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No friends found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Start adding friends to see them here"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
