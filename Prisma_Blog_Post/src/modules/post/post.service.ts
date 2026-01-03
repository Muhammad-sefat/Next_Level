import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdId" | "updatedId">
) => {
  const result = await prisma.post.create({ data });
  return result;
};

export const postService = {
  createPost,
};
