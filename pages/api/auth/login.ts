import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "nisaaulia";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "thunderbolt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Check credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create session token (simple implementation, in production use JWT or session store)
      const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString("base64");
      
      // Set cookie with session token
      const cookie = serialize("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      res.setHeader("Set-Cookie", cookie);
      return res.status(200).json({ success: true, message: "Login successful" });
    }

    return res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    console.error("Error in /api/auth/login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

