import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const partner = await prisma.partner.findUnique({
        where: { id: id as string },
      });

      if (!partner) {
        return res.status(404).json({ error: "Partner not found" });
      }

      res.status(200).json(partner);
    } catch (error) {
      console.error("Error fetching partner:", error);
      res.status(500).json({ error: "Failed to fetch partner" });
    }
  } else if (req.method === "PATCH") {
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
        tags,
        notes,
        collaborationCount,
        manualScore,
      } = req.body;

      // Get existing partner to calculate new rank
      const existingPartner = await prisma.partner.findUnique({
        where: { id: id as string },
      });

      if (!existingPartner) {
        return res.status(404).json({ error: "Partner not found" });
      }

      // Calculate internal rank if collaborationCount or manualScore changed
      const newCollaborationCount =
        collaborationCount !== undefined
          ? collaborationCount
          : existingPartner.collaborationCount;
      const newManualScore =
        manualScore !== undefined ? manualScore : existingPartner.manualScore;
      const internalRank = newCollaborationCount * 0.5 + newManualScore;

      // Prepare update data
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (category !== undefined) updateData.category = category;
      if (description !== undefined) updateData.description = description;
      if (location !== undefined) updateData.location = location;
      if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
      if (instagram !== undefined) updateData.instagram = instagram;
      if (email !== undefined) updateData.email = email;
      if (priceRange !== undefined) updateData.priceRange = priceRange;
      if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl;
      if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
      if (tags !== undefined) updateData.tags = tags;
      if (notes !== undefined) updateData.notes = notes;
      if (collaborationCount !== undefined)
        updateData.collaborationCount = collaborationCount;
      if (manualScore !== undefined) updateData.manualScore = manualScore;
      updateData.internalRank = internalRank;

      const partner = await prisma.partner.update({
        where: { id: id as string },
        data: updateData,
      });

      res.status(200).json(partner);
    } catch (error) {
      console.error("Error updating partner:", error);
      res.status(500).json({ error: "Failed to update partner" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.partner.delete({
        where: { id: id as string },
      });

      res.status(200).json({ message: "Partner deleted successfully" });
    } catch (error) {
      console.error("Error deleting partner:", error);
      res.status(500).json({ error: "Failed to delete partner" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

