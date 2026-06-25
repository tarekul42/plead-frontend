# PropLead AI — Frontend

AI-powered real estate lead engine dashboard. Built with Next.js 16 + React 19 + Tailwind CSS v4 + TypeScript 6.

---

## Technologies

| Layer         | Technology                                |
| ------------- | ----------------------------------------- |
| Framework     | Next.js 16 (App Router) + React 19        |
| Language      | TypeScript 6                              |
| Styling       | Tailwind CSS v4                           |
| Auth          | Clerk (`@clerk/nextjs`)                   |
| State         | TanStack Query (server) + Zustand (client) |
| Forms         | React Hook Form + Zod                     |
| Charts        | Recharts                                  |
| Animations    | Framer Motion                             |
| HTTP Client   | Axios                                     |
| Icons         | Lucide React                              |
| Theme         | next-themes (light/dark)                  |

## Features

- **13-section Landing Page** — Hero with Framer Motion animations, stats counter, featured properties, categories, AI showcase, testimonials, FAQ accordion, newsletter CTA, and more
- **Property Explore** — Debounced search, 6+ filters (type, status, beds, baths, price range), sort, URL-synced pagination, mobile filter drawer, skeleton loaders
- **Property Detail** — Image gallery with lightbox, specs grid, features, location, sticky inquiry sidebar, loading states
- **Authentication** — Clerk sign-in/sign-up pages with PropLead theme, demo login buttons (Agent / Manager / Admin)
- **Role-Based Dashboard** — Agent / Manager / Admin views with per-role sidebar menus (6/7/9 items)
- **Agent Overview** — 4 stat cards, 3 charts (line/pie/bar via Recharts), recent leads table
- **Manager Overview** — Team analytics, leads-by-agent chart, top performers leaderboard
- **Admin Overview** — Platform-wide stats, activity chart, lead distribution pie chart
- **Leads Management** — Table view + 5-column Kanban (New → Contacted → Qualified → Won → Lost), search
- **Lead Detail** — Lead profile + AI Match Panel (call to action, loading state, scored results with reasons)
- **Interactions** — Log form (type, outcome, notes) + timeline view
- **Properties CRUD** — Table list with edit/delete/AI-generate, add/edit forms with AI description button
- **AI Tools** — 3-tab interface (Match Engine, Description Generator, Email Generator) with loading/success states
- **AI Usage Analytics** — Daily generations chart, type breakdown pie chart, recent generations table
- **Blog Management** — List table, new/edit forms with markdown editor
- **Agents Page** — Team performance table with conversion rates, rating
- **Users Page** — Role management with inline change, active/inactive toggle
- **Reviews Moderation** — Filter tabs (All/Pending/Approved/Flagged), approve/delete actions
- **Static Pages** — About, Contact (form), Help (searchable FAQ), Privacy, Terms
- **Blog** — List page with 6 posts, detail page with 3 full articles
- **Profile Settings** — Edit name, title, phone
- **Dark Mode** — Full dark mode support via next-themes
- **SEO** — Metadata on every page, sitemap.xml, robots.txt
- **Toast Notifications** — Global toast system (success/error/info/warning)

## Dependencies

### Production
`@clerk/nextjs`, `@hookform/resolvers`, `@tanstack/react-query`, `axios`, `class-variance-authority`, `clsx`, `framer-motion`, `lucide-react`, `next`, `next-themes`, `react`, `react-dom`, `react-hook-form`, `recharts`, `tailwind-merge`, `zod`, `zustand`

### Dev
`typescript`, `@types/*`, `eslint`, `eslint-config-next`, `tailwindcss`, `@tailwindcss/postcss`, `postcss`

## Getting Started

### Prerequisites
- Bun (recommended) or Node.js 18+
- Clerk account (free tier)
- Backend API running locally or deployed (optional for static pages)

### Setup

```bash
# 1. Clone
git clone https://github.com/tarekul42/plead-frontend.git
cd plead-frontend

# 2. Install dependencies
bun install

# 3. Environment variables
cp .env.local.example .env.local
# Fill in your Clerk publishable key and API URL

# 4. Start dev server
bun run dev
```

### Available Scripts

| Command             | Description                     |
| ------------------- | ------------------------------- |
| `bun run dev`       | Start Next.js dev server        |
| `bun run build`     | Production build                |
| `bun run start`     | Start production server         |
| `bun run typecheck` | Type-check without emitting     |
| `bun run lint`      | Run Next.js lint                |

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Hosted on **Vercel Free** at:

```
https://plead.vercel.app
```

## Links

- **Backend Repo**: [github.com/tarekul42/plead-backend](https://github.com/tarekul42/plead-backend)
- **Live App**: [plead.vercel.app](https://plead.vercel.app)
- **API**: [plead-api.onrender.com](https://plead-api.onrender.com)
