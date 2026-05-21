import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  rows,
  emptyMessage = "No records yet.",
}: DataTableProps<T>) {
  const alignClass = (align?: Column<T>["align"]) =>
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${alignClass(col.align)}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={row.id ?? idx}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-900/60"
                >
                  {columns.map((col) => {
                    const fallback = (row as Record<string, unknown>)[col.key];
                    return (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-slate-700 dark:text-slate-200 ${alignClass(col.align)}`}
                      >
                        {col.render ? col.render(row) : String(fallback ?? "")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const palette: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    blocked: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    present: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    absent: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    late: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "in-stock": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "low-stock": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "out-of-stock": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    open: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "in-progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  };
  const cls = palette[status] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return <span className={`badge ${cls}`}>{status}</span>;
}
