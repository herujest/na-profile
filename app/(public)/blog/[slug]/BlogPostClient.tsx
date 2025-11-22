"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ContentSection from "@/components/ContentSection";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { stagger } from "@/animations";
import Button from "@/components/Button";
import BlogEditor from "@/components/BlogEditor";

interface BlogPost {
  date: string;
  slug: string;
  preview: string;
  title: string;
  tagline: string;
  image: string;
  content: string;
}

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const textOne = useRef<HTMLHeadingElement>(null);
  const textTwo = useRef<HTMLHeadingElement>(null);
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    if (textOne.current && textTwo.current) {
      stagger([textOne.current, textTwo.current], { y: 30 }, { y: 0 });
    }
  }, []);

  return (
    <div className="mt-10 flex flex-col">
      <img
        className="w-full h-96 rounded-lg shadow-lg object-cover"
        src={post.image}
        alt={post.title}
      />
      <h1
        ref={textOne}
        className="mt-10 text-4xl mob:text-2xl laptop:text-6xl text-bold"
      >
        {post.title}
      </h1>
      <h2
        ref={textTwo}
        className="mt-2 text-xl max-w-4xl text-darkgray opacity-50"
      >
        {post.tagline}
      </h2>
      <ContentSection content={post.content} />
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => setShowEditor(true)} type={"primary"}>
            Edit this blog
          </Button>
        </div>
      )}

      {showEditor && (
        <BlogEditor
          post={post}
          close={() => setShowEditor(false)}
          refresh={() => router.refresh()}
        />
      )}
    </div>
  );
}

