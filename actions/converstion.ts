"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const createConversation = async (data) => {
  const { otherUserId, isGroup, members, name } = data;

  try {
    const user = await currentUser();

    if (!user?.id || !user?.email) {
      return { error: "Unauthorised" };
    }
    if (!isGroup && !otherUserId) {
      return { error: "Cinversation must be a group or have a another user!" };
    }
    if (isGroup && (!members || members.length < 2 || !name)) {
      return { error: "Group must have atleast 3 members and a name!" };
    }

    if (isGroup) {
      const newConversation = await db.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member) => ({
                id: member.value,
              })),
              {
                id: user.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
      console.log(newConversation);
      return newConversation;
    }

    const existingConversation = await db.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [user.id, otherUserId],
            },
          },
          {
            userIds: {
              equals: [otherUserId, user.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversation[0];

    if (singleConversation) {
      console.log(singleConversation);
      return singleConversation;
    }
    const newConversation = await db.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: user.id,
            },
            {
              id: otherUserId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });
    console.log(newConversation);

    return newConversation;
  } catch (error) {
    console.log(error);
    return { error: "Sommething went wrong!" };
  }
};
