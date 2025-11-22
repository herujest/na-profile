"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { stagger } from "@/animations";
import Button from "@/components/Button";
import data from "@/lib/data/portfolio.json";
import { ISOToDate } from "@/lib";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";

interface BlogPost {
  slug: string;
  title: string;
  image: string;
  preview: string;
  author?: string;
  date: string;
}

interface BlogClientProps {
  posts: BlogPost[];
}

// Client component for blog list
export default function BlogClient({ posts }: BlogClientProps) {
  const showBlog = useRef(data.showBlog);
  const text = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    if (text.current) {
      stagger(
        [text.current],
        { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
        { y: 0, x: 0, transform: "scale(1)" }
      );
      if (showBlog.current) {
        stagger([text.current], { y: 30 }, { y: 0 });
      } else {
        router.push("/");
      }
    }
  }, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const createBlog = async () => {
    if (process.env.NODE_ENV === "development") {
      try {
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          router.refresh();
        } else {
          alert("Failed to create blog post");
        }
      } catch (error) {
        console.error("Error creating blog:", error);
        alert("Failed to create blog post");
      }
    } else {
      alert("This thing only works in development mode.");
    }
  };

  const deleteBlog = async (slug: string) => {
    if (process.env.NODE_ENV === "development") {
      try {
        const res = await fetch("/api/blog", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
          }),
        });
        if (res.ok) {
          router.refresh();
        } else {
          alert("Failed to delete blog post");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog post");
      }
    } else {
      alert("This thing only works in development mode.");
    }
  };

  return (
    showBlog.current && (
      <>
        <div className="mt-10 mb-10">
          <h1
            ref={text}
            className="mx-auto mob:p-2 text-bold text-6xl laptop:text-8xl w-full"
          >
            Blog.
          </h1>
          <div className="mt-10 grid grid-cols-1 mob:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 justify-between gap-10">
            {posts &&
              posts.map((post) => (
                <div
                  className="cursor-pointer relative"
                  key={post.slug}
                  onClick={() => router.push(`/blog/${post.slug}`)}
                >
                  <img
                    className="w-full h-60 rounded-lg shadow-lg object-cover"
                    src={post.image}
                    alt={post.title}
                  />
                  <h2 className="mt-5 text-4xl">{post.title}</h2>
                  <p className="mt-2 opacity-50 text-lg">{post.preview}</p>
                  <span className="text-sm mt-5 opacity-25">
                    {ISOToDate(post.date)}
                  </span>
                  {process.env.NODE_ENV === "development" && mounted && (
                    <div
                      className="absolute top-0 right-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        onClick={() => {
                          deleteBlog(post.slug);
                        }}
                        type={"primary"}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
        {process.env.NODE_ENV === "development" && mounted && (
          <div className="fixed bottom-6 right-6">
            <Button onClick={createBlog} type={"primary"}>
              Add New Post +{" "}
            </Button>
          </div>
        )}
      </>
    )
  );
}

