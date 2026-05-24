"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { complaintsService, usersService } from "@/lib/services";
import { buildLookup, formatDate, formatId } from "@/lib/format";
import type { Complaint, ComplaintStatus, User } from "@/lib/types";

export default function AdminComplaintsPage() {
  const [items, setItems] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [c, u] = await Promise.all([
          complaintsService.getComplaints(),
          usersService.getUsers({ limit: 100 }),
        ]);
        if (cancelled) return;
        setItems(c);
        setUsers(u.items);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load complaints.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const userMap = useMemo(() => buildLookup(users), [users]);

  const handleStatus = async (id: string, status: ComplaintStatus) => {
    try {
      const updated = await complaintsService.updateComplaintStatus(id, status);
      setItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update complaint.");
    }
  };

  const columns: Column<Complaint>[] = [
    { key: "id", header: "ID", render: (c) => formatId(c.id) },
    {
      key: "by",
      header: "Submitted by",
      render: (c) => userMap.get(c.byId)?.name ?? c.by ?? formatId(c.byId),
    },
    { key: "subject", header: "Subject" },
    { key: "date", header: "Date", render: (c) => formatDate(c.date) },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    {
      key: "actions",
      header: "Update",
      align: "right",
      render: (c) => (
        <select
          className="input py-1.5 text-xs"
          value={c.status}
          onChange={(e) => handleStatus(c.id, e.target.value as ComplaintStatus)}
        >
          <option value="open">Open</option>
          <option value="in-progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
      ),
    },
  ];

  return (
    <DashboardShell role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Complaints</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track and resolve issues raised by your team.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      <DataTable<Complaint>
        columns={columns}
        rows={items}
        emptyMessage={loading ? "Loading complaints…" : "No complaints yet."}
      />
    </DashboardShell>
  );
}
