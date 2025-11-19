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
  const { slug } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Slug is required" });
  }

  const portfolioData = join(process.cwd(), "/data/portfolio.json");

  try {
    const fileContents = fs.readFileSync(portfolioData, "utf-8");
    const data: PortfolioData = JSON.parse(fileContents);

    let items: PortfolioItem[] = [];

    // Check if portfolioItems exists, otherwise convert from collaborations
    if (data.portfolioItems && data.portfolioItems.length > 0) {
      items = data.portfolioItems;
    } else if (data.collaborations && data.collaborations.length > 0) {
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

    // Find item by slug
    const item = items.find((item) => item.slug === slug);

    if (!item) {
      return res.status(404).json({ error: "Portfolio item not found" });
    }

    res.status(200).json({ item });
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    res.status(500).json({ error: "Failed to read portfolio data" });
  }
}

