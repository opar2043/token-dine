import type {
  AttendanceEntry,
  Bonus,
  Client,
  ClientPurchase,
  Complaint,
  DailyProgress,
  Product,
  TableAssignment,
  TokenSale,
  User,
  Worker,
} from "./types";

export const mockUsers: User[] = [
  {
    id: "U-001",
    name: "Rashed Admin",
    email: "admin@restaurant.com",
    role: "admin",
    status: "active",
    joinedOn: "2025-01-10",
  },
  {
    id: "U-002",
    name: "Karim Manager",
    mobile: "01710000001",
    role: "manager",
    status: "active",
    joinedOn: "2025-02-15",
  },
  {
    id: "U-003",
    name: "Salma Manager",
    mobile: "01710000002",
    role: "manager",
    status: "active",
    joinedOn: "2025-03-04",
  },
  {
    id: "U-004",
    name: "Hasan Worker",
    mobile: "01810000001",
    role: "worker",
    status: "active",
    joinedOn: "2025-04-01",
  },
  {
    id: "U-005",
    name: "Mim Worker",
    mobile: "01810000002",
    role: "worker",
    status: "active",
    joinedOn: "2025-04-12",
  },
  {
    id: "U-006",
    name: "Tanvir Worker",
    mobile: "01810000003",
    role: "worker",
    status: "blocked",
    joinedOn: "2025-04-22",
  },
];

export const mockClients: Client[] = [
  {
    id: "C-1001",
    name: "Arif Hossain",
    mobile: "01911112233",
    nid: "1990123456789",
    email: "arif@example.com",
    address: "Dhanmondi, Dhaka",
    gender: "male",
    rating: 4.5,
    tokensBought: 50,
    tokensSpent: 32,
    balance: 18,
    createdAt: "2026-04-12",
  },
  {
    id: "C-1002",
    name: "Nadia Khan",
    mobile: "01922223344",
    nid: "1992234567890",
    email: "nadia@example.com",
    address: "Banani, Dhaka",
    gender: "female",
    referral: "01911112233",
    rating: 5,
    tokensBought: 80,
    tokensSpent: 60,
    balance: 20,
    createdAt: "2026-04-20",
  },
  {
    id: "C-1003",
    name: "Sajid Rahman",
    mobile: "01933334455",
    nid: "1988345678901",
    gender: "male",
    rating: 3.5,
    tokensBought: 25,
    tokensSpent: 25,
    balance: 0,
    createdAt: "2026-05-02",
  },
  {
    id: "C-1004",
    name: "Mitu Akter",
    mobile: "01944445566",
    nid: "1995456789012",
    gender: "female",
    referral: "01922223344",
    rating: 4,
    tokensBought: 100,
    tokensSpent: 45,
    balance: 55,
    createdAt: "2026-05-10",
  },
];

export const mockWorkers: Worker[] = [
  {
    id: "W-001",
    name: "Hasan Worker",
    mobile: "01810000001",
    table: "T-04",
    attendanceRate: 96,
    tokensSold: 320,
    bonus: 1500,
    rating: 4.6,
    status: "active",
  },
  {
    id: "W-002",
    name: "Mim Worker",
    mobile: "01810000002",
    table: "T-07",
    attendanceRate: 92,
    tokensSold: 280,
    bonus: 1200,
    rating: 4.4,
    status: "active",
  },
  {
    id: "W-003",
    name: "Tanvir Worker",
    mobile: "01810000003",
    table: "T-02",
    attendanceRate: 70,
    tokensSold: 110,
    bonus: 0,
    rating: 3.1,
    status: "blocked",
  },
];

export const mockProducts: Product[] = [
  {
    id: "P-01",
    name: "Chicken Biriyani",
    image: "🍛",
    category: "Main Course",
    costPrice: 180,
    sellingPrice: 280,
    stock: 42,
    status: "in-stock",
    addedOn: "2026-01-12",
    updatedOn: "2026-05-18",
  },
  {
    id: "P-02",
    name: "Beef Kacchi",
    image: "🥘",
    category: "Main Course",
    costPrice: 310,
    sellingPrice: 420,
    stock: 8,
    status: "low-stock",
    addedOn: "2026-01-12",
    updatedOn: "2026-05-19",
  },
  {
    id: "P-03",
    name: "Borhani",
    image: "🥤",
    category: "Beverage",
    costPrice: 30,
    sellingPrice: 60,
    stock: 75,
    status: "in-stock",
    addedOn: "2026-02-05",
    updatedOn: "2026-05-20",
  },
  {
    id: "P-04",
    name: "Shik Kabab",
    image: "🍢",
    category: "Appetizer",
    costPrice: 120,
    sellingPrice: 180,
    stock: 0,
    status: "out-of-stock",
    addedOn: "2026-02-22",
    updatedOn: "2026-05-15",
  },
  {
    id: "P-05",
    name: "Falooda",
    image: "🍨",
    category: "Dessert",
    costPrice: 80,
    sellingPrice: 150,
    stock: 22,
    status: "in-stock",
    addedOn: "2026-03-08",
    updatedOn: "2026-05-20",
  },
];

export const mockSales: TokenSale[] = [
  { id: "S-9001", client: "Arif Hossain", worker: "Hasan Worker", tokens: 10, amount: 1000, date: "2026-05-18" },
  { id: "S-9002", client: "Nadia Khan", worker: "Mim Worker", tokens: 20, amount: 2000, date: "2026-05-19" },
  { id: "S-9003", client: "Mitu Akter", worker: "Hasan Worker", tokens: 15, amount: 1500, date: "2026-05-20" },
  { id: "S-9004", client: "Sajid Rahman", worker: "Mim Worker", tokens: 5, amount: 500, date: "2026-05-20" },
  { id: "S-9005", client: "Arif Hossain", worker: "Hasan Worker", tokens: 8, amount: 800, date: "2026-05-21" },
];

export const mockAttendance: AttendanceEntry[] = [
  { id: "A-1", worker: "Hasan Worker", date: "2026-05-21", status: "present" },
  { id: "A-2", worker: "Mim Worker", date: "2026-05-21", status: "late" },
  { id: "A-3", worker: "Tanvir Worker", date: "2026-05-21", status: "absent" },
  { id: "A-4", worker: "Hasan Worker", date: "2026-05-20", status: "present" },
  { id: "A-5", worker: "Mim Worker", date: "2026-05-20", status: "present" },
];

export const mockComplaints: Complaint[] = [
  { id: "CMP-01", by: "Hasan Worker", subject: "AC not working in section A", date: "2026-05-15", status: "in-progress" },
  { id: "CMP-02", by: "Mim Worker", subject: "Need more napkins on tables", date: "2026-05-17", status: "open" },
  { id: "CMP-03", by: "Tanvir Worker", subject: "POS device freezing", date: "2026-05-12", status: "resolved" },
];

export const mockBonuses: Bonus[] = [
  { id: "B-01", worker: "Hasan Worker", amount: 1500, date: "2026-05-01", reason: "Top seller of the week" },
  { id: "B-02", worker: "Mim Worker", amount: 1200, date: "2026-05-01", reason: "Perfect attendance" },
  { id: "B-03", worker: "Hasan Worker", amount: 800, date: "2026-04-15", reason: "Positive customer feedback" },
];

export const mockTables: TableAssignment[] = [
  { id: "TA-01", table: "T-01", worker: "Hasan Worker", assignedOn: "2026-05-15", status: "active" },
  { id: "TA-02", table: "T-02", worker: "Tanvir Worker", assignedOn: "2026-05-15", status: "free" },
  { id: "TA-03", table: "T-04", worker: "Hasan Worker", assignedOn: "2026-05-15", status: "active" },
  { id: "TA-04", table: "T-05", worker: "—", assignedOn: "—", status: "free" },
  { id: "TA-05", table: "T-07", worker: "Mim Worker", assignedOn: "2026-05-15", status: "active" },
  { id: "TA-06", table: "T-08", worker: "—", assignedOn: "—", status: "free" },
];

export const mockClientPurchases: ClientPurchase[] = [
  // C-1001 Arif Hossain
  { id: "CP-001", clientId: "C-1001", productId: "P-01", productName: "Chicken Biriyani", qty: 2, tokensUsed: 6, amount: 560, date: "2026-05-21" },
  { id: "CP-002", clientId: "C-1001", productId: "P-03", productName: "Borhani", qty: 2, tokensUsed: 2, amount: 120, date: "2026-05-21" },
  { id: "CP-003", clientId: "C-1001", productId: "P-05", productName: "Falooda", qty: 1, tokensUsed: 2, amount: 150, date: "2026-05-19" },
  { id: "CP-004", clientId: "C-1001", productId: "P-01", productName: "Chicken Biriyani", qty: 1, tokensUsed: 3, amount: 280, date: "2026-05-12" },
  { id: "CP-005", clientId: "C-1001", productId: "P-02", productName: "Beef Kacchi", qty: 1, tokensUsed: 4, amount: 420, date: "2026-04-28" },
  { id: "CP-006", clientId: "C-1001", productId: "P-04", productName: "Shik Kabab", qty: 2, tokensUsed: 4, amount: 360, date: "2026-04-15" },

  // C-1002 Nadia Khan
  { id: "CP-007", clientId: "C-1002", productId: "P-02", productName: "Beef Kacchi", qty: 2, tokensUsed: 8, amount: 840, date: "2026-05-20" },
  { id: "CP-008", clientId: "C-1002", productId: "P-05", productName: "Falooda", qty: 2, tokensUsed: 3, amount: 300, date: "2026-05-19" },
  { id: "CP-009", clientId: "C-1002", productId: "P-01", productName: "Chicken Biriyani", qty: 3, tokensUsed: 9, amount: 840, date: "2026-05-10" },
  { id: "CP-010", clientId: "C-1002", productId: "P-03", productName: "Borhani", qty: 4, tokensUsed: 4, amount: 240, date: "2026-04-29" },

  // C-1003 Sajid Rahman
  { id: "CP-011", clientId: "C-1003", productId: "P-01", productName: "Chicken Biriyani", qty: 2, tokensUsed: 6, amount: 560, date: "2026-05-18" },
  { id: "CP-012", clientId: "C-1003", productId: "P-04", productName: "Shik Kabab", qty: 1, tokensUsed: 2, amount: 180, date: "2026-05-04" },

  // C-1004 Mitu Akter
  { id: "CP-013", clientId: "C-1004", productId: "P-05", productName: "Falooda", qty: 3, tokensUsed: 5, amount: 450, date: "2026-05-21" },
  { id: "CP-014", clientId: "C-1004", productId: "P-02", productName: "Beef Kacchi", qty: 1, tokensUsed: 4, amount: 420, date: "2026-05-15" },
  { id: "CP-015", clientId: "C-1004", productId: "P-03", productName: "Borhani", qty: 2, tokensUsed: 2, amount: 120, date: "2026-05-11" },
];

export const mockDailyProgress: DailyProgress[] = [
  { id: "DP-01", worker: "Hasan Worker", table: "T-04", tokenGiven: 30, tokenSold: 28, balance: 2, date: "2026-05-21", notes: "Strong morning shift" },
  { id: "DP-02", worker: "Mim Worker", table: "T-07", tokenGiven: 25, tokenSold: 30, balance: -5, date: "2026-05-21", notes: "Sold extras from float" },
  { id: "DP-03", worker: "Tanvir Worker", table: "T-02", tokenGiven: 20, tokenSold: 12, balance: 8, date: "2026-05-21" },
  { id: "DP-04", worker: "Hasan Worker", table: "T-04", tokenGiven: 30, tokenSold: 30, balance: 0, date: "2026-05-20" },
];
