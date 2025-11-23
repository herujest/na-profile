-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Service_order_idx" ON "Service"("order");

-- Insert default services from portfolio.json
INSERT INTO "Service" ("id", "title", "description", "order", "createdAt", "updatedAt")
VALUES
    (gen_random_uuid()::text, 'Beauty Direction', 'I offer creative direction tailored to beauty and commercial shoots—curating concepts, styling, and visual mood that elevate your campaign''s essence. From soft elegance to bold editorial, I help shape visuals that speak.', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Commercial Modeling', 'With a strong background in commercial work, I bring brand stories to life through movement, poise, and polished presence. I model for beauty brands, lifestyle labels, and campaigns that seek both authenticity and allure.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Makeup Artistry Collaboration', 'Specializing in the harmony between face and frame, I collaborate with top makeup artists or offer guided looks to create visually cohesive, stunning results for photo and film.', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Brand Aesthetics Consulting', 'I assist brands in defining their visual identity within beauty, fashion, and lifestyle. Whether it''s selecting the right palette, textures, or atmosphere, I help ensure every image aligns with your brand''s refined voice.', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

