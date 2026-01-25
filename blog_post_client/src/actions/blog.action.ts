"use server";

import { BlogData, blogService } from "@/services/blog.service";
import { revalidateTag } from "next/cache";

export const createBlogPost = async (data: BlogData) => {
  const res = await blogService.createBlogPost(data);
  revalidateTag("layout", "blogPosts");
  return res;
};
