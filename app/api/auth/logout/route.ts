import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Mark as dynamic since we use cookies
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Clear session cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/auth/logout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

