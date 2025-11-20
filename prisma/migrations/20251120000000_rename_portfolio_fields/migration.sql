-- Rename columns in Portfolio table
ALTER TABLE "Portfolio" RENAME COLUMN "techStack" TO "photographers";
ALTER TABLE "Portfolio" RENAME COLUMN "contributions" TO "categories";
ALTER TABLE "Portfolio" RENAME COLUMN "features" TO "brands";

