export type Role = "admin" | "manager" | "worker";

export type AccountStatus = "active" | "blocked";

export interface User {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  password?: string;
  role: Role;
  status: AccountStatus;
  joinedOn?: string;
  createdAt?: string;
  updatedAt?: string;
  table?: string;
  tokensSold?: number;
  bonus?: number;
  rating?: number;
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
  updatedAt?: string;
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
  status: AccountStatus;
}

export type ProductStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface Product {
  id: string;
  name: string;
  image?: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  status: ProductStatus;
  addedOn: string;
  updatedOn: string;
}

export interface TokenSale {
  id: string;
  clientId: string;
  workerId: string;
  tokens: number;
  amount: number;
  date: string;
  client?: string;
  worker?: string;
}

export type AttendanceStatus = "present" | "absent" | "late";

export interface AttendanceEntry {
  id: string;
  workerId: string;
  worker?: string;
  date: string;
  status: AttendanceStatus;
}

export type ComplaintStatus = "open" | "in-progress" | "resolved";

export interface Complaint {
  id: string;
  byId: string;
  by?: string;
  subject: string;
  date: string;
  status: ComplaintStatus;
}

export interface Bonus {
  id: string;
  workerId: string;
  worker?: string;
  amount: number;
  reason: string;
  date: string;
}

export type TableStatus = "active" | "free";

export interface TableAssignment {
  id: string;
  table: string;
  workerId?: string;
  worker?: string;
  assignedOn?: string;
  status: TableStatus;
}

export interface DailyProgress {
  id: string;
  workerId: string;
  worker?: string;
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

export interface AnalyticsOverview {
  revenue: { total: number; day: number; week: number; month: number };
  tokensSold: number;
  activeClients: number;
  stockAlerts: number;
  referralCount: number;
  profitEstimate: number;
}

export interface WorkerAnalytics {
  tokensSold: number;
  revenue: number;
  attendanceRate: number;
  rating: number;
}
