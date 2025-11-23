-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "aboutPara" TEXT NOT NULL DEFAULT '';

-- Update existing default settings with aboutPara from portfolio.json
UPDATE "SiteSettings"
SET "aboutPara" = 'Modeling, for me, is more than a profession—it is an intimate dialogue between soul and surface, a dance between light, emotion, and the silent language of expression. My name is Nisa Aulia, and I specialize in makeup artistry and commercial shoots, where every detail is curated, every glance intentional. 

My journey began not in the spotlight, but in the quiet moments of transformation—watching colors bloom on skin, seeing faces light up under the right contour or the perfect shade. Makeup became my medium, the lens through which I understood beauty: nuanced, evolving, powerful.

I used to believe modeling was simply about standing before a camera. Now I know it''s about embodying a story. It''s about how you move, what you wear, the textures that touch your skin, and the brand of self you choose to reflect. Each shoot is a canvas. Each look, a mood. Each campaign, a memory in motion.

Elegance, to me, is not just style—it is intention. It is the ability to communicate grace without words, to hold space with presence alone.

I don''t just model—I become the Muse. For brands. For beauty. For the story waiting to be seen.
'
WHERE "id" = 'default';

