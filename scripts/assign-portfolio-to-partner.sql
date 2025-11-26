-- Script to assign existing portfolios to a partner
-- Run this after the migration is applied

-- Step 1: Create default category if it doesn't exist
INSERT INTO "PartnerCategory" (id, name, slug, "order", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'Photographer',
    'photographer',
    0,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "PartnerCategory" WHERE slug = 'photographer'
);

-- Step 2: Create default partner if none exists
INSERT INTO "Partner" (id, name, "categoryId", "collaborationCount", "internalRank", "manualScore", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'Default Partner',
    (SELECT id FROM "PartnerCategory" WHERE slug = 'photographer' LIMIT 1),
    0,
    0,
    0,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "Partner" LIMIT 1
);

-- Step 3: Assign all portfolios without partnerId to the first partner
UPDATE "Portfolio"
SET "partnerId" = (SELECT id FROM "Partner" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "partnerId" IS NULL;

-- Step 4: Verify
SELECT 
    COUNT(*) as portfolios_without_partner
FROM "Portfolio"
WHERE "partnerId" IS NULL;

