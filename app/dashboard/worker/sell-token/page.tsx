"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import { clientsService, productsService, salesService } from "@/lib/services";
import { formatId } from "@/lib/format";
import type { Client, Product } from "@/lib/types";

interface CartItem {
  productId: string;
  qty: number;
  tokensUsed: number;
}

const TOKEN_VALUE = 100;

export default function WorkerSellTokenPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clientId, setClientId] = useState("");
  const [tokens, setTokens] = useState(0);
  const [items, setItems] = useState<CartItem[]>([]);
  const [done, setDone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [c, p] = await Promise.all([
          clientsService.getClients({ limit: 200 }),
          productsService.getProducts(),
        ]);
        if (cancelled) return;
        setClients(c.items);
        setProducts(p);
        if (c.items[0]) setClientId(c.items[0].id);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const client = useMemo(
    () => clients.find((c) => c.id === clientId) ?? null,
    [clients, clientId],
  );

  const totalSpend = useMemo(
    () =>
      items.reduce((sum, item) => {
        const p = products.find((x) => x.id === item.productId);
        return sum + (p ? p.sellingPrice * item.qty : 0);
      }, 0),
    [items, products],
  );

  const tokenAmount = tokens * TOKEN_VALUE;
  const remaining = (client?.balance ?? 0) * TOKEN_VALUE + tokenAmount - totalSpend;

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { productId: products[0]?.id ?? "", qty: 1, tokensUsed: 1 },
    ]);

  const updateItem = (idx: number, patch: Partial<CartItem>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const finalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !client) return;
    setError(null);
    setSubmitting(true);
    try {
      if (tokens > 0) {
        await salesService.createSales({
          clientId: client.id,
          workerId: user.id,
          tokens,
          amount: tokenAmount,
        });
      }
      for (const item of items) {
        if (!item.productId || item.qty < 1) continue;
        await clientsService.addClientPurchase(client.id, {
          productId: item.productId,
          qty: item.qty,
          tokensUsed: item.tokensUsed,
        });
      }
      const updatedClient = await clientsService.getClient(client.id);
      setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
      setDone(`Transaction for ${client.name} saved.`);
      setTokens(0);
      setItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to finalize transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell role="worker">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Sell token &amp; purchase</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Issue tokens and record the client&apos;s purchases in a single transaction.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      {done ? (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          {done}
        </div>
      ) : null}

      <form onSubmit={finalize} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,360px]">
        <div className="card space-y-5">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Client
            </label>
            <select
              className="input mt-1"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              {clients.length === 0 ? (
                <option value="">{loading ? "Loading…" : "No clients"}</option>
              ) : null}
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} • {c.mobile}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tokens to sell
            </label>
            <input
              type="number"
              min={0}
              className="input mt-1"
              value={tokens}
              onChange={(e) => setTokens(Number(e.target.value) || 0)}
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              1 token = ৳ {TOKEN_VALUE}. Sale value: ৳ {tokenAmount.toLocaleString()}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Items purchased
              </label>
              <button type="button" onClick={addItem} className="btn-ghost px-3 py-1.5 text-xs">
                Add item
              </button>
            </div>

            <div className="mt-2 space-y-2">
              {items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500 dark:border-slate-800">
                  No items yet — add purchases the client made with their tokens.
                </p>
              ) : (
                items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1fr,70px,80px,80px,32px] items-center gap-2 rounded-xl border border-slate-200 p-2 dark:border-slate-800"
                  >
                    <select
                      className="input"
                      value={item.productId}
                      onChange={(e) => updateItem(idx, { productId: e.target.value })}
                    >
                      {products.map((p) => (
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
                      value={item.qty}
                      onChange={(e) => updateItem(idx, { qty: Number(e.target.value) || 1 })}
                    />
                    <input
                      type="number"
                      min={1}
                      className="input"
                      placeholder="Tokens"
                      value={item.tokensUsed}
                      onChange={(e) => updateItem(idx, { tokensUsed: Number(e.target.value) || 1 })}
                    />
                    <div className="text-right text-sm font-medium text-slate-700 dark:text-slate-200">
                      ৳{" "}
                      {(
                        (products.find((p) => p.id === item.productId)?.sellingPrice ?? 0) *
                        item.qty
                      ).toLocaleString()}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-slate-400 hover:text-rose-500"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <aside className="card h-fit space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Summary</h3>

          <Row label="Client" value={client?.name ?? "—"} />
          <Row label="Client ID" value={client ? formatId(client.id) : "—"} />
          <Row label="Existing balance" value={`৳ ${((client?.balance ?? 0) * TOKEN_VALUE).toLocaleString()}`} />
          <Row label="New tokens" value={`+ ৳ ${tokenAmount.toLocaleString()}`} />
          <Row label="Spending" value={`− ৳ ${totalSpend.toLocaleString()}`} />

          <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
            <Row
              label="Remaining balance"
              value={
                <span className={remaining < 0 ? "text-rose-600 dark:text-rose-400" : ""}>
                  ৳ {remaining.toLocaleString()}
                </span>
              }
              bold
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={!client || submitting || !user}
          >
            {submitting ? "Saving…" : "Finalize transaction"}
          </button>
        </aside>
      </form>
    </DashboardShell>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`text-slate-900 dark:text-slate-100 ${bold ? "font-semibold" : ""}`}>{value}</span>
    </div>
  );
}
