# Supabase + Prisma Migration Guide (Windows PowerShell)

## ✅ Completed Setup

- Prisma 5.22.0 installed (stable, Supabase-compatible)
- Schema configured with `url` + `directUrl` for two-URL pattern
- Prisma Client generated successfully

---

## 🔧 Required: Create `.env` File

Run these commands in PowerShell:

```powershell
cd "c:\Users\user\Desktop\toli site"

@"
# Database - Supabase PostgreSQL
# DIRECT_URL: Used by Prisma CLI for migrations (port 5432)
# DATABASE_URL: Used by application runtime/PrismaClient (port 6543 pooler)

DIRECT_URL="postgresql://postgres:Cvfja`$t*7YTrY#T@db.hozzuzqvwkjoodrzrlaq.supabase.co:5432/postgres"
DATABASE_URL="postgresql://postgres.hozzuzqvwkjoodrzrlaq:Cvfja`$t*7YTrY#T@aws-1-eu-north-1.pooler.supabase.com:6543/postgres"
"@ | Out-File -FilePath .env -Encoding utf8
```

**Special Characters in Password**: 
The backtick `` ` `` before `$` escapes it in PowerShell: ``Cvfja`$t*7YTrY#T``

---

## 🚀 Run Migration

### Option 1: Prisma Migrate (Recommended for Production)

```powershell
pnpm prisma migrate dev --name init
```

**What it does:**
- Connects via DIRECT_URL (port 5432)
- Creates migration files in `prisma/migrations/`
- Applies migration to database
- Regenerates Prisma Client

### Option 2: DB Push (Quick Development Alternative)

If `migrate dev` hangs or you're doing rapid prototyping:

```powershell
pnpm prisma db push
```

**What it does:**
- Connects via DIRECT_URL (port 5432)  
- Syncs schema directly (no migration files)
- Faster for development iterations

---

## ⚠️ Troubleshooting

### If Commands Still Hang:

**Cause**: Network/firewall blocking port 5432 (direct connection)

**Solution 1:** Switch to mobile hotspot temporarily
```powershell
# 1. Connect laptop to phone hotspot
# 2. Run migration:
pnpm prisma migrate dev --name init
# 3. Switch back to regular network
```

**Solution 2:** Use Prisma Studio to verify connection
```powershell
pnpm prisma studio
```
Opens GUI at http://localhost:5555 - if this works, database is accessible.

### Common Errors:

| Error | Cause | Fix |
|-------|-------|-----|
| `P1001: Can't reach database` | Firewall blocking port 5432 | Try hotspot or VPN |
| `Environment variable not found` | `.env` file missing | Run `.env` creation command above |
| `P1012: url no longer supported` | Prisma 7.x installed | Already fixed - using Prisma 5.22 |

---

## ✅ Verify Migration Success

After migration completes, verify with:

```powershell
# Check all tables created
pnpm prisma studio
```

You should see 7 tables:
- `users`
- `categories`
- `products`
- `product_images`
- `orders`
- `order_items`
- `payments`

---

## 📊 Two-URL Pattern Explained

### Why Two URLs?

Supabase provides **two connection methods**:

1. **Direct Connection** (port 5432)
   - Full PostgreSQL protocol support
   - Required for schema changes (migrations)
   - Lower connection limit
   - Used by: `prisma migrate`, `prisma db push`

2. **Connection Pooler** (port 6543)
   - Optimized for serverless (Next.js/Vercel)
   - Higher concurrency
   - **Cannot handle migrations** (limited protocol support)
   - Used by: PrismaClient in your app

### How Prisma Uses Them:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")     // Pooler → Runtime queries
  directUrl = env("DIRECT_URL")       // Direct → Migrations
}
```

---

## 🎯 Next Steps (After Migration)

Once migration succeeds:

**Phase 1 Complete** ✅
- Database schema live in Supabase
- All 7 models created
- Prisma Client ready

**Phase 2: Backend APIs**
- Authentication (NextAuth.js)
- CRUD API routes
- File uploads
- Order processing

---

## 📝 Quick Reference

```powershell
# Create .env (DO THIS FIRST)
cd "c:\Users\user\Desktop\toli site"
# ... (run .env creation command from above)

# Run migration
pnpm prisma migrate dev --name init

# OR use db push for faster dev
pnpm prisma db push

# Verify in GUI
pnpm prisma studio

# If it hangs, try hotspot then retry
```
