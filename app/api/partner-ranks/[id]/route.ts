import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/partner-ranks/[id] - Get single partner rank
export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const rank = await prisma.partnerRank.findUnique({
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

    if (!rank) {
      return NextResponse.json(
        { error: "Partner rank not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rank, { status: 200 });
  } catch (error) {
    console.error("Error fetching partner rank:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner rank" },
      { status: 500 }
    );
  }
}

// PUT /api/partner-ranks/[id] - Update partner rank (admin only)
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
    const { name, slug, description, weight, order } = body;

    const existing = await prisma.partnerRank.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Partner rank not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (weight !== undefined) updateData.weight = weight;
    if (order !== undefined) updateData.order = order;

    const rank = await prisma.partnerRank.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(rank, { status: 200 });
  } catch (error: any) {
    console.error("Error updating partner rank:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Rank name or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update partner rank" },
      { status: 500 }
    );
  }
}

// DELETE /api/partner-ranks/[id] - Delete partner rank (admin only)
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

    // Check if rank has partners
    const rank = await prisma.partnerRank.findUnique({
      where: { id },
      include: {
        partners: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!rank) {
      return NextResponse.json(
        { error: "Partner rank not found" },
        { status: 404 }
      );
    }

    if (rank.partners.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete rank with existing partners",
          partnerCount: rank.partners.length,
        },
        { status: 400 }
      );
    }

    await prisma.partnerRank.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Partner rank deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting partner rank:", error);
    return NextResponse.json(
      { error: "Failed to delete partner rank" },
      { status: 500 }
    );
  }
}

