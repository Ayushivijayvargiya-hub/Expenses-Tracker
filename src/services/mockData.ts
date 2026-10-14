import { User } from '../types';

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Simulate API delay
export const delay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Hash password (simple base64 encoding for demo - in production use bcrypt)
export const hashPassword = (password: string): string => {
  return btoa(password);
};

// Verify password
export const verifyPassword = (password: string, hash: string): boolean => {
  return btoa(password) === hash;
};

// Generate JWT-like token (for demo purposes)
export const generateToken = (userId: string): string => {
  const payload = {
    userId,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  return btoa(JSON.stringify(payload));
};

// Verify token
export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      return null; // Token expired
    }
    return { userId: payload.userId };
  } catch {
    return null;
  }
};

// Initialize with empty data - users start fresh
export const initializeDemoData = (): void => {
  // Initialize with empty arrays - no demo data
  const existingTransactions = localStorage.getItem('fintrack_transactions');
  if (!existingTransactions) {
    localStorage.setItem('fintrack_transactions', JSON.stringify([]));
  }

  const existingBudgets = localStorage.getItem('fintrack_budgets');
  if (!existingBudgets) {
    localStorage.setItem('fintrack_budgets', JSON.stringify([]));
  }
};
