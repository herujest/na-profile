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

// GET /api/portfolio - List all portfolios
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const admin = searchParams.get("admin");

    // If admin=true, return full portfolio configuration including socials, services, etc.
    if (admin === "true") {
      // Read portfolio.json for full configuration
      const fs = require("fs");
      const path = require("path");
      const portfolioDataPath = path.join(process.cwd(), "lib/data/portfolio.json");
      
      try {
        // Try to read portfolio.json
        if (fs.existsSync(portfolioDataPath)) {
          const fileContent = fs.readFileSync(portfolioDataPath, "utf8");
          const portfolioData = JSON.parse(fileContent);
          return NextResponse.json(portfolioData, { status: 200 });
        }
      } catch (error) {
        console.error("[PORTFOLIO API] Error reading portfolio.json:", error);
      }

      // Fallback: return structure with empty arrays if file doesn't exist
      return NextResponse.json(
        {
          socials: [],
          services: [],
          name: "",
          headerTaglineOne: "",
          headerTaglineTwo: "",
          headerTaglineThree: "",
          showCursor: false,
          showBlog: false,
          darkMode: false,
          showResume: false,
          aboutpara: "",
          resume: {
            tagline: "",
            description: "",
            languages: [],
            frameworks: [],
            others: [],
            experiences: [],
          },
        },
        { status: 200 }
      );
    }

    const where: any = {};
    if (featured === "true") {
      where.featured = true;
    }

    try {
      const portfolioItems = await prisma.portfolio.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      });

      return NextResponse.json({ portfolioItems }, { status: 200 });
    } catch (dbError: any) {
      console.error("[PORTFOLIO API] Database error:", dbError);
      // Return empty array if database error (e.g., table doesn't exist)
      return NextResponse.json({ portfolioItems: [] }, { status: 200 });
    }
  } catch (error: any) {
    console.error("[PORTFOLIO API] GET Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch portfolios",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/portfolio - Create new portfolio
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      slug: providedSlug, // Slug can be provided (from generate-slug endpoint)
    } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Use provided slug or generate new one
    let slug: string;
    if (
      providedSlug &&
      typeof providedSlug === "string" &&
      providedSlug.trim().length > 0
    ) {
      // Validate that provided slug is unique
      const existing = await prisma.portfolio.findUnique({
        where: { slug: providedSlug },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }

      slug = providedSlug.trim();
    } else {
      // Generate unique slug
      slug = generateSecureSlug();
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
    }

    // Create portfolio
    const portfolioItem = await prisma.portfolio.create({
      data: {
        title: title.trim(),
        slug,
        summary: summary?.trim() || null,
        images: Array.isArray(images) ? images : [],
        tags: Array.isArray(tags) ? tags : [],
        categories: Array.isArray(categories) ? categories : [],
        brands: Array.isArray(brands) ? brands : [],
        featured: featured === true,
        order: typeof order === "number" ? order : 0,
      },
    });

    console.log("[PORTFOLIO API] Portfolio created:", {
      id: portfolioItem.id,
      slug: portfolioItem.slug,
      title: portfolioItem.title,
    });

    return NextResponse.json(portfolioItem, { status: 201 });
  } catch (error: any) {
    console.error("[PORTFOLIO API] POST Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create portfolio",
        details: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

