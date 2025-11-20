// utils / auth.ts;
import { NextApiRequest } from "next";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "nisaaulia";

export function isAuthenticated(req: NextApiRequest): boolean {
  const sessionToken = req.cookies.admin_session;

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

export function requireAuth(req: NextApiRequest, res: any): boolean {
  if (!isAuthenticated(req)) {
    if (!res.headersSent) {
      res.status(401).json({ error: "Unauthorized" });
    }
    return false;
  }
  return true;
}
