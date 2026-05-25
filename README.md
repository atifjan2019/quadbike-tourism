# Quad Bike Tourism

Next.js 16 + Supabase (Postgres) + Prisma + Tailwind v4. Public homepage with booking form, and a passcode-protected admin panel for managing tours, bookings, testimonials, FAQ, media and settings.

---

## Stack

- **Framework**: Next.js 16.2 (App Router) + React 19 + TypeScript
- **Database**: Supabase Postgres (accessed via Prisma)
- **Auth**: Passcode-only (single shared passcode → signed JWT cookie)
- **UI**: Tailwind v4, shadcn-style primitives, Radix, Lucide icons
- **Editor**: Tiptap rich text
- **Email**: Resend (optional)
- **Images**: Sharp resize → `/public/uploads`

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Fill in `.env.local` (already created with empty fields):

| Var | Where to get it |
|---|---|
| `DATABASE_URL` | Supabase dashboard → Project Settings → Database → "Transaction Pooler" |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API → URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API → "anon public" |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API → "service_role secret" |
| `PASSCODE` | Default `524862` |
| `AUTH_SECRET` | Generate with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `RESEND_API_KEY` | resend.com → API Keys (or leave blank to skip emails) |

### 3. Push schema + seed

```bash
npx prisma db push     # creates tables in Supabase
npm run db:seed        # inserts categories, tours, FAQs, testimonials, settings
```

### 4. Run

```bash
npm run dev
```

Open:
- **http://localhost:3000** — public homepage
- **http://localhost:3000/admin** — admin panel (redirects to login)
- Enter passcode `524862` to access admin

---

## Project Structure

```
prisma/
  schema.prisma        # Category, Tour, Variation, Booking, Testimonial, FAQ, Media, Setting
  seed.ts              # sample data

src/
  app/
    page.tsx           # public homepage
    api/
      auth/login|logout  # passcode auth
      booking            # PUBLIC — used by the homepage form
      tours              # PUBLIC — list / by-slug
      admin/             # gated by middleware (auth + JWT cookie)
        tours/[id]
        categories/[id]
        bookings/[id]
        testimonials/[id]
        faq/[id]
        media/upload
        settings
    admin/
      login            # passcode keypad
      dashboard
      tours/new|[id]
      categories
      bookings/[id]
      testimonials
      faq
      media
      settings

  components/
    ui/                # Button, Input, Textarea, Label, Select, Switch, Card, Badge, Table, Tabs
    admin/             # AdminShell, TourForm, RichEditor, CategoriesManager, TestimonialsManager, FAQManager, MediaManager, SettingsForm, BookingActions
    (homepage components: Header, Hero, CategoryGrid, GoldenDunesSection, SignaturePackages, Testimonials, FAQ, BookingCTA, Footer, WhatsAppFloat)

  lib/
    db.ts              # Prisma singleton
    auth.ts            # JWT sign/verify, cookies
    email.ts           # Resend wrapper (no-ops when key missing)
    utils.ts           # cn(), formatMoney(), generateBookingReference()

  utils/supabase/
    client.ts          # browser client (anon key)
    server.ts          # SSR client (anon key + cookies)
    middleware.ts      # SSR session refresh helper
    admin.ts           # server-only admin client (service_role)

middleware.ts          # protects /admin/** and /api/admin/**
```

---

## Admin Auth

A single passcode (`PASSCODE` env) signs a 7-day JWT stored in an httpOnly cookie. The root `middleware.ts` checks that cookie on every `/admin/**` and `/api/admin/**` request and redirects to `/admin/login` (or returns 401 for API calls) if invalid.

To rotate the passcode, change `PASSCODE` and `AUTH_SECRET` and redeploy. All existing sessions invalidate.

---

## Booking Flow

1. Homepage form (`BookingCTA`) POSTs to `/api/booking`.
2. The route validates with Zod, resolves the tour (by `tourId`, `tourSlug`, or `activity` → category fallback), creates the `Booking` with status `PENDING` and an auto reference (`QBT-YYYY-NNNNNN`).
3. Fires two emails via Resend: customer confirmation + admin notification. If `RESEND_API_KEY` is empty, this is a no-op (the booking still saves).
4. Admin sees it at `/admin/bookings`; clicking opens the detail view where status can move `PENDING → CONFIRMED` (fires a "Booking confirmed" email), `→ COMPLETED`, or `→ CANCELLED`.

---

## NPM Scripts

```bash
npm run dev          # next dev (Turbopack)
npm run build        # next build
npm run start        # next start
npm run db:push      # prisma db push (sync schema to Supabase)
npm run db:seed      # seed sample data
npm run db:studio    # open Prisma Studio
```

---

## Notes

- **Prisma + Supabase**: Prisma talks directly to Supabase's Postgres via the pooler URL. Use `pgbouncer=true&connection_limit=1` query params on `DATABASE_URL` to avoid pooling-related issues in serverless.
- **Supabase JS SDK** is wired up alongside Prisma — use it if you later want Supabase Auth, Storage, or Realtime. The admin client (`utils/supabase/admin.ts`) uses the `service_role` key and **must never be imported from a Client Component**.
- **Media**: Uploads land in `/public/uploads/`. Sharp resizes them to max 1600px wide WebP. For cloud storage, swap the implementation in `/api/admin/media/upload/route.ts` to Supabase Storage.
- **Analytics scripts**: Google Ads gtag + Smartlook recorder are injected from `app/layout.tsx` via `next/script` with `strategy="afterInteractive"`.
