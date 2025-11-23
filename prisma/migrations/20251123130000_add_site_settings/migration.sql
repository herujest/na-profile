-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "headerTaglineOne" TEXT NOT NULL DEFAULT '',
    "headerTaglineTwo" TEXT NOT NULL DEFAULT '',
    "headerTaglineThree" TEXT NOT NULL DEFAULT '',
    "headerTaglineFour" TEXT NOT NULL DEFAULT '',
    "showCursor" BOOLEAN NOT NULL DEFAULT false,
    "showBlog" BOOLEAN NOT NULL DEFAULT false,
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "showResume" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettings_id_key" ON "SiteSettings"("id");

-- Insert default settings
INSERT INTO "SiteSettings" ("id", "name", "headerTaglineOne", "headerTaglineTwo", "headerTaglineThree", "headerTaglineFour", "showCursor", "showBlog", "darkMode", "showResume", "createdAt", "updatedAt")
VALUES (
    'default',
    'Nisa Aulia',
    'Hello 👋',
    'I''m Nisa Aulia - Model',
    'Muse and Makeup Aficionado',
    ' based in Jakarta, Indonesia.',
    true,
    true,
    false,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

