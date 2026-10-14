// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  verified?: boolean;
  verificationCode?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Transaction Types
export type TransactionType = "income" | "expense";

export type ExpenseCategory =
  | "Food"
  | "Travel"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Education"
  | "Bills"
  | "Other";

export type IncomeCategory =
  | "Salary"
  | "Freelancing"
  | "Business"
  | "Investment"
  | "Other";

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
  notes?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  title: string;
  amount: number;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
  notes?: string;
  date: string;
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  month: string; // Format: YYYY-MM
  budgetAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetFormData {
  month: string;
  budgetAmount: number;
}

// Analytics Types
export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  savingsRate: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

export interface DashboardAnalytics {
  stats: DashboardStats;
  monthlyTrend: MonthlyData[];
  categoryDistribution: CategoryData[];
  recentTransactions: Transaction[];
}

export interface MonthlyReport {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  topCategories: CategoryData[];
  transactions: Transaction[];
}

export interface YearlyReport {
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  monthlyBreakdown: MonthlyData[];
  topCategories: CategoryData[];
}

// Filter Types
export interface TransactionFilters {
  search?: string;
  type?: TransactionType | "all";
  category?: string;
  startDate?: string;
  endDate?: string;
}
