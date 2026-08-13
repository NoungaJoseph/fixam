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
- [x] Booking System & Cross-Platform Management Fixes
  - [x] **Website Booking Creation Fix**: Resolved Prisma Foreign Key error in backend `createBooking` where notification creation referenced raw `providerId` instead of verified `targetProviderId` (User ID). Auto-created wallet balance on initial booking so new clients can book instantly without "Insufficient coins" errors.
  - [x] **Mobile App Service Duration Chips**: Added interactive Service Duration selector chips (`1 Hour`, `2-3 Hours`, `Half Day (4h)`, `Full Day (8h)`, `Multi-Day`, `Flexible`) matching the website options in `BookingFormScreen.js`.
  - [x] **Cross-Platform Provider Booking Management**: Added a dedicated **Direct Bookings** tab to `ProviderDashboard.tsx` on the website where providers can view incoming direct client bookings, Accept, Reject, Mark Completed, or Chat directly with clients.
  - [x] **Booking Detail & Action Resolution**: Fixed booking ID extraction in `MyBookings.tsx` cancellation handler and updated `BookingDetail.tsx` drawer to display proposed budget, service duration, urgency level, and scheduled date/time.





