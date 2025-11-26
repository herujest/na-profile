# Migration Guide: Partner Features Implementation

Dokumen ini menjelaskan perubahan schema dan cara melakukan migrasi untuk fitur Partner/Collaboration yang baru.

## Perubahan Schema

### Model Baru

1. **PartnerCategory** - Kategori partner yang dapat dikelola melalui admin
2. **PartnerRank** - Ranking/tingkat partner (Platinum, Gold, Silver, Bronze, dll)
3. **PartnerSocial** - Social media links per partner (mendukung multiple platforms)

### Perubahan Model Existing

1. **Partner**

   - Menambahkan `categoryId` (FK ke PartnerCategory) - nullable
   - Menambahkan `rankId` (FK ke PartnerRank) - nullable
   - Menambahkan relasi `category`, `rank`, `socials`, `portfolios`
   - Field `category` (String) diubah menjadi `categoryLegacy` untuk backward compatibility
   - Field `whatsapp` dan `instagram` tetap ada untuk backward compatibility

2. **Portfolio**
   - Menambahkan `partnerId` (REQUIRED) - setiap portfolio harus punya partner
   - Menambahkan `datePublished` (DateTime, nullable) - untuk tracking tanggal publish
   - Menambahkan relasi `partner`

## Langkah Migrasi

### 1. Backup Database

Jika database berjalan di Docker (recommended):

```bash
# Opsi 1: Gunakan script backup yang sudah ada
./scripts/backup-db.sh

# Opsi 2: Manual dengan Docker exec
docker exec nisa-profile-db pg_dump -U postgres nisa_profile > backup_$(date +%Y%m%d_%H%M%S).sql

# Opsi 3: Jika menggunakan DATABASE_URL dari environment
# Extract connection details dan gunakan docker exec
docker exec nisa-profile-db pg_dump -U postgres nisa_profile > backup_$(date +%Y%m%d_%H%M%S).sql
```

Jika database berjalan di server remote dan Anda punya `pg_dump` terinstall:

```bash
# Backup database sebelum migrasi
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

**Catatan**: Jika `pg_dump` tidak terinstall, gunakan Docker method di atas. Script `backup-db.sh` akan otomatis detect username yang benar.

## ✅ Migration Completed

Migration telah berhasil dilakukan dengan langkah-langkah berikut:

1. ✅ Database backup dibuat
2. ✅ Schema baru (PartnerCategory, PartnerRank, PartnerSocial) ditambahkan
3. ✅ Portfolio existing di-assign ke default partner
4. ✅ Migration file dibuat dan di-mark sebagai applied: `20251126044740_add_partner_features`
5. ✅ Database schema sekarang up-to-date

**Scripts yang tersedia:**

- `./scripts/backup-db.sh` - Backup database
- `./scripts/migrate-docker.sh` - Run migration dari Docker network
- `./scripts/assign-portfolio-to-partner.sql` - Assign portfolios ke partner (sudah dijalankan)

### 2. Generate Migration

**Opsi 1: Menggunakan Docker (Recommended jika ada masalah koneksi dari host)**

Jika Anda mendapat error "Authentication failed" saat menjalankan migration dari host machine:

```bash
# Gunakan script Docker yang sudah disediakan
./scripts/migrate-docker.sh add_partner_features
```

**Opsi 2: Migration dari host machine (Jika koneksi berhasil)**

```bash
# Generate Prisma migration
npx prisma migrate dev --name add_partner_features
```

**Opsi 3: Manual migration**

```bash
npx prisma migrate dev --create-only --name add_partner_features
# Edit file migration di prisma/migrations/...
npx prisma migrate dev
```

**Catatan**: Jika terjadi error authentication, gunakan Opsi 1 (Docker script) yang akan menjalankan migration dari dalam Docker network.

### 3. Migrasi Data Existing (Jika Ada)

Jika sudah ada data partner dan portfolio:

#### A. Migrasi Partner Categories

Buat kategori dari data existing:

```typescript
// Script: scripts/migrate-categories.ts
import { prisma } from "../lib/prisma";

async function migrateCategories() {
  const mainCategories = [
    "MUA",
    "Photographer",
    "Videographer",
    "Stylist",
    "Wardrobe",
  ];

  for (const catName of mainCategories) {
    const slug = catName.toLowerCase().replace(/\s+/g, "-");
    await prisma.partnerCategory.upsert({
      where: { slug },
      update: {},
      create: {
        name: catName,
        slug,
        order: mainCategories.indexOf(catName),
      },
    });
  }
}

migrateCategories();
```

#### B. Migrasi Partner Data

Update partner existing untuk menggunakan categoryId:

```typescript
// Script: scripts/migrate-partners.ts
import { prisma } from "../lib/prisma";

async function migratePartners() {
  const partners = await prisma.partner.findMany({
    where: {
      categoryLegacy: { not: null },
    },
  });

  for (const partner of partners) {
    if (partner.categoryLegacy) {
      const category = await prisma.partnerCategory.findFirst({
        where: {
          name: partner.categoryLegacy,
        },
      });

      if (category) {
        await prisma.partner.update({
          where: { id: partner.id },
          data: { categoryId: category.id },
        });
      }
    }
  }
}

migratePartners();
```

#### C. Migrasi Portfolio Data

**PENTING**: Portfolio existing tidak punya `partnerId`. Anda perlu:

1. Assign portfolio ke partner yang sesuai, atau
2. Buat partner default untuk portfolio yang tidak punya partner

```typescript
// Script: scripts/migrate-portfolios.ts
import { prisma } from "../lib/prisma";

async function migratePortfolios() {
  // Option 1: Assign ke partner default
  const defaultPartner = await prisma.partner.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!defaultPartner) {
    console.error("No partner found! Create at least one partner first.");
    return;
  }

  // Update all portfolios without partnerId
  const portfolios = await prisma.portfolio.findMany({
    where: {
      partnerId: null, // This will fail if partnerId is required
    },
  });

  // If partnerId is nullable during migration, update them
  // Otherwise, you need to handle this before making partnerId required
}
```

**Rekomendasi**: Buat migration yang membuat `partnerId` nullable dulu, lalu update data, baru ubah jadi required.

### 4. Recalculate Collaboration Counts

Setelah migrasi, recalculate semua collaboration counts:

```bash
# Via API (setelah server running)
curl -X POST http://localhost:3000/api/partners/bulk-recalculate-collab \
  -H "Cookie: admin_session=..." \
  -H "Content-Type: application/json"
```

Atau via script:

```typescript
// Script: scripts/recalc-counts.ts
import { recalcAllPartnerCollabCounts } from "../lib/portfolio-utils";

async function main() {
  await recalcAllPartnerCollabCounts();
  console.log("Collaboration counts recalculated!");
}

main();
```

## API Endpoints Baru

### Partner Categories

- `GET /api/partner-categories` - List categories
- `GET /api/partner-categories/:id` - Get category
- `POST /api/partner-categories` - Create (admin)
- `PUT /api/partner-categories/:id` - Update (admin)
- `DELETE /api/partner-categories/:id` - Delete (admin)

### Partner Ranks

- `GET /api/partner-ranks` - List ranks
- `GET /api/partner-ranks/:id` - Get rank
- `POST /api/partner-ranks` - Create (admin)
- `PUT /api/partner-ranks/:id` - Update (admin)
- `DELETE /api/partner-ranks/:id` - Delete (admin)

### Partner Updates

- `GET /api/partners` - Sekarang support filters: `categoryId`, `rankId`, `search`, `page`, `limit`, `sort`, `minCollaborations`, `tags`
- `POST /api/partners` - Sekarang support `categoryId`, `rankId`, `socials[]`
- `PATCH /api/partners/:id` - Support update `categoryId`, `rankId`, `socials[]`

### Portfolio Updates

- `POST /api/portfolio` - **REQUIRES** `partnerId` (mandatory)
- `PUT /api/portfolio/:slug` - Support update `partnerId` (akan adjust counts)
- `DELETE /api/portfolio/:slug` - Auto decrement partner collaborationCount

### Utility

- `POST /api/partners/bulk-recalculate-collab` - Recalculate counts (admin)
  - Body: `{ partnerId?: string }` - jika tidak ada, recalculate semua

## Testing Checklist

- [ ] Migration berhasil tanpa error
- [ ] Partner categories dapat dibuat/diupdate/dihapus
- [ ] Partner ranks dapat dibuat/diupdate/dihapus
- [ ] Partner dapat di-assign ke category dan rank
- [ ] Partner socials dapat ditambahkan/diupdate
- [ ] Portfolio creation memerlukan partnerId
- [ ] Portfolio creation auto-increment collaborationCount
- [ ] Portfolio update dengan partner change adjust counts correctly
- [ ] Portfolio delete auto-decrement collaborationCount
- [ ] Recalculate utility bekerja dengan benar
- [ ] API responses include relations (category, rank, socials, partner)

## Rollback Plan

Jika perlu rollback:

1. Restore database dari backup
2. Atau revert migration:
   ```bash
   npx prisma migrate resolve --rolled-back <migration_name>
   ```

## Notes

- Field `categoryLegacy`, `whatsapp`, `instagram` di Partner tetap ada untuk backward compatibility
- Portfolio `partnerId` adalah required - pastikan semua portfolio punya partner sebelum migration
- Collaboration counts dihitung secara denormalized untuk performance
- Gunakan utility function `recalcAllPartnerCollabCounts()` jika ada inconsistency
