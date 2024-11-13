// "use server";

// import { db } from "@/lib/db";

// export const getComments = async (postId) => {
//   console.log(postId);
//   try {
//     const comments = await db.comment.findMany({
//       where: {
//         postId,
//         isTop: true, //fetch only top level comments
//       },
//       include: {
//         replies: {
//           select: {
//             content: true,
//             id: true,
//             createdAt: true,
//             replies: {
//               select: {
//                 content: true,
//                 id: true,
//                 createdAt: true,
//                 replies: true,
//                 user: {
//                   select: {
//                     id: true,
//                     image: true,
//                     firstname: true,
//                     lastname: true,
//                     username: true,
//                     email: true,
//                   },
//                 },
//               },
//             },
//             user: {
//               select: {
//                 id: true,
//                 image: true,
//                 firstname: true,
//                 lastname: true,
//                 username: true,
//                 email: true,
//               },
//             },
//           },
//         },
//         user: {
//           select: {
//             id: true,
//             image: true,
//             firstname: true,
//             lastname: true,
//             username: true,
//             email: true,
//           },
//         },
//       },
//     });
//     // console.log(comments);
//     return comments;
//   } catch (error) {
//     console.log(error, "getComments");
//   }
// };

"use server";

import { db } from "@/lib/db";

const getTopLevelComments = async (postId: string) => {
  return await db.comment.findMany({
    where: {
      postId,
      isTop: true,
    },
    include: {
      user: {
        select: {
          id: true,
          image: true,
          firstname: true,
          lastname: true,
          username: true,
          email: true,
        },
      },
    },
  });
};

const fetchRepliesRecursively = async (commentId: string) => {
  const replies = await db.comment.findMany({
    where: {
      parentId: commentId,
    },
    include: {
      user: {
        select: {
          id: true,
          image: true,
          firstname: true,
          lastname: true,
          username: true,
          email: true,
        },
      },
    },
  });

  for (const reply of replies) {
    reply.replies = await fetchRepliesRecursively(reply.id);
  }

  return replies;
};

export const getComments = async (postId: string) => {
  try {
    const topLevelComments = await getTopLevelComments(postId);

    for (const comment of topLevelComments) {
      comment.replies = await fetchRepliesRecursively(comment.id);
    }

    return topLevelComments;
  } catch (error) {
    console.log(error, "getComments");
  }
};
