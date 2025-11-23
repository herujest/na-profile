import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

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

    // Transform image URLs to use NEXT_PUBLIC_R2_PUBLIC_BASE
    const transformedItem = {
      ...portfolioItem,
      images: transformImageUrls(portfolioItem.images),
    };

    return NextResponse.json(transformedItem, { status: 200 });
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

    // Transform image URLs to use NEXT_PUBLIC_R2_PUBLIC_BASE
    const transformedItem = {
      ...portfolioItem,
      images: transformImageUrls(portfolioItem.images),
    };

    return NextResponse.json(transformedItem, { status: 200 });
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

