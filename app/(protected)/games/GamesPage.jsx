"use client";
import { useEffect, useState } from "react";
import PvPGames from "./PvPGames";
import PvPAiGames from "./PvAIGames";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GamesPage = ({ userGames, userGamesWithAi }) => {
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
          <TabsTrigger value="player">Games with Players</TabsTrigger>
          <TabsTrigger value="ai">Games with AI</TabsTrigger>
        </TabsList>
        <TabsContent value="player">
          <PvPGames userGames={userGames} />
        </TabsContent>
        <TabsContent value="ai">
          <PvPAiGames userGamesWithAi={userGamesWithAi} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamesPage;
