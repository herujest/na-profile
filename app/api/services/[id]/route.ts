import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/services/[id] - Get single service
export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service, { status: 200 });
  } catch (error: any) {
    console.error("[SERVICES API] GET Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch service",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Update service
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
    const { title, description, order } = body;

    // Check if service exists
    const existing = await prisma.service.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Update service
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(order !== undefined && {
          order: typeof order === "number" ? order : 0,
        }),
      },
    });

    console.log("[SERVICES API] Service updated:", {
      id: service.id,
      title: service.title,
    });

    return NextResponse.json(service, { status: 200 });
  } catch (error: any) {
    console.error("[SERVICES API] PUT Error:", error);
    return NextResponse.json(
      {
        error: "Failed to update service",
        details: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Delete service
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

    // Check if service exists
    const existing = await prisma.service.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Delete service
    await prisma.service.delete({
      where: { id },
    });

    console.log("[SERVICES API] Service deleted:", {
      id,
      title: existing.title,
    });

    return NextResponse.json(
      { success: true, message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[SERVICES API] DELETE Error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete service",
        details: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

