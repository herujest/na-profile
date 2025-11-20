# 🧹 Cleanup Analysis - Folder Lama

## 📊 **Status: Folder Lama vs App Router**

### ❌ **TIDAK DIGUNAKAN LAGI** (Bisa dihapus)

#### 1. **pages/admin/** ✅ **AMAN UNTUK DIHAPUS**
- ❌ **0 references** di `app/` atau `components/`
- ✅ Semua sudah di-migrate ke `app/(admin)/`
- 📁 **Files:**
  - `pages/admin/about.tsx` → `app/(admin)/about/page.tsx` ✅
  - `pages/admin/dashboard.tsx` → `app/(admin)/dashboard/page.tsx` ✅
  - `pages/admin/header.tsx` → `app/(admin)/header/page.tsx` ✅
  - `pages/admin/login.tsx` → `app/(admin)/login/page.tsx` ✅
  - `pages/admin/partners.tsx` → `app/(admin)/partners/page.tsx` ✅
  - `pages/admin/portfolio/[id].tsx` → `app/(admin)/portfolio/[slug]/page.tsx` ✅
  - `pages/admin/portfolio/index.tsx` → `app/(admin)/portfolio/page.tsx` ✅
  - `pages/admin/resume.tsx` → `app/(admin)/resume/page.tsx` ✅
  - `pages/admin/services.tsx` → `app/(admin)/services/page.tsx` ✅
  - `pages/admin/socials.tsx` → `app/(admin)/socials/page.tsx` ✅
  - `pages/admin/index.tsx` → `app/(admin)/page.tsx` ✅

#### 2. **pages/api/** ✅ **AMAN UNTUK DIHAPUS**
- ❌ **0 references** di `app/` atau `components/`
- ✅ Semua sudah di-migrate ke `app/api/`
- 📁 **Files:**
  - `pages/api/auth/*` → `app/api/auth/*` ✅
  - `pages/api/blog/*` → `app/api/blog/*` ✅
  - `pages/api/partners/*` → `app/api/partners/*` ✅
  - `pages/api/portfolio/*` → `app/api/portfolio/*` ✅
  - `pages/api/upload.ts` → `app/api/upload/route.ts` ✅
  - `pages/api/upload-delete.ts` → `app/api/upload-delete/route.ts` ✅

#### 3. **pages/blog/** ✅ **AMAN UNTUK DIHAPUS**
- ❌ **0 references** di `app/` atau `components/`
- ✅ Semua sudah di-migrate ke `app/(public)/blog/`
- 📁 **Files:**
  - `pages/blog/[slug].tsx` → `app/(public)/blog/[slug]/page.tsx` ✅
  - `pages/blog/index.tsx` → `app/(public)/blog/page.tsx` ✅

#### 4. **pages/portfolio/** ✅ **AMAN UNTUK DIHAPUS**
- ❌ **0 references** di `app/` atau `components/`
- ✅ Sudah di-migrate ke `app/(public)/portfolio/`
- 📁 **Files:**
  - `pages/portfolio/index.tsx` → `app/(public)/portfolio/page.tsx` ✅

#### 5. **pages/resume.tsx** ✅ **AMAN UNTUK DIHAPUS**
- ❌ **0 references** di `app/` atau `components/`
- ✅ Sudah di-migrate ke `app/(public)/resume/page.tsx`

#### 6. **pages/index.tsx** ⚠️ **HATI-HATI**
- ❌ **0 references** di `app/` atau `components/`
- ✅ Sudah di-migrate ke `app/(public)/page.tsx`
- ⚠️ **Note:** Masih ada link ke `/edit` di dalam file, tapi itu untuk Pages Router
- ✅ **Bisa dihapus** jika tidak digunakan untuk Pages Router

#### 7. **pages/sections/** ✅ **AMAN UNTUK DIHAPUS**
- ❌ **0 references** di `app/` atau `components/`
- ✅ Sudah dipindah ke `components/sections/`
- 📁 **Files:**
  - `pages/sections/portfolio/index.tsx` → `components/sections/portfolio/index.tsx` ✅
  - `pages/sections/collaboration/index.tsx` → `components/sections/collaboration/index.tsx` ✅
  - `pages/sections/gallery/` → Sudah dihapus sebelumnya ✅

### ⚠️ **MASIH DIGUNAKAN** (Jangan dihapus)

#### 1. **pages/edit.tsx** ⚠️ **MASIH DIGUNAKAN**
- ✅ **1 reference** di `app/(public)/resume/page.tsx`:
  ```typescript
  router.push("/edit")  // Development mode only
  ```
- 📍 **Lokasi:** Line 35 di `app/(public)/resume/page.tsx`
- ⚠️ **Action:** Update link ke `/admin/dashboard` atau `/admin/resume` jika ingin cleanup
- ✅ **Optional:** Bisa dihapus jika update link tersebut

#### 2. **pages/_app.tsx** ✅ **REQUIRED**
- ✅ Required untuk Pages Router (jika masih digunakan)
- 📝 **Note:** Untuk backward compatibility dengan Pages Router

#### 3. **pages/_document.tsx** ✅ **REQUIRED**
- ✅ Required untuk Pages Router (jika masih digunakan)
- 📝 **Note:** Untuk backward compatibility dengan Pages Router

## 🎯 **Rekomendasi Cleanup**

### ✅ **Bisa Langsung Dihapus (Aman)**

```bash
# Hapus folder admin (semua sudah di-migrate)
rm -rf pages/admin/

# Hapus folder api (semua sudah di-migrate)
rm -rf pages/api/

# Hapus folder blog (semua sudah di-migrate)
rm -rf pages/blog/

# Hapus folder portfolio (sudah di-migrate)
rm -rf pages/portfolio/

# Hapus resume.tsx (sudah di-migrate)
rm pages/resume.tsx

# Hapus index.tsx (sudah di-migrate)
rm pages/index.tsx

# Hapus folder sections (sudah dipindah ke components)
rm -rf pages/sections/
```

### ⚠️ **Update Dulu Baru Hapus**

1. **Update `/edit` link di `app/(public)/resume/page.tsx`:**
   ```typescript
   // Line 35: Change dari
   router.push("/edit")
   // Menjadi
   router.push("/admin/dashboard")  // atau "/admin/resume"
   ```

2. **Kemudian hapus:**
   ```bash
   rm pages/edit.tsx
   ```

### ✅ **Jangan Dihapus (Required)**

- ✅ `pages/_app.tsx` - Required untuk Pages Router
- ✅ `pages/_document.tsx` - Required untuk Pages Router

## 📊 **Summary**

| Folder/File | Status | Action |
|-------------|--------|--------|
| `pages/admin/` | ❌ Tidak digunakan | ✅ **HAPUS** |
| `pages/api/` | ❌ Tidak digunakan | ✅ **HAPUS** |
| `pages/blog/` | ❌ Tidak digunakan | ✅ **HAPUS** |
| `pages/portfolio/` | ❌ Tidak digunakan | ✅ **HAPUS** |
| `pages/resume.tsx` | ❌ Tidak digunakan | ✅ **HAPUS** |
| `pages/index.tsx` | ❌ Tidak digunakan | ✅ **HAPUS** |
| `pages/sections/` | ❌ Tidak digunakan | ✅ **HAPUS** |
| `pages/edit.tsx` | ⚠️ Masih digunakan | ⚠️ **UPDATE LINK DULU** |
| `pages/_app.tsx` | ✅ Required | ❌ **JANGAN HAPUS** |
| `pages/_document.tsx` | ✅ Required | ❌ **JANGAN HAPUS** |

## 🎯 **Quick Cleanup Script**

```bash
# Update edit link dulu
# (Edit app/(public)/resume/page.tsx line 35)

# Kemudian jalankan:
rm -rf pages/admin/ pages/api/ pages/blog/ pages/portfolio/ pages/sections/
rm pages/resume.tsx pages/index.tsx pages/edit.tsx

# Keep:
# - pages/_app.tsx
# - pages/_document.tsx
```

## ⚠️ **Warning**

Sebelum cleanup, pastikan:
1. ✅ Semua App Router routes sudah ditest
2. ✅ Tidak ada broken links
3. ✅ Semua functionality bekerja
4. ✅ Backup folder `pages/` jika perlu

## ✅ **Setelah Cleanup**

Setelah cleanup, folder `pages/` hanya akan berisi:
```
pages/
├── _app.tsx       # Required for Pages Router
└── _document.tsx  # Required for Pages Router
```

Semua functionality sudah pindah ke App Router! 🎉

