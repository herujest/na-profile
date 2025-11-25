-- Rename column from photographers to tags (only if Portfolio table and photographers column exist)
-- This migration is now handled by the create table migration, but kept for migration history
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'Portfolio'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Portfolio' AND column_name = 'photographers'
    ) THEN
        ALTER TABLE "Portfolio" RENAME COLUMN "photographers" TO "tags";
    END IF;
END $$;
