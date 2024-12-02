import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import RequestPage from "./RequestPage";

const page = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const currentUserData = await db.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      sentRequests: {
        include: {
          receiver: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              username: true,
              image: true,
            },
          },
        },
      },
      receivedRequests: {
        include: {
          sender: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return <RequestPage currentUser={currentUserData} />;
};

export default page;
