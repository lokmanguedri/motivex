# Phase 3.1: NextAuth UI Integration - Testing Guide

## ✅ Completed Changes

### Files Modified (No Visual Changes)
1. **components/providers/session-provider.tsx** [NEW]
   - Client-side NextAuth SessionProvider wrapper

2. **contexts/auth-context.tsx** [MODIFIED]
   - Replaced mock authentication with real NextAuth
   - Maintained same interface for existing UI
   - Uses `useSession` hook from NextAuth

3. **app/layout.tsx** [MODIFIED]
   - Wrapped app with `SessionProvider`
   - No visual/styling changes

4. **app/account/page.tsx** [MODIFIED]
   - Removed demo login hint
   - Now uses real authentication

---

## 🧪 Testing Checklist

### Prerequisites

1. **Ensure server is running**:
   ```powershell
   cd "c:\Users\user\Desktop\toli site"
   pnpm dev
   ```

2. **Verify .env has auth variables**:
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="<your-secret>"
   ADMIN_EMAIL="admin@motivex.dz"
   ADMIN_PASSWORD="YourPassword123!"
   ```

3. **Admin user is seeded**:
   ```powershell
   pnpm seed
   ```

---

### Test 1: Login as Admin

1. Navigate to: `http://localhost:3000/account`
2. Click **"Connexion" / "تسجيل الدخول"** tab
3. Enter credentials:
   - Email: `admin@motivex.dz`
   - Password: `YourPassword123!` (whatever you set in .env)
4. Click **"Se connecter" / "تسجيل الدخول"**

**✅ Expected Result**:
- Toast notification: "Connexion réussie" / "تم تسجيل الدخول بنجاح"
- Page refreshes showing account dashboard
- Shows: "Bonjour, Admin" / "مرحباً، Admin"
- **Admin button visible**: "Tableau de bord admin" / "لوحة تحكم المدير"

---

### Test 2: Access Admin Dashboard

1. While logged in as admin, click the **Settings/Gear icon** button
2. Should navigate to `/admin`

**✅ Expected Result**:
- Successfully loads `/admin` page
- No redirect or 401 error

---

### Test 3: Logout

1. On account page, click **"Se déconnecter" / "تسجيل الخروج"** button

**✅ Expected Result**:
- Redirected back to login/register page
- Session cleared

---

### Test 4: Access Admin Without Auth

1. Make sure you're logged out
2. Try to navigate directly to: `http://localhost:3000/admin`

**✅ Expected Result**:
- Redirected to `/account` (middleware protection)
- Cannot access admin page

---

### Test 5: Session Persistence

1. Login as admin
2. Refresh the page (F5)

**✅ Expected Result**:
- Session persists
- Still logged in (no re-login required)
- Account dashboard still shows

---

## 🔍 Verification Points

### UI Should Look Exactly the Same

- ✅ Login form: Same design, colors, layout
- ✅ Account dashboard: Same cards, same spacing
- ✅ Header: Same icon positions
- ✅ No new buttons or elements added
- ✅ Same typography and colors everywhere

### What Changed (Backend Only)

- ❌ Demo login ("demo123") no longer works
- ✅ Real database authentication via NextAuth
- ✅ Admin role from database controls access
- ✅ Session stored in JWT (not localStorage)

---

## 🐛 Troubleshooting

### "Connexion échouée" / Login Failed

**Problem**: Login fails even with correct credentials

**Solutions**:
1. Check admin user exists in database:
   ```powershell
   pnpm prisma studio
   # Navigate to users table, verify admin@motivex.dz exists
   ```

2. Verify password in .env matches what you're typing

3. Check browser console for errors

### Redirects to /account immediately

**Problem**: Can't stay on account dashboard after login

**Solution**:
- Clear browser cookies
- Check NextAuth secret is set in .env
- Restart dev server

### Admin button doesn't show

**Problem**: Logged in but no admin button visible

**Solution**:
- Check user role in Prisma Studio is "ADMIN" (not "USER")
- Verify session includes role (check browser dev tools → Application → Cookies → look for next-auth token)

---

## 📊 Session Data Structure

When logged in, session contains:
```typescript
{
  user: {
    id: "cltxxxxx...",
    email: "admin@motivex.dz",
    name: "Admin User",
    role: "ADMIN"
  }
}
```

This is automatically mapped to the existing UI's User type.

---

## 🎯 Phase 3.1 Success Criteria

- [ ] Login with admin credentials works
- [ ] Session persists across page refresh
- [ ] Admin button shows for ADMIN role
- [ ] `/admin` route accessible when logged in as admin
- [ ] `/admin` redirects to `/account` when not logged in
- [ ] Logout clears session
- [ ] UI looks exactly the same (zero visual changes)
- [ ] Header, footer, and all existing components unchanged

---

## 🚀 Next: Phase 3.2

**Will wire product data** (no redesign):
- Connect product listing to `/api/products`
- Connect product  details to `/api/products/:id`
- Wire admin product management to admin APIs

**Still NO UI changes** - just data wiring!
