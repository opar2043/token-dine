"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DataTable, StatusBadge, type Column } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { PlusIcon } from "@/components/icons";
import { mockClients, mockUsers } from "@/lib/mockData";
import type { Client, User } from "@/lib/types";

type CreateRole = "client" | "manager" | "worker";

interface UsersRow extends User {}

const userColumns: Column<UsersRow>[] = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "role", header: "Role", render: (u) => <span className="capitalize">{u.role}</span> },
  { key: "email", header: "Email", render: (u) => u.email ?? "—" },
  { key: "mobile", header: "Mobile", render: (u) => u.mobile ?? "—" },
  { key: "joinedOn", header: "Joined" },
  { key: "status", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const handleCreateStaff = (u: User) => {
    setUsers((prev) => [u, ...prev]);
    setFlash(`${u.role === "manager" ? "Manager" : "Worker"} ${u.name} added to Users.`);
    setOpen(false);
  };

  const handleCreateClient = (c: Client) => {
    setClients((prev) => [c, ...prev]);
    setFlash(`Client ${c.name} added (visible in the Clients tab).`);
    setOpen(false);
  };

  return (
    <DashboardShell role="admin">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage admins, managers, workers, and add new clients.
          </p>
        </div>
        <button type="button" className="btn-primary gap-1.5" onClick={() => setOpen(true)}>
          <PlusIcon /> Add user
        </button>
      </div>

      {flash ? (
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          <span>{flash}</span>
          <button onClick={() => setFlash(null)} className="text-emerald-700 dark:text-emerald-200">
            ✕
          </button>
        </div>
      ) : null}

      <DataTable<UsersRow> columns={userColumns} rows={users} />

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Showing {users.length} system user(s). Clients ({clients.length}) live on the{" "}
        <strong>Clients</strong> page.
      </p>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title="Add user"
        description="Pick a role — fields adapt automatically."
      >
        <CreateForm
          existingUsers={users}
          existingClients={clients}
          onCreateStaff={handleCreateStaff}
          onCreateClient={handleCreateClient}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </DashboardShell>
  );
}

/* ------------------------------------------------------------------ */

function CreateForm({
  existingUsers,
  existingClients,
  onCreateStaff,
  onCreateClient,
  onCancel,
}: {
  existingUsers: User[];
  existingClients: Client[];
  onCreateStaff: (u: User) => void;
  onCreateClient: (c: Client) => void;
  onCancel: () => void;
}) {
  const [role, setRole] = useState<CreateRole>("client");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"active" | "blocked">("active");
  // client-only
  const [nid, setNid] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [referral, setReferral] = useState("");
  const [tokensBought, setTokensBought] = useState(0);
  const [rating, setRating] = useState(4);
  const [error, setError] = useState<string | null>(null);

  const isClient = role === "client";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!/^01\d{9}$/.test(mobile.trim())) {
      setError("Mobile must be 11 digits starting with 01.");
      return;
    }

    if (isClient) {
      if (!nid.trim()) {
        setError("NID is required for clients.");
        return;
      }
      if (existingClients.some((c) => c.mobile === mobile.trim())) {
        setError("A client with that mobile already exists.");
        return;
      }
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
      onCreateClient(next);
      return;
    }

    // manager / worker
    if (!password || password.length < 4) {
      setError("Password / PIN must be at least 4 characters.");
      return;
    }
    if (existingUsers.some((u) => u.mobile === mobile.trim())) {
      setError("A staff user with that mobile already exists.");
      return;
    }
    const prefix = role === "manager" ? "M" : "W";
    const id = `${prefix}-${Math.floor(Math.random() * 900 + 100)}`;
    const next: User = {
      id,
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim() || undefined,
      role,
      status,
      joinedOn: new Date().toISOString().slice(0, 10),
    };
    onCreateStaff(next);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* role selector */}
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
        {(["client", "manager", "worker"] as CreateRole[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition ${
              role === r
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Full name" required>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="Mobile number" required>
          <input
            className="input"
            placeholder="01XXXXXXXXX"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </Field>
        <Field label={isClient ? "Email" : "Email (optional)"}>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        {isClient ? (
          <>
            <Field label="NID" required>
              <input className="input" value={nid} onChange={(e) => setNid(e.target.value)} required />
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
          </>
        ) : (
          <>
            <Field label={role === "manager" ? "Password" : "Password / PIN"} required>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
              />
            </Field>
            <Field label="Status">
              <select
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "blocked")}
              >
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </Field>
          </>
        )}
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
          Create {role}
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
