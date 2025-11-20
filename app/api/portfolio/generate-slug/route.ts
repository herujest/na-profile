import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

// Generate secure slug from UUID
function generateSecureSlug(): string {
  try {
    return uuidv4().replace(/-/g, "");
  } catch (error) {
    console.error("[PORTFOLIO API] Error generating UUID:", error);
    return `portfolio_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}`;
  }
}

// POST /api/portfolio/generate-slug - Generate unique slug
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate unique slug
    let slug = generateSecureSlug();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const existing = await prisma.portfolio.findUnique({
        where: { slug },
      });

      if (!existing) {
        break; // Slug is unique
      }

      slug = generateSecureSlug();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: "Failed to generate unique slug" },
        { status: 500 }
      );
    }

    return NextResponse.json({ slug }, { status: 200 });
  } catch (error: any) {
    console.error("[PORTFOLIO API] Generate Slug Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate slug",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

