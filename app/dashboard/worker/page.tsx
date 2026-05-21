"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, type Column } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import { mockClients, mockSales } from "@/lib/mockData";
import type { TokenSale } from "@/lib/types";

const columns: Column<TokenSale>[] = [
  { key: "id", header: "Txn ID" },
  { key: "date", header: "Date" },
  { key: "client", header: "Client" },
  { key: "tokens", header: "Tokens", align: "right" },
  { key: "amount", header: "Amount (BDT)", align: "right", render: (s) => s.amount.toLocaleString() },
];

export default function WorkerDashboardPage() {
  const mySales = mockSales;
  const totalAmount = mySales.reduce((sum, s) => sum + s.amount, 0);
  const totalTokens = mySales.reduce((sum, s) => sum + s.tokens, 0);

  return (
    <DashboardShell role="worker">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Your overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track your sales, attendance, and assigned clients.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Clients Served" value={mockClients.length} />
        <StatCard label="Tokens Sold" value={totalTokens} />
        <StatCard label="Sales (BDT)" value={`৳ ${totalAmount.toLocaleString()}`} />
        <StatCard label="Attendance" value="96%" hint="Last 30 days" />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Recent sales</h2>
        <DataTable<TokenSale> columns={columns} rows={mySales} />
      </section>
    </DashboardShell>
  );
}
