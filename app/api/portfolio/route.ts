import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { createPortfolio } from "@/lib/portfolio-utils";

// Helper function to transform image URLs to use NEXT_PUBLIC_R2_PUBLIC_BASE
function transformImageUrls(images: string[]): string[] {
  const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE || process.env.R2_PUBLIC_URL || "";
  
  if (!r2BaseUrl) {
    return images;
  }

  const baseUrl = r2BaseUrl.replace(/\/$/, "");

  return images.map((imageUrl: string) => {
    // If URL is empty or invalid, return as is
    if (!imageUrl || typeof imageUrl !== "string") {
      return imageUrl;
    }

    // If URL already starts with the correct base URL, return as is
    if (imageUrl.startsWith(baseUrl)) {
      return imageUrl;
    }

    // If URL contains "aulia-bucket" or bucket name, extract the key and rebuild
    const bucketName = process.env.R2_BUCKET_NAME || "";
    if (imageUrl.includes("aulia-bucket") || (bucketName && imageUrl.includes(bucketName))) {
      // Extract the key path (everything after portfolio/ or dev/portfolio/)
      const portfolioMatch = imageUrl.match(/(?:dev\/)?portfolio\/.+/);
      if (portfolioMatch) {
        const key = portfolioMatch[0];
        return `${baseUrl}/${key}`;
      }
    }

    // If URL is relative (doesn't start with http/https), prepend base URL
    if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
      // Remove leading slash if present
      const cleanUrl = imageUrl.replace(/^\//, "");
      return `${baseUrl}/${cleanUrl}`;
    }

    // If URL starts with http/https but doesn't match our base, try to extract key
    // For URLs like https://aulia-bucket/portfolio/... or https://aulia-bucket/dev/portfolio/...
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split("/").filter(Boolean); // Remove empty strings
      const portfolioIndex = pathParts.indexOf("portfolio");
      if (portfolioIndex !== -1) {
        // Include "dev" prefix if it exists before "portfolio"
        const startIndex = portfolioIndex > 0 && pathParts[portfolioIndex - 1] === "dev" 
          ? portfolioIndex - 1 
          : portfolioIndex;
        const key = pathParts.slice(startIndex).join("/");
        return `${baseUrl}/${key}`;
      }
    } catch {
      // Invalid URL, return as is
    }

    return imageUrl;
  });
}

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
        include: {
          partner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      });

      // Transform image URLs to use NEXT_PUBLIC_R2_PUBLIC_BASE
      const transformedItems = portfolioItems.map((item) => ({
        ...item,
        images: transformImageUrls(item.images),
      }));

      return NextResponse.json({ portfolioItems: transformedItems }, { status: 200 });
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
      partnerId, // REQUIRED: every portfolio must have a partner
      datePublished,
      slug: providedSlug, // Slug can be provided (from generate-slug endpoint)
    } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!partnerId || typeof partnerId !== "string" || partnerId.trim().length === 0) {
      return NextResponse.json(
        { error: "Partner ID is required" },
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

    // Create portfolio using utility function (handles collaborationCount increment)
    const portfolioItem = await createPortfolio({
      title: title.trim(),
      slug,
      partnerId: partnerId.trim(),
      summary: summary?.trim() || null,
      images: Array.isArray(images) ? images : [],
      tags: Array.isArray(tags) ? tags : [],
      categories: Array.isArray(categories) ? categories : [],
      brands: Array.isArray(brands) ? brands : [],
      featured: featured === true,
      order: typeof order === "number" ? order : 0,
      datePublished: datePublished || null,
    });

    console.log("[PORTFOLIO API] Portfolio created:", {
      id: portfolioItem.id,
      slug: portfolioItem.slug,
      title: portfolioItem.title,
    });

    // Transform image URLs to use NEXT_PUBLIC_R2_PUBLIC_BASE
    const transformedItem = {
      ...portfolioItem,
      images: transformImageUrls(portfolioItem.images),
    };

    return NextResponse.json(transformedItem, { status: 201 });
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

