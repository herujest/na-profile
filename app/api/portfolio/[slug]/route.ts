import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET /api/portfolio/[slug] - Get single portfolio
export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;

    const portfolioItem = await prisma.portfolio.findUnique({
      where: { slug },
    });

    if (!portfolioItem) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(portfolioItem, { status: 200 });
  } catch (error: any) {
    console.error("[PORTFOLIO API] GET Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch portfolio",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/portfolio/[slug] - Update portfolio
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

    const { slug } = await params;
    const body = await req.json();
    const {
      title,
      summary,
      images,
      tags,
      categories,
      brands,
      featured,
      order,
    } = body;

    // Check if portfolio exists
    const existing = await prisma.portfolio.findUnique({
      where: { slug },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Update portfolio
    const portfolioItem = await prisma.portfolio.update({
      where: { slug },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(summary !== undefined && {
          summary: summary?.trim() || null,
        }),
        ...(images !== undefined && {
          images: Array.isArray(images) ? images : [],
        }),
        ...(tags !== undefined && {
          tags: Array.isArray(tags) ? tags : [],
        }),
        ...(categories !== undefined && {
          categories: Array.isArray(categories) ? categories : [],
        }),
        ...(brands !== undefined && {
          brands: Array.isArray(brands) ? brands : [],
        }),
        ...(featured !== undefined && { featured: featured === true }),
        ...(order !== undefined && {
          order: typeof order === "number" ? order : 0,
        }),
      },
    });

    console.log("[PORTFOLIO API] Portfolio updated:", {
      id: portfolioItem.id,
      slug: portfolioItem.slug,
      title: portfolioItem.title,
    });

    return NextResponse.json(portfolioItem, { status: 200 });
  } catch (error: any) {
    console.error("[PORTFOLIO API] PUT Error:", error);
    return NextResponse.json(
      {
        error: "Failed to update portfolio",
        details: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/portfolio/[slug] - Delete portfolio
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

    const { slug } = await params;

    // Check if portfolio exists
    const existing = await prisma.portfolio.findUnique({
      where: { slug },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Delete portfolio
    await prisma.portfolio.delete({
      where: { slug },
    });

    console.log("[PORTFOLIO API] Portfolio deleted:", {
      slug,
      title: existing.title,
    });

    return NextResponse.json(
      { success: true, message: "Portfolio deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[PORTFOLIO API] DELETE Error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete portfolio",
        details: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

