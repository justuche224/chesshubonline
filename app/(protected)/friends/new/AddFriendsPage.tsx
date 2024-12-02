"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users2, Search, UserPlus, Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { searchUsers } from "@/actions/search-user";
import { useDebounce } from "@/hooks/use-debounce";
import { addFriend } from "@/actions/add-friend";
import { toast } from "sonner";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [pendingRequests, setPendingRequests] = React.useState(new Set());
  const searchQuery = searchParams.get("s") || "";

  const debouncedSearch = useDebounce(async (query) => {
    if (!query) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    const { users: searchResults, error } = await searchUsers(query);
    console.log(error);
    setUsers(searchResults || []);
    setIsLoading(false);
  }, 300);

  React.useEffect(() => {
    debouncedSearch(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearch = (e) => {
    const query = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set("s", query);
    } else {
      params.delete("s");
    }

    router.replace(`/friends/new?${params.toString()}`);
  };

  const handleAddFriend = async (userId) => {
    // Prevent duplicate requests
    if (pendingRequests.has(userId)) return;

    setPendingRequests((prev) => new Set([...prev, userId]));
    const result = await addFriend(userId);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast(result.success);
      // Update the UI to show pending state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, hasPendingRequest: true } : user
        )
      );
    }

    setPendingRequests((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Users2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold">Find Friends</h1>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6 sm:mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, username, or email..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Results */}
      <div className="space-y-3 sm:space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarImage src={user.image} alt={user.username} />
                      <AvatarFallback className="bg-primary/10">
                        {user.firstname[0]}
                        {user.lastname[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {user.firstname} {user.lastname}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => router.push(`/profile/${user.username}`)}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant={user.hasPendingRequest ? "secondary" : "default"}
                      size="sm"
                      className="flex-1 sm:flex-none"
                      disabled={
                        user.hasPendingRequest || pendingRequests.has(user.id)
                      }
                      onClick={() => handleAddFriend(user.id)}
                    >
                      {pendingRequests.has(user.id) ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4 mr-2" />
                      )}
                      {user.hasPendingRequest ? "Pending" : "Add Friend"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : searchQuery ? (
          <div className="text-center py-8 sm:py-12">
            <Users2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-lg font-semibold mb-2">Search for friends</h3>
            <p className="text-muted-foreground">
              Search by name, username, or email address
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
