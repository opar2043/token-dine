"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";

interface Form {
  name: string;
  mobile: string;
  nid: string;
  email: string;
  address: string;
  gender: "male" | "female" | "other" | "";
  referral: string;
}

const empty: Form = {
  name: "",
  mobile: "",
  nid: "",
  email: "",
  address: "",
  gender: "",
  referral: "",
};

export default function WorkerNewClientPage() {
  const [form, setForm] = useState<Form>(empty);
  const [saved, setSaved] = useState<string | null>(null);

  const update = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `C-${Math.floor(Math.random() * 9000 + 1000)}`;
    setSaved(id);
    setForm(empty);
  };

  return (
    <DashboardShell role="worker">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">New client</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Create an account for a walk-in customer.
        </p>
      </div>

      {saved ? (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          Client created with ID <strong>{saved}</strong>.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="card grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Full name" required>
          <input className="input" value={form.name} onChange={update("name")} required />
        </Field>
        <Field label="Mobile number" required>
          <input className="input" value={form.mobile} onChange={update("mobile")} required />
        </Field>
        <Field label="NID" required>
          <input className="input" value={form.nid} onChange={update("nid")} required />
        </Field>
        <Field label="Email">
          <input type="email" className="input" value={form.email} onChange={update("email")} />
        </Field>
        <Field label="Address">
          <input className="input" value={form.address} onChange={update("address")} />
        </Field>
        <Field label="Gender">
          <select className="input" value={form.gender} onChange={update("gender")}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Referral mobile (optional)">
          <input className="input" value={form.referral} onChange={update("referral")} />
        </Field>

        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="btn-primary">
            Create client
          </button>
        </div>
      </form>
    </DashboardShell>
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
