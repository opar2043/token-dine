"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, type Column } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { StatCard } from "@/components/StatCard";
import { EditIcon, EyeIcon, PlusIcon, TrashIcon } from "@/components/icons";
import {
  mockClientPurchases,
  mockClients,
  mockProducts,
} from "@/lib/mockData";
import type { Client, ClientPurchase } from "@/lib/types";

type Mode = "view" | "edit" | "delete" | null;
type Range = "today" | "week" | "month" | "all";

function withinRange(dateStr: string, range: Range): boolean {
  if (range === "all") return true;
  const today = new Date("2026-05-21T00:00:00Z");
  const d = new Date(dateStr + "T00:00:00Z");
  const diffDays = Math.floor((today.getTime() - d.getTime()) / 86_400_000);
  if (range === "today") return diffDays === 0;
  if (range === "week") return diffDays >= 0 && diffDays < 7;
  if (range === "month") return diffDays >= 0 && diffDays < 30;
  return true;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [purchases, setPurchases] = useState<ClientPurchase[]>(mockClientPurchases);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [range, setRange] = useState<Range>("all");
  const [createOpen, setCreateOpen] = useState(false);

  const selected = useMemo(
    () => clients.find((c) => c.id === selectedId) ?? null,
    [clients, selectedId],
  );

  const open = (id: string, m: Mode) => {
    setSelectedId(id);
    setMode(m);
    setRange("all");
  };
  const close = () => {
    setMode(null);
    setSelectedId(null);
  };

  const handleDelete = () => {
    if (!selected) return;
    setClients((prev) => prev.filter((c) => c.id !== selected.id));
    setPurchases((prev) => prev.filter((p) => p.clientId !== selected.id));
    close();
  };

  const handleSave = (next: Client) => {
    setClients((prev) => prev.map((c) => (c.id === next.id ? next : c)));
    close();
  };

  const handleCreate = (next: Client) => {
    setClients((prev) => [next, ...prev]);
    setCreateOpen(false);
  };

  const handleAddPurchase = (purchase: ClientPurchase) => {
    setPurchases((prev) => [purchase, ...prev]);
    setClients((prev) =>
      prev.map((c) =>
        c.id === purchase.clientId
          ? {
              ...c,
              tokensSpent: c.tokensSpent + purchase.tokensUsed,
              balance: c.balance - purchase.tokensUsed,
            }
          : c,
      ),
    );
  };

  const columns: Column<Client>[] = [
    { key: "id", header: "Client ID" },
    { key: "name", header: "Name" },
    { key: "mobile", header: "Mobile" },
    { key: "nid", header: "NID" },
    { key: "tokensBought", header: "Bought", align: "right" },
    { key: "tokensSpent", header: "Spent", align: "right" },
    { key: "balance", header: "Balance", align: "right" },
    { key: "rating", header: "Rating", align: "right", render: (c) => c.rating.toFixed(1) },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <IconButton title="View details" onClick={() => open(c.id, "view")}>
            <EyeIcon />
          </IconButton>
          <IconButton title="Edit" onClick={() => open(c.id, "edit")}>
            <EditIcon />
          </IconButton>
          <IconButton
            title="Delete"
            danger
            onClick={() => open(c.id, "delete")}
          >
            <TrashIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell role="admin">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Clients</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View, edit, or remove client records.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <PlusIcon /> New client
        </button>
      </div>

      <DataTable<Client> columns={columns} rows={clients} />

      {/* VIEW MODAL */}
      <Modal
        open={mode === "view" && !!selected}
        onClose={close}
        size="lg"
        title={selected ? `${selected.name} • ${selected.id}` : "Client"}
        description={selected ? `Mobile: ${selected.mobile} • NID: ${selected.nid}` : undefined}
      >
        {selected ? (
          <ViewContent
            client={selected}
            purchases={purchases.filter((p) => p.clientId === selected.id)}
            range={range}
            onRangeChange={setRange}
          />
        ) : null}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        open={mode === "edit" && !!selected}
        onClose={close}
        size="lg"
        title={selected ? `Edit ${selected.name}` : "Edit client"}
        description="Update profile, rating, and add new menu purchases to history."
      >
        {selected ? (
          <EditContent
            client={selected}
            purchases={purchases.filter((p) => p.clientId === selected.id)}
            onSave={handleSave}
            onAddPurchase={handleAddPurchase}
            onCancel={close}
          />
        ) : null}
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        open={mode === "delete" && !!selected}
        onClose={close}
        size="sm"
        title="Delete client?"
        description="This action cannot be undone."
        footer={
          <>
            <button type="button" className="btn-ghost" onClick={close}>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
            >
              Delete client
            </button>
          </>
        }
      >
        {selected ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You are about to remove <strong>{selected.name}</strong> ({selected.id}) along with{" "}
            {purchases.filter((p) => p.clientId === selected.id).length} purchase record(s).
          </p>
        ) : null}
      </Modal>

      {/* CREATE MODAL */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        size="lg"
        title="New client"
        description="Register a new customer."
      >
        <CreateClientForm
          existing={clients}
          onCancel={() => setCreateOpen(false)}
          onCreate={handleCreate}
        />
      </Modal>
    </DashboardShell>
  );
}

function IconButton({
  children,
  title,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
        danger
          ? "border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
          : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* VIEW                                                                */
/* ------------------------------------------------------------------ */

function ViewContent({
  client,
  purchases,
  range,
  onRangeChange,
}: {
  client: Client;
  purchases: ClientPurchase[];
  range: Range;
  onRangeChange: (r: Range) => void;
}) {
  const filtered = useMemo(
    () => purchases.filter((p) => withinRange(p.date, range)),
    [purchases, range],
  );

  const totalItems = filtered.reduce((sum, p) => sum + p.qty, 0);
  const totalTokens = filtered.reduce((sum, p) => sum + p.tokensUsed, 0);
  const totalAmount = filtered.reduce((sum, p) => sum + p.amount, 0);

  const ranges: { value: Range; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
    { value: "all", label: "All time" },
  ];

  const columns: Column<ClientPurchase>[] = [
    { key: "date", header: "Date" },
    { key: "productName", header: "Item" },
    { key: "qty", header: "Qty", align: "right" },
    { key: "tokensUsed", header: "Tokens", align: "right" },
    { key: "amount", header: "Amount (BDT)", align: "right", render: (p) => p.amount.toLocaleString() },
  ];

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ProfileRow label="Email" value={client.email ?? "—"} />
        <ProfileRow label="Address" value={client.address ?? "—"} />
        <ProfileRow label="Gender" value={client.gender ?? "—"} />
        <ProfileRow label="Referral" value={client.referral ?? "—"} />
        <ProfileRow label="Joined" value={client.createdAt} />
        <ProfileRow label="Rating" value={`${client.rating.toFixed(1)} / 5`} />
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Tokens Bought" value={client.tokensBought} />
        <StatCard label="Tokens Spent" value={client.tokensSpent} />
        <StatCard label="Balance" value={client.balance} />
        <StatCard label="Lifetime Visits" value={purchases.length} />
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Purchase history
          </h3>
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
            {ranges.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => onRangeChange(r.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  range === r.value
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3 grid grid-cols-3 gap-2 text-center text-xs">
          <Mini label="Items" value={totalItems} />
          <Mini label="Tokens used" value={totalTokens} />
          <Mini label="Spend (BDT)" value={totalAmount.toLocaleString()} />
        </div>

        <DataTable<ClientPurchase>
          columns={columns}
          rows={filtered}
          emptyMessage="No purchases in this range."
        />
      </section>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="text-sm text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="text-base font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EDIT                                                                */
/* ------------------------------------------------------------------ */

function EditContent({
  client,
  purchases,
  onSave,
  onAddPurchase,
  onCancel,
}: {
  client: Client;
  purchases: ClientPurchase[];
  onSave: (next: Client) => void;
  onAddPurchase: (p: ClientPurchase) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Client>(client);

  // new purchase fields
  const [productId, setProductId] = useState(mockProducts[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [tokensUsed, setTokensUsed] = useState(1);

  const update = <K extends keyof Client>(key: K, value: Client[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleAddItem = () => {
    const product = mockProducts.find((p) => p.id === productId);
    if (!product || qty < 1 || tokensUsed < 1) return;
    const purchase: ClientPurchase = {
      id: `CP-${Math.floor(Math.random() * 9000 + 1000)}`,
      clientId: form.id,
      productId: product.id,
      productName: product.name,
      qty,
      tokensUsed,
      amount: product.sellingPrice * qty,
      date: new Date().toISOString().slice(0, 10),
    };
    onAddPurchase(purchase);
    update("tokensSpent", form.tokensSpent + tokensUsed);
    update("balance", form.balance - tokensUsed);
    setQty(1);
    setTokensUsed(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Full name" required>
          <input
            className="input"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </Field>
        <Field label="Mobile" required>
          <input
            className="input"
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value)}
            required
          />
        </Field>
        <Field label="NID" required>
          <input
            className="input"
            value={form.nid}
            onChange={(e) => update("nid", e.target.value)}
            required
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            className="input"
            value={form.email ?? ""}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>
        <Field label="Address">
          <input
            className="input"
            value={form.address ?? ""}
            onChange={(e) => update("address", e.target.value)}
          />
        </Field>
        <Field label="Gender">
          <select
            className="input"
            value={form.gender ?? ""}
            onChange={(e) => update("gender", (e.target.value || undefined) as Client["gender"])}
          >
            <option value="">—</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Referral mobile">
          <input
            className="input"
            value={form.referral ?? ""}
            onChange={(e) => update("referral", e.target.value)}
          />
        </Field>
        <Field label={`Rating: ${form.rating.toFixed(1)} / 5`}>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={form.rating}
            onChange={(e) => update("rating", Number(e.target.value))}
            className="w-full accent-slate-900 dark:accent-white"
          />
        </Field>
        <Field label="Tokens bought">
          <input
            type="number"
            min={0}
            className="input"
            value={form.tokensBought}
            onChange={(e) => update("tokensBought", Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Tokens spent">
          <input
            type="number"
            min={0}
            className="input"
            value={form.tokensSpent}
            onChange={(e) => update("tokensSpent", Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Balance">
          <input
            type="number"
            className="input"
            value={form.balance}
            onChange={(e) => update("balance", Number(e.target.value) || 0)}
          />
        </Field>
      </section>

      {/* MENU / PURCHASE ADD */}
      <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Add menu purchase
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Append a new item to this client's purchase history.
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {purchases.length} record(s) on file
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr,100px,120px,auto]">
          <select
            className="input"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {mockProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (৳ {p.sellingPrice})
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            className="input"
            placeholder="Qty"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value) || 1)}
          />
          <input
            type="number"
            min={1}
            className="input"
            placeholder="Tokens"
            value={tokensUsed}
            onChange={(e) => setTokensUsed(Number(e.target.value) || 1)}
          />
          <button type="button" onClick={handleAddItem} className="btn-ghost gap-1.5">
            <PlusIcon /> Add
          </button>
        </div>
      </section>

      <div className="flex items-center justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save changes
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

/* ------------------------------------------------------------------ */
/* CREATE                                                              */
/* ------------------------------------------------------------------ */

function CreateClientForm({
  existing,
  onCancel,
  onCreate,
}: {
  existing: Client[];
  onCancel: () => void;
  onCreate: (c: Client) => void;
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [nid, setNid] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [referral, setReferral] = useState("");
  const [tokensBought, setTokensBought] = useState(0);
  const [rating, setRating] = useState(4);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Name is required.");
    if (!/^01\d{9}$/.test(mobile.trim()))
      return setError("Mobile must be 11 digits starting with 01.");
    if (!nid.trim()) return setError("NID is required.");
    if (existing.some((c) => c.mobile === mobile.trim()))
      return setError("A client with that mobile already exists.");

    const id = `C-${Math.floor(Math.random() * 9000 + 1000)}`;
    const next: Client = {
      id,
      name: name.trim(),
      mobile: mobile.trim(),
      nid: nid.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      gender: gender || undefined,
      referral: referral.trim() || undefined,
      rating,
      tokensBought,
      tokensSpent: 0,
      balance: tokensBought,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    onCreate(next);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Full name" required>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="Mobile" required>
          <input
            className="input"
            placeholder="01XXXXXXXXX"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </Field>
        <Field label="NID" required>
          <input className="input" value={nid} onChange={(e) => setNid(e.target.value)} required />
        </Field>
        <Field label="Email">
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Address">
          <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} />
        </Field>
        <Field label="Gender">
          <select
            className="input"
            value={gender}
            onChange={(e) => setGender(e.target.value as typeof gender)}
          >
            <option value="">—</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Referral mobile (optional)">
          <input className="input" value={referral} onChange={(e) => setReferral(e.target.value)} />
        </Field>
        <Field label="Initial tokens bought">
          <input
            type="number"
            min={0}
            className="input"
            value={tokensBought}
            onChange={(e) => setTokensBought(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label={`Rating: ${rating.toFixed(1)} / 5`}>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full accent-slate-900 dark:accent-white"
          />
        </Field>
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
          Create client
        </button>
      </div>
    </form>
  );
}
