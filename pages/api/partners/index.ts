import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { category } = req.query;

      const where: any = {};
      if (category && category !== "All" && category !== "Others") {
        where.category = category as string;
      } else if (category === "Others") {
        // For "Others", we can filter categories that are not in the main list
        const mainCategories = ["MUA", "Photographer", "Videographer", "Stylist", "Wardrobe"];
        where.NOT = {
          category: {
            in: mainCategories,
          },
        };
      }

      const partners = await prisma.partner.findMany({
        where,
        orderBy: [
          { internalRank: "desc" },
          { collaborationCount: "desc" },
          { createdAt: "desc" },
        ],
      });

      res.status(200).json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        name,
        category,
        description,
        location,
        whatsapp,
        instagram,
        email,
        priceRange,
        portfolioUrl,
        avatarUrl,
        tags = [],
        notes,
        collaborationCount = 0,
        manualScore = 0,
      } = req.body;

      // Calculate internal rank
      const internalRank = collaborationCount * 0.5 + manualScore;

      const partner = await prisma.partner.create({
        data: {
          name,
          category,
          description,
          location,
          whatsapp,
          instagram,
          email,
          priceRange,
          portfolioUrl,
          avatarUrl,
          tags: tags || [],
          notes,
          collaborationCount,
          manualScore,
          internalRank,
        },
      });

      res.status(201).json(partner);
    } catch (error) {
      console.error("Error creating partner:", error);
      res.status(500).json({ error: "Failed to create partner" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

