import { cookies } from "next/headers";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "nisaaulia";

/**
 * Check if user is authenticated (for App Router - Server Components)
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return false;
  }

  try {
    const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
    const [username] = decoded.split(":");

    return username === ADMIN_USERNAME;
  } catch (error) {
    return false;
  }
}

/**
 * Check if user is authenticated (for Pages Router API routes)
 */
export function isAuthenticatedPages(req: { cookies?: { admin_session?: string } }): boolean {
  const sessionToken = req.cookies?.admin_session;

  if (!sessionToken) {
    return false;
  }

  try {
    const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
    const [username] = decoded.split(":");

    return username === ADMIN_USERNAME;
  } catch (error) {
    return false;
  }
}

/**
 * Require authentication for Pages Router API routes
 */
export function requireAuth(req: { cookies?: { admin_session?: string } }, res: any): boolean {
  if (!isAuthenticatedPages(req)) {
    if (!res.headersSent) {
      res.status(401).json({ error: "Unauthorized" });
    }
    return false;
  }
  return true;
}
