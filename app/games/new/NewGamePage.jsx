"use client";
import { useEffect, useState } from "react";
import UserList from "./UserList";
import AIList from "./AiList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NewGamePage = ({ otherUsers, user, friends }) => {
  const [activeTab, setActiveTab] = useState("player");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === "ai" || hash === "player") {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <div>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full text-center"
      >
        <TabsList>
          <TabsTrigger value="player">Select an Opponent</TabsTrigger>
          <TabsTrigger value="ai">Play with AI</TabsTrigger>
        </TabsList>
        <TabsContent value="player">
          <UserList
            otherUsers={otherUsers}
            userId={user.id}
            friends={friends}
          />
        </TabsContent>
        <TabsContent value="ai">
          <AIList userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewGamePage;
