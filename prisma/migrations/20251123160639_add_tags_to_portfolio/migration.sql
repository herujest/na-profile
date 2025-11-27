-- Add tags column to Portfolio table
-- This migration handles the case where tags column doesn't exist
-- It will rename photographers to tags if photographers exists, or add tags if neither exists

DO $$
BEGIN
    -- Check if photographers column exists and rename it to tags
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Portfolio' AND column_name = 'photographers'
    ) THEN
        ALTER TABLE "Portfolio" RENAME COLUMN "photographers" TO "tags";
    -- If photographers doesn't exist, check if tags exists, if not add it
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Portfolio' AND column_name = 'tags'
    ) THEN
        ALTER TABLE "Portfolio" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
END $$;








