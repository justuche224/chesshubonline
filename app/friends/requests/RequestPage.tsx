"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  UserX,
  UserCheck,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  cancelSentFriendRequest,
} from "@/actions/manage-friend-request";
import { useRouter } from "next/navigation";

const RequestPage = ({ currentUser }) => {
  const [pendingActions, setPendingActions] = useState(new Set());
  const router = useRouter();

  const sentRequests = currentUser.sentRequests.filter(
    (request) => request.status === "PENDING"
  );
  const receivedRequests = currentUser.receivedRequests.filter(
    (request) => request.status === "PENDING"
  );

  const handleAcceptRequest = async (requestId) => {
    if (pendingActions.has(requestId)) return;

    try {
      setPendingActions((prev) => new Set([...prev, requestId]));
      const result = await acceptFriendRequest(requestId);

      if (result.success) {
        toast.success("Friend request accepted");
      } else {
        throw new Error("Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Error accepting friend request");
    } finally {
      setPendingActions((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (pendingActions.has(requestId)) return;

    try {
      setPendingActions((prev) => new Set([...prev, requestId]));
      const result = await rejectFriendRequest(requestId);

      if (result.success) {
        toast.success("Request rejected");
      } else {
        throw new Error("Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast.error("Error rejecting friend request");
    } finally {
      setPendingActions((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (pendingActions.has(requestId)) return;

    try {
      setPendingActions((prev) => new Set([...prev, requestId]));
      const result = await cancelSentFriendRequest(requestId);

      if (result.success) {
        toast.success("Request canceled");
      } else {
        throw new Error("Failed to cancel request");
      }
    } catch (error) {
      console.error("Error canceling friend request:", error);
      toast.error("Error canceling friend request");
    } finally {
      setPendingActions((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  const RequestCard = ({ request, type }) => (
    <Card key={request.id}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={
                  type === "sent"
                    ? request.receiver.image
                    : request.sender.image
                }
                alt="Profile picture"
              />
              <AvatarFallback>
                {type === "sent"
                  ? request.receiver.firstname[0] + request.receiver.lastname[0]
                  : request.sender.firstname[0] + request.sender.lastname[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {type === "sent"
                  ? `${request.receiver.firstname} ${request.receiver.lastname}`
                  : `${request.sender.firstname} ${request.sender.lastname}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                @
                {type === "sent"
                  ? request.receiver.username
                  : request.sender.username}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {type === "received" ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAcceptRequest(request.id)}
                        disabled={pendingActions.has(request.id)}
                      >
                        {pendingActions.has(request.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Accept Request</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={pendingActions.has(request.id)}
                      >
                        {pendingActions.has(request.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserX className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reject Request</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelRequest(request.id)}
                      disabled={pendingActions.has(request.id)}
                    >
                      {pendingActions.has(request.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserX className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cancel Request</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ type }) => (
    <div className="text-center py-12">
      <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No {type} requests</h3>
      <p className="text-muted-foreground">
        {type === "sent"
          ? "You haven't sent any friend requests yet"
          : "You don't have any pending friend requests"}
      </p>
    </div>
  );

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Friend Requests</h1>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">
            Received
            {receivedRequests.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {receivedRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent
            {sentRequests.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {sentRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedRequests.length > 0 ? (
            receivedRequests.map((request) => (
              <RequestCard key={request.id} request={request} type="received" />
            ))
          ) : (
            <EmptyState type="received" />
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentRequests.length > 0 ? (
            sentRequests.map((request) => (
              <RequestCard key={request.id} request={request} type="sent" />
            ))
          ) : (
            <EmptyState type="sent" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestPage;
