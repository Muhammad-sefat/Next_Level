import {
  CommnetStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "autherId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      autherId: userId,
    },
  });
  return result;
};

const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  autherId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  autherId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured,
    });
  }

  if (status) {
    andConditions.push({
      status,
    });
  }

  if (autherId) {
    andConditions.push({
      autherId,
    });
  }

  const whereClause = andConditions.length > 0 ? { AND: andConditions } : {};

  const allPost = await prisma.post.findMany({
    take: limit,
    skip,
    where: whereClause,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });
  const total = await prisma.post.count({
    where: whereClause,
  });
  return {
    data: allPost,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommnetStatus.APPROVED,
          },
          orderBy: { createdId: "desc" },
          include: {
            replies: {
              where: {
                status: CommnetStatus.APPROVED,
              },
              orderBy: { createdId: "asc" },
              include: {
                replies: {
                  where: {
                    status: CommnetStatus.APPROVED,
                  },
                  orderBy: { createdId: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return postData;
  });
};

const getMyPosts = async (autherId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: autherId,
      status: "active",
    },
    select: {
      id: true,
    },
  });

  const result = await prisma.post.findMany({
    where: {
      autherId,
    },
    orderBy: {
      createdId: "desc",
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  // const total = await prisma.post.aggregate({
  //     _count: {
  //         id: true
  //     },
  //     where: {
  //         authorId
  //     }
  // })

  return result;
};

const updatePost = async (
  postId: string,
  data: Partial<Post>,
  autherId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      autherId: true,
    },
  });

  if (isAdmin || postData.autherId !== autherId) {
    throw new Error("You are not authorized to update this post!");
  }
  if (!isAdmin) {
    delete data.isFeatured;
  }

  const result = await prisma.post.update({
    where: {
      id: postData.id,
    },
    data,
  });

  return result;
};

//*
// 1. user - nijar created post delete korta parbe
// 2. admin - sobar post delete korta parbe
// */

const deletePost = async (
  postId: string,
  autherId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      autherId: true,
    },
  });

  if (!isAdmin && postData.autherId !== autherId) {
    throw new Error("You are not the owner/creator of the post!");
  }

  return await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const getStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      publlishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComment,
      totalUsers,
      adminCount,
      userCount,
      totalViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
      await tx.post.count({ where: { status: PostStatus.DRAFT } }),
      await tx.post.count({ where: { status: PostStatus.ARCHEIVED } }),
      await tx.commnet.count(),
      await tx.commnet.count({ where: { status: CommnetStatus.APPROVED } }),
      await tx.user.count(),
      await tx.user.count({ where: { role: "ADMIN" } }),
      await tx.user.count({ where: { role: "USER" } }),
      await tx.post.aggregate({
        _sum: { views: true },
      }),
    ]);

    return {
      totalPosts,
      publlishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComment,
      totalUsers,
      adminCount,
      userCount,
      totalViews: totalViews._sum.views,
    };
  });
};

export const postService = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats,
};
