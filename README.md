# Auto Lab Shop Management

Shop management system for Auto Lab (George Town, Grand Cayman). It runs alongside the existing
ARC (AutoRepairCloud) and the Auto Lab Books app, and will gradually take over from ARC.
Separate repo from Books (`Autolab-books`); both share one Supabase project.

**Stack:** React + Vite, Supabase (Postgres, RLS, Storage), Netlify.

## Run it

```
npm install
cp .env.example .env.local   # fill in the Supabase URL and anon key
npm run dev
```

## Phase 1 – Foundation (this version)

- Clean project structure and visible version label (`src/version.js`)
- Sign-in and roles: owner, office, technician (`supabase/migrations/001_foundation.sql`)
- Customers and vehicles tables with row-level security
- Invoice numbers in the AL series (`next_invoice_number()` → AL-0001, AL-0002 …)
- Approved technician inspection sheet prototype (`public/prototypes/inspection.html`)

## Rules of the system

- Technicians never see prices. Enforced in the database, not just the screen.
- Work order becomes the invoice; the same invoice number feeds Books.
- WhatsApp stays free: click-to-chat links only, no paid API.

## Build order

1. Foundation  2. Work orders  3. Inspections  4. Money (invoices, payments, Books link)
5. WhatsApp links  6. Parts, reports, gradual switch-over
