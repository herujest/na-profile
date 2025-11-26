import { getPostBySlug, getAllPosts } from "@/lib/api";
import type { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";

export const dynamic = 'error';

interface BlogPost {
  date: string;
  slug: string;
  preview: string;
  title: string;
  tagline: string;
  image: string;
  content: string;
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Server component for data fetching
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, [
    "date",
    "slug",
    "preview",
    "title",
    "tagline",
    "preview",
    "image",
    "content",
  ]) as BlogPost;

  return <BlogPostClient post={post} />;
}

// Generate static params for SSG
export async function generateStaticParams() {
  const posts = getAllPosts(["slug"]);

  return posts.map((post: Record<string, any>) => ({
    slug: post.slug as string,
  }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, ["title", "preview", "image"]);

  return {
    title: post.title as string,
    description: post.preview as string,
    openGraph: {
      title: post.title as string,
      description: post.preview as string,
      images: post.image ? [{ url: post.image as string }] : [],
    },
  };
}
