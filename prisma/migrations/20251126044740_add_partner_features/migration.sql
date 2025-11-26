-- CreateTable
CREATE TABLE IF NOT EXISTS "PartnerCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PartnerRank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerRank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PartnerSocial" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "url" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerSocial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PartnerCategory_name_key" ON "PartnerCategory"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "PartnerCategory_slug_key" ON "PartnerCategory"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "PartnerRank_slug_key" ON "PartnerRank"("slug");

-- AlterTable: Add new columns to Partner
ALTER TABLE "Partner" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
ALTER TABLE "Partner" ADD COLUMN IF NOT EXISTS "rankId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Partner_categoryId_idx" ON "Partner"("categoryId");
CREATE INDEX IF NOT EXISTS "Partner_rankId_idx" ON "Partner"("rankId");

-- AlterTable: Add partnerId and datePublished to Portfolio (if not exists)
ALTER TABLE "Portfolio" ADD COLUMN IF NOT EXISTS "partnerId" TEXT;
ALTER TABLE "Portfolio" ADD COLUMN IF NOT EXISTS "datePublished" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Portfolio_partnerId_idx" ON "Portfolio"("partnerId");
CREATE INDEX IF NOT EXISTS "Portfolio_datePublished_idx" ON "Portfolio"("datePublished");

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Partner_categoryId_fkey'
    ) THEN
        ALTER TABLE "Partner" ADD CONSTRAINT "Partner_categoryId_fkey" 
        FOREIGN KEY ("categoryId") REFERENCES "PartnerCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Partner_rankId_fkey'
    ) THEN
        ALTER TABLE "Partner" ADD CONSTRAINT "Partner_rankId_fkey" 
        FOREIGN KEY ("rankId") REFERENCES "PartnerRank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'PartnerSocial_partnerId_fkey'
    ) THEN
        ALTER TABLE "PartnerSocial" ADD CONSTRAINT "PartnerSocial_partnerId_fkey" 
        FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Portfolio_partnerId_fkey'
    ) THEN
        ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_partnerId_fkey" 
        FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- Make partnerId NOT NULL (all portfolios should now have a partner)
ALTER TABLE "Portfolio" ALTER COLUMN "partnerId" SET NOT NULL;

-- CreateIndex for PartnerSocial
CREATE INDEX IF NOT EXISTS "PartnerSocial_partnerId_idx" ON "PartnerSocial"("partnerId");

