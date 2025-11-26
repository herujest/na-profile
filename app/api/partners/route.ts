import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// GET /api/partners - List all partners with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const categoryId = searchParams.get("categoryId");
    const rankId = searchParams.get("rankId");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const sort = searchParams.get("sort") || "internalRank";
    const order = searchParams.get("order") || "desc";
    const minCollaborations = searchParams.get("minCollaborations");
    const tags = searchParams.get("tags");

    const where: any = {};

    // Legacy category filter (for backward compatibility)
    if (category && category !== "All" && category !== "Others") {
      where.categoryLegacy = category as string;
    } else if (category === "Others") {
      const mainCategories = [
        "MUA",
        "Photographer",
        "Videographer",
        "Stylist",
        "Wardrobe",
      ];
      where.NOT = {
        categoryLegacy: {
          in: mainCategories,
        },
      };
    }

    // New categoryId filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Rank filter
    if (rankId) {
      where.rankId = rankId;
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    // Min collaborations filter
    if (minCollaborations) {
      where.collaborationCount = {
        gte: parseInt(minCollaborations),
      };
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim());
      where.tags = {
        hasSome: tagArray,
      };
    }

    // Build orderBy
    const orderBy: any[] = [];
    if (sort === "collaborationCount") {
      orderBy.push({ collaborationCount: order });
    } else if (sort === "manualScore") {
      orderBy.push({ manualScore: order });
    } else if (sort === "internalRank") {
      orderBy.push({ internalRank: order });
    } else if (sort === "createdAt") {
      orderBy.push({ createdAt: order });
    } else {
      orderBy.push({ internalRank: "desc" });
    }
    orderBy.push({ createdAt: "desc" });

    const skip = (page - 1) * limit;

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        include: {
          category: true,
          rank: true,
          socials: {
            orderBy: { order: "asc" },
          },
          _count: {
            select: {
              portfolios: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.partner.count({ where }),
    ]);

    return NextResponse.json(
      {
        partners,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}

// POST /api/partners - Create new partner (admin only)
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      tags = [],
      notes,
      collaborationCount = 0,
      manualScore = 0,
      rankId,
      socials = [], // Array of { platform, handle, url, order }
    } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Calculate internal rank
    const internalRank = collaborationCount * 0.5 + manualScore;

    // Create partner with socials in a transaction
    const partner = await prisma.$transaction(async (tx) => {
      const newPartner = await tx.partner.create({
        data: {
          name: name.trim(),
          categoryLegacy: category || null, // Legacy field
          categoryId: categoryId || null,
          description: description?.trim() || null,
          location: location?.trim() || null,
          whatsapp: whatsapp || null, // Legacy field
          instagram: instagram || null, // Legacy field
          email: email?.trim() || null,
          priceRange: priceRange?.trim() || null,
          portfolioUrl: portfolioUrl?.trim() || null,
          avatarUrl: avatarUrl?.trim() || null,
          tags: Array.isArray(tags) ? tags : [],
          notes: notes?.trim() || null,
          collaborationCount,
          manualScore,
          internalRank,
          rankId: rankId || null,
        },
      });

      // Create socials if provided
      if (Array.isArray(socials) && socials.length > 0) {
        await tx.partnerSocial.createMany({
          data: socials.map((social: any) => ({
            partnerId: newPartner.id,
            platform: social.platform?.trim() || "",
            handle: social.handle?.trim() || "",
            url: social.url?.trim() || null,
            order: typeof social.order === "number" ? social.order : 0,
          })),
        });
      }

      // Return partner with relations
      return await tx.partner.findUnique({
        where: { id: newPartner.id },
        include: {
          category: true,
          rank: true,
          socials: {
            orderBy: { order: "asc" },
          },
        },
      });
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error: any) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      {
        error: "Failed to create partner",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

