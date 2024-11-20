import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChatPage from "./ChatPage";

const page = async ({ params }) => {
  const { chatId } = params;
  const user = await currentUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch conversation with detailed user information
  const conversation = await db.conversation.findUnique({
    where: { id: chatId },
    include: {
      user1: true,
      user2: true,
      messages: {
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  // Check if user is part of the conversation
  if (
    !conversation ||
    (conversation.user1Id !== user.id && conversation.user2Id !== user.id)
  ) {
    return redirect("/conversations");
  }

  // Determine the other user in the conversation
  const otherUser =
    conversation.user1Id === user.id ? conversation.user2 : conversation.user1;

  return (
    <ChatPage otherUser={otherUser} conversation={conversation} user={user} />
  );
};

export default page;
