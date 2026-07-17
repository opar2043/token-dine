"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Modal } from "@/components/Modal";
import { attendanceService, bonusesService, salesService, usersService } from "@/lib/services";
import { buildLookup, formatDate, formatId } from "@/lib/format";
import { inRange, type DateRange } from "@/lib/dateRange";
import type { AttendanceEntry, Bonus, TokenSale, User } from "@/lib/types";

// Default to today's records.
const TODAY_RANGE: DateRange = { preset: "day" };

// Group sales into tokens-per-worker-per-day for the Tokens column.
const dayKey = (date: string) => new Date(date).toISOString().slice(0, 10);
const tokenKey = (workerId: string, date: string) => `${workerId}|${dayKey(date)}`;

export default function AdminAttendancePage() {
  const [items, setItems] = useState<AttendanceEntry[]>([]);
  const [workers, setWorkers] = useState<User[]>([]);
  const [sales, setSales] = useState<TokenSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<DateRange>(TODAY_RANGE);
  const [bonusFor, setBonusFor] = useState<AttendanceEntry | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [att, w, s] = await Promise.all([
          attendanceService.getAttendance(),
          usersService.getUsers({ role: "worker", limit: 100 }),
          salesService.getSales(),
        ]);
        if (cancelled) return;
        setItems(att);
        setWorkers(w.items);
        setSales(s);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load attendance.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const workerMap = useMemo(() => buildLookup(workers), [workers]);

  // Tokens each worker sold on a given day.
  const tokensByWorkerDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sales) {
      const key = tokenKey(s.workerId, s.date);
      map.set(key, (map.get(key) ?? 0) + s.tokens);
    }
    return map;
  }, [sales]);

  const filtered = useMemo(
    () => items.filter((a) => inRange(a.date, range)),
    [items, range],
  );

  const columns: Column<AttendanceEntry>[] = [
    { key: "id", header: "Entry", render: (a) => formatId(a.id) },
    {
      key: "worker",
      header: "Worker",
      render: (a) => workerMap.get(a.workerId)?.name ?? a.worker ?? formatId(a.workerId),
    },
    { key: "date", header: "Date", render: (a) => formatDate(a.date) },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    {
      key: "tokens",
      header: "Tokens",
      align: "right",
      render: (a) => `${(tokensByWorkerDay.get(tokenKey(a.workerId, a.date)) ?? 0).toLocaleString()} tkn`,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (a) => (
        <button type="button" className="btn-ghost text-xs" onClick={() => setBonusFor(a)}>
          Give bonus
        </button>
      ),
    },
  ];

  const bonusWorkerName = bonusFor
    ? workerMap.get(bonusFor.workerId)?.name ?? bonusFor.worker ?? formatId(bonusFor.workerId)
    : "";

  return (
    <DashboardShell role="admin">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Attendance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            All worker attendance entries across the team.
          </p>
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <DataTable<AttendanceEntry>
        columns={columns}
        rows={filtered}
        emptyMessage={loading ? "Loading attendance…" : "No attendance records in this range."}
      />

      <Modal
        open={bonusFor !== null}
        onClose={() => setBonusFor(null)}
        size="sm"
        title="Give bonus"
        description={bonusWorkerName ? `Award a bonus to ${bonusWorkerName}.` : undefined}
      >
        {bonusFor ? (
          <BonusForm
            workerId={bonusFor.workerId}
            onCancel={() => setBonusFor(null)}
            onSaved={() => setBonusFor(null)}
          />
        ) : null}
      </Modal>
    </DashboardShell>
  );
}

function BonusForm({
  workerId,
  onCancel,
  onSaved,
}: {
  workerId: string;
  onCancel: () => void;
  onSaved: (b: Bonus) => void;
}) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const value = Number(amount);
    if (!value || value <= 0) return setError("Enter a bonus amount greater than 0.");
    if (!reason.trim()) return setError("Please add a reason.");

    setSubmitting(true);
    try {
      const created = await bonusesService.createBonuses({
        workerId,
        amount: value,
        reason: reason.trim(),
      });
      onSaved(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to give bonus.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Bonus amount
        </span>
        <input
          type="number"
          min={1}
          className="input mt-1"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Reason
        </span>
        <input
          className="input mt-1"
          placeholder="e.g. Great performance"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </label>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : "Give bonus"}
        </button>
      </div>
    </form>
  );
}
