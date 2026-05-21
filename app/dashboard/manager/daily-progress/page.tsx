"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, type Column } from "@/components/DataTable";
import { mockDailyProgress, mockWorkers } from "@/lib/mockData";
import type { DailyProgress } from "@/lib/types";

const columns: Column<DailyProgress>[] = [
  { key: "date", header: "Date" },
  { key: "worker", header: "Worker" },
  { key: "table", header: "Table" },
  { key: "tokenGiven", header: "Given", align: "right" },
  { key: "tokenSold", header: "Sold", align: "right" },
  {
    key: "balance",
    header: "Balance",
    align: "right",
    render: (row) => (
      <span
        className={
          row.balance < 0
            ? "font-semibold text-rose-600 dark:text-rose-400"
            : "text-slate-700 dark:text-slate-200"
        }
      >
        {row.balance}
      </span>
    ),
  },
  { key: "notes", header: "Notes", render: (row) => row.notes ?? "—" },
];

export default function ManagerDailyProgressPage() {
  const [worker, setWorker] = useState(mockWorkers[0]?.name ?? "");
  const [table, setTable] = useState(mockWorkers[0]?.table ?? "");
  const [given, setGiven] = useState(0);
  const [sold, setSold] = useState(0);
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState<DailyProgress[]>(mockDailyProgress);

  const balance = useMemo(() => given - sold, [given, sold]);
  const negative = balance < 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: DailyProgress = {
      id: `DP-${rows.length + 10}`,
      worker,
      table,
      tokenGiven: given,
      tokenSold: sold,
      balance,
      date: new Date().toISOString().slice(0, 10),
      notes: notes || undefined,
    };
    setRows([entry, ...rows]);
    setGiven(0);
    setSold(0);
    setNotes("");
  };

  return (
    <DashboardShell role="manager">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Daily progress</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Record token given vs sold per worker. Negative balances are highlighted.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Worker
            </label>
            <select
              value={worker}
              onChange={(e) => {
                const next = e.target.value;
                setWorker(next);
                const match = mockWorkers.find((w) => w.name === next);
                if (match?.table) setTable(match.table);
              }}
              className="input mt-1"
            >
              {mockWorkers.map((w) => (
                <option key={w.id} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Table
            </label>
            <input className="input mt-1" value={table} onChange={(e) => setTable(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Token given
            </label>
            <input
              type="number"
              min={0}
              className="input mt-1"
              value={given}
              onChange={(e) => setGiven(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Token sold
            </label>
            <input
              type="number"
              min={0}
              className="input mt-1"
              value={sold}
              onChange={(e) => setSold(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Remaining balance
            </label>
            <div
              className={`mt-1 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                negative
                  ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                  : "border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              }`}
            >
              {balance}
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Notes (optional)
            </label>
            <input
              className="input mt-1"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything worth flagging…"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button type="submit" className="btn-primary">
            Save progress
          </button>
        </div>
      </form>

      <DataTable<DailyProgress> columns={columns} rows={rows} />
    </DashboardShell>
  );
}
