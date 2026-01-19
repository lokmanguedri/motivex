# Phase 1: Quick Setup Commands

## ✅ Already Completed

```bash
# 1. Install Prisma
pnpm add @prisma/client
pnpm add -D prisma

# 2. Validate schema
pnpm prisma validate

# 3. Generate Prisma Client
pnpm prisma generate
```

---

## 🔴 YOU MUST DO: Database Setup

### Step 1: Get PostgreSQL Database

Choose one:
- **Supabase** (recommended): https://supabase.com
- **Neon**: https://neon.tech
- **Railway**: https://railway.app
- **Local**: Install PostgreSQL locally

### Step 2: Create `.env` File

In project root (`c:\Users\user\Desktop\toli site`), create `.env`:

```bash
# Copy example
copy .env.example .env
```

Edit `.env` and add your actual database URL:

```env
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

### Step 3: Run Migration

```bash
cd "c:\Users\user\Desktop\toli site"
pnpm prisma migrate dev --name init
```

This creates all database tables.

### Step 4: Verify (Optional)

```bash
pnpm prisma studio
```

Opens database GUI at http://localhost:5555

---

## Schema Summary

**7 Models Created:**
1. **User** - Authentication (email unique, role: USER/ADMIN)
2. **Category** - Product categories (slug unique, bilingual FR/AR)
3. **Product** - Products (SKU unique, price @db.Decimal(12,2), bilingual)
4. **ProductImage** - Product images (multiple per product, sortable)
5. **Order** - Orders (status tracking, structured shipping fields)
6. **OrderItem** - Order items (bilingual snapshots at purchase time)
7. **Payment** - Payments (COD/BARIDIMOB, receipt upload)

**Key Features:**
- ✅ Bilingual: FR/AR for products and order snapshots
- ✅ DZD currency: `@db.Decimal(12,2)` on all money fields
- ✅ Structured shipping: wilaya, commune, address1, phone, notes
- ✅ Unique constraints: email, slug, SKU
- ✅ Indexes: category_id, user_id, status

---

## Next Phase

Phase 2 will add:
- NextAuth.js authentication
- API routes for CRUD
- File uploads
- Order processing
