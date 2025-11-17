import fs from "fs";
import { join } from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const portfolioData = join(process.cwd(), "/data/portfolio.json");
  if (process.env.NODE_ENV === "development") {
    if (req.method === "POST") {
      fs.writeFileSync(
        portfolioData,
        JSON.stringify(req.body),
        "utf-8"
      );
      res.status(200).json({ status: "OK" });
    } else {
      res
        .status(200)
        .json({ name: "This route works in development mode only" });
    }
  } else {
    res.status(200).json({ name: "This route works in development mode only" });
  }
}

