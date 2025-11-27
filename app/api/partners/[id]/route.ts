import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

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
      include: {
        category: true,
        rank: true,
        socials: {
          orderBy: { order: "asc" },
        },
        portfolios: {
          select: {
            id: true,
            title: true,
            slug: true,
            summary: true,
            images: true,
            datePublished: true,
            createdAt: true,
          },
          orderBy: { datePublished: "desc" },
        },
        _count: {
          select: {
            portfolios: true,
          },
        },
      },
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

// PATCH /api/partners/[id] - Update partner (admin only)
export async function PATCH(
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
    const {
      name,
      category, // Legacy field
      categoryId,
      description,
      location,
      whatsapp, // Legacy field
      instagram, // Legacy field
      email,
      priceRange,
      portfolioUrl,
      avatarUrl,
      tags,
      notes,
      collaborationCount,
      manualScore,
      rankId,
      socials, // Array of { id?, platform, handle, url, order } - if provided, will replace all socials
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

    // Update partner and socials in transaction
    const partner = await prisma.$transaction(async (tx) => {
      // Prepare update data
      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (category !== undefined) updateData.categoryLegacy = category || null;
      if (categoryId !== undefined) updateData.categoryId = categoryId || null;
      if (description !== undefined) updateData.description = description?.trim() || null;
      if (location !== undefined) updateData.location = location?.trim() || null;
      if (whatsapp !== undefined) updateData.whatsapp = whatsapp || null;
      if (instagram !== undefined) updateData.instagram = instagram || null;
      if (email !== undefined) updateData.email = email?.trim() || null;
      if (priceRange !== undefined) updateData.priceRange = priceRange?.trim() || null;
      if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl?.trim() || null;
      if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl?.trim() || null;
      if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
      if (notes !== undefined) updateData.notes = notes?.trim() || null;
      if (collaborationCount !== undefined)
        updateData.collaborationCount = collaborationCount;
      if (manualScore !== undefined) updateData.manualScore = manualScore;
      if (rankId !== undefined) updateData.rankId = rankId || null;
      updateData.internalRank = internalRank;

      const updatedPartner = await tx.partner.update({
        where: { id },
        data: updateData,
      });

      // Update socials if provided
      if (Array.isArray(socials)) {
        // Delete existing socials
        await tx.partnerSocial.deleteMany({
          where: { partnerId: id },
        });

        // Create new socials
        if (socials.length > 0) {
          await tx.partnerSocial.createMany({
            data: socials.map((social: any) => ({
              partnerId: id,
              platform: social.platform?.trim() || "",
              handle: social.handle?.trim() || "",
              url: social.url?.trim() || null,
              order: typeof social.order === "number" ? social.order : 0,
            })),
          });
        }
      }

      // Return partner with relations
      return await tx.partner.findUnique({
        where: { id },
        include: {
          category: true,
          rank: true,
          socials: {
            orderBy: { order: "asc" },
          },
        },
      });
    });

    return NextResponse.json(partner, { status: 200 });
  } catch (error: any) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      {
        error: "Failed to update partner",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/partners/[id] - Delete partner (admin only)
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

    // Check if partner has portfolios
    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            portfolios: true,
          },
        },
      },
    });

    if (!partner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    if (partner._count.portfolios > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete partner with existing portfolios",
          portfolioCount: partner._count.portfolios,
        },
        { status: 400 }
      );
    }

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

