# Praxia Labs - Project Documentation

**Last Updated:** 27 Mayo 2026  
**Status:** Migration Drizzle → Prisma (IN PROGRESS)  
**Owner:** Jose Maria Romero (@jmaria69)  
**Location:** `D:\web`

---

## 📋 Current Project State

### ✅ Completed This Session

1. **Fixed Authentication System**
   - Created `model AdminUser` in Prisma schema
   - Implemented login/logout with bcryptjs hashing
   - Added email normalization with `.toLowerCase()`
   - Created seed script (`scripts/seed.ts`) with two admin users
   - Admin accounts: `admin@test.com` + `jmaria.romero@praxialabs.com` (password: `Supercalif`)

2. **Database Setup**
   - PostgreSQL on Vercel
   - Prisma v5.22.0 as ORM
   - Created migration for AdminUser model

3. **Cleaned package.json**
   - Removed dead Drizzle dependencies (`drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`)
   - Updated build scripts for Prisma only

### ⚠️ In Progress: Drizzle → Prisma Migration

**Context:** Project has TWO ORMs mixed:

- **Drizzle:** `src/lib/db/`, `src/lib/repositories/projects.repository.ts`, `src/lib/repositories/crm.repository.ts`
- **Prisma:** `src/app/actions/auth.ts`, `src/app/api/contact/route.ts`

**Migration Work:**

- ✅ Schema updated with `AdminUser`, `CrmContact`, `Interaction`, `Contact`
- ⏳ Need to rewrite: `crm.repository.ts` → Prisma
- ⏳ Need to rewrite: `projects.repository.ts` → Prisma
- ⏳ Need to delete: `src/lib/db/index.ts`

**Files Ready (already provided):**

```
crm.repository.ts (rewritten with Prisma)
projects.repository.ts (rewritten with Prisma)
schema.prisma (with Project model added)
```

---

## 🏗️ Architecture

### Tech Stack

```
Frontend: Next.js 16.2.6 + React 19.2.4 + Tailwind CSS 4
Backend: Node.js + TypeScript
Database: PostgreSQL (Vercel)
ORM: Prisma v5.22.0 (in transition from Drizzle)
Auth: Session-based with JWT (jose) + bcryptjs
Email: Resend API
API Style: Server Actions + Route Handlers
```

### Folder Structure

```
src/
├── app/
│   ├── actions/auth.ts          [Server actions for login/logout] ✅
│   ├── api/contact/route.ts      [Contact form endpoint] ✅ (uses Prisma)
│   ├── admin/dashboard/page.tsx  [Admin dashboard] ⏳
│   └── layout.tsx               [Root layout]
├── lib/
│   ├── prisma.ts                [Prisma client singleton] ✅
│   ├── auth.ts                  [Session management] ✅
│   ├── repositories/
│   │   ├── crm.repository.ts     [CRM data layer] ⏳ (needs Prisma rewrite)
│   │   ├── projects.repository.ts [Projects data layer] ⏳ (needs Prisma rewrite)
│   │   └── dashboard.repository.ts [Dashboard stats aggregator] ✅
│   ├── db/
│   │   └── index.ts             [OLD Drizzle client] ❌ DELETE
│   └── projects.ts              [Seed data for projects]
├── types/
│   └── index.ts                 [TypeScript interfaces]
└── components/
    └── admin/                   [Dashboard UI components]

prisma/
├── schema.prisma                [Database schema] ⏳ (partially updated)
└── migrations/                  [Migration history]

scripts/
└── seed.ts                       [Database seed script] ✅
```

---

## 🗄️ Database Schema (Current - Prisma)

```prisma
model AdminUser {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  name          String
  role          String    @default("admin")
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  @@map("admin_users")
}

model Project {
  id               String    @id
  name             String
  description      String
  longDescription  String
  tech             String[]
  status           String    // "production" | "beta" | "development"
  category         String
  url              String?
  github           String?
  image            String
  color            String
  metricsUsers     Int?
  metricsRevenue   Float?
  metricsRating    Float?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  @@map("projects")
}

model Contact {
  id        String    @id @default(uuid())
  nombre    String
  email     String
  phone     String?
  createdAt DateTime  @default(now())
  @@map("contacts")
}

model CrmContact {
  id            String         @id @default(uuid())
  name          String
  email         String
  phone         String?
  company       String?
  source        String         @default("web")
  stage         String         @default("lead")
  value         Float          @default(0)
  notes         String
  tags          String[]
  lastContact   DateTime       @default(now())
  createdAt     DateTime       @default(now())
  interactions  Interaction[]
  @@map("crm_contacts")
}

model Interaction {
  id        String    @id @default(uuid())
  contactId String
  contact   CrmContact @relation(fields: [contactId], references: [id], onDelete: Cascade)
  type      String
  date      DateTime  @default(now())
  summary   String
  @@map("interactions")
}
```

---

## 🔐 Authentication Flow

### Login Process

1. User submits email + password in form
2. `src/app/actions/auth.ts:login()` validates input with Zod schema
3. Query: `prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } })`
4. Compare password hash with bcryptjs `.compare()`
5. If valid: create session with `createSession()` (Jose JWT)
6. Redirect to `/admin/dashboard`

### Session Management

- **Created by:** `src/lib/auth.ts:createSession()`
- **Stored:** HTTP-only cookie
- **Used in:** Server Components via `getSession()`
- **Clear on:** `logout()` → deletes session → redirects to `/login`

### Important: Email Normalization

- All email lookups use `.toLowerCase()`
- Applied in: `getAdminByEmail()`, `login()`, `changePassword()`
- Schema: `@unique` on email field (case-sensitive in PostgreSQL)

---

## 📝 Environment Variables (.env.local)

```bash
# Database
DATABASE_URL=postgresql://user:password@host/dbname

# Admin
AUTH_SECRET=minimo32caracteres
ADMIN_EMAIL=jmaria.romero@praxialabs.com
ADMIN_PASSWORD=Supercalif

# JWT
JWT_SECRET=minimo32caracteres

# Email
RESEND_API_KEY=re_xxxxxxxxxx

# Analytics
NEXT_PUBLIC_GA_ID=G-CQ6W47R42W

# Google Maps (if used)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxxxxxxx
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev                  # Start dev server on :3000

# Build & Deploy
npm run build               # Compile + Prisma generate
npm start                   # Production server

# Database
npm run db:seed            # Seed admin users (scripts/seed.ts)

# Code Quality
npm run lint               # ESLint
```

---

## 🚀 Deployment Checklist

- [ ] All Drizzle code replaced with Prisma
- [ ] `src/lib/db/index.ts` deleted
- [ ] All repositories working with Prisma
- [ ] CSP headers configured for Google Analytics + Leaflet
- [ ] Environment variables set in Vercel
- [ ] Database migrated to Vercel Postgres
- [ ] Seed script executed in production
- [ ] Admin accounts created
- [ ] Login works in production
- [ ] Build passes without errors

---

## 🔧 Next Steps (Priority Order)

### 1. Complete Drizzle → Prisma Migration (TODAY)

```bash
# 1. Update schema.prisma with Project model
# 2. Replace crm.repository.ts (provided in claude.md)
# 3. Replace projects.repository.ts (provided in claude.md)
# 4. Delete src/lib/db/index.ts
# 5. Test migrations
npx prisma migrate dev
npm run build
npm run dev
```

### 2. Fix CSP (Content Security Policy)

- Google Analytics (`https://www.googletagmanager.com`)
- Leaflet CSS/JS (`https://unpkg.com`)
- Update in `next.config.ts` or `src/app/layout.tsx`

### 3. Build Dashboard

- Display real CRM contacts
- Show project metrics
- Real-time traffic (GA integration)

### 4. Deploy to GitHub

```bash
git add .
git commit -m "Migration: Drizzle → Prisma complete"
git push origin main
```

### 5. Deploy to Vercel

- Connect GitHub repo
- Set environment variables
- Deploy
- Verify login works
- Verify database connections

---

## 🐛 Known Issues & Solutions

### Issue: "Cannot read properties of undefined (reading 'findUnique')"

**Cause:** `prisma.adminUser` is `undefined`  
**Solution:** Model doesn't exist in schema. Add to `schema.prisma` and migrate.

### Issue: "Admin encontrado: undefined" after logout

**Cause:** Database cleaned between sessions OR email not normalized  
**Solution:**

- Run `npm run db:seed` to recreate admins
- Ensure `email.toLowerCase()` used in queries

### Issue: Build error "Module not found: @neondatabase/serverless"

**Cause:** Drizzle code still importing removed dependency  
**Solution:** Replace `crm.repository.ts` and `projects.repository.ts` with Prisma versions

### Issue: CSP blocks Google Analytics

**Cause:** `script-src` policy doesn't include `https://www.googletagmanager.com`  
**Solution:** Update CSP headers in next.config.ts

---

## 📂 Key Files to Remember

| File | Purpose | Status |
|------|---------|--------|
| `src/app/actions/auth.ts` | Login/logout logic | ✅ Working |
| `src/lib/prisma.ts` | Prisma singleton | ✅ Working |
| `src/lib/auth.ts` | Session management | ✅ Working |
| `prisma/schema.prisma` | Database schema | ⏳ Partial |
| `src/lib/repositories/crm.repository.ts` | CRM data access | ⏳ Needs rewrite |
| `src/lib/repositories/projects.repository.ts` | Projects data access | ⏳ Needs rewrite |
| `src/lib/db/index.ts` | OLD Drizzle client | ❌ Delete |
| `scripts/seed.ts` | Admin seeding | ✅ Working |
| `package.json` | Dependencies | ✅ Cleaned |

---

## 💡 Development Tips

### Run admin locally

```bash
npm run db:seed
npm run dev
# Visit http://localhost:3000/login
# Email: admin@test.com
# Password: admin123
```

### Debug Prisma queries

Add to any file:

```typescript
import { prisma } from "@/lib/prisma";

// Enable query logging
prisma.$on('query', (e) => {
  console.log('Query:', e.query);
  console.log('Duration:', e.duration + 'ms');
});
```

### Verify Prisma schema

```bash
npx prisma validate
```

### Generate new migration

```bash
npx prisma migrate dev --name describe_your_change
```

---

## 📞 Quick Reference

**Admin Credentials (Dev)**

- Email: `admin@test.com` OR `jmaria.romero@praxialabs.com`
- Password: `Supercalif` (or `admin123` for test account)

**Database**

- Provider: PostgreSQL
- ORM: Prisma v5.22.0
- Client: `@prisma/client`

**Authentication**

- Method: Session-based JWT
- Token library: `jose`
- Password hashing: `bcryptjs`
- Session storage: HTTP-only cookie

---

## 🎯 Session Goals Recap

✅ **Completed**

- Fixed auth system with Prisma
- Created AdminUser model
- Implemented working login/logout
- Cleaned up package.json
- Created admin seed script

⏳ **In Progress**

- Migrate remaining repositories to Prisma
- Fix CSP headers for external resources
- Complete dashboard implementation

🚀 **Ready for Deploy**

- All auth infrastructure
- Database migrations
- Environment setup

---

**Generated by Claude**  
For next session: Review "Next Steps" section and complete remaining Prisma migration tasks.
