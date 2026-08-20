export type Role = "customer" | "merchant" | "analyst" | "admin";

export type DemoAccount = {
  email: string;
  password: string;
  otp: string;
  name: string;
  role: Role;
  org: string;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "asha@aegisflow.demo",
    password: "Customer@123",
    otp: "424242",
    name: "Asha Rao",
    role: "customer",
    org: "Personal account",
  },
  {
    email: "merchant@urbancart.demo",
    password: "Merchant@123",
    otp: "424242",
    name: "Vikram Sethi",
    role: "merchant",
    org: "UrbanCart Retail Pvt Ltd",
  },
  {
    email: "analyst@aegisflow.demo",
    password: "Analyst@123",
    otp: "424242",
    name: "Neha Kulkarni",
    role: "analyst",
    org: "Fraud & Risk Operations",
  },
  {
    email: "admin@aegisflow.demo",
    password: "Admin@123",
    otp: "424242",
    name: "Rahul Menon",
    role: "admin",
    org: "Security Administration",
  },
];

export const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  merchant: "Merchant",
  analyst: "Fraud Analyst",
  admin: "Administrator",
};

/** Least privilege matrix — which app domain each role may enter. */
export const ROLE_APPS: Record<Role, string[]> = {
  customer: ["/app/customer", "/app/agents"],
  merchant: ["/app/merchant"],
  analyst: ["/app/fraud"],
  admin: ["/app/admin"],
};

export type AgentStatus = "active" | "paused" | "revoked";

export type Agent = {
  id: string;
  name: string;
  purpose: string;
  perTxnLimit: number;
  dailyLimit: number;
  spentToday: number;
  allowed: string[];
  blocked: string[];
  status: AgentStatus;
};

export const AGENTS: Agent[] = [
  {
    id: "agt_travelbot",
    name: "TravelBot",
    purpose: "Book flights, hotels and airport transport",
    perTxnLimit: 8000,
    dailyLimit: 10000,
    spentToday: 6500,
    allowed: ["Flights", "Hotels", "Transportation"],
    blocked: ["Gambling", "Cryptocurrency", "Electronics", "Cash transfer"],
    status: "active",
  },
  {
    id: "agt_shopbot",
    name: "ShopBot",
    purpose: "Reorder household groceries and essentials",
    perTxnLimit: 3000,
    dailyLimit: 5000,
    spentToday: 2000,
    allowed: ["Groceries", "Household"],
    blocked: ["Gambling", "Cryptocurrency", "Travel"],
    status: "active",
  },
  {
    id: "agt_billbot",
    name: "BillBot",
    purpose: "Pay recurring electricity and broadband bills",
    perTxnLimit: 4000,
    dailyLimit: 4000,
    spentToday: 0,
    allowed: ["Utilities"],
    blocked: ["Gambling", "Cryptocurrency", "Retail"],
    status: "paused",
  },
];

export type TxnStatus = "approved" | "blocked" | "pending";

export type Txn = {
  id: string;
  agent: string;
  merchant: string;
  category: string;
  amount: number;
  status: TxnStatus;
  risk: "low" | "medium" | "high";
  reason: string;
  time: string;
};

export const TRANSACTIONS: Txn[] = [
  {
    id: "txn_10241",
    agent: "TravelBot",
    merchant: "HotelBooking",
    category: "Hotels",
    amount: 6500,
    status: "approved",
    risk: "low",
    reason: "Within per-transaction and daily limits, category allowed.",
    time: "Today 09:14",
  },
  {
    id: "txn_10242",
    agent: "ShopBot",
    merchant: "UrbanCart",
    category: "Groceries",
    amount: 2000,
    status: "approved",
    risk: "low",
    reason: "Matches usual spend pattern for this agent.",
    time: "Today 10:02",
  },
  {
    id: "txn_10243",
    agent: "TravelBot",
    merchant: "LuxuryStay",
    category: "Hotels",
    amount: 35000,
    status: "blocked",
    risk: "high",
    reason:
      "Transaction amount is significantly higher than the agent's normal spending behaviour and exceeds the ₹8,000 per-transaction limit.",
    time: "Today 11:47",
  },
  {
    id: "txn_10244",
    agent: "ShopBot",
    merchant: "CryptoX",
    category: "Cryptocurrency",
    amount: 12000,
    status: "blocked",
    risk: "high",
    reason: "Category 'Cryptocurrency' is on the agent's blocked list.",
    time: "Today 12:20",
  },
  {
    id: "txn_10245",
    agent: "TravelBot",
    merchant: "SkyJet Airways",
    category: "Flights",
    amount: 7400,
    status: "pending",
    risk: "medium",
    reason: "Amount near the per-transaction ceiling — human approval requested.",
    time: "Today 13:05",
  },
  {
    id: "txn_10246",
    agent: "BillBot",
    merchant: "PowerGrid Utilities",
    category: "Utilities",
    amount: 1850,
    status: "approved",
    risk: "low",
    reason: "Recurring bill within policy.",
    time: "Yesterday 18:31",
  },
];

export const MERCHANT_ORDERS = [
  { id: "ord_5512", buyer: "Asha R.", agent: "ShopBot", amount: 2000, status: "Fulfilled", date: "Today" },
  { id: "ord_5513", buyer: "Karan M.", agent: "ShopBot", amount: 1450, status: "Packed", date: "Today" },
  { id: "ord_5509", buyer: "Divya P.", agent: "Human", amount: 3200, status: "Fulfilled", date: "Yesterday" },
  { id: "ord_5501", buyer: "Asha R.", agent: "Human", amount: 890, status: "Refunded", date: "18 Aug" },
];

export const MERCHANT_REFUNDS = [
  { id: "rfd_221", order: "ord_5501", amount: 890, reason: "Item damaged", status: "Completed" },
  { id: "rfd_222", order: "ord_5488", amount: 640, reason: "Wrong size", status: "Processing" },
];

export const SETTLEMENTS = [
  { id: "stl_9001", period: "16–18 Aug", gross: 48200, fees: 964, net: 47236, status: "Settled" },
  { id: "stl_9002", period: "19–20 Aug", gross: 21350, fees: 427, net: 20923, status: "In transit" },
];

export const FRAUD_ALERTS = [
  {
    id: "alr_301",
    txn: "txn_10243",
    title: "Spending anomaly — TravelBot",
    score: 92,
    level: "high" as const,
    detail: "Agent normally spends ₹2,000–₹5,000; attempted ₹35,000 at a new merchant.",
    action: "Blocked",
  },
  {
    id: "alr_302",
    txn: "txn_10244",
    title: "Restricted category attempt — ShopBot",
    score: 88,
    level: "high" as const,
    detail: "Attempted payment in blocked category 'Cryptocurrency'.",
    action: "Blocked",
  },
  {
    id: "alr_303",
    txn: "txn_10245",
    title: "Near-limit velocity — TravelBot",
    score: 54,
    level: "medium" as const,
    detail: "Third travel payment within 4 hours, close to daily ceiling.",
    action: "Requires approval",
  },
];

export const USERS = [
  { id: "usr_01", name: "Asha Rao", email: "asha@aegisflow.demo", role: "customer" as Role, mfa: true, status: "Active" },
  { id: "usr_02", name: "Vikram Sethi", email: "merchant@urbancart.demo", role: "merchant" as Role, mfa: true, status: "Active" },
  { id: "usr_03", name: "Neha Kulkarni", email: "analyst@aegisflow.demo", role: "analyst" as Role, mfa: true, status: "Active" },
  { id: "usr_04", name: "Rahul Menon", email: "admin@aegisflow.demo", role: "admin" as Role, mfa: true, status: "Active" },
  { id: "usr_05", name: "Imran Q.", email: "imran@urbancart.demo", role: "merchant" as Role, mfa: false, status: "Suspended" },
];

export const PERMISSIONS: { role: Role; can: string[]; cannot: string[] }[] = [
  {
    role: "customer",
    can: ["View own account & transactions", "Create / pause / revoke own AI agents", "Approve or reject own payments"],
    cannot: ["View other customers", "Access merchant settlements", "Open fraud or admin consoles"],
  },
  {
    role: "merchant",
    can: ["View own orders, refunds, settlements", "Export own transaction history"],
    cannot: ["View customer profiles", "Access admin application", "View other merchants' data"],
  },
  {
    role: "analyst",
    can: ["View flagged transactions", "Assign risk scores", "Block suspicious payments", "Record investigations"],
    cannot: ["Manage users or roles", "Change security policies", "Move funds or issue refunds"],
  },
  {
    role: "admin",
    can: ["Manage users & roles", "Manage access policies", "View audit logs and security events"],
    cannot: ["Approve customer payments", "Read raw card data", "Bypass audit logging"],
  },
];

export const AUDIT_LOGS = [
  { id: "log_9001", actor: "admin@aegisflow.demo", action: "role.assign", target: "usr_03 → fraud_analyst", time: "Today 08:02", ip: "10.20.4.11" },
  { id: "log_9002", actor: "analyst@aegisflow.demo", action: "txn.block", target: "txn_10243", time: "Today 11:48", ip: "10.30.9.4" },
  { id: "log_9003", actor: "asha@aegisflow.demo", action: "agent.pause", target: "agt_billbot", time: "Today 07:41", ip: "49.36.11.2" },
  { id: "log_9004", actor: "system", action: "policy.deny", target: "ShopBot → CryptoX (blocked category)", time: "Today 12:20", ip: "svc-policy" },
  { id: "log_9005", actor: "admin@aegisflow.demo", action: "user.suspend", target: "usr_05", time: "Yesterday 16:10", ip: "10.20.4.11" },
];

export const SECURITY_EVENTS = [
  { id: "sec_01", type: "MFA challenge passed", who: "asha@aegisflow.demo", severity: "info", time: "Today 09:10" },
  { id: "sec_02", type: "Failed login (3 attempts)", who: "imran@urbancart.demo", severity: "warning", time: "Today 10:55" },
  { id: "sec_03", type: "Cross-zone request denied", who: "customer-app → admin-db", severity: "critical", time: "Today 11:12" },
  { id: "sec_04", type: "New device sign-in", who: "analyst@aegisflow.demo", severity: "info", time: "Today 08:31" },
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
