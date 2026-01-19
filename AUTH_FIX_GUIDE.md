# Production Auth Fix - Deployment Guide

## Prerequisites

Ensure you have:
- Admin access to Vercel dashboard
- Admin access to Supabase SQL Editor
- Git repository access

---

## Step 1: Set Vercel Environment Variables

Go to Vercel Dashboard → Project Settings → Environment Variables

Add/update these variables for **Production** environment:

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXTAUTH_URL` | `https://motivex.app` | Must match production domain |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | Keep secret, never commit |
| `NEXT_PUBLIC_SITE_URL` | `https://motivex.app` | Public-facing URL |
| `DATABASE_URL` | `postgresql://USER:PASSWORD@HOST:6543/DATABASE?pgbouncer=true&connection_limit=1&statement_cache_size=0` | Supabase pooler |
| `DIRECT_URL` | Same as `DATABASE_URL` | If port 5432 blocked |
| `ADMIN_EMAIL` | `owner@motivex.dz` | Admin account email |
| `ADMIN_PASSWORD` | Strong password | Change immediately after first login |

---

## Step 2: Run SQL Migration (Optional)

**Only if you want phone numbers to be unique.**

1. Open Supabase Dashboard → SQL Editor
2. Paste contents of `migrations/add_phone_unique_constraint.sql`
3. Click **Run**
4. Check output:
   - ✅ `SUCCESS: Unique constraint added` → Done
   - ⚠️ `WARNING: Duplicate phone numbers exist` → Clean duplicates first
   - ℹ️ `INFO: Constraint already exists` → Already applied

---

## Step 3: Deploy to Vercel

```bash
git add -A
git commit -m "fix: production-grade auth with admin bootstrap"
git push
```

Vercel will automatically deploy. Wait for deployment to complete.

---

## Step 4: Verify Deployment

### 4.1 Admin Bootstrap

1. Visit `https://motivex.app/account`
2. Login with `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. Should redirect to `/admin`
4. Check Vercel logs for: `✅ Admin user created: owner@motivex.dz`

### 4.2 Session Persistence

1. After login, open DevTools → Application → Cookies
2. Verify `__Secure-next-auth.session-token` exists
3. Visit `https://motivex.app/api/auth/session`
4. Should return:
   ```json
   {
     "user": {
       "id": "...",
       "email": "owner@motivex.dz",
       "name": "Admin MOTIVEX",
       "role": "ADMIN"
     }
   }
   ```

### 4.3 User Registration

1. Logout and go to Register tab
2. **Test valid registration:**
   - Email: `test@example.com`
   - Phone: `0555123456`
   - Should succeed and auto-login
3. **Test duplicate email:**
   - Try same email again
   - Should show: "Email déjà utilisé / البريد مستعمل"
4. **Test duplicate phone (if constraint added):**
   - Try same phone with different email
   - Should show: "Téléphone déjà utilisé / الهاتف مستعمل"
5. **Test invalid phone:**
   - Enter `123`
   - Should show format error

### 4.4 Environment Validation

Check Vercel deployment logs for:
- ❌ No critical errors about missing `NEXTAUTH_SECRET` or `NEXTAUTH_URL`
- ✅ Admin bootstrap message

---

## Troubleshooting

### Issue: "NEXTAUTH_SECRET is missing"

**Solution:** Add `NEXTAUTH_SECRET` in Vercel environment variables and redeploy.

### Issue: Session returns null

**Solution:** 
1. Clear browser cookies
2. Verify `NEXTAUTH_URL=https://motivex.app` (no trailing slash)
3. Check cookie domain matches

### Issue: Admin not created

**Solution:**
1. Check Vercel logs for bootstrap errors
2. Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
3. Check database connection

### Issue: Phone constraint fails

**Solution:**
1. Find duplicates: `SELECT phone, COUNT(*) FROM users WHERE phone IS NOT NULL GROUP BY phone HAVING COUNT(*) > 1;`
2. Clean duplicates manually
3. Re-run migration

---

## Rollback Plan

If deployment fails:

1. **Revert code:**
   ```bash
   git revert HEAD
   git push
   ```

2. **Remove phone constraint (if added):**
   ```sql
   ALTER TABLE users DROP CONSTRAINT IF EXISTS users_phone_key;
   ```

---

## Post-Deployment

1. **Change admin password:**
   - Login as admin
   - Go to account settings
   - Update password

2. **Monitor logs:**
   - Check Vercel logs for errors
   - Monitor Supabase for database issues

3. **Test all flows:**
   - User registration
   - User login
   - Admin login
   - Admin dashboard access
