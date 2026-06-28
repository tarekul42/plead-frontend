# PropLead AI — Frontend (`plead-frontend`)

> **Real Estate Lead Engine** — AI-powered SaaS for real estate agencies.
> Built with Next.js 14 (App Router) + TypeScript + Tailwind + ShadCN UI + HeroUI + Clerk.

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Prerequisites](#3-prerequisites)
4. [Environment Setup](#4-environment-setup)
5. [Installation & Run](#5-installation--run)
6. [Folder Structure](#6-folder-structure)
7. [Design System](#7-design-system)
8. [Routing & Pages](#8-routing--pages)
9. [Component Build Guide](#9-component-build-guide)
10. [Auth & RBAC Integration](#10-auth--rbac-integration)
11. [API Integration Patterns](#11-api-integration-patterns)
12. [State Management](#12-state-management)
13. [Forms & Validation](#13-forms--validation)
14. [Build Order (Recommended)](#14-build-order-recommended)
15. [Testing Strategy](#15-testing-strategy)
16. [Build & Deploy](#16-build--deploy)
17. [Troubleshooting](#17-troubleshooting)

---

## 1. Project Overview

**PropLead AI** is a multi-tenant SaaS platform for real estate agencies. The frontend is the user-facing layer that delivers:

- **Public site** — landing page, property explore, property details, blog, about, contact.
- **Auth flow** — sign-in / sign-up via Clerk (Google, GitHub, email/password, demo buttons).
- **Dashboard** — role-aware (Agent / Manager / Admin) with leads, properties, interactions, AI tools, analytics.

### Core AI Features (UI surfaces)
1. **AI Property Description Generator** — Dashboard > Add/Edit Property.
2. **AI Lead-to-Property Matcher** — Dashboard > Lead Profile > "Find Matching Properties" (returns top 3 with rationale).

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.4+ |
| UI Components | ShadCN UI + HeroUI | latest |
| Forms | React Hook Form + Zod | latest |
| Data Fetching | TanStack Query v5 + Axios | latest |
| State | Zustand | latest |
| Auth | Clerk (Next.js SDK) | latest |
| Charts | Recharts | latest |
| Maps | Leaflet + react-leaflet | latest |
| Icons | lucide-react | latest |
| Animation | Framer Motion | latest |
| Theme | next-themes | latest |
| Image Upload | Cloudinary Upload Widget | — |
| Testing | Jest + React Testing Library + Playwright | latest |

---

## 3. Prerequisites

- **Node.js** v18.17+ (LTS recommended) — check with `node -v`
- **pnpm** v8+ (preferred) or npm v9+
- **Git** v2.30+
- A **Clerk** account (free) — https://clerk.com
- A **Cloudinary** account (free) — https://cloudinary.com
- Backend API URL (see `plead-backend` README) — default `http://localhost:8080/api/v1`

---

## 4. Environment Setup

### 4.1 Clone & Install
```bash
git clone https://github.com/<your-org>/plead-frontend.git
cd plead-frontend
npm install
```

### 4.2 Create `.env.local`
Copy `.env.local.example` to `.env.local` and fill in.

### 4.3 Clerk Project Setup
1. Go to https://dashboard.clerk.com → create new application.
2. Enable **Email/Password**, **Google**, **GitHub** providers.
3. Copy keys into `.env.local`.

### 4.4 Cloudinary Setup
1. Go to https://cloudinary.com/console → create free account.
2. Create unsigned upload preset named `plead_properties`.

---

## 5. Installation & Run

### Development
```bash
npm run dev          # starts Next.js on http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
```

### Lint & Format
```bash
npm run lint
npm run format
```

### Type Check
```bash
npm run typecheck
```

### Tests
```bash
npm run test
npm run test:e2e
```

---

## 6. Folder Structure

```
plead-frontend/
├── app/
│   ├── (public)/                    # public routes group
│   │   ├── page.tsx                 # landing
│   │   ├── properties/
│   │   │   ├── page.tsx             # explore
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # detail
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── ...
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── leads/
│   │   ├── properties/
│   │   └── ...
│   ├── layout.tsx
│   ├── globals.css
│   └── middleware.ts
├── components/
│   ├── ui/                          # shadcn primitives
│   ├── layout/                      # navbar, footer, sidebar
│   ├── landing/                     # 8 landing sections
│   ├── properties/                  # cards, filters, gallery, map
│   ├── leads/                       # cards, table, kanban
│   ├── interactions/
│   ├── dashboard/
│   ├── charts/
│   ├── ai/
│   ├── forms/
│   └── common/
├── lib/
│   ├── api-client.ts
│   ├── queries/
│   ├── validations/
│   └── utils.ts
├── hooks/
├── store/
├── types/
├── providers/
└── tests/
```

---

## 7. Design System

### 7.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--primary-1` | `#0F172A` | Deep Slate — text, dark mode base |
| `--primary-2` | `#2563EB` | Vibrant Blue — primary buttons, active states |
| `--primary-3` | `#10B981` | Emerald Green — success, AI highlights |
| `--neutral-100` | `#F1F5F9` | Surface alt (light) |
| `--neutral-200` | `#E2E8F0` | Borders (light) |
| `--danger` | `#EF4444` | Error / delete |
| `--warning` | `#F59E0B` | Warnings |

### 7.2 Dark Mode Tokens
- Background: `#0F172A`
- Surface: `#1E293B`
- Border: `#334155`
- Text: `#F1F5F9`

### 7.3 Styling Rules
- **Card border-radius:** `rounded-xl` (12px) — uniform
- **Card padding:** `p-6` (24px)
- **Card shadow (light):** `shadow-sm`
- **Button border-radius:** `rounded-lg` (8px)
- **Button heights:** `h-9` (sm), `h-10` (md), `h-12` (lg)
- **Input border-radius:** `rounded-lg` (8px)
- **Max container width:** 1400px
- **Hover transitions:** `150ms ease-in-out`

### 7.4 Typography
- Headings: **Inter** (700/600/500)
- Body: **Inter** (400/500)
- Mono: **JetBrains Mono**

### 7.5 Responsiveness
- Breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- Mobile-first

---

## 8. Routing & Pages

### 8.1 Public Routes
| Path | Page |
|---|---|
| `/` | Landing (8 sections) |
| `/properties` | Explore |
| `/properties/[slug]` | Property Detail |
| `/about` | About |
| `/contact` | Contact |
| `/blog` | Blog List |
| `/blog/[slug]` | Blog Detail |
| `/help` | Help / FAQ |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

### 8.2 Auth Routes
| Path | Notes |
|---|---|
| `/sign-in` | Clerk `<SignIn />` with PropLead theme |
| `/sign-up` | Clerk `<SignUp />` with PropLead theme |

### 8.3 Dashboard Routes (protected)
| Path | Role |
|---|---|
| `/dashboard` | all |
| `/dashboard/leads` | all |
| `/dashboard/leads/[id]` | all |
| `/dashboard/properties` | manager/admin |
| `/dashboard/properties/new` | manager/admin |
| `/dashboard/ai-tools` | all |
| `/dashboard/agents` | manager/admin |
| `/dashboard/users` | admin |
| `/dashboard/reviews` | admin |
| `/dashboard/ai-usage` | manager/admin |
| `/dashboard/blog` | manager/admin |
| `/dashboard/profile` | all |

---

## 9. Component Build Guide

Every component follows this convention:
- **File:** `components/<category>/<name>.tsx`
- **Client component:** `"use client"` only if it uses hooks/state
- **Props:** fully typed with TypeScript
- **Styling:** Tailwind classes only (no inline styles)
- **Accessibility:** proper aria labels, semantic HTML

### Property Card
- image gallery thumbnail
- title, location, price
- beds/baths/area icons
- status badge
- "View Details" link

### Skeleton Loader
- matches the exact dimensions of the card
- pulsing animation via Tailwind `animate-pulse`

### AI Match Panel
- displays top 3 matches with score bars
- shows reasoning for each match
- loading state with spinner
- error state with retry

---

## 10. Auth & RBAC Integration

- Clerk handles authentication
- Dashboard routes protected via `middleware.ts`
- Role-based access via `<RoleGuard>` component
- `useCurrentUser` hook provides user + role + agencyId
- Demo login buttons rendered on sign-in page

---

## 11. API Integration Patterns

- Axios instance with dynamic auth token injection
- Module-specific API objects (`propertiesApi`, `leadsApi`, `aiApi`)
- TanStack Query hooks per resource
- Optimistic updates on mutations

---

## 12. State Management

- **Zustand** for UI state (sidebar, filters)
- **TanStack Query** for server state (properties, leads)
- **URL state** for filters and pagination

---

## 13. Forms & Validation

- Zod schemas mirroring backend validation
- React Hook Form with `@hookform/resolvers/zod`
- Cloudinary widget for image uploads

---

## 14. Build Order (Recommended)

1. **Foundation** — project setup, design system, providers, middleware
2. **Layout** — public navbar/footer, dashboard sidebar/navbar
3. **Public Pages** — landing (8 sections), explore, property detail
4. **Dashboard** — leads, properties, AI tools, admin pages
5. **Polish** — animations, error states, accessibility, Lighthouse audit

---

## 15. Testing Strategy

- **Unit tests** — Jest + RTL for components, hooks, and utils
- **Integration tests** — MSW + Jest for pages
- **E2E tests** — Playwright for critical flows (auth, explore, dashboard)
- **Accessibility** — jest-axe for a11y checks

---

## 16. Build & Deploy

```bash
npm run build        # production build
npm run start        # start production server
```

Deploy to Vercel:
1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables
4. Deploy

---

## 17. Troubleshooting

- **Module not found** — run `npm install`
- **Clerk errors** — verify `.env.local` keys are correct
- **Build fails** — run `npm run typecheck` to find TS errors
- **API 401** — ensure Clerk session token is being sent

---

## 18. License

MIT
