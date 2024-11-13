import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import UserList from "./UserList";
import AIList from "./AiList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = async () => {
  const user = await currentUser();

  if (!user) {
    return (
      <div>
        <h1>Please login</h1>
      </div>
    );
  }
  const allUsers = await db.user.findMany();

  // Filter out the current user
  const otherUsers = allUsers.filter((u) => u.id !== user?.id);

  return (
    <div>
      <Tabs defaultValue="player" className="w-full text-center">
        <TabsList>
          <TabsTrigger value="player">Select an Opponent</TabsTrigger>
          <TabsTrigger value="ai">Play with AI</TabsTrigger>
        </TabsList>
        <TabsContent value="player">
          <UserList otherUsers={otherUsers} userId={user.id} />
        </TabsContent>
        <TabsContent value="ai">
          <AIList userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
