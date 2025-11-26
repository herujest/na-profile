import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/partner-categories/[id] - Get single partner category
export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const category = await prisma.partnerCategory.findUnique({
      where: { id },
      include: {
        partners: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Partner category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error fetching partner category:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner category" },
      { status: 500 }
    );
  }
}

// PUT /api/partner-categories/[id] - Update partner category (admin only)
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
    const { name, slug, order } = body;

    const existing = await prisma.partnerCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Partner category not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim();
    if (order !== undefined) updateData.order = order;

    const category = await prisma.partnerCategory.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error: any) {
    console.error("Error updating partner category:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Category name or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update partner category" },
      { status: 500 }
    );
  }
}

// DELETE /api/partner-categories/[id] - Delete partner category (admin only)
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

    // Check if category has partners
    const category = await prisma.partnerCategory.findUnique({
      where: { id },
      include: {
        partners: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Partner category not found" },
        { status: 404 }
      );
    }

    if (category.partners.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category with existing partners",
          partnerCount: category.partners.length,
        },
        { status: 400 }
      );
    }

    await prisma.partnerCategory.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Partner category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting partner category:", error);
    return NextResponse.json(
      { error: "Failed to delete partner category" },
      { status: 500 }
    );
  }
}

