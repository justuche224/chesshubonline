import { db } from "@/lib/db";
import Profile from "./Profile";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

const page = async ({ params }) => {
  const currentUserData = await currentUser();

  if (!currentUserData) {
    return (
      <div>
        <h1>Please login</h1>
      </div>
    );
  }

  const { username } = await params;
  if (currentUserData.username === username) {
    redirect("/profile");
  }

  // Get viewed user's data
  const viewedUser = await db.user.findUnique({
    where: { username },
    include: {
      gamesAsWhitePlayer: true,
      gamesAsBlackPlayer: true,
      gamesWithAi: true,
    },
  });

  if (!viewedUser) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-gray-500">
          The user you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    );
  }

  // Get current user's data with friend relationships
  const currentUserInfor = await db.user.findUnique({
    where: { id: currentUserData.id },
    include: {
      friends1: true,
      friends2: true,
      sentRequests: {
        where: {
          receiverId: viewedUser.id,
        },
      },
    },
  });

  return <Profile user={viewedUser} currentUser={currentUserInfor} />;
};

export default page;
