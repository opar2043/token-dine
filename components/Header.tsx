"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Welcome back
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {user?.name ?? "Guest"} <span className="text-slate-400">• {user?.role}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button onClick={handleLogout} className="btn-ghost px-3 py-1.5 text-xs">
          Logout
        </button>
      </div>
    </header>
  );
}
