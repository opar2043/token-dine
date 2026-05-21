export type Role = "admin" | "manager" | "worker";

export interface User {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  role: Role;
  status: "active" | "blocked";
  joinedOn: string;
}

export interface Client {
  id: string;
  name: string;
  mobile: string;
  nid: string;
  email?: string;
  address?: string;
  gender?: "male" | "female" | "other";
  referral?: string;
  rating: number;
  tokensBought: number;
  tokensSpent: number;
  balance: number;
  createdAt: string;
}

export interface Worker {
  id: string;
  name: string;
  mobile: string;
  table?: string;
  attendanceRate: number;
  tokensSold: number;
  bonus: number;
  rating: number;
  status: "active" | "blocked";
}

export interface Product {
  id: string;
  name: string;
  image?: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  addedOn: string;
  updatedOn: string;
}

export interface TokenSale {
  id: string;
  client: string;
  worker: string;
  tokens: number;
  amount: number;
  date: string;
}

export interface AttendanceEntry {
  id: string;
  worker: string;
  date: string;
  status: "present" | "absent" | "late";
}

export interface Complaint {
  id: string;
  by: string;
  subject: string;
  date: string;
  status: "open" | "in-progress" | "resolved";
}

export interface Bonus {
  id: string;
  worker: string;
  amount: number;
  date: string;
  reason: string;
}

export interface TableAssignment {
  id: string;
  table: string;
  worker: string;
  assignedOn: string;
  status: "active" | "free";
}

export interface DailyProgress {
  id: string;
  worker: string;
  table: string;
  tokenGiven: number;
  tokenSold: number;
  balance: number;
  date: string;
  notes?: string;
}

export interface ClientPurchase {
  id: string;
  clientId: string;
  productId: string;
  productName: string;
  qty: number;
  tokensUsed: number;
  amount: number;
  date: string;
}
