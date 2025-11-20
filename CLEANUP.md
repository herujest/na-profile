# Cleanup Notes

## Files/Folders That Can Be Removed (Future)

### ⚠️ **IMPORTANT: Keep These For Now**

#### 1. **pages/** folder
- **Status**: ⚠️ **KEEP** - Still active for:
  - API Routes (`pages/api/*`) - Still using Pages Router
  - Backward compatibility - Old routes still work
- **Action**: Keep until all API routes migrated to App Router

#### 2. **pages/sections/** folder
- **Status**: ⚠️ **KEEP** - Still used by:
  - `pages/index.tsx` - Old Pages Router home page
  - `pages/blog/index.tsx` - Old Pages Router blog page
- **Action**: Keep until Pages Router fully deprecated

#### 3. **utils/** folder
- **Status**: ⚠️ **KEEP** - Still used by:
  - `pages/api/*` - All API routes import from utils/
  - Pages Router components - Still using utils/
- **Action**: Keep until all API routes migrated to App Router

### ✅ **Already Cleaned Up**

1. **Empty Folders Removed**:
   - `components/HomeViews/` - Empty folder
   - `components/sections/gallery/` - Empty folder

2. **Empty Files Removed**:
   - `app/globals.css` - Empty file (styles handled in styles/globals.css)

### 📋 **Future Cleanup (After Full Migration)**

Once all API routes are migrated to App Router:

1. **Remove pages/sections/**
   ```bash
   rm -rf pages/sections/
   ```

2. **Remove Pages Router pages** (after confirming App Router works):
   - `pages/index.tsx`
   - `pages/blog/`
   - `pages/portfolio/`
   - `pages/resume.tsx`
   - `pages/_app.tsx`
   - `pages/_document.tsx`

3. **Update API routes** to use `lib/` instead of `utils/`:
   - Update all `pages/api/*` imports from `utils/` to `lib/`
   - Then remove `utils/` folder

4. **Remove admin Pages Router pages** (after migrating to App Router):
   - `pages/admin/*`

### 📝 **Current Structure**

```
✅ app/                    # App Router (Active)
✅ components/             # Components (Clean)
✅ lib/                    # Library functions (New)
⚠️ pages/                  # Pages Router (Still active for API & backward compat)
⚠️ utils/                  # Utils (Still used by API routes)
⚠️ pages/sections/         # Sections (Still used by Pages Router)
```

### 🔍 **How to Check Dependencies**

```bash
# Check if pages/sections is used
grep -r "pages/sections" pages/

# Check if utils is used
grep -r "from.*utils\|import.*utils" pages/

# Check if Pages Router pages are referenced
grep -r "pages/" app/
```

### ⚡ **Safe Cleanup Commands**

```bash
# Remove build artifacts (safe)
rm -f *.tsbuildinfo

# Remove empty folders (safe)
find . -type d -empty -delete

# Remove empty files (safe)
find . -type f -empty -name "*.css" -delete
```

## Notes

- **Dual Mode**: Project currently runs in dual mode (Pages Router + App Router)
- **API Routes**: Still use Pages Router pattern (`pages/api/*`)
- **Migration**: Gradual migration is safer than big bang
- **Backward Compat**: Old routes still work for compatibility

