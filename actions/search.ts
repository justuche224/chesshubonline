"use server";

import { db } from "@/lib/db";

export const searchUsers = async (search, user) => {
  //   console.log(user);
  //   console.log(search);
  try {
    const users = await db.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: user, // Exclude the user ID from the results
            },
          },
          {
            OR: [
              { firstname: { contains: search, mode: "insensitive" } },
              { lastname: { contains: search, mode: "insensitive" } },
              {
                AND: [
                  {
                    firstname: {
                      contains: search.split(" ")[0],
                      mode: "insensitive",
                    },
                  },
                  {
                    lastname: {
                      contains: search.split(" ")[1],
                      mode: "insensitive",
                    },
                  },
                ],
              },
              { username: { contains: search, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: {
        firstname: true,
        lastname: true,
        username: true,
        image: true,
      },
    });
    // console.log(users);
    return users;
  } catch (error) {
    // console.log(error);
    return null;
  }
};
