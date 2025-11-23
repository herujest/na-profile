import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/socials/[id] - Get single social
export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const social = await prisma.social.findUnique({
      where: { id },
    });

    if (!social) {
      return NextResponse.json(
        { error: "Social not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(social, { status: 200 });
  } catch (error: any) {
    console.error("[SOCIALS API] GET Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch social",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/socials/[id] - Update social
export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, link, order } = body;

    // Check if social exists
    const existing = await prisma.social.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Social not found" },
        { status: 404 }
      );
    }

    // Validation
    if (title !== undefined && (!title || typeof title !== "string" || title.trim().length === 0)) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (link !== undefined && (!link || typeof link !== "string" || link.trim().length === 0)) {
      return NextResponse.json(
        { error: "Link is required" },
        { status: 400 }
      );
    }

    // Update social
    const social = await prisma.social.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(link !== undefined && { link: link.trim() }),
        ...(order !== undefined && {
          order: typeof order === "number" ? order : 0,
        }),
      },
    });

    console.log("[SOCIALS API] Social updated:", {
      id: social.id,
      title: social.title,
    });

    return NextResponse.json(social, { status: 200 });
  } catch (error: any) {
    console.error("[SOCIALS API] PUT Error:", error);
    return NextResponse.json(
      {
        error: "Failed to update social",
        details: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/socials/[id] - Delete social
export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if social exists
    const existing = await prisma.social.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Social not found" },
        { status: 404 }
      );
    }

    // Delete social
    await prisma.social.delete({
      where: { id },
    });

    console.log("[SOCIALS API] Social deleted:", {
      id,
      title: existing.title,
    });

    return NextResponse.json(
      { success: true, message: "Social deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[SOCIALS API] DELETE Error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete social",
        details: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

