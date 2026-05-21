"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { mockProducts } from "@/lib/mockData";
import type { Product } from "@/lib/types";

const columns: Column<Product>[] = [
  {
    key: "image",
    header: "",
    render: (p) => (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-800">
        {p.image ?? "🍽️"}
      </div>
    ),
  },
  { key: "id", header: "SKU" },
  { key: "name", header: "Product" },
  { key: "category", header: "Category" },
  { key: "sellingPrice", header: "Price", align: "right", render: (p) => `৳ ${p.sellingPrice}` },
  { key: "stock", header: "Stock", align: "right" },
  { key: "updatedOn", header: "Updated" },
  { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
];

export default function ManagerInventoryPage() {
  const low = mockProducts.filter((p) => p.status === "low-stock").length;
  const out = mockProducts.filter((p) => p.status === "out-of-stock").length;

  return (
    <DashboardShell role="manager">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Inventory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Stock levels with low and out-of-stock alerts.
          </p>
        </div>
        <button className="btn-primary" type="button">
          Add product
        </button>
      </div>

      {low + out > 0 ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <strong>{out}</strong> item(s) out of stock, <strong>{low}</strong> low-stock. Reorder soon.
        </div>
      ) : null}

      <DataTable<Product> columns={columns} rows={mockProducts} />
    </DashboardShell>
  );
}
