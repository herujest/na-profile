import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { name: "This route works in development mode only" },
      { status: 200 }
    );
  }

  try {
    const body = await req.json();
    const { slug, content, variables } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const { date, title, tagline, preview, image } = variables;

    // Try app/content/blog first, fallback to old locations
    let postsfolder = join(process.cwd(), `app/content/blog/`);
    if (!fs.existsSync(postsfolder)) {
      postsfolder = join(process.cwd(), `content/blog/`);
    }
    if (!fs.existsSync(postsfolder)) {
      postsfolder = join(process.cwd(), `_posts/`);
    }

    // Ensure directory exists
    if (!fs.existsSync(postsfolder)) {
      fs.mkdirSync(postsfolder, { recursive: true });
    }

    const filePath = join(postsfolder, `${slug}.md`);

    fs.writeFileSync(
      filePath,
      matter.stringify(content || "", {
        date,
        title,
        tagline,
        preview,
        image,
      }),
      "utf-8"
    );

    return NextResponse.json({ status: "DONE" }, { status: 200 });
  } catch (error) {
    console.error("Error editing blog post:", error);
    return NextResponse.json(
      { error: "Failed to edit blog post" },
      { status: 500 }
    );
  }
}

