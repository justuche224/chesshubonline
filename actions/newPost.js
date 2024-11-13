"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const newPost = async (props) => {
  console.log(props);
  try {
    const user = await currentUser();

    if (!user.email || !user.id) {
      return { error: "Unauthorized!" };
    }

    const newPost = await db.post.create({
      data: {
        content: props.content,
        image: props.image,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            username: true,
            email: true,
          },
        },
      },
    });

    console.log(newPost);

    return { success: "Post created!", data: newPost };
  } catch (error) {
    console.log();
    return { error: "server error!" };
  }
};
