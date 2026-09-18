# PropLead AI — Public Routes UI/UX Implementation Plan

## Overview

Zero hardcoded data. Everything from the backend. If the backend endpoint doesn't exist, it's documented here for implementation.

**Current state:** Frontend has hardcoded blog posts, testimonials, stats, categories, FAQ, contact form (fake), newsletter (fake), save button (local state only). Backend has some endpoints but many are auth-gated or missing.

**Target state:** Every piece of data on public routes is fetched from the backend API.

---

## Backend API Audit

### What Already Exists

| Endpoint | Auth Required | Public Access? | Notes |
|----------|--------------|----------------|-------|
| `GET /properties` | No | Yes (with agencyId param) | Works, needs agencyId handling for public |
| `GET /properties/:slug` | No | Yes | Works |
| `GET /properties/:id/related` | No | Yes | Works |
| `GET /blog` | YES | NO | Needs public version |
| `GET /blog/:slug` | YES | NO | Needs public version |
| `GET /reviews` | YES | NO | Needs public read |
| `GET /properties/:id/reviews` | YES | NO | Needs public read |
| `POST /reviews` | YES | NO | Needs public write for logged-in users |
| `GET /users/me` | YES | NO | OK |
| `GET /leads/stats` | YES | NO | OK (dashboard only) |
| `GET /admin/stats` | YES | NO | OK (admin only) |

### What Needs to Be Built (Backend)

| Priority | Endpoint | Purpose |
|----------|----------|---------|
| **CRITICAL** | `GET /public/blog` | Public blog listing (no auth, status=published only) |
| **CRITICAL** | `GET /public/blog/:slug` | Public blog detail (no auth, status=published only) |
| **CRITICAL** | `POST /contact` | Contact form submission |
| **CRITICAL** | `POST /newsletter/subscribe` | Newsletter subscription |
| **HIGH** | `GET /public/stats` | Platform-wide stats (property count, lead count, etc.) |
| **HIGH** | `GET /properties/category-counts` | Count of properties per type |
| **HIGH** | `POST /favorites` | Save a property to favorites |
| **HIGH** | `DELETE /favorites/:propertyId` | Remove from favorites |
| **HIGH** | `GET /favorites` | List user's saved properties |
| **HIGH** | `GET /favorites/check/:propertyId` | Check if property is saved |
| **MEDIUM** | `GET /public/testimonials` | Public testimonials |
| **MEDIUM** | `GET /public/faq` | Public FAQ content |
| **MEDIUM** | `GET /public/outcomes` | Outcomes chart data |

---

## Phase 0: Backend — New Endpoints (plead-backend)

### 0.1 — Public Blog Endpoints

**Problem:** All blog routes require auth. Public blog pages can't fetch data.

**Fix:** Add public routes that only return `status: "published"` blogs, no agency scoping.

**New file:** `src/modules/blogs/blogs.public.routes.ts`

```ts
import { Router } from "express";
import { BlogsPublicController } from "./blogs.public.controller";
import { validate } from "../../core/middleware/validate.middleware";
import { blogSlugParamSchema, listBlogsQuerySchema } from "./blogs.validation";

const blogsPublicRouter = Router();

blogsPublicRouter.get("/", validate(listBlogsQuerySchema, "query"), BlogsPublicController.list);
blogsPublicRouter.get("/:slug", validate(blogSlugParamSchema, "params"), BlogsPublicController.getBySlug);

export { blogsPublicRouter };
```

**New file:** `src/modules/blogs/blogs.public.controller.ts`

- `list`: Returns published blogs only, no agency filtering. Paginated.
- `getBySlug`: Returns a single published blog by slug. No agency filtering.

**Register in `app.ts`:** `app.use("/api/v1/public/blog", blogsPublicRouter);`

**Key difference from existing controller:** No `req.user!.agencyId` — returns all published blogs across all agencies.

---

### 0.2 — Contact Form Endpoint

**New files:**
- `src/modules/contact/contact.model.ts`
- `src/modules/contact/contact.service.ts`
- `src/modules/contact/contact.controller.ts`
- `src/modules/contact/contact.routes.ts`
- `src/modules/contact/contact.validation.ts`

**Model:**
```ts
interface IContact {
  name: string;
  email: string;
  subject: string;
  message: string;
  propertyId?: mongoose.Types.ObjectId; // optional, for property inquiries
  status: "new" | "read" | "replied";
  createdAt: Date;
}
```

**Validation:**
```ts
const createContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  propertyId: objectId.optional(),
});
```

**Endpoint:** `POST /api/v1/contact` (no auth required, rate-limited)

**Register:** `app.use("/api/v1/contact", contactRouter);`

---

### 0.3 — Newsletter Subscribe Endpoint

**New files:**
- `src/modules/newsletter/newsletter.model.ts`
- `src/modules/newsletter/newsletter.service.ts`
- `src/modules/newsletter/newsletter.controller.ts`
- `src/modules/newsletter/newsletter.routes.ts`
- `src/modules/newsletter/newsletter.validation.ts`

**Model:**
```ts
interface INewsletter {
  email: string;
  status: "active" | "unsubscribed";
  subscribedAt: Date;
  unsubscribedAt?: Date;
}
```

**Endpoint:** `POST /api/v1/newsletter/subscribe` (no auth required, rate-limited)

**Register:** `app.use("/api/v1/newsletter", newsletterRouter);`

---

### 0.4 — Public Stats Endpoint

**New file or add to existing controller.**

**Endpoint:** `GET /api/v1/public/stats` (no auth required)

**Returns:**
```json
{
  "propertiesListed": 1247,
  "leadsTracked": 5832,
  "aiMatchesMade": 28491,
  "avgCloseTimeReduction": 52
}
```

**Implementation:** Aggregate queries on PropertyModel, LeadModel, and AiGeneratedCopyModel.

**Register:** `app.use("/api/v1/public", publicRouter);`

---

### 0.5 — Property Category Counts

**Add to properties service or create public endpoint.**

**Endpoint:** `GET /api/v1/properties/category-counts` (no auth required)

**Returns:**
```json
{
  "house": 240,
  "apartment": 320,
  "condo": 180,
  "townhouse": 95,
  "land": 60,
  "commercial": 45
}
```

**Implementation:** MongoDB aggregation: `PropertyModel.aggregate([{ $group: { _id: "$propertyType", count: { $sum: 1 } } }])`

---

### 0.6 — Favorites/Saved Properties

**New files:**
- `src/modules/favorites/favorites.model.ts`
- `src/modules/favorites/favorites.service.ts`
- `src/modules/favorites/favorites.controller.ts`
- `src/modules/favorites/favorites.routes.ts`

**Model:**
```ts
interface IFavorite {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  agencyId: mongoose.Types.ObjectId;
  createdAt: Date;
}
```

**Endpoints (auth required):**
- `POST /api/v1/favorites` — `{ propertyId: string }`
- `DELETE /api/v1/favorites/:propertyId`
- `GET /api/v1/favorites` — list user's favorites
- `GET /api/v1/favorites/check/:propertyId` — boolean check

**Compound unique index:** `{ userId, propertyId }` to prevent duplicates.

**Register:** `app.use("/api/v1/favorites", favoritesRouter);`

---

### 0.7 — Public Testimonials

**New files:**
- `src/modules/testimonials/testimonials.model.ts`
- `src/modules/testimonials/testimonials.service.ts`
- `src/modules/testimonials/testimonials.controller.ts`
- `src/modules/testimonials/testimonials.routes.ts`

**Model:**
```ts
interface ITestimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
}
```

**Endpoint:** `GET /api/v1/public/testimonials` (no auth required)

**Register:** `app.use("/api/v1/public", publicRouter);`

---

### 0.8 — Public FAQ

**New files:**
- `src/modules/faq/faq.model.ts`
- `src/modules/faq/faq.controller.ts`
- `src/modules/faq/faq.routes.ts`

**Model:**
```ts
interface IFAQ {
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}
```

**Endpoint:** `GET /api/v1/public/faq` (no auth required)

---

### 0.9 — Fix Blog Auth Requirement

**Problem:** Existing `GET /api/v1/blog` requires auth. The dashboard blog management uses this.

**Fix:** Keep existing auth-gated routes for dashboard. Add new public routes as described in 0.1. The public routes go under `/api/v1/public/blog` and don't require auth.

---

### 0.10 — Fix Properties agencyId for Public Access

**Problem:** `GET /properties` requires `agencyId` from `req.user` or query param. Public users aren't authenticated.

**Fix:** For public property listing, either:
- A) Pass `agencyId` as a required query param from the frontend (e.g., `?agencyId=xxx`)
- B) Create a public endpoint that doesn't filter by agency
- C) Use a default agency ID for public access

**Recommendation:** Option A — the frontend knows which agency to show (from env var or config). The existing endpoint already supports `agencyId` as a query param.

---

## Phase 1: Frontend — API Client Updates (plead-frontend)

### 1.1 — Add New API Endpoints to Client

**File:** `src/lib/api-client.ts`

Add:
```ts
export const contactApi = {
  submit: (data: { name: string; email: string; subject: string; message: string; propertyId?: string }) =>
    apiClient.post("/contact", data).then(extractData),
};

export const newsletterApi = {
  subscribe: (data: { email: string }) =>
    apiClient.post("/newsletter/subscribe", data).then(extractData),
};

export const publicApi = {
  stats: () => apiClient.get("/public/stats").then(extractData),
  testimonials: () => apiClient.get("/public/testimonials").then(extractData),
  faq: () => apiClient.get("/public/faq").then(extractData),
  blogList: (params?: Record<string, unknown>) =>
    apiClient.get("/public/blog", { params }).then(extractPaginatedData),
  blogGet: (slug: string) => apiClient.get(`/public/blog/${slug}`).then(extractData),
};

export const favoritesApi = {
  list: () => apiClient.get("/favorites").then(extractPaginatedData),
  add: (propertyId: string) => apiClient.post("/favorites", { propertyId }).then(extractData),
  remove: (propertyId: string) => apiClient.delete(`/favorites/${propertyId}`).then(extractData),
  check: (propertyId: string) => apiClient.get(`/favorites/check/${propertyId}`).then(extractData),
};

export const propertiesApiExtended = {
  categoryCounts: () => apiClient.get("/properties/category-counts").then(extractData),
};
```

### 1.2 — Add React Query Hooks

**New file:** `src/lib/queries/use-public.ts`

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/query";
import { publicApi, contactApi, newsletterApi, favoritesApi, propertiesApiExtended } from "@/lib/api-client";

// Public stats
export function usePublicStats() {
  return useQuery({ queryKey: ["public-stats"], queryFn: publicApi.stats });
}

// Public testimonials
export function useTestimonials() {
  return useQuery({ queryKey: ["testimonials"], queryFn: publicApi.testimonials });
}

// Public FAQ
export function useFaq() {
  return useQuery({ queryKey: ["faq"], queryFn: publicApi.faq });
}

// Public blog
export function usePublicBlogList(params?: Record<string, unknown>) {
  return useQuery({ queryKey: ["public-blog", params], queryFn: () => publicApi.blogList(params) });
}

export function usePublicBlogPost(slug: string) {
  return useQuery({ queryKey: ["public-blog", slug], queryFn: () => publicApi.blogGet(slug) });
}

// Contact form
export function useSubmitContact() {
  return useMutation({ mutationFn: contactApi.submit });
}

// Newsletter
export function useSubscribeNewsletter() {
  return useMutation({ mutationFn: newsletterApi.subscribe });
}

// Favorites
export function useFavorites() {
  return useQuery({ queryKey: ["favorites"], queryFn: favoritesApi.list });
}

export function useCheckFavorite(propertyId: string) {
  return useQuery({
    queryKey: ["favorites", propertyId],
    queryFn: () => favoritesApi.check(propertyId),
    enabled: !!propertyId,
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ propertyId, isFavorited }: { propertyId: string; isFavorited: boolean }) => {
      if (isFavorited) return favoritesApi.remove(propertyId);
      return favoritesApi.add(propertyId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

// Category counts
export function useCategoryCounts() {
  return useQuery({ queryKey: ["category-counts"], queryFn: propertiesApiExtended.categoryCounts });
}
```

---

## Phase 2: Frontend — Replace All Hardcoded Data

### 2.1 — Blog Pages → Use `usePublicBlogList` / `usePublicBlogPost`

**Files:**
- `src/components/landing/blog-teaser.tsx` — replace hardcoded array with `usePublicBlogList({ limit: 3 })`
- `src/app/(public)/blog/page.tsx` — replace hardcoded array with `usePublicBlogList()`
- `src/app/(public)/blog/[slug]/page.tsx` — replace hardcoded `posts` record with `usePublicBlogPost(slug)`

**Note:** Remove the duplicated blog data. Both `blog-teaser.tsx` and `blog/page.tsx` will use the same hook.

---

### 2.2 — Stats Bar → Use `usePublicStats`

**File:** `src/components/landing/stats-bar.tsx`

Replace hardcoded `stats` array with `usePublicStats()`. Map the API response to the component's expected format.

---

### 2.3 — Property Categories → Use `useCategoryCounts`

**File:** `src/components/landing/property-categories.tsx`

Replace hardcoded `categories` with `useCategoryCounts()`. Merge with `PROPERTY_CATEGORIES` from constants for labels/icons.

---

### 2.4 — Testimonials → Use `useTestimonials`

**File:** `src/components/landing/testimonials.tsx`

Replace hardcoded `testimonials` array with `useTestimonials()`.

---

### 2.5 — FAQ → Use `useFaq`

**File:** `src/components/landing/faq.tsx`

Replace hardcoded `faqs` array with `useFaq()`.

---

### 2.6 — Contact Form → Use `useSubmitContact`

**File:** `src/app/(public)/contact/page.tsx`

Replace `handleSubmit` with `useSubmitContact()` mutation. Add loading state, error handling, and real success feedback.

---

### 2.7 — Newsletter → Use `useSubscribeNewsletter`

**File:** `src/components/landing/newsletter-cta.tsx`

Replace `setTimeout` mock with `useSubscribeNewsletter()` mutation. Add loading state, error handling, and privacy note.

---

### 2.8 — Save Button → Use `useCheckFavorite` + `useToggleFavorite`

**Files:**
- `src/components/properties/property-card.tsx`
- `src/app/(public)/properties/[slug]/page.tsx`

Replace local `useState(false)` with `useCheckFavorite(propertyId)` and `useToggleFavorite()` mutation.

---

### 2.9 — Help Topics → Keep Hardcoded (or Build Endpoint)

The help topics are static support content. Options:
- A) Keep hardcoded (low risk, rarely changes)
- B) Build a `GET /public/help-topics` endpoint

**Recommendation:** Option A for now. Add a TODO comment.

---

### 2.10 — Hero Mock Matches → Keep as Marketing

The hero section's mock AI match cards are marketing illustration, not real data. Keep hardcoded but fix the dynamic Tailwind classes.

---

### 2.11 — Outcomes Chart → Keep as Marketing (or Build Endpoint)

The outcomes chart shows demo before/after data. Options:
- A) Keep hardcoded (marketing content)
- B) Build `GET /public/outcomes` endpoint

**Recommendation:** Option A for now.

---

## Phase 3: Frontend — Bug Fixes (No Backend Changes)

### 3.1 — Fix Dynamic Tailwind Classes

**Files:** `src/components/landing/hero.tsx`, `src/components/landing/stats-bar.tsx`

Replace `bg-${color}/10` with lookup map.

---

### 3.2 — Fix Broken Footer Links

**File:** `src/components/layout/public-footer.tsx`

Remove `/pricing`, `/careers`, `/cookies`. Update to only working routes.

---

### 3.3 — Fix Placeholder Social Links

**File:** `src/components/layout/public-footer.tsx`

Remove or replace generic GitHub/Twitter/LinkedIn URLs.

---

### 3.4 — Fix Non-Functional "Share" Button

**File:** `src/app/(public)/properties/[slug]/page.tsx`

Add `navigator.clipboard.writeText()` with toast feedback.

---

### 3.5 — Fix "Inquire Now" Auth Check

**File:** `src/app/(public)/properties/[slug]/page.tsx`

Check auth state. If signed in → `/contact?property={id}`. If not → `/sign-in`.

---

### 3.6 — Fix Stats Bar Clarity

**File:** `src/components/landing/stats-bar.tsx`

Change "Avg Deal Time: 52%" to "52% Faster Closes" or similar.

---

### 3.7 — Deduplicate Featured/Top Rated Properties

**Files:** `src/components/landing/featured-properties.tsx`, `src/components/landing/top-rated-properties.tsx`

Pass excluded IDs from FeaturedProperties to TopRatedProperties.

---

### 3.8 — Fix Price Filter Validation

**File:** `src/components/properties/property-filters.tsx`

Add `min="0"`, validate min <= max.

---

### 3.9 — Fix Mobile Navbar Gap

**File:** `src/components/layout/public-navbar.tsx`

Change hamburger from `md:hidden` to `sm:hidden`.

---

## Phase 4: Frontend — Accessibility & Mobile

### 4.1 — Add Skip-to-Content Link
### 4.2 — Add `aria-expanded` to Mobile Hamburger
### 4.3 — Fix Mobile Filter Drawer (animation + focus trap)
### 4.4 — Add Touch/Swipe to Property Gallery
### 4.5 — Improve Chip Remove Accessibility

---

## Phase 5: Frontend — Design System

### 5.1 — Typography Scale
### 5.2 — PageHeader Component
### 5.3 — Section Component
### 5.4 — EmptyState Component
### 5.5 — Toast Integration Audit

---

## Phase 6: Frontend — Landing Page Enhancements

### 6.1 — How It Works: Add CTA
### 6.2 — AI Features Showcase: Add Third Feature + CTA
### 6.3 — Testimonials: Visual Variety (from API data)
### 6.4 — Outcomes Chart: Add Y-Axis Label
### 6.5 — Final CTA: Copy Update
### 6.6 — Newsletter: Privacy Note (from real subscribe)

---

## Phase 7: Frontend — Page Redesigns

### 7.1 — About Page Redesign
### 7.2 — Help Center Redesign
### 7.3 — 404 Page Redesign
### 7.4 — Error Page Improvements
### 7.5 — Legal Pages: Table of Contents
### 7.6 — Property Detail: Real Map (Leaflet)
### 7.7 — Property Detail: Status Capitalization + Back Link

---

## Execution Order

| Step | What | Repo | Est. |
|------|------|------|------|
| 1 | Phase 0: Build all backend endpoints | plead-backend | High |
| 2 | Phase 1: Update frontend API client + hooks | plead-frontend | Medium |
| 3 | Phase 2: Replace all hardcoded data with API calls | plead-frontend | Medium |
| 4 | Phase 3: Bug fixes (no backend) | plead-frontend | Low |
| 5 | Phase 4: Accessibility + mobile | plead-frontend | Medium |
| 6 | Phase 5: Design system | plead-frontend | Low |
| 7 | Phase 6: Landing page enhancements | plead-frontend | Low |
| 8 | Phase 7: Page redesigns | plead-frontend | Medium |

---

## Summary: What to Build

### Backend (plead-backend)
1. Public blog endpoints (`/api/v1/public/blog`)
2. Contact form endpoint (`/api/v1/contact`)
3. Newsletter subscribe endpoint (`/api/v1/newsletter/subscribe`)
4. Public stats endpoint (`/api/v1/public/stats`)
5. Property category counts (`/api/v1/properties/category-counts`)
6. Favorites system (`/api/v1/favorites`)
7. Public testimonials (`/api/v1/public/testimonials`)
8. Public FAQ (`/api/v1/public/faq`)

### Frontend (plead-frontend)
1. API client additions (8 new API modules)
2. React Query hooks (use-public.ts)
3. Replace hardcoded data in 10+ components
4. Bug fixes (9 items)
5. Accessibility improvements (5 items)
6. Design system (5 items)
7. Landing page enhancements (6 items)
8. Page redesigns (7 items)
