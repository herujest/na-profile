# Migration Guide: Pages Router → App Router (Next.js 14)

## ✅ Status Migration: **COMPLETED** (Core Pages)

Migration ke App Router sudah selesai untuk semua core pages. Struktur App Router sudah aktif dan siap digunakan.

## Struktur Baru (App Router)

```
app/
├── layout.tsx                  # ✅ Root layout dengan metadata & ThemeProvider
├── globals.css                 # ✅ Global styles (link to styles/)
├── (public)/                   # ✅ Public route group
│   ├── layout.tsx              # ✅ Public layout wrapper (MainLayout)
│   ├── page.tsx                # ✅ Home page (MIGRATED)
│   ├── blog/
│   │   ├── page.tsx            # ✅ Blog list (MIGRATED)
│   │   └── [slug]/
│   │       └── page.tsx        # ✅ Blog post (MIGRATED)
│   ├── portfolio/
│   │   └── page.tsx            # ✅ Portfolio page (MIGRATED)
│   └── resume/
│       └── page.tsx            # ✅ Resume page (MIGRATED)
└── (admin)/                    # ✅ Admin route group
    ├── layout.tsx              # ✅ Admin layout dengan auth check
    ├── page.tsx                # ✅ Admin index (redirect to dashboard)
    ├── login/
    │   └── page.tsx            # ✅ Admin login (MIGRATED)
    ├── dashboard/
    │   └── page.tsx            # ✅ Admin dashboard (MIGRATED)
    └── portfolio/
        └── page.tsx            # ✅ Admin portfolio list (MIGRATED)
```

## Folder Structure Changes

### ✅ Completed
- [x] Created `app/` folder structure
- [x] Created root `app/layout.tsx` with metadata
- [x] Created `lib/` folder (copied from `utils/`)
- [x] Created `hooks/`, `types/`, `content/` folders
- [x] Updated `lib/auth.ts` for App Router (cookies() API)
- [x] Updated `tsconfig.json` with path aliases
- [x] Created route groups: `(public)` and `(admin)`
- [x] Migrated home page (`app/(public)/page.tsx`)
- [x] Migrated blog pages (`app/(public)/blog/page.tsx` and `app/(public)/blog/[slug]/page.tsx`)
- [x] Migrated portfolio pages (`app/(public)/portfolio/page.tsx`)
- [x] Migrated resume page (`app/(public)/resume/page.tsx`)
- [x] Migrated admin pages:
  - `app/(admin)/login/page.tsx`
  - `app/(admin)/dashboard/page.tsx`
  - `app/(admin)/portfolio/page.tsx`
- [x] Created `app/(admin)/layout.tsx` with auth check
- [x] Updated `lib/api.ts` for blog posts (content/blog support)

### ⏳ Optional (Can be done later)
- [ ] Migrate admin portfolio detail/edit page (`app/(admin)/portfolio/[slug]/page.tsx`)
- [ ] Migrate remaining admin pages (partners, services, socials, resume, etc.)
- [ ] Migrate API routes to App Router route handlers (Pages Router API still works fine)

## Key Differences: Pages Router → App Router

### 1. File Naming
| Pages Router | App Router |
|--------------|------------|
| `index.tsx` | `page.tsx` |
| `_app.tsx` | `layout.tsx` |
| `_document.tsx` | (included in root `layout.tsx`) |

### 2. Data Fetching
| Pages Router | App Router |
|--------------|------------|
| `getStaticProps` | Direct fetch in Server Components |
| `getServerSideProps` | Direct fetch in Server Components |
| `getStaticPaths` | `generateStaticParams()` |

### 3. Metadata
| Pages Router | App Router |
|--------------|------------|
| `<Head>` component | `metadata` export or `generateMetadata()` |

### 4. API Routes
| Pages Router | App Router |
|--------------|------------|
| `pages/api/*.ts` | `app/api/*/route.ts` |
| `handler(req, res)` | `GET()`, `POST()`, etc. exports |

### 5. Client Components
- Use `"use client"` directive for components that need client-side features
- Server Components are default in App Router

## Migration Patterns Used

### 1. Server + Client Component Pattern
```tsx
// Server component (data fetching)
export default async function Page() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}

// Client component (interactivity)
"use client";
export function ClientComponent({ data }: { data: any }) {
  // Client-side logic here
}
```

### 2. Route Groups
- `(public)` - Public pages with MainLayout
- `(admin)` - Admin pages with AdminLayout + auth check

### 3. Dynamic Routes
```tsx
// Generate static params for SSG
export async function generateStaticParams() {
  return [{ slug: 'post-1' }, { slug: 'post-2' }];
}

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Fetch metadata
  return { title: '...', description: '...' };
}
```

## Current State

- **Pages Router**: Still functional for backward compatibility (can be removed later)
- **App Router**: Fully functional for all core pages
- **Utils → Lib**: Files copied, both folders exist for compatibility
- **Content**: Blog posts moved to `content/blog/` (with fallback to `_posts/`)

## Path Aliases

All imports use path aliases defined in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./*"],
    "@/components/*": ["./components/*"],
    "@/lib/*": ["./lib/*"],
    "@/app/*": ["./app/*"],
    "@/hooks/*": ["./hooks/*"],
    "@/types/*": ["./types/*"],
    "@/utils/*": ["./utils/*"]
  }
}
```

## Next Steps (Optional)

1. **Migrate remaining admin pages** (partners, services, socials, resume)
2. **Migrate admin portfolio detail/edit page** (large file, can be done incrementally)
3. **Migrate API routes** (Pages Router API routes still work fine)
4. **Remove Pages Router files** (after confirming everything works)
5. **Remove utils folder** (after all imports updated to lib/)

## Notes

- Both routers can coexist during migration
- App Router routes take precedence if both exist
- All API routes remain in `pages/api/` until migrated (optional)
- Utils remain in `utils/` for backward compatibility during migration
