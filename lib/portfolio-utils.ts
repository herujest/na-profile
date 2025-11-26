import { prisma } from "@/lib/prisma";

type CreatePortfolioInput = {
  title: string;
  slug: string;
  partnerId: string;
  datePublished?: string | null;
  images?: string[];
  tags?: string[];
  categories?: string[];
  brands?: string[];
  summary?: string;
  featured?: boolean;
  order?: number;
};

type UpdatePortfolioInput = Partial<CreatePortfolioInput>;

/**
 * Create portfolio and increment partner collaborationCount atomically
 */
export async function createPortfolio(data: CreatePortfolioInput) {
  // Validate partner exists
  const partner = await prisma.partner.findUnique({
    where: { id: data.partnerId },
  });

  if (!partner) {
    throw new Error("Partner not found");
  }

  // Transaction: create portfolio + increment partner collaborationCount
  return await prisma.$transaction(async (tx) => {
    const portfolio = await tx.portfolio.create({
      data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary ?? null,
        images: data.images ?? [],
        tags: data.tags ?? [],
        categories: data.categories ?? [],
        brands: data.brands ?? [],
        featured: !!data.featured,
        order: data.order ?? 0,
        partner: { connect: { id: data.partnerId } },
        datePublished: data.datePublished ? new Date(data.datePublished) : null,
      },
    });

    // Increment collaborationCount
    await tx.partner.update({
      where: { id: data.partnerId },
      data: { collaborationCount: { increment: 1 } },
    });

    return portfolio;
  });
}

/**
 * Update portfolio and handle partner changes atomically
 */
export async function updatePortfolio(
  id: string,
  updates: UpdatePortfolioInput
) {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.portfolio.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Portfolio not found");
    }

    // If partner changed
    if (updates.partnerId && updates.partnerId !== existing.partnerId) {
      // Validate new partner exists
      const newPartner = await tx.partner.findUnique({
        where: { id: updates.partnerId },
      });

      if (!newPartner) {
        throw new Error("New partner not found");
      }

      // Decrement old partner
      await tx.partner.update({
        where: { id: existing.partnerId },
        data: { collaborationCount: { decrement: 1 } },
      });

      // Increment new partner
      await tx.partner.update({
        where: { id: updates.partnerId },
        data: { collaborationCount: { increment: 1 } },
      });
    }

    // Perform update
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.summary !== undefined) updateData.summary = updates.summary ?? null;
    if (updates.images !== undefined) updateData.images = updates.images;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.categories !== undefined) updateData.categories = updates.categories;
    if (updates.brands !== undefined) updateData.brands = updates.brands;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.order !== undefined) updateData.order = updates.order;
    if (updates.partnerId !== undefined) updateData.partnerId = updates.partnerId;
    if (updates.datePublished !== undefined) {
      updateData.datePublished = updates.datePublished
        ? new Date(updates.datePublished)
        : null;
    }

    const updated = await tx.portfolio.update({
      where: { id },
      data: updateData,
    });

    return updated;
  });
}

/**
 * Delete portfolio and decrement partner collaborationCount atomically
 */
export async function deletePortfolio(id: string) {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.portfolio.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Portfolio not found");
    }

    await tx.portfolio.delete({ where: { id } });

    // Decrement collaborationCount
    await tx.partner.update({
      where: { id: existing.partnerId },
      data: { collaborationCount: { decrement: 1 } },
    });

    return { success: true };
  });
}

/**
 * Recalculate all partner collaboration counts from database
 * Useful for repair/maintenance
 */
export async function recalcAllPartnerCollabCounts() {
  // Fetch all partners with their portfolio counts
  const partners = await prisma.partner.findMany({
    include: {
      _count: {
        select: {
          portfolios: true,
        },
      },
    },
  });

  // Update all partners in transaction
  return await prisma.$transaction(
    partners.map((p) =>
      prisma.partner.update({
        where: { id: p.id },
        data: { collaborationCount: p._count.portfolios },
      })
    )
  );
}

/**
 * Recalculate collaboration count for a specific partner
 */
export async function recalcPartnerCollabCount(partnerId: string) {
  const count = await prisma.portfolio.count({
    where: { partnerId },
  });

  return await prisma.partner.update({
    where: { id: partnerId },
    data: { collaborationCount: count },
  });
}

