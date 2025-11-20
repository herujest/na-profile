# Pending Migration Checklist

## ✅ **Already Migrated**

### Public Pages (App Router)
- ✅ `app/(public)/page.tsx` - Home page (WITH animations fixed)
- ✅ `app/(public)/blog/page.tsx` - Blog list
- ✅ `app/(public)/blog/[slug]/page.tsx` - Blog post
- ✅ `app/(public)/portfolio/page.tsx` - Portfolio list
- ✅ `app/(public)/resume/page.tsx` - Resume page

### Admin Pages (App Router)
- ✅ `app/(admin)/login/page.tsx` - Admin login
- ✅ `app/(admin)/dashboard/page.tsx` - Admin dashboard
- ✅ `app/(admin)/portfolio/page.tsx` - Portfolio list
- ⚠️ `app/(admin)/portfolio/[slug]/page.tsx` - Portfolio edit/detail (NEEDS MIGRATION)

### API Routes (App Router)
- ✅ All API routes migrated (`app/api/*`)

### Components
- ✅ All components migrated to use path aliases
- ✅ Sections moved from `pages/sections/` to `components/sections/`

### Styles & Animations
- ✅ `gradient-circle` and `gradient-circle-bottom` added to App Router home page
- ✅ MorphSVGPlugin script with onLoad handler added
- ✅ `createStickySlide` for services section (parallax)
- ✅ ScrollTrigger parallax for about section background
- ✅ ScrollTrigger.refresh() after setup
- ✅ Hash navigation handler for #contact
- ✅ MorphSVGPlugin registration useEffect

## ⚠️ **Still Pending Migration**

### Admin Pages (Pages Router → App Router)
- ❌ `pages/admin/about.tsx` → `app/(admin)/about/page.tsx`
- ❌ `pages/admin/header.tsx` → `app/(admin)/header/page.tsx`
- ❌ `pages/admin/partners.tsx` → `app/(admin)/partners/page.tsx`
- ❌ `pages/admin/resume.tsx` → `app/(admin)/resume/page.tsx`
- ❌ `pages/admin/services.tsx` → `app/(admin)/services/page.tsx`
- ❌ `pages/admin/socials.tsx` → `app/(admin)/socials/page.tsx`
- ❌ `pages/admin/portfolio/[id].tsx` → `app/(admin)/portfolio/[slug]/page.tsx`

### Other Pages
- ❌ `pages/edit.tsx` - CMS Edit page (check if still needed)

## 🔍 **Comparison: Pages Router vs App Router**

### Home Page Animations Status

#### ✅ Fixed in App Router
- ✅ `createStickySlide` for services section
- ✅ ScrollTrigger parallax for about background
- ✅ ScrollTrigger.refresh() after setup
- ✅ MorphSVGPlugin registration
- ✅ Hash navigation handler
- ✅ Gradient circles (visual elements)
- ✅ MorphSVGPlugin script with onLoad

#### ✅ Already Working
- ✅ `stagger` animations for text elements
- ✅ `scrollAnimation` for sections
- ✅ Morphing transition functions
- ✅ Tab switching animations

## 📋 **Migration Priority**

1. **High Priority** - Core admin functionality:
   - `app/(admin)/portfolio/[slug]/page.tsx` (edit/detail page)
   
2. **Medium Priority** - Admin management pages:
   - `app/(admin)/partners/page.tsx`
   - `app/(admin)/about/page.tsx`
   - `app/(admin)/services/page.tsx`
   - `app/(admin)/socials/page.tsx`
   - `app/(admin)/header/page.tsx`
   - `app/(admin)/resume/page.tsx`

3. **Low Priority** - Check if needed:
   - `pages/edit.tsx` (may be replaced by individual admin pages)

## 🎯 **Next Steps**

1. Migrate admin portfolio detail/edit page
2. Migrate remaining admin management pages
3. Test all admin functionality
4. Remove Pages Router files after testing
5. Update all internal links to use App Router

