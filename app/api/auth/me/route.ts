import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "nisaaulia";

// Mark as dynamic since we use cookies
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    try {
      // Decode session token
      const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
      const [username] = decoded.split(":");

      // Verify username matches admin
      if (username === ADMIN_USERNAME) {
        return NextResponse.json(
          { authenticated: true, username },
          { status: 200 }
        );
      }
    } catch (error) {
      // Invalid token format
      console.error("Error decoding session token:", error);
    }

    return NextResponse.json({ authenticated: false }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

