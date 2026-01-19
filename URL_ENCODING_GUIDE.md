# Prisma Migration: URL Encoding Guide

## 🔴 Problem: P1013 Invalid Port Number

**Root Cause**: Special characters in database password are not URL-encoded.

**Password**: `Cvfja$t*7YTrY#T`  
**Issue**: `$`, `*`, `#` are special characters that break URL parsing.

---

## ✅ Solution: URL-Encode Special Characters

### URL Encoding Rules

Common special characters and their URL-encoded equivalents:

| Character | URL Encoded | Example |
|-----------|-------------|---------|
| `$` | `%24` | Dollar sign |
| `#` | `%23` | Hash/pound |
| `*` | `%2A` | Asterisk |
| `@` | `%40` | At sign |
| `:` | `%3A` | Colon |
| `/` | `%2F` | Forward slash |
| `?` | `%3F` | Question mark |
| `&` | `%26` | Ampersand |
| `` ` `` (backtick) | `%60` | Backtick |
| ` ` (space) | `%20` | Space |

### Your Encoded Password

**Original**: `Cvfja$t*7YTrY#T`  
**Encoded**: `Cvfja%24t%2A7YTrY%23T`

---

## 📝 Step 1: Create `.env` File (Manual Entry)

**DO NOT use PowerShell heredoc** - it corrupts special characters.

### Option A: Notepad (Recommended)

1. Open Notepad
2. Copy-paste this content:

```env
# Database - Supabase PostgreSQL
# DIRECT_URL: Port 5432 for migrations
# DATABASE_URL: Port 6543 pooler for runtime

DIRECT_URL="postgresql://postgres:Cvfja%24t%2A7YTrY%23T@db.hozzuzqvwkjoodrzrlaq.supabase.co:5432/postgres"
DATABASE_URL="postgresql://postgres.hozzuzqvwkjoodrzrlaq:Cvfja%24t%2A7YTrY%23T@aws-1-eu-north-1.pooler.supabase.com:6543/postgres"
```

3. Save as: `c:\Users\user\Desktop\toli site\.env`
   - **Important**: Choose "All Files" in file type dropdown
   - **Important**: Encoding must be `UTF-8`

### Option B: VS Code / Your Editor

1. Open `c:\Users\user\Desktop\toli site` in your editor
2. Create new file `.env`
3. Paste the content above
4. Save

---

## 🚀 Step 2: Verify Configuration

Run these commands to confirm everything is set up:

```powershell
cd "c:\Users\user\Desktop\toli site"

# 1. Validate schema
pnpm prisma validate

# 2. Regenerate Prisma Client
pnpm prisma generate
```

**Expected Output**:
- ✅ "The schema is valid"
- ✅ "Generated Prisma Client"

---

## 🎯 Step 3: Run Migration

### Primary Method: Migrate Dev

```powershell
pnpm prisma migrate dev --name init
```

**What it does**:
- Uses `DIRECT_URL` (port 5432)
- Creates `prisma/migrations/` folder
- Creates all 7 tables
- Regenerates client

**If it succeeds**: Skip to Step 4 (Verify) ✅

### Fallback 1: DB Push (If Migrate Hangs)

```powershell
pnpm prisma db push
```

**Difference**:
- No migration files created
- Faster for development
- Still uses port 5432

### Fallback 2: Mobile Hotspot (If Port 5432 Blocked)

If you get `P1001: Can't reach database server`:

1. Connect laptop to mobile hotspot
2. Run migration again
3. Switch back to WiFi

**Why**: ISPs often block port 5432 for security. Mobile carriers don't.

---

## ✅ Step 4: Verify Success

```powershell
# Open Prisma Studio
pnpm prisma studio
```

Opens GUI at http://localhost:5555

**Success Criteria**:
- ✅ You see all 7 tables:
  - `users`
  - `categories`
  - `products`
  - `product_images`
  - `orders`
  - `order_items`
  - `payments`
- ✅ Each table shows correct columns
- ✅ No errors in console

---

## 📋 Generic Template (For Future Reference)

For any Supabase project:

```env
# Replace <PROJECT>, <REGION>, and <ENCODED_PASSWORD>
DIRECT_URL="postgresql://postgres:<ENCODED_PASSWORD>@db.<PROJECT>.supabase.co:5432/postgres"
DATABASE_URL="postgresql://postgres.<PROJECT>:<ENCODED_PASSWORD>@aws-<REGION>.pooler.supabase.com:6543/postgres"
```

**How to get values**:
1. Supabase Dashboard → Project Settings → Database
2. Copy "Direct connection" → Extract host/password
3. Copy "Connection pooling" → Extract host/password
4. **Encode password** using rules above

---

## 🔧 Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `P1013: invalid port` | Password not URL-encoded | Encode `$`, `#`, `*`, etc. |
| `P1001: Can't reach database` | Port 5432 blocked | Use mobile hotspot |
| `Environment variable not found` | `.env` missing | Create `.env` file manually |
| Commands hang | Network/firewall | Try hotspot or `db push` |

---

## ✅ Phase 1 Complete Checklist

After successful migration:

- [x] Prisma 5.22.0 installed
- [x] Schema created with 7 models
- [x] Two-URL configuration
- [x] `.env` file created with URL-encoded password
- [x] `pnpm prisma validate` passes
- [x] `pnpm prisma generate` completes
- [ ] **Migration runs successfully** ← YOU ARE HERE
- [ ] **Prisma Studio shows all 7 tables**

**Once complete**: Phase 1 done ✅ → Ready for Phase 2 (APIs)
