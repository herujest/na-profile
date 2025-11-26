// Script to assign existing portfolios to a partner
// Run this after the migration is applied and at least one partner exists

import { prisma } from '../lib/prisma';

async function assignPortfoliosToPartner() {
  try {
    // Find portfolios without a partnerId
    const portfoliosWithoutPartner = await prisma.portfolio.findMany({
      where: {
        partnerId: null,
      },
    });

    if (portfoliosWithoutPartner.length === 0) {
      console.log('✓ All portfolios already have partners assigned.');
      return;
    }

    console.log(`Found ${portfoliosWithoutPartner.length} portfolio(s) without a partner.`);

    // Find the first partner (or create a default one if none exists)
    let partner = await prisma.partner.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    if (!partner) {
      console.log('No partners found. Creating a default partner...');
      
      // Create a default partner category first if needed
      let category = await prisma.partnerCategory.findFirst({
        where: { slug: 'photographer' },
      });

      if (!category) {
        category = await prisma.partnerCategory.create({
          data: {
            name: 'Photographer',
            slug: 'photographer',
            order: 0,
          },
        });
        console.log('Created default category: Photographer');
      }

      // Create default partner
      partner = await prisma.partner.create({
        data: {
          name: 'Default Partner',
          categoryId: category.id,
          description: 'Default partner for existing portfolios',
        },
      });
      console.log(`Created default partner: ${partner.name} (${partner.id})`);
    } else {
      console.log(`Using existing partner: ${partner.name} (${partner.id})`);
    }

    // Assign all portfolios to this partner
    const updateResult = await prisma.portfolio.updateMany({
      where: {
        partnerId: null,
      },
      data: {
        partnerId: partner.id,
      },
    });

    console.log(`✓ Successfully assigned ${updateResult.count} portfolio(s) to partner: ${partner.name}`);

    // Verify
    const remaining = await prisma.portfolio.count({
      where: {
        partnerId: null,
      },
    });

    if (remaining === 0) {
      console.log('✓ All portfolios now have partners assigned!');
    } else {
      console.warn(`⚠️  Warning: ${remaining} portfolio(s) still without a partner.`);
    }

  } catch (error) {
    console.error('Error assigning portfolios to partner:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

assignPortfoliosToPartner();

