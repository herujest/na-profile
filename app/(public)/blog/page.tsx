import BlogClient from "./BlogClient";
import { getAllPosts } from "@/lib/api";

export const dynamic = 'error';

interface BlogPost {
  slug: string;
  title: string;
  image: string;
  preview: string;
  author?: string;
  date: string;
}

// Server component for data fetching
export default async function BlogPage() {
  const posts = getAllPosts([
    "slug",
    "title",
    "image",
    "preview",
    "author",
    "date",
  ]) as BlogPost[];

  return <BlogClient posts={posts} />;
}
