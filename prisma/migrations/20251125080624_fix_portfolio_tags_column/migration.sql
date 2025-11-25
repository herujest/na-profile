-- Fix Portfolio.tags column - ensure it exists
-- This migration is idempotent and safe to run multiple times

DO $$
BEGIN
    -- Check if tags column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'Portfolio' 
        AND column_name = 'tags'
    ) THEN
        -- Add tags column if it doesn't exist
        ALTER TABLE "Portfolio" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
        RAISE NOTICE 'Added tags column to Portfolio table';
    ELSE
        RAISE NOTICE 'tags column already exists in Portfolio table';
    END IF;
    
    -- Also ensure categories and brands columns exist (they should, but just in case)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'Portfolio' 
        AND column_name = 'categories'
    ) THEN
        ALTER TABLE "Portfolio" ADD COLUMN "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];
        RAISE NOTICE 'Added categories column to Portfolio table';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'Portfolio' 
        AND column_name = 'brands'
    ) THEN
        ALTER TABLE "Portfolio" ADD COLUMN "brands" TEXT[] DEFAULT ARRAY[]::TEXT[];
        RAISE NOTICE 'Added brands column to Portfolio table';
    END IF;
END $$;

