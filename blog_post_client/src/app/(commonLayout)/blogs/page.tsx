import BlogCard from "@/components/modules/blogs/BlogCard";
import { blogService } from "@/services/blog.service";
import { BlogPost } from "@/types";

const BlogPage = async () => {
  const { data } = await blogService.getBlogPosts(
    {
      isFeatured: false,
    },
    {
      cache: "no-store",
    },
  );

  return (
    <div className="grid grid-cols-3 max-w-7xl mx-auto px-6 py-8 gap-6">
      {data?.data?.map((post: BlogPost) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogPage;
