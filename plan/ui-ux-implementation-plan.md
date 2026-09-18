# PropLead AI — Public Routes UI/UX Implementation Plan

## Overview

This plan covers a full UI/UX overhaul of all public-facing routes in the PropLead AI frontend. Work is divided into 6 phases, ordered by impact and dependency. Each phase is a single PR; each fix within a phase is a separate commit.

**Current state:** Functional but with critical bugs (fake forms, broken links, dynamic Tailwind failures), accessibility gaps, and inconsistent design patterns.

**Target state:** Polished, accessible, trustworthy public experience ready for production launch.

---

## Phase 0: Critical Bug Fixes

These are broken features that actively harm users or render components visually broken.

### 0.1 — Fix Dynamic Tailwind Classes

**Problem:** Tailwind cannot detect dynamically constructed class names at build time. `bg-${match.color}/10` and `text-${stat.color}` produce empty styles.

**Files affected:**
- `src/components/landing/hero.tsx` — match score badges, colored dots
- `src/components/landing/stats-bar.tsx` — stat icons

**Fix:**
```ts
// Replace dynamic construction with a lookup map
const colorMap: Record<string, { bg: string; text: string; light: string }> = {
  brand:   { bg: "bg-brand/10",   text: "text-brand",   light: "bg-brand/20" },
  success: { bg: "bg-success/10", text: "text-success", light: "bg-success/20" },
  warning: { bg: "bg-warning/10", text: "text-warning", light: "bg-warning/20" },
  danger:  { bg: "bg-danger/10",  text: "text-danger",  light: "bg-danger/20" },
};
```

Apply the same pattern in both files. Verify all colored elements render correctly in both light and dark mode.

---

### 0.2 — Fix Broken Blog Posts

**Problem:** 3 of 6 listed blog posts have no content defined. Clicking them shows "Post not found."

**File:** `src/app/(public)/blog/[slug]/page.tsx`

**Fix options (choose one):**
- A) Add real content for all 6 posts (preferred if content exists)
- B) Remove the 3 broken posts from the listing array in `blog/page.tsx`
- C) Show a "Coming Soon" state for posts without content instead of "Post not found"

**Recommendation:** Option B for now, with a TODO to add content later. Broken links damage trust.

---

### 0.3 — Fix Broken Footer Links

**Problem:** Footer links to `/pricing`, `/careers`, `/cookies` — none of these pages exist.

**File:** `src/components/layout/public-footer.tsx`

**Fix:** Remove all three links. Update the link lists to only include working routes:
- Product: Explore, How it Works, AI Features
- Company: About, Blog, Contact
- Legal: Privacy, Terms, Help

---

### 0.4 — Fix Placeholder Social Links

**Problem:** GitHub/Twitter/LinkedIn link to generic homepages (`github.com`, `twitter.com`, `linkedin.com`).

**File:** `src/components/layout/public-footer.tsx`

**Fix:** Either:
- A) Point to actual PropLead profiles (if they exist)
- B) Remove the social links section entirely until real profiles are created
- C) Use `mailto:` for email only, remove the rest

**Recommendation:** Option B — placeholder links look unprofessional.

---

### 0.5 — Fix Non-Functional "Share" Button

**Problem:** Share button on property detail page has no `onClick` handler.

**File:** `src/app/(public)/properties/[slug]/page.tsx`

**Fix:**
```tsx
const handleShare = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied!", description: "Property link copied to clipboard" });
  } catch {
    toast({ title: "Failed to copy", variant: "destructive" });
  }
};
```

Wire `handleShare` to the Share button's `onClick`. Verify the global toast system is available.

---

### 0.6 — Fix Fake Contact Form

**Problem:** Form submission does nothing — just sets `submitted = true` without any API call.

**File:** `src/app/(public)/contact/page.tsx`

**Fix options (choose one):**
- A) Integrate with a form service (Formspree, Getform, etc.) — requires signing up and adding API key to `.env`
- B) Use `mailto:` link as the primary CTA, remove the fake form
- C) Keep the form but clearly label: "This form is currently a demo. Email us directly at hello@proplead.ai"

**Recommendation:** Option C for now (no backend dependency), with a TODO for real integration.

---

### 0.7 — Fix Fake Newsletter Subscribe

**Problem:** Subscribe is a `setTimeout` mock — no backend integration.

**File:** `src/components/landing/newsletter-cta.tsx`

**Fix:** Same approach as contact form — either integrate with a real service, or clearly label as demo. Add privacy note: "We respect your privacy. Unsubscribe anytime."

---

## Phase 1: High-Priority UX Fixes

### 1.1 — Fix "Save" Button Persistence

**Problem:** Save heart toggles local state but doesn't persist. User loses saved state on navigation.

**Files:** `src/components/properties/property-card.tsx`, `src/app/(public)/properties/[slug]/page.tsx`

**Fix (interim):** Use `localStorage` to persist saved property IDs:
```ts
// Hook: useSavedProperties
const getSaved = (): string[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("savedProperties") || "[]");
};

const toggleSave = (id: string) => {
  const saved = getSaved();
  const next = saved.includes(id) ? saved.filter(s => s !== id) : [...saved, id];
  localStorage.setItem("savedProperties", JSON.stringify(next));
  return next.includes(id);
};

const isSaved = (id: string) => getSaved().includes(id);
```

Extract into `src/hooks/use-saved-properties.ts`. Update both `PropertyCard` and property detail page to use this hook. Add a TODO comment for API integration.

---

### 1.2 — Fix "Inquire Now" Auth Check

**Problem:** Always redirects to `/sign-up`, even for logged-in users.

**File:** `src/app/(public)/properties/[slug]/page.tsx`

**Fix:**
```tsx
import { useUser } from "@clerk/nextjs";

// In the component:
const { isSignedIn } = useUser();

// In the CTA:
const handleInquire = () => {
  if (isSignedIn) {
    // Option A: scroll to a contact form section on the page
    // Option B: open a modal
    // Option C: link to /contact with property context
    router.push(`/contact?property=${property._id}`);
  } else {
    router.push("/sign-in");
  }
};
```

**Recommendation:** Option C — redirect to contact page with property ID as a query param. The contact form can then pre-fill the subject line.

---

### 1.3 — Fix Stats Bar Clarity

**Problem:** "Avg Deal Time: 52%" is ambiguous — users don't know what the metric represents.

**File:** `src/components/landing/stats-bar.tsx`

**Fix:** Change the stat to:
```ts
{
  label: "Faster Closes",
  value: 52,
  suffix: "%",
  icon: TrendingDown,
  color: "success",
  description: "Reduction in average deal closing time",
}
```

Or: "Avg Close Time" with value "47 days" and a secondary label "52% faster than industry avg".

---

### 1.4 — Deduplicate Featured/Top Rated Properties

**Problem:** If fewer than 8 properties exist, both sections show identical cards.

**Files:** `src/components/landing/featured-properties.tsx`, `src/components/landing/top-rated-properties.tsx`

**Fix:** Pass excluded IDs from FeaturedProperties to TopRatedProperties:
```tsx
// In page.tsx (landing page):
const featuredIds = featuredProperties.map(p => p._id);

// Pass to TopRatedProperties
<TopRatedProperties excludeIds={featuredIds} />
```

In `TopRatedProperties`, filter out excluded IDs from the API query or after fetch.

---

### 1.5 — Extract Shared Blog Data

**Problem:** Blog post data is duplicated between `blog-teaser.tsx` and `blog/page.tsx`.

**Fix:**
1. Create `src/lib/blog-data.ts` with the shared `posts` array and `Post` type
2. Import from both `blog-teaser.tsx` and `blog/page.tsx`
3. Single source of truth for all blog content

---

### 1.6 — Fix Price Filter Validation

**Problem:** Price inputs accept negative values and min > max.

**File:** `src/components/properties/property-filters.tsx`

**Fix:**
```tsx
<input
  type="number"
  min="0"
  max={priceMax || undefined}
  placeholder="Min"
  value={priceMin}
  onChange={(e) => {
    const val = Number(e.target.value);
    if (val >= 0) updateFilter("priceMin", val > 0 ? String(val) : undefined);
  }}
/>
```

Apply the same pattern to max price input. Add visual validation message if min > max.

---

### 1.7 — Fix Mobile Navbar Gap

**Problem:** Desktop buttons hidden at `sm`, hamburger only shows at `md`. Gap between breakpoints.

**File:** `src/components/layout/public-navbar.tsx`

**Fix:** Change hamburger menu visibility from `md:hidden` to `sm:hidden`, so it appears as soon as desktop buttons hide:
```tsx
{/* Desktop buttons */}
<div className="hidden sm:flex items-center gap-2">
  {/* Sign in / Get started buttons */}
</div>

{/* Hamburger */}
<button className="sm:hidden ...">
```

---

## Phase 2: Accessibility & Mobile Improvements

### 2.1 — Add Skip-to-Content Link

**File:** `src/app/(public)/layout.tsx`

Add as the first child inside `<body>`:
```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
>
  Skip to content
</a>

<main id="main-content" className="min-h-screen">
  {children}
</main>
```

---

### 2.2 — Add `aria-expanded` to Mobile Hamburger

**File:** `src/components/layout/public-navbar.tsx`

```tsx
<button
  className="sm:hidden ..."
  onClick={() => setMobileOpen(!mobileOpen)}
  aria-expanded={mobileOpen}
  aria-label={mobileOpen ? "Close menu" : "Open menu"}
>
```

---

### 2.3 — Fix Mobile Filter Drawer

**File:** `src/app/(public)/properties/page.tsx`

**Animation:** Add CSS transition:
```tsx
<div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
  {/* Backdrop */}
</div>
<div className={`fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
  {/* Filter panel */}
</div>
```

**Focus trap:** Use a `useEffect` to:
1. Trap Tab/Shift+Tab inside the drawer when open
2. Return focus to the trigger button when closed
3. Add `role="dialog"` and `aria-modal="true"` to the drawer

---

### 2.4 — Add Touch/Swipe to Property Gallery

**File:** `src/components/properties/property-gallery.tsx`

Add touch handlers:
```tsx
const touchStart = useRef<number | null>(null);

const handleTouchStart = (e: React.TouchEvent) => {
  touchStart.current = e.touches[0].clientX;
};

const handleTouchEnd = (e: React.TouchEvent) => {
  if (touchStart.current === null) return;
  const diff = touchStart.current - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextImage();
    else prevImage();
  }
  touchStart.current = null;
};

// Apply to the main image container
<div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
```

---

### 2.5 — Improve Chip Remove Accessibility

**File:** `src/app/(public)/properties/page.tsx`

```tsx
<Chip
  key={filter.key}
  label={filter.label}
  onRemove={() => removeFilter(filter.key)}
  aria-label={`Remove ${filter.label} filter`}
/>
```

---

## Phase 3: Design System Foundations

### 3.1 — Establish Typography Scale

Create a consistent type hierarchy in `globals.css` or as Tailwind theme extensions:

| Token | Class | Usage |
|-------|-------|-------|
| Display | `text-5xl font-bold tracking-tight` | Hero headlines |
| H1 | `text-4xl font-bold` | Page titles |
| H2 | `text-3xl font-semibold` | Section headings |
| H3 | `text-2xl font-semibold` | Sub-section headings |
| H4 | `text-xl font-medium` | Card titles |
| Body | `text-base` | Default text |
| Small | `text-sm` | Secondary text |
| Caption | `text-xs` | Labels, timestamps |

Audit every page and apply the correct tier. No more ad-hoc `text-2xl` vs `text-3xl` choices.

---

### 3.2 — Create PageHeader Component

**New file:** `src/components/layout/page-header.tsx`

```tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="text-center py-12 px-4">
      <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
      {description && (
        <p className="text-lg text-muted max-w-2xl mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
```

Replace manual heading blocks in: About, Help, Contact, Properties, Blog, Terms, Privacy pages.

---

### 3.3 — Create Section Component

**New file:** `src/components/layout/section.tsx`

```tsx
interface SectionProps {
  children: React.ReactNode;
  variant?: "default" | "surface" | "brand";
  className?: string;
}

export function Section({ children, variant = "default", className }: SectionProps) {
  const bg = {
    default: "bg-background",
    surface: "bg-surface",
    brand: "bg-brand/5",
  }[variant];

  return (
    <section className={`${bg} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-container mx-auto">{children}</div>
    </section>
  );
}
```

Replace all `section` wrappers in landing page sections with `<Section>`.

---

### 3.4 — Create Standardized EmptyState Component

**New file:** `src/components/ui/empty-state.tsx`

```tsx
interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-muted/10 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
```

Use in: property grid empty state, blog empty state, search no-results, reviews empty state.

---

### 3.5 — Verify Toast Integration

Audit all user feedback points and ensure they use the global toast system:

| Action | Current Feedback | Should Be |
|--------|-----------------|-----------|
| Share button clicked | Nothing | Toast: "Link copied!" |
| Save toggled | Visual heart toggle only | Optional toast: "Saved to favorites" |
| Contact form submitted | Inline success state | Toast + inline |
| Newsletter subscribed | Inline success state | Toast + inline |
| Filter applied | Visual grid update | No toast needed |
| Error occurs | Error component | Toast: "Something went wrong" |

---

## Phase 4: Landing Page Enhancements

### 4.1 — How It Works: Add CTA

**File:** `src/components/landing/how-it-works.tsx`

Add after the 3-step grid:
```tsx
<div className="text-center mt-12">
  <Button asChild size="lg">
    <Link href="/sign-up">
      Get Started Free
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  </Button>
</div>
```

---

### 4.2 — AI Features Showcase: Add Third Feature + CTA

**File:** `src/components/landing/ai-features-showcase.tsx`

Add a third feature card (e.g., "Smart Analytics" or "Email Automation"). Add a CTA row at the bottom: "Try AI Features →" linking to `/sign-up`.

---

### 4.3 — Testimonials: Visual Variety

**File:** `src/components/landing/testimonials.tsx`

Add different colored avatar backgrounds:
```ts
const avatarColors = ["bg-brand/10", "bg-success/10", "bg-warning/10"];
```

Cycle through them for each testimonial. Add company logos as small grayscale images if available.

---

### 4.4 — Outcomes Chart: Add Y-Axis Label

**File:** `src/components/landing/outcomes-chart.tsx`

Add a Y-axis label via Recharts:
```tsx
<YAxis label={{ value: "Days to Close", angle: -90, position: "insideLeft" }} />
```

Evaluate if Recharts bundle size is justified. Consider a CSS-only bar chart as an alternative.

---

### 4.5 — Final CTA: Copy Update

**File:** `src/components/landing/final-cta.tsx`

- Change "Talk to sales" → "Have questions?"
- Add trust signal below buttons: "Join 500+ real estate professionals"

---

### 4.6 — Newsletter CTA: Privacy Note + Demo Label

**File:** `src/components/landing/newsletter-cta.tsx`

Add below the form:
```tsx
<p className="text-xs text-muted mt-3">
  We respect your privacy. Unsubscribe anytime.
</p>
{/* If keeping as demo: */}
<p className="text-xs text-warning mt-1">Demo — not yet connected to a mailing list</p>
```

---

## Phase 5: Page Redesigns

### 5.1 — About Page Redesign

**File:** `src/app/(public)/about/page.tsx`

Current: 52 lines, too thin.

**New structure:**
1. Hero section with mission statement
2. Founder story / "Why we built PropLead"
3. Values grid (existing 4 cards, improved copy)
4. Team section (1-2 people with photos, or "Meet the team" placeholder)
5. Timeline / milestones (founding, beta launch, etc.)
6. CTA: "Join us" or "Explore the platform"

---

### 5.2 — Help Center Redesign

**File:** `src/app/(public)/help/page.tsx`

Current: Flat list of 6 items.

**New structure:**
1. Search bar (keep)
2. Category cards: Getting Started, Properties, AI Features, Account, Billing
3. Each category expands to show articles
4. Articles have step-by-step format with screenshots
5. Link to external docs/knowledge base at the bottom
6. "Still need help?" section with contact link

---

### 5.3 — 404 Page Redesign

**File:** `src/app/(public)/not-found.tsx`

Current: Just 3 elements.

**New structure:**
1. Illustration or large "404" with brand styling
2. "Page not found" heading
3. "The page you're looking for doesn't exist or has been moved."
4. Navigation suggestions: "Popular pages" with links to Explore, Blog, Help
5. Search bar
6. "Go home" as a secondary link, not the only option

---

### 5.4 — Error Page Improvements

**File:** `src/app/(public)/error.tsx`

- Show error reference ID (from `error.digest`) for support
- Add "Go home" fallback link alongside "Try again"
- Better visual design with icon and descriptive text

---

### 5.5 — Legal Pages: Table of Contents

**Files:** `src/app/(public)/terms/page.tsx`, `src/app/(public)/privacy/page.tsx`

Add at the top of each page:
```tsx
<nav className="mb-8 p-4 bg-surface rounded-card">
  <h2 className="font-medium mb-2">Table of Contents</h2>
  <ul className="space-y-1">
    {sections.map((s) => (
      <li key={s.id}>
        <a href={`#${s.id}`} className="text-sm text-brand hover:underline">
          {s.title}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

Add `id` attributes to each section heading for anchor linking.

---

### 5.6 — Property Detail: Real Map

**File:** `src/app/(public)/properties/[slug]/page.tsx`

The env already has a Mapbox tile URL configured.

**Implementation options:**
- A) **Leaflet + OpenStreetMap** (free, no API key needed, ~40KB gzipped)
- B) **Mapbox GL JS** (requires token, more features)
- C) **Static map image** via Mapbox static API (no JS dependency)

**Recommendation:** Option A for zero cost. Install `react-leaflet` + `leaflet`, render a map centered on the property coordinates with a marker.

---

### 5.7 — Property Detail: Additional Fixes

**File:** `src/app/(public)/properties/[slug]/page.tsx`

- Fix status text capitalization: `property.status.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())`
- Add "Back to results" link that preserves filter state via `router.back()` or a constructed URL
- Improve mobile layout: sidebar should stack below main content on mobile instead of side-by-side

---

## Execution Summary

| Phase | PR Title | Commits | Est. Complexity |
|-------|----------|---------|-----------------|
| 0 | fix: critical bug fixes for public routes | 7 | Low-Medium |
| 1 | fix: high-priority UX improvements | 7 | Medium |
| 2 | feat: accessibility and mobile improvements | 5 | Medium |
| 3 | refactor: design system foundations | 5 | Low |
| 4 | feat: landing page enhancements | 6 | Low-Medium |
| 5 | feat: page redesigns and improvements | 7 | Medium-High |

**Total: ~37 commits across 6 PRs**

---

## Open Questions (Require User Decision)

1. **Contact form / newsletter:** Demo labeling, or real service integration? If real, which service?
2. **Save button:** localStorage interim acceptable?
3. **Property map:** Leaflet (free) or Mapbox (requires token)?
4. **Blog posts:** Remove broken ones, or add content?
5. **Social links:** Remove until real profiles exist, or point to project repo?
6. **Any brand/design references** to follow?
