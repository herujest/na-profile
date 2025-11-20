import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/partners/[id] - Get single partner
export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const partner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(partner, { status: 200 });
  } catch (error) {
    console.error("Error fetching partner:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner" },
      { status: 500 }
    );
  }
}

// PATCH /api/partners/[id] - Update partner
export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      name,
      category,
      description,
      location,
      whatsapp,
      instagram,
      email,
      priceRange,
      portfolioUrl,
      avatarUrl,
      tags,
      notes,
      collaborationCount,
      manualScore,
    } = body;

    // Get existing partner to calculate new rank
    const existingPartner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!existingPartner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    // Calculate internal rank if collaborationCount or manualScore changed
    const newCollaborationCount =
      collaborationCount !== undefined
        ? collaborationCount
        : existingPartner.collaborationCount;
    const newManualScore =
      manualScore !== undefined ? manualScore : existingPartner.manualScore;
    const internalRank = newCollaborationCount * 0.5 + newManualScore;

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
    if (instagram !== undefined) updateData.instagram = instagram;
    if (email !== undefined) updateData.email = email;
    if (priceRange !== undefined) updateData.priceRange = priceRange;
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (tags !== undefined) updateData.tags = tags;
    if (notes !== undefined) updateData.notes = notes;
    if (collaborationCount !== undefined)
      updateData.collaborationCount = collaborationCount;
    if (manualScore !== undefined) updateData.manualScore = manualScore;
    updateData.internalRank = internalRank;

    const partner = await prisma.partner.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(partner, { status: 200 });
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { error: "Failed to update partner" },
      { status: 500 }
    );
  }
}

// DELETE /api/partners/[id] - Delete partner
export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await prisma.partner.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Partner deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json(
      { error: "Failed to delete partner" },
      { status: 500 }
    );
  }
}

