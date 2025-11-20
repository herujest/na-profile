# API Routes Migration - Pages Router → App Router

## ✅ **Status: COMPLETED**

Semua API routes sudah di-migrate dari Pages Router ke App Router.

## 📋 **Migration Summary**

### ✅ **Migrated Routes**

#### 1. **Auth Routes** (`app/api/auth/*`)
- ✅ `app/api/auth/login/route.ts` - POST login
- ✅ `app/api/auth/me/route.ts` - GET check authentication
- ✅ `app/api/auth/logout/route.ts` - POST logout

#### 2. **Portfolio Routes** (`app/api/portfolio/*`)
- ✅ `app/api/portfolio/route.ts` - GET list, POST create
- ✅ `app/api/portfolio/[slug]/route.ts` - GET, PUT, DELETE by slug
- ✅ `app/api/portfolio/generate-slug/route.ts` - POST generate unique slug

#### 3. **Blog Routes** (`app/api/blog/*`)
- ✅ `app/api/blog/route.ts` - POST create, DELETE blog
- ✅ `app/api/blog/edit/route.ts` - POST edit blog

#### 4. **Partners Routes** (`app/api/partners/*`)
- ✅ `app/api/partners/route.ts` - GET list, POST create
- ✅ `app/api/partners/[id]/route.ts` - GET, PATCH, DELETE by id

#### 5. **Upload Routes** (`app/api/upload/*`)
- ✅ `app/api/upload/route.ts` - POST upload image to R2
- ✅ `app/api/upload-delete/route.ts` - DELETE image from R2

### 🔄 **Key Changes**

#### 1. **Request/Response Handling**
```typescript
// Pages Router (Old)
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ data });
  }
}

// App Router (New)
export async function GET(req: NextRequest) {
  return NextResponse.json({ data }, { status: 200 });
}
```

#### 2. **Authentication**
```typescript
// Pages Router (Old)
import { requireAuth } from "../../../utils/auth";
if (!requireAuth(req, res)) return;

// App Router (New)
import { isAuthenticated } from "@/lib/auth";
const authenticated = await isAuthenticated();
if (!authenticated) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

#### 3. **Cookies**
```typescript
// Pages Router (Old)
res.setHeader("Set-Cookie", cookie);
const sessionToken = req.cookies?.admin_session;

// App Router (New)
import { cookies } from "next/headers";
const cookieStore = await cookies();
cookieStore.set("admin_session", sessionToken, {...});
const sessionToken = cookieStore.get("admin_session")?.value;
```

#### 4. **Dynamic Route Params**
```typescript
// Pages Router (Old)
const { slug } = req.query;

// App Router (New)
interface RouteContext {
  params: Promise<{ slug: string }>;
}
export async function GET(req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
}
```

#### 5. **Query Parameters**
```typescript
// Pages Router (Old)
const { category } = req.query;

// App Router (New)
const { searchParams } = new URL(req.url);
const category = searchParams.get("category");
```

#### 6. **File Upload**
```typescript
// Pages Router (Old)
// Uses formidable for multipart/form-data
const form = formidable({...});
const [fields, files] = await form.parse(req);

// App Router (New)
// Uses native FormData
const formData = await req.formData();
const file = formData.get("file") as File;
const bytes = await file.arrayBuffer();
```

#### 7. **Imports**
```typescript
// Pages Router (Old)
import { prisma } from "../../../utils/prisma";
import { requireAuth } from "../../../utils/auth";

// App Router (New)
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
```

### 📁 **New Structure**

```
app/api/
├── auth/
│   ├── login/
│   │   └── route.ts         # POST /api/auth/login
│   ├── logout/
│   │   └── route.ts         # POST /api/auth/logout
│   └── me/
│       └── route.ts         # GET /api/auth/me
├── blog/
│   ├── edit/
│   │   └── route.ts         # POST /api/blog/edit
│   └── route.ts             # POST /api/blog, DELETE /api/blog
├── partners/
│   ├── [id]/
│   │   └── route.ts         # GET/PATCH/DELETE /api/partners/[id]
│   └── route.ts             # GET/POST /api/partners
├── portfolio/
│   ├── [slug]/
│   │   └── route.ts         # GET/PUT/DELETE /api/portfolio/[slug]
│   ├── generate-slug/
│   │   └── route.ts         # POST /api/portfolio/generate-slug
│   └── route.ts             # GET/POST /api/portfolio
├── upload/
│   └── route.ts             # POST /api/upload
└── upload-delete/
    └── route.ts             # DELETE /api/upload-delete
```

### 🔍 **Backward Compatibility**

#### Current State
- ✅ App Router routes are **ACTIVE** and take precedence
- ⚠️ Pages Router routes still exist for backward compatibility
- ⚠️ Both routes can coexist during migration

#### Testing
1. Test all API endpoints to ensure they work
2. Verify authentication works correctly
3. Test file upload functionality
4. Test all CRUD operations

### 🗑️ **Future Cleanup**

Once all routes are tested and confirmed working:

1. **Remove Pages Router API routes**:
   ```bash
   rm -rf pages/api/
   ```

2. **Remove Pages Router auth**:
   - Remove `pages/api/auth/*`

3. **Remove utils folder** (if not used elsewhere):
   - Update any remaining imports from `utils/` to `lib/`
   - Remove `utils/` folder

### 📝 **Notes**

- All routes use **async/await** pattern
- All routes use **NextRequest/NextResponse** from `next/server`
- All routes use **path aliases** (`@/lib/*`)
- Authentication uses **cookies()** API from `next/headers`
- File uploads use **native FormData** (no formidable needed)
- Dynamic routes use **Promise<{ param }>** pattern

### ✅ **Migration Checklist**

- [x] Auth routes migrated
- [x] Portfolio routes migrated
- [x] Blog routes migrated
- [x] Partners routes migrated
- [x] Upload routes migrated
- [x] All imports updated to `lib/`
- [x] All types updated for App Router
- [x] Authentication updated for App Router
- [x] File upload updated for App Router
- [ ] All routes tested (manual testing required)
- [ ] Remove Pages Router API routes (after testing)

## 🎯 **Next Steps**

1. **Test all API endpoints** to ensure they work correctly
2. **Monitor for errors** in production/logs
3. **Update client-side code** if needed (should work as-is)
4. **Remove old routes** after confirming everything works

