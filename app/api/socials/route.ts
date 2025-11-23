import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// GET /api/socials - Get all socials
export async function GET(req: NextRequest) {
  try {
    const socials = await prisma.social.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ socials }, { status: 200 });
  } catch (error: any) {
    console.error("[SOCIALS API] GET Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch socials",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/socials - Create new social
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, link, order } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!link || typeof link !== "string" || link.trim().length === 0) {
      return NextResponse.json(
        { error: "Link is required" },
        { status: 400 }
      );
    }

    // Create social
    const social = await prisma.social.create({
      data: {
        title: title.trim(),
        link: link.trim(),
        order: typeof order === "number" ? order : 0,
      },
    });

    console.log("[SOCIALS API] Social created:", {
      id: social.id,
      title: social.title,
    });

    return NextResponse.json(social, { status: 201 });
  } catch (error: any) {
    console.error("[SOCIALS API] POST Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create social",
        details: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

