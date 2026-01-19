# QUICK START - Prisma Migration

## Copy this EXACT content into `.env`

**File path**: `c:\Users\user\Desktop\toli site\.env`

**Use Notepad** (not PowerShell):
1. Open Notepad
2. Copy the 2 lines below
3. Save As → Navigate to project folder
4. Filename: `.env` (with the dot)
5. Save as type: **All Files**
6. Encoding: **UTF-8**

```
DIRECT_URL="postgresql://postgres:Cvfja%24t%2A7YTrY%23T@db.hozzuzqvwkjoodrzrlaq.supabase.co:5432/postgres"
DATABASE_URL="postgresql://postgres.hozzuzqvwkjoodrzrlaq:Cvfja%24t%2A7YTrY%23T@aws-1-eu-north-1.pooler.supabase.com:6543/postgres"
```

---

## Then Run These Commands

```powershell
cd "c:\Users\user\Desktop\toli site"

# Validate
pnpm prisma validate

# Run migration
pnpm prisma migrate dev --name init

# Verify (opens GUI)
pnpm prisma studio
```

---

## If Port 5432 is Blocked

1. Connect to mobile hotspot
2. Run migration
3. Switch back to WiFi

OR use quick alternative:
```powershell
pnpm prisma db push
```

---

**Password encoding note**: `$` → `%24`, `*` → `%2A`, `#` → `%23`
