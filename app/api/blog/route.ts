import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { getRandomImage } from "@/lib";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { name: "This route works in development mode only" },
      { status: 200 }
    );
  }

  try {
    const postsfolder = join(process.cwd(), `app/content/blog/${uuidv4()}.md`);
    const data = matter.stringify("# New Blog", {
      date: new Date().toISOString(),
      title: "New Blog",
      tagline: "Amazing New Blog",
      preview:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      image: getRandomImage(),
    });

    // Ensure app/content/blog directory exists
    const blogDir = join(process.cwd(), "app/content/blog");
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    fs.writeFileSync(postsfolder, data);
    return NextResponse.json({ status: "CREATED" }, { status: 200 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { name: "This route works in development mode only" },
      { status: 200 }
    );
  }

  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // Try app/content/blog first, fallback to old locations
    let deleteFile = join(process.cwd(), `app/content/blog/${slug}.md`);
    if (!fs.existsSync(deleteFile)) {
      deleteFile = join(process.cwd(), `content/blog/${slug}.md`);
    }
    if (!fs.existsSync(deleteFile)) {
      deleteFile = join(process.cwd(), `_posts/${slug}.md`);
    }

    if (!fs.existsSync(deleteFile)) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    fs.unlinkSync(deleteFile);
    return NextResponse.json({ status: "DONE" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

