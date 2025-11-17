// pages/api/portfolio/list-files.ts
import { listR2Files } from "../../../utils/s3Config";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API /api/list-files was called");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) {
      return res.status(500).json({ error: "R2_BUCKET_NAME not configured" });
    }
    const files = await listR2Files(bucketName);
    res.status(200).json({ files });
  } catch (error) {
    console.log("error", error);

    res.status(500).json({ error: "Failed to list files" });
  }
}

