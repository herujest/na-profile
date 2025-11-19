import { NextApiRequest, NextApiResponse } from "next";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "nisaaulia";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sessionToken = req.cookies?.admin_session;

    if (!sessionToken) {
      return res.status(200).json({ authenticated: false });
    }

    try {
      // Decode session token
      const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
      const [username] = decoded.split(":");

      // Verify username matches admin
      if (username === ADMIN_USERNAME) {
        return res.status(200).json({ authenticated: true, username });
      }
    } catch (error) {
      // Invalid token format
      console.error("Error decoding session token:", error);
    }

    return res.status(200).json({ authenticated: false });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

