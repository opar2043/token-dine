"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { PlusIcon } from "@/components/icons";
import { mockProducts } from "@/lib/mockData";
import type { Product } from "@/lib/types";

function stockStatus(stock: number): Product["status"] {
  if (stock <= 0) return "out-of-stock";
  if (stock < 10) return "low-stock";
  return "in-stock";
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [open, setOpen] = useState(false);

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
    { key: "costPrice", header: "Cost", align: "right", render: (p) => `৳ ${p.costPrice}` },
    { key: "sellingPrice", header: "Selling", align: "right", render: (p) => `৳ ${p.sellingPrice}` },
    {
      key: "profit",
      header: "Margin",
      align: "right",
      render: (p) => `৳ ${p.sellingPrice - p.costPrice}`,
    },
    { key: "stock", header: "Stock", align: "right" },
    { key: "addedOn", header: "Added" },
    { key: "updatedOn", header: "Updated" },
    { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
  ];

  const handleCreate = (p: Product) => {
    setProducts((prev) => [p, ...prev]);
    setOpen(false);
  };

  return (
    <DashboardShell role="admin">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cost, selling price, margin, and stock health.
          </p>
        </div>
        <button type="button" className="btn-primary gap-1.5" onClick={() => setOpen(true)}>
          <PlusIcon /> Add product
        </button>
      </div>

      <DataTable<Product> columns={columns} rows={products} />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="md"
        title="Add product"
        description="Create a new menu item with pricing and starting stock."
      >
        <ProductForm
          existingCount={products.length}
          onCancel={() => setOpen(false)}
          onCreate={handleCreate}
        />
      </Modal>
    </DashboardShell>
  );
}

const categories = ["Main Course", "Appetizer", "Beverage", "Dessert", "Snack", "Other"];
const emojiChoices = ["🍛", "🥘", "🥤", "🍢", "🍨", "🍕", "🍔", "🥗", "🍰", "🍜", "🍤", "🍽️"];

function ProductForm({
  existingCount,
  onCancel,
  onCreate,
}: {
  existingCount: number;
  onCancel: () => void;
  onCreate: (p: Product) => void;
}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(emojiChoices[0]);
  const [category, setCategory] = useState(categories[0]);
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (sellingPrice <= 0) {
      setError("Selling price must be greater than 0.");
      return;
    }
    if (costPrice < 0 || sellingPrice < costPrice) {
      setError("Selling price must be greater than or equal to cost.");
      return;
    }
    if (stock < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const id = `P-${String(existingCount + 1).padStart(2, "0")}`;
    const next: Product = {
      id,
      name: name.trim(),
      image,
      category,
      costPrice,
      sellingPrice,
      stock,
      status: stockStatus(stock),
      addedOn: today,
      updatedOn: today,
    };
    onCreate(next);
  };

  const margin = sellingPrice - costPrice;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Product name" required>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="Category">
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Cost price (BDT)" required>
          <input
            type="number"
            min={0}
            className="input"
            value={costPrice}
            onChange={(e) => setCostPrice(Number(e.target.value) || 0)}
            required
          />
        </Field>
        <Field label="Selling price (BDT)" required>
          <input
            type="number"
            min={0}
            className="input"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
            required
          />
        </Field>
        <Field label="Starting stock" required>
          <input
            type="number"
            min={0}
            className="input"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value) || 0)}
            required
          />
        </Field>
        <Field label={`Margin: ৳ ${margin}`}>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
            Status preview:{" "}
            <strong>
              {stockStatus(stock).replace("-", " ")}
            </strong>
          </div>
        </Field>
      </section>

      <section>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Image
        </p>
        <div className="flex flex-wrap gap-2">
          {emojiChoices.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setImage(emoji)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition ${
                image === emoji
                  ? "border-slate-900 bg-slate-100 dark:border-white dark:bg-slate-800"
                  : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </section>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Add product
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
