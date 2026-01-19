# Phase 2: Backend Setup Complete

## ✅ Files Created

### Authentication (9 files)
- `lib/auth.ts` - NextAuth v5 configuration with Credentials provider
- `lib/api-auth.ts` - Server-side auth helpers (requireAuth, requireAdmin)
- `app/api/auth/[...nextauth]/route.ts` - NextAuth route handler
- `types/next-auth.d.ts` - TypeScript session type extensions
- `middleware.ts` - Edge middleware (basic auth check only, no DB)

### Product APIs (4 files)
- `app/api/products/route.ts` - GET list (public)
- `app/api/products/[id]/route.ts` - GET details (public)
- `app/api/admin/products/route.ts` - POST create (ADMIN)
- `app/api/admin/products/[id]/route.ts` - PATCH/DELETE (ADMIN)

### Seeding (2 files)
- `prisma/seed.ts` - Admin user seed script (tsx-based)
- `package.json` - Added seed command

---

## 🚀 Setup Steps

### 1. Update `.env` File

Add these environment variables:

```powershell
# Open .env in Notepad or your editor, add:
```

```env
# Existing DB URLs (keep these)
DIRECT_URL="postgresql://..."
DATABASE_URL="postgresql://..."

# NEW: NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="GENERATE_THIS_SECRET"

# NEW: Admin User Credentials
ADMIN_EMAIL="admin@motivex.dz"
ADMIN_PASSWORD="YourSecurePassword123!"
```

### 2. Generate NEXTAUTH_SECRET

```powershell
cd "c:\Users\user\Desktop\toli site"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as `NEXTAUTH_SECRET` in `.env`.

### 3. Regenerate Prisma Client

```powershell
pnpm prisma generate
```

### 4. Seed Admin User

```powershell
pnpm seed
```

**Expected output**:
```
🌱 Seeding database...
✅ Admin user created/updated:
   Email: admin@motivex.dz
   Role: ADMIN
   ID: cltxxxxx...
🎉 Seeding completed successfully!
```

### 5. Start Development Server

```powershell
pnpm dev
```

---

## 🧪 Testing Guide

### Test 1: Seed Verification

After running `pnpm seed`, verify admin user in database:

```powershell
pnpm prisma studio
```

Navigate to the `users` table - you should see the admin user.

### Test 2: Authentication

**Using Prisma Studio** (simplest method):
1. Open Prisma Studio: `pnpm prisma studio`
2. Go to `users` table
3. Verify your admin user exists with `role: ADMIN`

**Testing login** (requires UI integration - Phase 3):
- Login will work once you wire the `/account` page to use NextAuth signIn()

### Test 3: Public Product API

Open browser or use curl:

```powershell
# Test GET /api/products (should return empty array initially)
curl http://localhost:3000/api/products

# Test with filters
curl "http://localhost:3000/api/products?page=1&limit=10"
```

**Expected**: `{"products":[],"pagination":{...}}`

### Test 4: Admin Product API (CLI Test)

**Important**: Admin APIs require authentication. Here's how to test:

1. First, you need to login via the UI (Phase 3 will wire this)
2. Or, create a test product using Prisma Studio manually
3. Or, use this curl command WITH a valid session cookie

**For now, verify the endpoint exists**:
```powershell
# This will return 401 (correct, you're not logged in)
curl -X POST http://localhost:3000/api/admin/products -H "Content-Type: application/json" -d "{}"
```

**Expected**: `{"error":"Authentication required"}` or redirect

### Test 5: Middleware Protection

```powershell
# Try accessing admin route without login
curl http://localhost:3000/admin
```

**Expected**: Redirect to `/account` (302 or 401)

---

## 📁 File Structure

```
c:/Users/user/Desktop/toli site/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          ✅ NextAuth handler
│   │   ├── products/
│   │   │   ├── route.ts              ✅ GET list (public)
│   │   │   └── [id]/
│   │   │       └── route.ts          ✅ GET details (public)
│   │   └── admin/
│   │       └── products/
│   │           ├── route.ts          ✅ POST create (ADMIN)
│   │           └── [id]/
│   │               └── route.ts      ✅ PATCH/DELETE (ADMIN)
│   └── (existing pages - unchanged)
├── lib/
│   ├── prisma.ts                     ✅ Singleton (confirmed)
│   ├── auth.ts                       ✅ NextAuth config
│   └── api-auth.ts                   ✅ Auth helpers
├── prisma/
│   └── seed.ts                       ✅ Admin seed
├── types/
│   └── next-auth.d.ts                ✅ Session types
├── middleware.ts                     ✅ Route protection
├── package.json                      ✅ Updated (seed script)
└── .env                              ⚠️ UPDATE REQUIRED
```

---

## 🎯 What Works Now

- ✅ **Authentication**: NextAuth v5 with Credentials provider
- ✅ **Password Security**: bcrypt hashing (10 rounds)
- ✅ **Session Management**: JWT-based with role in token
- ✅ **Admin Protection**: Middleware (basic) + Server-side ADMIN checks
- ✅ **Public APIs**: GET products with filters/pagination
- ✅ **Admin APIs**: CRUD operations with role enforcement
- ✅ **Seeding**: Admin user creation from env variables

## 🔄 What's Next (Phase 3)

Phase 3 will **wire existing UI to these APIs** (no redesign):

- Connect `/account` page to NextAuth signIn/signOut
- Wire product listing pages to fetch from `/api/products`
- Wire admin pages to use `/api/admin/products`
- Add SessionProvider to app layout
- Add login/logout buttons

**No UI redesign - just data wiring!**

---

## 🛠️ Quick Commands Reference

```powershell
# Go to project directory
cd "c:\Users\user\Desktop\toli site"

# Generate NextAuth secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Regenerate Prisma Client (after schema changes)
pnpm prisma generate

# Seed admin user
pnpm seed

# Start dev server
pnpm dev

# Open Prisma Studio (database GUI)
pnpm prisma studio

# Test public API
curl http://localhost:3000/api/products
```

---

## ✅ Success Criteria

- [ ] `.env` updated with NEXTAUTH_URL, NEXTAUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
- [ ] `pnpm prisma generate` completes successfully
- [ ] `pnpm seed` creates admin user
- [ ] `pnpm dev` starts without errors
- [ ] GET `/api/products` returns `{"products":[],"pagination":{...}}`
- [ ] GET `/admin` redirects to `/account` (unauthenticated)
- [ ] POST `/api/admin/products` returns 401/redirect (unauthenticated)
- [ ] Prisma Studio shows admin user in `users` table
