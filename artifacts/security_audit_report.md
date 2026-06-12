# 🛡️ Fixam Security Audit Report

This report outlines the current security posture of the Fixam application, covering the **Backend**, **Database**, **Mobile App**, and **Dashboard**. It identifies vulnerabilities and provides actionable recommendations to fortify the platform against common attacks (like SQL Injection, XSS, and data leaks).

---

## 1. Backend API (Node.js/Express)

The backend has a solid security foundation with several middlewares already in place, but there are areas for improvement.

### ✅ Current Protections
- **SQL Injection:** Prisma ORM inherently prevents most SQL injections by using parameterized queries.
- **XSS Protection:** An active `xss` sanitizer middleware recursively cleans incoming requests (`req.body`, `req.query`, `req.params`).
- **HTTP Parameter Pollution (HPP):** Protected using the `hpp` package.
- **Security Headers:** `helmet` is active, enforcing secure HTTP headers.
- **Rate Limiting:** `express-rate-limit` is applied to `/api/` to prevent brute-force attacks.

### ⚠️ Vulnerabilities & Risks
1. **Raw SQL Queries (`$queryRawUnsafe` / `$executeRawUnsafe`):**
   - **Risk:** Some scripts (e.g., `mark_migrations_applied.js`) use raw unsafe queries. While currently used for admin tasks, any user input passed to these functions could trigger severe SQL injection.
   - **Fix:** Avoid `Unsafe` methods entirely. Always use `$queryRaw` or `$executeRaw` with parameterized inputs.
2. **CORS Configuration:**
   - **Risk:** `app.use(cors())` allows requests from *any* origin (`*`). This is dangerous for cookie-based auth or sensitive data exposure if accessed via browsers.
   - **Fix:** Restrict CORS to specific trusted domains (e.g., the exact URL of the dashboard).
3. **JWT Secret Management:**
   - **Risk:** If `JWT_SECRET` is weak or exposed, attackers can forge auth tokens.
   - **Fix:** Ensure the secret is a high-entropy string (e.g., 64+ random characters) and rotate it periodically.
4. **Lack of Strict Input Validation (Schema Validation):**
   - **Risk:** While `xss` cleans strings, it doesn't enforce data types or constraints (e.g., ensuring an age is a number, not an object).
   - **Fix:** Use the existing `zod` dependency to enforce strict request schemas (e.g., validate email format, password complexity) before hitting the controllers.

---

## 2. Database (PostgreSQL / Supabase)

### ✅ Current Protections
- **Connection Security:** Uses `pgbouncer` pooler and authenticated connections.
- **Row Level Security (RLS):** A migration (`enable_rls`) indicates RLS is being utilized to restrict data access at the database level.

### ⚠️ Vulnerabilities & Risks
1. **Direct Database Exposure:**
   - **Risk:** The Supabase database might be accessible to the public internet if IP allowlisting is not configured.
   - **Fix:** Restrict database connections to only the Railway backend IPs (using Supabase Network Restrictions) if direct frontend connection is not required.
2. **Secrets in Source Control:**
   - **Risk:** Hardcoded database URLs in local `.env` files can leak if accidentally committed.
   - **Fix:** Never commit `.env` files. Ensure Railway environment variables are strictly managed.

---

## 3. Mobile App (React Native)

### ⚠️ Vulnerabilities & Risks
1. **Insecure Token Storage:**
   - **Risk (High):** In `AuthContext.js`, the app currently stores the `authToken` and user data in **both** `SecureStore` (encrypted) AND `AsyncStorage` (unencrypted plain text):
     ```javascript
     await AsyncStorage.setItem(key, value);
     await SecureStore.setItemAsync(key, value);
     ```
     An attacker with physical access to the device or a malicious app exploiting a backup could extract the JWT from the plain text `AsyncStorage`.
   - **Fix:** Remove `AsyncStorage` usage for sensitive keys (like `authToken`). Only use `SecureStore` for authentication tokens.
2. **Deep Linking / Intent Spoofing:**
   - **Risk:** If the app accepts deep links, malicious apps could send crafted intents to bypass authentication or trigger unauthorized actions.
   - **Fix:** Validate all incoming URL parameters from deep links before acting on them.

---

## 4. Dashboard (React/Web)

### ⚠️ Vulnerabilities & Risks
1. **Local Storage of JWTs:**
   - **Risk:** Storing JWTs in `localStorage` makes them susceptible to Cross-Site Scripting (XSS) attacks. If an attacker injects a script into the dashboard, they can steal the admin token.
   - **Fix:** Store the JWT in an **`HttpOnly` secure cookie** instead of `localStorage`. The browser handles the cookie automatically, and JavaScript cannot read it, preventing XSS token theft.
2. **Missing CSRF Protection:**
   - **Risk:** If moving to cookies, the dashboard becomes vulnerable to Cross-Site Request Forgery (CSRF).
   - **Fix:** Implement CSRF tokens or rely on `SameSite=Strict` cookie attributes.

---

## 🎯 Summary Action Plan (What to implement next)

To make the platform highly secure, I recommend we prioritize the following fixes:

1. **[Mobile App]** Fix `AuthContext.js` to stop writing the `authToken` into the unencrypted `AsyncStorage`.
2. **[Backend]** Lock down `cors()` in `app.js` to only allow your specific Dashboard domain.
3. **[Backend]** Implement strict `zod` schema validation on critical endpoints (like Auth and Payments) to prevent unexpected data payloads.
4. **[Dashboard]** Migrate the dashboard's authentication to use `HttpOnly` cookies instead of `localStorage`.

> [!TIP]
> **Would you like me to start implementing these fixes right now?** We can begin with the high-priority Mobile App token storage fix and the Backend CORS lockdown.
