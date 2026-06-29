# PropLead AI — Frontend

> AI-powered real estate lead engine dashboard. Built with Next.js 16 + React 19 + Tailwind CSS v4 + TypeScript 6.

[![Live Demo](https://img.shields.io/badge/Live_Demo-vercel.app-000000?style=flat-square&logo=vercel&logoColor=white)](https://plead.vercel.app)
[![Backend Repo](https://img.shields.io/badge/Backend_Repo-GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/tarekul42/plead-backend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## 📋 Overview

PropLead is a full-featured real estate lead engine that helps agencies manage properties, leads, and AI-powered marketing. The frontend provides role-based dashboards (Agent / Manager / Admin), property exploration with advanced filters, AI match scoring with natural language reasons, blog management, review moderation, and a polished landing page with Framer Motion animations.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| UI Runtime | React 19 |
| Language | TypeScript 6 |
| Styling | Tailwind CSS v4 |
| Authentication | Clerk (`@clerk/nextjs`) |
| Server State | TanStack Query v5 |
| Client State | Zustand |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animations | Framer Motion |
| HTTP Client | Axios |
| Icons | Lucide React |
| Theme | next-themes (light/dark) |
| Testing | Vitest + Playwright |
| Package Manager | Bun |

---

## ✨ Main Features

- **13-section Landing Page** — Hero with Framer Motion animations, stats counter, featured properties, categories, AI showcase, testimonials, FAQ accordion, newsletter CTA
- **Property Explore** — Debounced search, 6+ filters (type, status, beds, baths, price range), sort, URL-synced pagination, mobile filter drawer, skeleton loaders
- **Property Detail** — Image gallery with lightbox, specs grid, features, location map, sticky inquiry sidebar
- **Authentication** — Clerk sign-in/sign-up with PropLead theme, demo login buttons (Agent / Manager / Admin)
- **Role-Based Dashboard** — Agent / Manager / Admin views with per-role sidebar menus (6/7/9 items)
- **Agent Overview** — 4 stat cards, 3 charts (line/pie/bar via Recharts), recent leads table
- **Manager Overview** — Team analytics, leads-by-agent chart, top performers leaderboard
- **Admin Overview** — Platform-wide stats, activity chart, lead distribution pie chart
- **Leads Management** — Table view + 5-column Kanban (New → Contacted → Qualified → Won → Lost), search
- **Lead Detail** — Lead profile + AI Match Panel with scored results and natural language reasons
- **Interactions** — Log form (type, outcome, notes) + timeline view per lead
- **Properties CRUD** — Table list with edit/delete/AI-generate, add/edit forms with AI description generator
- **AI Tools** — 3-tab interface (Match Engine, Description Generator, Email Generator) with loading states
- **AI Usage Analytics** — Daily generations chart, type breakdown pie chart, recent generations table
- **Blog Management** — List table, new/edit forms with markdown editor, draft/publish toggle
- **Agents Page** — Team performance table with conversion rates, ratings
- **Users Page** — Role management with inline role change, active/inactive toggle
- **Reviews Moderation** — Filter tabs (All/Pending/Approved/Flagged), approve/delete actions
- **Static Pages** — About, Contact (form), Help (searchable FAQ), Privacy, Terms
- **Profile Settings** — Edit name, title, phone
- **Dark Mode** — Full dark mode via next-themes with persisted preference
- **SEO** — Metadata on every page, sitemap.xml, robots.txt
- **Toast Notifications** — Global toast system (success/error/info/warning)

---

## 📦 Main Dependencies

### Runtime

`next`, `react`, `react-dom`, `@clerk/nextjs`, `@tanstack/react-query`, `axios`, `zustand`, `next-themes`, `framer-motion`, `lucide-react`, `recharts`, `react-hook-form`, `@hookform/resolvers`, `zod`, `clsx`, `tailwind-merge`, `class-variance-authority`

### Dev

`typescript`, `@types/*`, `eslint`, `eslint-config-next`, `prettier`, `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `vitest`, `@playwright/test`, `@testing-library/react`, `jsdom`, `husky`, `lint-staged`

---

## 🚀 Run Locally

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Backend API running locally or deployed — see the [Backend Repository](https://github.com/tarekul42/plead-backend)
- [Clerk](https://clerk.com/) account (free tier)

### Setup

```bash
# 1. Clone
git clone https://github.com/tarekul42/plead-frontend.git
cd plead-frontend

# 2. Install dependencies
bun install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your keys (see table below)

# 4. Start dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080/api/v1` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_test_xxx` |
| `NEXT_CLERK_SECRET_KEY` | Clerk secret key | `sk_test_xxx` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page path | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page path | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Post-login redirect | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Post-registration redirect | `/dashboard` |
| `NEXT_PUBLIC_DEMO_AGENT_EMAIL` | Demo agent email (one-click login) | `agent@proplead.ai` |
| `NEXT_PUBLIC_DEMO_AGENT_PASSWORD` | Demo agent password | `Ag7$k9mX!pQ2` |
| `NEXT_PUBLIC_DEMO_MANAGER_EMAIL` | Demo manager email | `manager@proplead.ai` |
| `NEXT_PUBLIC_DEMO_MANAGER_PASSWORD` | Demo manager password | `Mgr8$jL3!nR5` |
| `NEXT_PUBLIC_DEMO_ADMIN_EMAIL` | Demo admin email | `admin@proplead.ai` |
| `NEXT_PUBLIC_DEMO_ADMIN_PASSWORD` | Demo admin password | `Adm4$vB7!wX1` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (upload widget) | `your-cloud-name` |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN (optional) | `https://xxx@ingest.sentry.io/xxx` |

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Next.js dev server |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run typecheck` | Type-check without emitting |
| `bun run lint` | Run ESLint |
| `bun run test` | Run Vitest unit tests |
| `bun run test:e2e` | Run Playwright E2E tests |

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| 🌐 **Live Demo** | https://plead.vercel.app |
| 🖥️ **Backend Repo** | https://github.com/tarekul42/plead-backend |
| 📚 **Live API** | https://plead-api.onrender.com |
| 📧 **Contact** | tarekulrifat142@gmail.com |

---

## 📄 License

MIT © Tarekul Islam Rifat

---

<div align="center">

**⭐ If this project helped you, give it a star!**

Built by [Tarekul Islam Rifat](https://github.com/tarekul42)

</div>
