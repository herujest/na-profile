import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Clear session cookie
    const cookie = serialize("admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in /api/auth/logout:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

