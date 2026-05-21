"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

type Mode = "admin" | "staff";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, loginAdmin, loginStaff } = useAuth();
  const [mode, setMode] = useState<Mode>("staff");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, loading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result =
      mode === "admin"
        ? loginAdmin(identifier.trim(), password)
        : loginStaff(identifier.trim(), password);

    if (!result) {
      setError(
        mode === "admin"
          ? "No admin account found for that email. Try admin@restaurant.com."
          : "No staff account found for that mobile. Try 01710000001 (manager) or 01810000001 (worker).",
      );
      return;
    }

    router.replace(`/dashboard/${result.role}`);
  };

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
            R
          </div>
          <span className="text-sm font-semibold">Restaurant Management</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="card">
            <h1 className="text-2xl font-semibold">Sign in</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Access the dashboard for your role.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
              {(["staff", "admin"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setIdentifier("");
                    setError(null);
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    mode === m
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {m === "admin" ? "Admin" : "Manager / Worker"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {mode === "admin" ? "Email" : "Mobile number"}
                </label>
                <input
                  type={mode === "admin" ? "email" : "tel"}
                  className="input mt-1"
                  placeholder={mode === "admin" ? "admin@restaurant.com" : "01XXXXXXXXX"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {mode === "admin" ? "Password" : "Password / PIN"}
                </label>
                <input
                  type="password"
                  className="input mt-1"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error ? (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                  {error}
                </p>
              ) : null}

              <button type="submit" className="btn-primary w-full">
                Sign in
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
              New here?{" "}
              <Link href="/register" className="font-medium text-slate-900 underline dark:text-white">
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Demo credentials</p>
            <ul className="mt-2 space-y-1">
              <li>Admin — admin@restaurant.com / any password</li>
              <li>Manager — 01710000001 / any password</li>
              <li>Worker — 01810000001 / any password</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
