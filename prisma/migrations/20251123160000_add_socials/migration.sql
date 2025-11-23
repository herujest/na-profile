-- CreateTable
CREATE TABLE "Social" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Social_order_idx" ON "Social"("order");

-- Insert default socials from Socials component
INSERT INTO "Social" ("id", "title", "link", "order", "createdAt", "updatedAt")
VALUES
    (gen_random_uuid()::text, 'Instagram', 'https://instagram.com/nisa_wly', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'TikTok', 'https://www.tiktok.com/@racunnyacacaaa', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Email', 'mailto:contact@nisaaulia.com', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

