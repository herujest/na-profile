import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// GET /api/services - Get all services
export async function GET(req: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ services }, { status: 200 });
  } catch (error: any) {
    console.error("[SERVICES API] GET Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch services",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/services - Create new service
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, order } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Create service
    const service = await prisma.service.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        order: typeof order === "number" ? order : 0,
      },
    });

    console.log("[SERVICES API] Service created:", {
      id: service.id,
      title: service.title,
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    console.error("[SERVICES API] POST Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create service",
        details: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

