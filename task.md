# Tasks - Multi-Country Implementation

- [x] Database Schema updates
  - [x] Modify `schema.prisma`
  - [x] Propose and run Prisma migration (Local Prisma Client generated successfully; remote migration requires user's direct DB connection access)
- [x] Backend API changes
  - [x] Modify `src/validators/auth.validator.js`
  - [x] Modify `src/controllers/auth.controller.js`
  - [x] Modify `src/controllers/job.controller.js`
  - [x] Modify `src/controllers/provider.controller.js`
  - [x] Modify `src/controllers/sports.controller.js`
  - [x] Modify `src/controllers/payment.controller.js`
- [x] Mobile App updates
  - [x] Create `app/src/constants/countries.js`
  - [x] Modify `app/src/screens/Auth/LoginScreen.js`
  - [x] Modify `app/src/screens/Auth/RegisterScreen.js`
  - [x] Modify `app/src/screens/Wallet/TopUpPaymentScreen.js`
  - [x] Modify `app/src/screens/Home/HomeScreen.js` (Provider filtering is handled dynamically on backend, no frontend changes needed)
  - [x] Modify `app/src/components/NewsTicker.js`
- [x] Website changes
  - [x] Modify `website/src/pages/Auth/Login.tsx`
  - [x] Modify `website/src/pages/Auth/Register.tsx`
- [x] Security Audit & Enterprise-Grade Hardening
  - [x] Critical Vulnerability Patching
    - [x] Block test OTP backdoor (`123456`) in production
    - [x] Remove `image/svg+xml` upload support (Stored XSS vector)
    - [x] Remove `application/octet-stream` upload support (MIME spoofing vector)
    - [x] Replace in-memory OTP cache with DB-backed `PendingVerification` table (Bcrypt hashed OTPs)
  - [x] Session & Authentication Security
    - [x] Implement DB-backed `tokenVersion` for instant JWT session revocation on logout
    - [x] Enforce dedicated `otpLimiter` (5 attempts / 15 min) on all OTP endpoints
    - [x] Reduce general API rate limiter from 2,000 to 300 requests / 15 min
    - [x] Gate localhost CORS policies strictly behind non-production `NODE_ENV`
  - [x] Data Privacy & Public Asset Hardening
    - [x] Restrict `/uploads` static file serving to public asset buckets only
    - [x] Create authenticated `ADMIN` API route for sensitive files (`verification-documents`, `payment-proofs`)
    - [x] Strip sensitive internal fields (`password`, `twoFactorCode`, `lastIpAddress`) from auth responses
    - [x] Enforce HTTPS and IPv4 address validation for IP geolocation requests (SSRF defense)
  - [x] Database Schema & Supabase Live Execution
    - [x] Created `PendingVerification` model & indexes in Prisma schema
    - [x] Added `tokenVersion` to `User` model in Prisma schema
    - [x] Executed SQL migration live on Supabase database (`bvzebfcjirnrcjxxdjrt`) via Supabase MCP
- [x] Provider Profile Picture & Favorites Synchronization Fixes
  - [x] **Mobile App Discover Pros Avatars**: Updated `getMediaUrl()` in `app/src/services/api.js` to normalize `/uploads/` paths against active `API_ORIGIN` and updated `ProviderListScreen.js` to extract provider avatars directly via `<UserAvatar />`.
  - [x] **Website Landing Page Verified Pros**: Added a public provider fetch hook on initial app mount in `App.tsx` and updated `ProCard` so verified providers and their profile pictures display on the landing page for all visitors.
  - [x] **Backend Favorite Providers API**: Added missing implementations for `getFavoriteProviders`, `addFavoriteProvider`, and `removeFavoriteProvider` in `provider.controller.js` and declared `ClientFavoriteProvider` model in `schema.prisma`.
  - [x] **Cross-Platform Favorites Sync**: Connected website heart toggle buttons & `SavedProviders.tsx` directly to `/api/providers/favorites` (enabling seamless sync between Website, Mobile App, and Database).
  - [x] **Instant Data Loading on Login**: Initialized wallet balance from session auth state immediately on login, combined dashboard data requests into a single parallel `Promise.all` batch, and added **Saved Providers** to the website navigation menu.




