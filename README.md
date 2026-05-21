# Restaurant Token & Staff Management System

A digital platform for running a restaurant's day-to-day operations: clients, tokens, staff, attendance, products, inventory, bonuses, referrals, reports, and analytics. Frontend is built with **Next.js (App Router) + TypeScript + Tailwind CSS**, is fully mobile-responsive, supports light & dark mode, and uses the **Poppins** font.

> **State of the project**: the **frontend is complete** and runs against in-memory mock data + a `localStorage`-backed auth simulation. A separate MongoDB backend is described in [`backend.md`](./backend.md). The frontend was designed so that connecting the backend is a drop-in replacement of `lib/mockData.ts` and three functions in `context/AuthContext.tsx` — no UI rewrites required.

---

## 1. How the System Works

### 1.1 Roles & access

| Role        | How they log in                  | Has dashboard?   |
| ----------- | -------------------------------- | ---------------- |
| **Admin**   | email + password                 | Yes — full control |
| **Manager** | mobile + password                | Yes — team & operations |
| **Worker**  | mobile + password / PIN          | Yes — daily sales & service |
| **Client**  | does not log in                  | No — record-only |

Public routes are only `/login` and `/register`. Everything else is behind a role-aware route guard (`components/DashboardShell.tsx`). If a user opens a route for a different role, they are bounced to their own dashboard.

### 1.2 Business flow

```
                ┌──────────────────────────────┐
                │  Worker searches client by   │
                │  mobile / NID                │
                └──────────────┬───────────────┘
                               │
                  ┌────────────┴────────────┐
                  │ Found?                  │
                  └────────────┬────────────┘
                               │
            yes ◄──────────────┴────────────► no
            │                                  │
   Load purchase history              ┌────────┴─────────┐
   and token balance                  │ Worker creates   │
            │                         │ new client       │
            │                         │ (+ referral)     │
            └──────────────┬──────────┘
                           │
                           ▼
                ┌──────────────────────────┐
                │ Client buys tokens       │
                │ (Sell Token form)        │
                └──────────────┬───────────┘
                               │
                               ▼
                ┌──────────────────────────┐
                │ Client spends tokens on  │
                │ menu items (purchases)   │
                └──────────────┬───────────┘
                               │
                               ▼
                ┌──────────────────────────┐
                │ System auto-calculates   │
                │ spent + remaining        │
                └──────────────────────────┘
```

### 1.3 Referral system

When a worker creates a client, they may enter the **mobile number of an existing client** as a referrer. The backend will credit that referrer with a configurable number of bonus tokens (default `5`).

### 1.4 Bonus system

Bonuses are assigned by admin, often based on a manager's recommendation. The manager's *Bonuses* page auto-flags workers as **Recommend bonus** when:

```
attendanceRate ≥ 90%  AND  tokensSold ≥ 250  AND  rating ≥ 4
```

### 1.5 Inventory

Products have a cost price, selling price, and stock count. Stock decrements automatically when a worker records a purchase. Status is **derived from stock**:

| Status         | Condition           |
| -------------- | ------------------- |
| `in-stock`     | `stock ≥ 10`        |
| `low-stock`    | `1 ≤ stock < 10`    |
| `out-of-stock` | `stock = 0`         |

### 1.6 Attendance & complaints

Workers click a single button to mark themselves present (date/time captured automatically). Workers and managers can file complaints; admins and managers move them through `open → in-progress → resolved`.

### 1.7 Daily progress

Managers record, per worker per day: tokens given to the worker, tokens they sold, and the balance. **Negative balances render in red** because they mean the worker sold from an unaccounted-for float — a flag for review.

---

## 2. Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** strict mode
- **Tailwind CSS** with `darkMode: "class"`
- **Poppins** via `next/font/google`
- React Context for auth + theme, `localStorage` for persistence
- No external UI library — all components are hand-built in `components/` for full control

The backend (separate repo) is documented in [`backend.md`](./backend.md). Recommended stack there: **Node + Express + Mongoose + MongoDB + JWT**.

---

## 3. Getting Started

```bash
# from this directory
npm install
npm run dev
```

Open <http://localhost:3000>. Unauthenticated users are redirected to `/login`.

Other scripts:

```bash
npm run build   # production build (verifies all routes typecheck)
npm run start   # serve the production build
npm run lint    # next lint
```

---

## 4. Demo Credentials

No backend is wired up yet, so login is simulated against seeded users in `lib/mockData.ts`.

**Any non-empty password works for these demo accounts** — use `12345` everywhere:

| Role    | Login mode | Identifier             | Password | Notes                              |
| ------- | ---------- | ---------------------- | -------- | ---------------------------------- |
| Admin   | Email      | `admin@restaurant.com` | `12345`  |                                    |
| Manager | Mobile     | `01710000001`          | `12345`  |                                    |
| Manager | Mobile     | `01710000002`          | `12345`  |                                    |
| Worker  | Mobile     | `01810000001`          | `12345`  |                                    |
| Worker  | Mobile     | `01810000002`          | `12345`  |                                    |
| Worker  | Mobile     | `01810000003`          | `12345`  | **blocked** — login denied         |

Switch between admin email and staff-mobile flows using the tab on `/login`. You can also create a fresh **Worker** or **Manager** via `/register` (min 4-char password, 11-digit mobile starting with `01`).

To reset the demo: DevTools → Application → Local Storage → clear keys `restaurant-auth-user` and `restaurant-theme`.

---

## 5. Feature Map by Role

### 5.1 Admin (`/dashboard/admin`)

| Page                | What it does                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------- |
| **Overview**        | Total / daily / weekly / monthly revenue, total clients, active clients, total workers, tokens sold, profit estimate, stock alerts, referral count, transaction count |
| **Users**           | Lists admins / managers / workers · **Add user** modal with **role tabs** (client / manager / worker) and role-conditional fields · status badges |
| **Clients**         | Full client table with **Actions** column: 👁 view, ✏️ edit, 🗑 delete · **New client** modal · view modal shows token KPIs + filterable purchase history (today / week / month / all) · edit modal allows rating slider + adding menu purchases to history |
| **Products**        | SKU / image / category / cost / selling / margin / stock / dates / status · **Add product** modal with emoji picker, category dropdown, cost ≤ selling validation |
| **Tables**          | Table-to-worker assignments, active/free counts                                             |
| **Transactions**    | Every token sale across all workers                                                         |
| **Attendance**      | All worker attendance entries                                                               |
| **Bonuses**         | Bonus history with total / count / average · "Assign new bonus" entry                       |
| **Complaints**      | Filed complaints with status                                                                |

### 5.2 Manager (`/dashboard/manager`)

| Page                | What it does                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------- |
| **Overview**        | Active workers, average attendance, today's sales, tables assigned · worker table          |
| **Workers**         | Performance: attendance %, tokens sold, bonus paid, rating                                  |
| **Daily Progress**  | Form with worker / table / token-given / token-sold · **auto-calculated balance** (**negative → red**) · notes field · table of past entries |
| **Tables**          | Assign / release tables                                                                     |
| **Attendance**      | Daily attendance submitted by workers                                                       |
| **Inventory**       | Stock list with low / out-of-stock alert banner · "Add product" entry                       |
| **Sales**           | Token sales handled by the team                                                             |
| **Bonuses**         | Auto-recommendation table based on rules above · history of bonuses paid                    |

### 5.3 Worker (`/dashboard/worker`)

| Page                | What it does                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------- |
| **Overview**        | Clients served, tokens sold, sales total, attendance · recent sales table                   |
| **Clients**         | Live search by name / mobile / NID                                                          |
| **New Client**      | Full client registration form (mobile validation, NID, referral mobile field)               |
| **Sell Token**      | Pick a client → enter tokens → optional **cart of menu items** (qty × selling price) → live remaining balance → **Finalize transaction** |
| **Sales**           | Worker's own token sales                                                                    |
| **My Progress**     | Personal stats + daily token-balance history (red on negatives)                             |
| **Attendance**      | "Mark me present" single-click button + history                                             |
| **Complaints**      | File complaints, view status                                                                |

---

## 6. UI / UX

- **Surface**: white background with black/slate text by default; dark mode swaps to slate-950 surfaces.
- **Theme toggle** in the header on every dashboard, plus on the login and register screens. Choice persists in `localStorage`.
- **Typography**: Poppins (300 / 400 / 500 / 600 / 700) loaded via `next/font/google` — no extra CSS imports needed.
- **Responsive**: every page works at 360 px → 1440 px. The sidebar collapses behind a hamburger on `< lg`.
- **Reusable primitives** (`app/globals.css`): `.card`, `.input`, `.btn-primary`, `.btn-ghost`, `.badge`.
- **Reusable React components**: `DataTable` (with `StatusBadge`), `Modal`, `StatCard`, `Sidebar`, `Header`, `DashboardShell`, `ThemeToggle`, icon set in `components/icons.tsx`.

---

## 7. Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout, wires Poppins + Theme + Auth providers
│   ├── page.tsx                # Entry — redirects based on auth state
│   ├── globals.css             # Tailwind layers + .card / .input / .btn-* / .badge
│   ├── login/page.tsx          # Admin email login / staff mobile login (tabbed)
│   ├── register/page.tsx       # Worker / Manager self-registration
│   └── dashboard/
│       ├── admin/              # 9 pages: overview, users, clients, products, tables,
│       │                       #          transactions, attendance, bonuses, complaints
│       ├── manager/            # 8 pages: overview, workers, daily-progress, tables,
│       │                       #          attendance, inventory, sales, bonuses
│       └── worker/             # 8 pages: overview, clients, new-client, sell-token,
│                               #          sales, progress, attendance, complaints
├── components/
│   ├── DashboardShell.tsx      # Sidebar + header layout + role guard
│   ├── Sidebar.tsx             # Role-aware nav
│   ├── Header.tsx              # Welcome strip + theme toggle + logout
│   ├── DataTable.tsx           # Reusable table + StatusBadge
│   ├── Modal.tsx               # Reusable modal with backdrop, ESC close, body lock
│   ├── StatCard.tsx            # KPI card
│   ├── ThemeToggle.tsx
│   └── icons.tsx               # Eye / Edit / Trash / Plus inline SVGs
├── context/
│   ├── AuthContext.tsx         # user state, login/register/logout, persistence
│   └── ThemeContext.tsx        # light/dark, persisted in localStorage
├── lib/
│   ├── types.ts                # All TypeScript types (single source of truth)
│   └── mockData.ts             # Seeded demo data — replace with API calls when backend lands
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── package.json
├── README.md                   # this file
└── backend.md                  # MongoDB backend specification
```

---

## 8. Data Model (frontend types)

All types live in `lib/types.ts` and are the single source of truth. They mirror the MongoDB collections described in `backend.md`.

- `User` (admin / manager / worker)
- `Client`
- `Product` (with `costPrice`, `sellingPrice`, `image`, `addedOn`, `updatedOn`)
- `TokenSale`
- `ClientPurchase` (items a client bought with tokens)
- `AttendanceEntry`
- `Complaint`
- `Bonus`
- `TableAssignment`
- `DailyProgress`

---

## 9. Replacing Mock Data with the Real Backend

Connecting the API only requires changes in two places. See `backend.md` §9 for the full step-by-step.

1. **`context/AuthContext.tsx`** — replace `loginAdmin`, `loginStaff`, `register` with `fetch` calls to:
   - `POST /api/auth/login/admin`
   - `POST /api/auth/login/staff`
   - `POST /api/auth/register`
   Store the returned JWT alongside the user under `localStorage` key `restaurant-token`.
2. **Page components** — replace the static imports from `lib/mockData.ts` with `useEffect` + `fetch` (or SWR / TanStack Query). The component shapes already match the backend schemas, so the JSX needs no changes.

Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` (e.g. `http://localhost:4000`).

---

## 10. Authentication Details

- **Admin** logs in with `email + password`.
- **Manager / Worker** log in with `mobile + password (or PIN)`.
- **Client** never logs in — they are records, not accounts.
- Frontend stores the signed-in user under `localStorage` key `restaurant-auth-user` and the theme under `restaurant-theme`. When the backend lands it will additionally store the JWT under `restaurant-token`.
- Blocked accounts cannot log in (demo user `01810000003` is intentionally seeded as `blocked` to demonstrate this).

---

## 11. Roadmap

The frontend is feature-complete relative to the original spec. Remaining work:

1. Build the MongoDB backend per `backend.md`.
2. Wire frontend to the API (replace mock data + auth handlers).
3. Add real product image uploads (currently emoji).
4. Add charts to admin overview (recharts is a good fit) once revenue data is real.
5. Optional: Socket.IO for live tables / inventory updates.
6. Optional: PWA + offline cache for workers in low-connectivity areas.

---

## 12. License & Credits

Internal project — no public license. Built as a complete operational dashboard for a single restaurant; the architecture also scales to multi-branch with the addition of a `branchId` field to every collection (described as a future option in `backend.md`).
