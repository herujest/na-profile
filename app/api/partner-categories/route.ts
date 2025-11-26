import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// GET /api/partner-categories - List all partner categories (public/admin)
export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.partnerCategory.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching partner categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner categories" },
      { status: 500 }
    );
  }
}

// POST /api/partner-categories - Create new partner category (admin only)
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, order = 0 } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name if not provided
    const categorySlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // Check if slug already exists
    const existing = await prisma.partnerCategory.findUnique({
      where: { slug: categorySlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.partnerCategory.create({
      data: {
        name: name.trim(),
        slug: categorySlug,
        order: typeof order === "number" ? order : 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("Error creating partner category:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Category name or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create partner category" },
      { status: 500 }
    );
  }
}

