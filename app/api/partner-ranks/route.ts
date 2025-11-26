import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// GET /api/partner-ranks - List all partner ranks
export async function GET(req: NextRequest) {
  try {
    const ranks = await prisma.partnerRank.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(ranks, { status: 200 });
  } catch (error) {
    console.error("Error fetching partner ranks:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner ranks" },
      { status: 500 }
    );
  }
}

// POST /api/partner-ranks - Create new partner rank (admin only)
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, weight = 0, order = 0 } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name if not provided
    const rankSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // Check if slug already exists
    const existing = await prisma.partnerRank.findUnique({
      where: { slug: rankSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const rank = await prisma.partnerRank.create({
      data: {
        name: name.trim(),
        slug: rankSlug,
        description: description?.trim() || null,
        weight: typeof weight === "number" ? weight : 0,
        order: typeof order === "number" ? order : 0,
      },
    });

    return NextResponse.json(rank, { status: 201 });
  } catch (error: any) {
    console.error("Error creating partner rank:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Rank name or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create partner rank" },
      { status: 500 }
    );
  }
}

