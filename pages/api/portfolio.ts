import fs from "fs";
import { join } from "path";
import { NextApiRequest, NextApiResponse } from "next";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  images: string[];
  techStack?: string[];
  contributions?: string[];
  features?: string[];
}

interface PortfolioData {
  portfolioItems?: PortfolioItem[];
  collaborations?: any[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const portfolioData = join(process.cwd(), "/data/portfolio.json");

  if (req.method === "GET") {
    try {
      const fileContents = fs.readFileSync(portfolioData, "utf-8");
      const data: PortfolioData = JSON.parse(fileContents);

      // Check if portfolioItems exists, otherwise convert from collaborations
      let items: PortfolioItem[] = [];

      if (data.portfolioItems && data.portfolioItems.length > 0) {
        items = data.portfolioItems;
      } else if (data.collaborations && data.collaborations.length > 0) {
        // Convert collaborations to portfolioItems format
        items = data.collaborations.map((collab) => ({
          id: collab.id || `collab-${Math.random()}`,
          title: collab.title || "",
          slug: collab.slug || collab.id || `collab-${Math.random()}`,
          summary: collab.summary || collab.description || "",
          images:
            collab.images ||
            collab.media?.map((m: any) =>
              typeof m.imageSrc === "string" ? m.imageSrc : m.imageSrc[0]
            ) ||
            [],
          techStack: collab.techStack || [],
          contributions: collab.contributions || [],
          features: collab.features || [],
        }));
      }

      res.status(200).json({ items });
    } catch (error) {
      console.error("Error reading portfolio data:", error);
      res.status(500).json({ error: "Failed to read portfolio data" });
    }
  } else if (req.method === "POST") {
    if (process.env.NODE_ENV === "development") {
      fs.writeFileSync(
        portfolioData,
        JSON.stringify(req.body),
        "utf-8"
      );
      res.status(200).json({ status: "OK" });
    } else {
      res.status(403).json({ error: "POST only works in development mode" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

