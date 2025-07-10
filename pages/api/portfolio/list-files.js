// pages/api/portfolio/list-files.js
import { listR2Files } from "../../../utils/s3Config";

export default async function handler(req, res) {
  console.log("API /api/list-files was called");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const files = await listR2Files(process.env.R2_BUCKET_NAME);
    res.status(200).json({ files });
  } catch (error) {
    console.log("error", error);

    res.status(500).json({ error: "Failed to list files" });
  }
}
