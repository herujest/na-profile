import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/partners - List all partners
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = {};
    if (category && category !== "All" && category !== "Others") {
      where.category = category as string;
    } else if (category === "Others") {
      // For "Others", we can filter categories that are not in the main list
      const mainCategories = [
        "MUA",
        "Photographer",
        "Videographer",
        "Stylist",
        "Wardrobe",
      ];
      where.NOT = {
        category: {
          in: mainCategories,
        },
      };
    }

    const partners = await prisma.partner.findMany({
      where,
      orderBy: [
        { internalRank: "desc" },
        { collaborationCount: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Return array (same format as Pages Router for compatibility)
    return NextResponse.json(partners, { status: 200 });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}

// POST /api/partners - Create new partner
export async function POST(req: NextRequest) {
  try {
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
      tags = [],
      notes,
      collaborationCount = 0,
      manualScore = 0,
    } = body;

    // Calculate internal rank
    const internalRank = collaborationCount * 0.5 + manualScore;

    const partner = await prisma.partner.create({
      data: {
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
        tags: tags || [],
        notes,
        collaborationCount,
        manualScore,
        internalRank,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 }
    );
  }
}

