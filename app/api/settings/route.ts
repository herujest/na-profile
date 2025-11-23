import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// GET /api/settings - Get site settings
export async function GET(req: NextRequest) {
  try {
    // Try to get settings, if none exist, return defaults
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "default",
          name: "Nisa Aulia",
          headerTaglineOne: "Hello 👋",
          headerTaglineTwo: "I'm Nisa Aulia - Model",
          headerTaglineThree: "Muse and Makeup Aficionado",
          headerTaglineFour: " based in Jakarta, Indonesia.",
          showCursor: true,
          showBlog: true,
          darkMode: false,
          showResume: true,
        },
      });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error: any) {
    console.error("[SETTINGS API] GET Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch settings",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update site settings
export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      headerTaglineOne,
      headerTaglineTwo,
      headerTaglineThree,
      headerTaglineFour,
      showCursor,
      showBlog,
      darkMode,
      showResume,
    } = body;

    // Check if settings exist
    const existing = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    let settings;
    if (existing) {
      // Update existing settings
      settings = await prisma.siteSettings.update({
        where: { id: "default" },
        data: {
          ...(name !== undefined && { name: name.trim() }),
          ...(headerTaglineOne !== undefined && {
            headerTaglineOne: headerTaglineOne.trim(),
          }),
          ...(headerTaglineTwo !== undefined && {
            headerTaglineTwo: headerTaglineTwo.trim(),
          }),
          ...(headerTaglineThree !== undefined && {
            headerTaglineThree: headerTaglineThree.trim(),
          }),
          ...(headerTaglineFour !== undefined && {
            headerTaglineFour: headerTaglineFour.trim(),
          }),
          ...(showCursor !== undefined && { showCursor: showCursor === true }),
          ...(showBlog !== undefined && { showBlog: showBlog === true }),
          ...(darkMode !== undefined && { darkMode: darkMode === true }),
          ...(showResume !== undefined && { showResume: showResume === true }),
        },
      });
    } else {
      // Create new settings
      settings = await prisma.siteSettings.create({
        data: {
          id: "default",
          name: name?.trim() || "Nisa Aulia",
          headerTaglineOne: headerTaglineOne?.trim() || "",
          headerTaglineTwo: headerTaglineTwo?.trim() || "",
          headerTaglineThree: headerTaglineThree?.trim() || "",
          headerTaglineFour: headerTaglineFour?.trim() || "",
          showCursor: showCursor === true,
          showBlog: showBlog === true,
          darkMode: darkMode === true,
          showResume: showResume === true,
        },
      });
    }

    console.log("[SETTINGS API] Settings updated:", {
      id: settings.id,
      name: settings.name,
    });

    return NextResponse.json(settings, { status: 200 });
  } catch (error: any) {
    console.error("[SETTINGS API] PUT Error:", error);
    return NextResponse.json(
      {
        error: "Failed to update settings",
        details: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

