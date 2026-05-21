"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockUsers } from "@/lib/mockData";
import type { Role, User } from "@/lib/types";

const STORAGE_KEY = "restaurant-auth-user";

interface RegisterPayload {
  name: string;
  mobile: string;
  email?: string;
  password: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginAdmin: (email: string, password: string) => User | null;
  loginStaff: (mobile: string, password: string) => User | null;
  register: (payload: RegisterPayload) => User;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setLoading(false);
  }, []);

  const persist = useCallback((next: User | null) => {
    setUser(next);
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const loginAdmin = useCallback(
    (email: string, password: string) => {
      // Demo: any non-empty password works for the seeded admin email.
      const match = mockUsers.find(
        (u) => u.role === "admin" && u.email?.toLowerCase() === email.toLowerCase(),
      );
      if (!match || !password) return null;
      if (match.status === "blocked") return null;
      persist(match);
      return match;
    },
    [persist],
  );

  const loginStaff = useCallback(
    (mobile: string, password: string) => {
      const match = mockUsers.find(
        (u) => (u.role === "manager" || u.role === "worker") && u.mobile === mobile,
      );
      if (!match || !password) return null;
      if (match.status === "blocked") return null;
      persist(match);
      return match;
    },
    [persist],
  );

  const register = useCallback(
    (payload: RegisterPayload) => {
      const id = `U-${Math.floor(Math.random() * 9000 + 1000)}`;
      const newUser: User = {
        id,
        name: payload.name,
        mobile: payload.mobile,
        email: payload.email,
        role: payload.role,
        status: "active",
        joinedOn: new Date().toISOString().slice(0, 10),
      };
      persist(newUser);
      return newUser;
    },
    [persist],
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo(
    () => ({ user, loading, loginAdmin, loginStaff, register, logout }),
    [user, loading, loginAdmin, loginStaff, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
