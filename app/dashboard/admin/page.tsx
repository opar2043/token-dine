"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { analyticsService, usersService } from "@/lib/services";
import { formatDate, formatId } from "@/lib/format";
import { ALL_RANGE, inRange, type DateRange } from "@/lib/dateRange";
import type { AnalyticsOverview, User } from "@/lib/types";

const userColumns: Column<User>[] = [
  { key: "id", header: "ID", render: (u) => formatId(u.id) },
  { key: "name", header: "Name" },
  { key: "role", header: "Role", render: (u) => <span className="capitalize">{u.role}</span> },
  { key: "contact", header: "Contact", render: (u) => u.email ?? u.mobile ?? "—" },
  { key: "joinedOn", header: "Joined", render: (u) => formatDate(u.joinedOn ?? u.createdAt) },
  { key: "status", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
];

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange>(ALL_RANGE);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ov, usersRes] = await Promise.all([
          analyticsService.getOverview(),
          usersService.getUsers({ limit: 100 }),
        ]);
        if (cancelled) return;
        setOverview(ov);
        setUsers(usersRes.items);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Token-only system: headline figures are tokens, not BDT.
  const totalTokens = overview?.tokens?.total ?? 0;
  const dailyTokens = overview?.tokens?.day ?? 0;
  const weeklyTokens = overview?.tokens?.week ?? 0;
  const monthlyTokens = overview?.tokens?.month ?? 0;

  const totalClients = overview?.activeClients ?? 0;
  const totalWorkers = users.filter((u) => u.role === "worker").length;
  const totalTokensSold = overview?.tokensSold ?? 0;
  // Product margin stays in BDT (used for product profitability only).
  const profit = overview?.profitEstimate ?? 0;
  const referralCount = overview?.referralCount ?? 0;
  const lowStock = overview?.stockAlerts ?? 0;
  const totalProducts = overview?.totalProducts ?? 0;

  const filteredUsers = useMemo(
    () => users.filter((u) => inRange(u.joinedOn ?? u.createdAt, range)),
    [users, range],
  );

  /* ── shared arrow SVG ── */
  const ArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );

  const Blobs = () => (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl transition-all duration-500 group-hover:scale-150"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-3xl transition-all duration-500 group-hover:scale-125"
      />
    </>
  );

  return (
    <DashboardShell role="admin">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Admin overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Full visibility into revenue, users, inventory and operations.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      {/* ─── 4 Primary Stat Boxes ─── */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Clients — indigo→violet */}
        <a
          href="/dashboard/admin/clients"
          className="group relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
        >
          <Blobs />
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white drop-shadow-sm">
            {loading ? "—" : totalClients.toLocaleString()}
          </p>
          <p className="mt-1 text-sm font-medium text-white/80">Total Clients</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/70 transition-all duration-300 group-hover:gap-2 group-hover:text-white">
            View details <ArrowIcon />
          </span>
        </a>

        {/* Total Products — amber→orange */}
        <a
          href="/dashboard/admin/products"
          className="group relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          style={{ background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" }}
        >
          <Blobs />
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375ZM21 9.375A2.625 2.625 0 0 0 18.375 6.75H5.625A2.625 2.625 0 0 0 3 9.375v9.75A2.625 2.625 0 0 0 5.625 21.75h12.75A2.625 2.625 0 0 0 21 19.125v-9.75Z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white drop-shadow-sm">
            {loading ? "—" : totalProducts.toLocaleString()}
          </p>
          <p className="mt-1 text-sm font-medium text-white/80">Total Products</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/70 transition-all duration-300 group-hover:gap-2 group-hover:text-white">
            View details <ArrowIcon />
          </span>
        </a>

        {/* Product Flow — emerald→cyan (replaces Revenue) */}
        <a
          href="/dashboard/admin/product-flow"
          className="group relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          style={{ background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)" }}
        >
          <Blobs />
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white drop-shadow-sm">
            {loading ? "—" : `Product Sells`}
            {/* {loading ? "—" : ` ${profit.toLocaleString()}`} */}
          </p>
          <p className="mt-1 text-sm font-medium text-white/80">Product Flow</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/70 transition-all duration-300 group-hover:gap-2 group-hover:text-white">
            View details <ArrowIcon />
          </span>
        </a>

        {/* Token Sold — pink→rose */}
        <a
          href="/dashboard/admin/transactions"
          className="group relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          style={{ background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)" }}
        >
          <Blobs />
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5Zm6.61 10.936a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 14.47a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white drop-shadow-sm">
            {loading ? "—" : totalTokensSold.toLocaleString()}
          </p>
          <p className="mt-1 text-sm font-medium text-white/80">Token Sold</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/70 transition-all duration-300 group-hover:gap-2 group-hover:text-white">
            View details <ArrowIcon />
          </span>
        </a>
      </div>

      {/* ─── Token throughput (token-only system) ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Tokens" value={totalTokens.toLocaleString()} hint="All time" />
        <StatCard label="Daily Tokens" value={dailyTokens.toLocaleString()} hint="Today" />
        <StatCard label="Weekly Tokens" value={weeklyTokens.toLocaleString()} hint="Last 7 days" />
        <StatCard label="Monthly Tokens" value={monthlyTokens.toLocaleString()} hint="This month" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Clients" value={totalClients} hint="With token balance" />
        <StatCard label="Total Workers" value={totalWorkers} />
        <StatCard label="Tokens Sold" value={totalTokensSold} hint="All workers" />
        <StatCard label="Stock Alerts" value={lowStock} hint="Low or out of stock" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Product Margin (est.)" value={`৳ ${profit.toLocaleString()}`} hint="Selling − cost basis" />
        <StatCard label="Referrals" value={referralCount} hint="Clients invited by others" />
      </div>

      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">All system users</h2>
          <DateRangeFilter value={range} onChange={setRange} />
        </div>
        <DataTable<User>
          columns={userColumns}
          rows={filteredUsers}
          emptyMessage={loading ? "Loading users…" : "No users in this range."}
        />
      </section>
    </DashboardShell>
  );
}
