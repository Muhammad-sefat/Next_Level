import { CommnetStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  autherId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.commnet.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }
  return await prisma.commnet.create({
    data: payload,
  });
};

const getCommentById = async (id: string) => {
  return await prisma.commnet.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
};

const getCommentsByAuthor = async (autherId: string) => {
  return await prisma.commnet.findMany({
    where: {
      autherId,
    },
    orderBy: { createdId: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const deleteComment = async (commentId: string, autherId: string) => {
  const commentData = await prisma.commnet.findFirst({
    where: {
      id: commentId,
      autherId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid!");
  }

  return await prisma.commnet.delete({
    where: {
      id: commentData.id,
    },
  });
};

// authorId, commentId, updatedData
const updateComment = async (
  commentId: string,
  data: { content?: string; status?: CommnetStatus },
  autherId: string
) => {
  const commentData = await prisma.commnet.findFirst({
    where: {
      id: commentId,
      autherId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid!");
  }

  return await prisma.commnet.update({
    where: {
      id: commentId,
      autherId,
    },
    data,
  });
};

const moderateComment = async (id: string, data: { status: CommnetStatus }) => {
  const commentData = await prisma.commnet.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (commentData.status === data.status) {
    throw new Error(
      `Your provided status (${data.status}) is already up to date.`
    );
  }

  return await prisma.commnet.update({
    where: {
      id,
    },
    data,
  });
};

export const CommentService = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
  updateComment,
  moderateComment,
};
